import { _decorator, Component, ITriggerEvent, BoxCollider, Prefab, Vec3, instantiate } from 'cc';
import { GameEnum } from '../Enums/GameEnum';
import { GameDataService } from '../Services/GameDataService';
import { AudioManager } from '../Managers/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('RedGemController')
export class RedGemController extends Component {
	@property(Prefab)
	public gemParticlePrefab: Prefab | null = null;

	private gameDataService = GameDataService.getInstance();

	private playParticleEffect(): void {
		if (this.gemParticlePrefab) {
			const instance = instantiate(this.gemParticlePrefab);

			instance.setScale(new Vec3(1.3, 1.3, 1.3));
			const pos = this.node.getWorldPosition().clone();
			instance.setWorldPosition(pos);
			this.node.scene.addChild(instance);
		}
	}

	private onTriggerEnter(event: ITriggerEvent) {
		if (event.otherCollider.node.name === GameEnum.PLAYER) {
			AudioManager.getInstance().playOneShot(AudioManager.GEM_PICKUP, 0.5);
			this.playParticleEffect();
			this.gameDataService.updateCounter();
			this.node.destroy();
		}
	}

	private checkForCollision(): void {
		let collider = this.node.getChildByName('RedGemCollider').getComponent(BoxCollider);
		collider.on('onTriggerEnter', this.onTriggerEnter, this);
	}

	public start(): void {
		this.checkForCollision();
	}
}
