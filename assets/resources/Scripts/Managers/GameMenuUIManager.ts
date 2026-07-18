import { _decorator, Component, Label, Node } from 'cc';
import { GameDataService } from '../Services/GameDataService';
import { GameEventEnum } from '../Enums/GameEventEnum';

const { ccclass } = _decorator;

@ccclass('GameMenuUIManager')
export class GameMenuUIManager extends Component {
	private counterLabelNode: Node = null;
	private gameDataService = GameDataService.getInstance();

	private updateCounter(value: number): void {
		if (this.counterLabelNode) {
			const lbl = this.counterLabelNode.getComponent(Label);

			if (lbl) {
				lbl.string = value.toString();
			}
		}
	}

	private onUpdateCounterEvent(data: any): void {
		if (data) {
			this.updateCounter(data.counter);
		}
	}

	public start(): void {
		this.counterLabelNode = this.node.getChildByName('CounterLabel');

		// Init counter value on start
		this.updateCounter(0);

		// Listen for counter update event and update the counter label
		this.gameDataService.updateCounterEvent.on(
			GameEventEnum.UPDATE_COUNTER_EVENT,
			this.onUpdateCounterEvent,
			this
		);
	}

	public onDestroy(): void {
		// Remove event listener when the component is destroyed
		this.gameDataService.updateCounterEvent.off(
			GameEventEnum.UPDATE_COUNTER_EVENT,
			this.onUpdateCounterEvent,
			this
		);
	}
}
