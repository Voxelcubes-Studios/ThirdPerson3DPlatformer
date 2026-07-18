import { _decorator, BoxCollider, Component, find, ITriggerEvent } from 'cc';
import { PlayerController } from './Player/PlayerController';
import { GameEnum } from '../Enums/GameEnum';
const { ccclass } = _decorator;

@ccclass('DeadZoneController')
export class DeadZoneController extends Component {
	private playerController: PlayerController = null;

	private onTriggerEnter(event: ITriggerEvent) {
		if (event.otherCollider.node.name === GameEnum.PLAYER) {
			if (this.playerController) {
				this.playerController.respawn();
			}
		}
	}

	private checkForCollision(): void {
		let collider = this.node.getComponent(BoxCollider);
		collider.on('onTriggerEnter', this.onTriggerEnter, this);
	}

	public start(): void {
		this.playerController = find(GameEnum.PLAYER).getComponent(
			'PlayerController'
		) as PlayerController;
		this.checkForCollision();
	}
}
