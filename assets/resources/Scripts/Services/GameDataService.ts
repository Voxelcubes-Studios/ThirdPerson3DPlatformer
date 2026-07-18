import { _decorator, EventTarget, find } from 'cc';
import { GameEventEnum } from '../Enums/GameEventEnum';
import { GemGeneratorManager } from '../Managers/GemGeneratorManager';

const { ccclass } = _decorator;

@ccclass('GameDataService')
export class GameDataService {
	private static _instance: GameDataService = null;

	public counter = 0;
	public isGamepadActive = true;
	public gemCount = 12; // Total number of gems to form the ring

	/**
	 * Use for hiding or showing the virtual joystick on screen.
	 * This is useful for mobile devices where the virtual joystick
	 * is used for player movement.
	 */
	public showJoystickOnScreen = true;
	public updateCounterEvent = new EventTarget();

	private constructor() {
		if (GameDataService._instance) {
			throw new Error(
				'Error: Instantiation failed: Use GameDataService.getInstance() instead of new keyword.'
			);
		}
		GameDataService._instance = this;
	}

	/**
	 * Call single instance of this class in which all
	 * variables and function can be accessed.
	 * @returns
	 */
	public static getInstance(): GameDataService {
		if (this._instance === null) {
			this._instance = new GameDataService();
		}
		return this._instance;
	}

	public generateGems(): void {
		const genNode = find('GemGenerator');

		if (genNode) {
			const script = genNode.getComponent('GemGeneratorManager') as GemGeneratorManager;
			if (script) {
				script.spawnAndAnimateRing();
			}
		}
	}

	protected createNewGems(): void {
		if (this.counter % this.gemCount === 0) {
			this.generateGems();
		}
	}

	public updateCounter(callback?: () => void): void {
		this.counter += 1;

		// Generate new gems when all current gems are collected.
		this.createNewGems();

		this.updateCounterEvent.emit(GameEventEnum.UPDATE_COUNTER_EVENT, {
			counter: this.counter,
		});

		if (callback) {
			callback();
		}
	}
}
