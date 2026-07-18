import { _decorator, Node, AudioSource, AudioClip, resources, director } from 'cc';

const { ccclass } = _decorator;

@ccclass('AudioManager')
export class AudioManager {
	// Constants for audio file paths
	public static GEM_PICKUP = 'Sounds/gem_pickup';

	private static instance: AudioManager;
	private audioEffectSource: AudioSource;

	public static getInstance(): AudioManager {
		if (this.instance == null) {
			this.instance = new AudioManager();
		}
		return this.instance;
	}

	public init(): void {
		let audioEffectMgr = new Node();
		audioEffectMgr.name = '__audioEffectManagerNode__';

		// Add to the scene.
		director.getScene().addChild(audioEffectMgr);

		// Persistent node, so it's not destroyed when scene changes.
		director.addPersistRootNode(audioEffectMgr);

		// Add AudioSource component to play sounds.
		this.audioEffectSource = audioEffectMgr.addComponent(AudioSource);
	}

	public get audioSource() {
		return this.audioEffectSource;
	}

	/**
	 * Play short audio, such as strikes, explosions
	 * @param sound clip or url for the audio
	 * @param volume
	 */
	public playOneShot(sound: AudioClip | string, volume: number = 1): void {
		if (sound instanceof AudioClip) {
			this.audioEffectSource.playOneShot(sound, volume);
		} else {
			resources.load(sound, (err, clip: AudioClip) => {
				if (err) {
					console.error('Unable to load audio file', err);
				} else {
					this.audioEffectSource.playOneShot(clip, volume);
				}
			});
		}
	}
}
