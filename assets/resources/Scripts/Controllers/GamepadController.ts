import { _decorator, Component, EventGamepad, input, Input, Vec2 } from 'cc';
import { GameDataService } from '../Services/GameDataService';
const { ccclass } = _decorator;

@ccclass('GamepadController')
export class GamepadController extends Component {
	private static LEFT_STICK = 'left';
	private static RIGHT_STICK = 'right';

	private activeGamepad: any = null;
	private deadzone: number = 0.15;

	public direction = new Vec2();
	public isTouching = false;
	public isConnected = false;

	private stick = null;
	private isLeftStickActive = false;
	private isRightStickActive = false;

	public gameDataService = GameDataService.getInstance();

	private onGamepadChange(event: EventGamepad) {
		if (event.gamepad.connected) {
			this.activeGamepad = event.gamepad;
			this.isConnected = true;
			console.log('Gamepad connected.');
		} else {
			this.isConnected = false;
			console.log('Gamepad disconnected.');
		}
	}

	private onGamepadInput(event: EventGamepad) {
		const leftStick = this.activeGamepad.leftStick;
		const rightStick = this.activeGamepad.rightStick;

		let lstickX = leftStick.getValue().x;
		let lstickY = leftStick.getValue().y;

		let rstickX = rightStick.getValue().x;
		let rstickY = rightStick.getValue().y;

		const lstickMagnitude = Math.sqrt(lstickX * lstickX + lstickY * lstickY);
		const rstickMagnitude = Math.sqrt(rstickX * rstickX + rstickY * rstickY);

		// Left Stick
		if (leftStick && !this.isRightStickActive) {
			if (lstickMagnitude > this.deadzone) {
				this.isLeftStickActive = true;
				this.isTouching = true;
			} else {
				this.isLeftStickActive = false;
				this.isTouching = false;
			}
		}

		// Right Stick
		if (rightStick && !this.isLeftStickActive) {
			if (rstickMagnitude > this.deadzone) {
				this.isRightStickActive = true;
				this.isTouching = true;
			} else {
				this.isRightStickActive = false;
				this.isTouching = false;
			}
		}
	}

	/**
	 * Returns the distance of the handle from the center, which
	 * can be used to determine movement speed.
	 * @returns
	 */
	public getMagnitude(): number {
		return this.direction.length();
	}

	private updateGamepadByStick(stickName: string): void {
		if (!this.activeGamepad) return;

		if (stickName === GamepadController.LEFT_STICK) {
			this.stick = this.activeGamepad.leftStick;
		} else if (stickName === GamepadController.RIGHT_STICK) {
			this.stick = this.activeGamepad.rightStick;
		}

		let stickX = this.stick.getValue().x;
		let stickY = this.stick.getValue().y;

		// Apply deadzone processing
		if (Math.abs(stickX) < this.deadzone) stickX = 0;
		if (Math.abs(stickY) < this.deadzone) stickY = 0;

		if (stickX !== 0 || stickY !== 0) {
			if (this.isTouching) {
				this.direction.set(stickX, stickY);
			} else {
				this.direction.set(0, 0);
			}
		}
	}

	public update(deltaTime: number): void {
		if (!this.gameDataService.isGamepadActive) return;

		if (this.isLeftStickActive && !this.isRightStickActive) {
			this.updateGamepadByStick(GamepadController.LEFT_STICK);
		} else if (!this.isLeftStickActive && this.isRightStickActive) {
			this.updateGamepadByStick(GamepadController.RIGHT_STICK);
		}
	}

	public onLoad(): void {
		input.on(Input.EventType.GAMEPAD_CHANGE, this.onGamepadChange, this);
		input.on(Input.EventType.GAMEPAD_INPUT, this.onGamepadInput, this);
		this.gameDataService.isGamepadActive = false;
	}

	public onDestroy(): void {
		input.off(Input.EventType.GAMEPAD_CHANGE, this.onGamepadChange, this);
		input.off(Input.EventType.GAMEPAD_INPUT, this.onGamepadInput, this);
	}
}
