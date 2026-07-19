import { _decorator, AudioClip, AudioSource, Component } from 'cc';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('MainSceneManager')
export class MainSceneManager extends Component {
	@property(AudioClip)
	public backgroundMusic: AudioClip | null = null;

	public levelAudioSource: AudioSource | null = null;
	public audioManager = AudioManager.getInstance();

	public initBackgroundMusic(): void {
		if (!this.backgroundMusic) {
			console.log('No background music added');
			return;
		}

		this.levelAudioSource = this.node.addComponent(AudioSource);
		this.levelAudioSource.clip = this.backgroundMusic;
		this.levelAudioSource.loop = true;
		this.levelAudioSource.volume = 0.3;
		this.levelAudioSource.play();
	}

	public start(): void {
		this.initBackgroundMusic();
		this.audioManager.init();
	}
}
