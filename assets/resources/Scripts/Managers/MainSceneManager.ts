import { _decorator, Component } from 'cc';
import { AudioManager } from './AudioManager';

const { ccclass } = _decorator;

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
	public audioManager = AudioManager.getInstance();

	public start(): void {
		this.audioManager.init();
	}
}
