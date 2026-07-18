import { _decorator, Component, Node, Vec3, instantiate, Prefab, tween } from 'cc';
import { TweenEasingEnum } from '../Enums/TweenEasingEnum';
import { GameDataService } from '../Services/GameDataService';
const { ccclass, property } = _decorator;

@ccclass('GemGeneratorManager')
export class GemGeneratorManager extends Component {
	@property({ type: Prefab, tooltip: 'The gem prefab to spawn' })
	public gemPrefab: Prefab = null!;

	@property({ tooltip: 'The final radius of the ring' })
	public ringRadius: number = 5.0;

	@property({ tooltip: 'How long the animation takes to expand (in seconds)' })
	public duration: number = 0.5;

	@property({
		type: Node,
		tooltip: 'Optional distinct start position node. Defaults to this node.',
	})
	public startPositionNode: Node = null!;

	private gameDataService = GameDataService.getInstance();

	public start(): void {
		if (!this.gemPrefab) {
			console.error('GemGeneratorManager: Add a Gem Prefab in the inspector.');
			return;
		}

		this.scheduleOnce(() => {
			this.spawnAndAnimateRing();
		}, 5); // Delay of 5 seconds before spawning the ring
	}

	public spawnAndAnimateRing(): void {
		// Determine starting position
		const originNode = this.startPositionNode ? this.startPositionNode : this.node;
		const startWorldPos = originNode.getWorldPosition();

		// The angle step between each gem to form a full 360-degree circle (in radians)
		const angleStep = (Math.PI * 2) / this.gameDataService.gemCount;

		for (let i = 0; i < this.gameDataService.gemCount; i++) {
			const angle = i * angleStep;
			const targetLocalX = Math.cos(angle) * this.ringRadius;
			const targetLocalZ = Math.sin(angle) * this.ringRadius;

			const targetWorldPos = new Vec3(
				startWorldPos.x + targetLocalX,
				startWorldPos.y, // Keeping Y constant to lay flat. Adjust if you want a vertical ring!
				startWorldPos.z + targetLocalZ
			);

			const gem = instantiate(this.gemPrefab);
			gem.setParent(this.node.parent || this.node.scene);
			gem.setWorldPosition(startWorldPos);

			const tempPos = new Vec3();

			tween(gem)
				.to(
					this.duration,
					{},
					{
						onUpdate: (target: Node, ratio: number) => {
							// Linearly interpolate between start position and target position
							Vec3.lerp(tempPos, startWorldPos, targetWorldPos, ratio);
							target.setWorldPosition(tempPos);
						},
						easing: TweenEasingEnum.BackOut, // 'quadOut'
					}
				)
				.start();
		}
	}
}
