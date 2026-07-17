import { _decorator, Component, ITriggerEvent, BoxCollider } from 'cc';
import { GameEnum } from '../Enums/GameEnum';
import { GameDataService } from '../Services/GameDataService';

const { ccclass } = _decorator;

@ccclass('GemController')
export class GemController extends Component {
	private gameDataService = GameDataService.getInstance();

	private onTriggerEnter(event: ITriggerEvent) {
		if (event.otherCollider.node.name === GameEnum.PLAYER) {
			// AudioManager.getInstance().playOneShot(AudioManager.COIN_PICKUP);
			this.gameDataService.updateCounter();
			this.node.destroy();
		}
	}

	private checkForCollision(): void {
		let collider = this.node.getComponent(BoxCollider);
		collider.on('onTriggerEnter', this.onTriggerEnter, this);
	}

	public start(): void {
		this.checkForCollision();
	}
}
