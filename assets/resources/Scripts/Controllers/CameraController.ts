import { _decorator, Component, math, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
	@property(Node)
	public target: Node | null = null;

	/**
	 * Default position relative to the player
	 */
	@property(Vec3)
	public offset: Vec3 = v3(0, 5, -10);

	/**
	 * Higher = faster follow, Lower = smoother delay
	 */
	@property
	public smoothSpeed: number = 0.1;

	@property
	public clampDamp: number = 20;

	/**
	 * Constantly rotate to look at the player
	 */
	@property
	public lookAtTarget: boolean = true;

	private targetPos: Vec3 = v3();
	private offsetPos: Vec3 = v3();
	// private currentPos: Vec3 = v3();

	/**
     * Uncomment the following code to enable smooth camera movement with lerp.
     * This will make the camera follow the player with a smooth transition,
     * rather than snapping directly to the target position.
     * 
     * @param dt 
     * @returns 
     
	public lateUpdate(dt: number): void {
		if (!this.target) return;

		this.target.getWorldPosition(this.targetPos);
		Vec3.add(this.offsetPos, this.targetPos, this.offset);

		this.node.getWorldPosition(this.currentPos);

		// Using lerp for smooth damping.
		const t = math.clamp01(this.smoothSpeed * this.clampDamp * dt);
		Vec3.lerp(this.currentPos, this.currentPos, this.offsetPos, t);

		// Apply the new position to the camera
		this.node.setWorldPosition(this.currentPos);

		// Point the camera directly at the player
		if (this.lookAtTarget) {
			this.node.lookAt(this.targetPos);
		}
	}*/

	public lateUpdate(dt: number): void {
		if (!this.target) return;

		this.target.getWorldPosition(this.targetPos);
		Vec3.add(this.offsetPos, this.targetPos, this.offset);

		// Set the camera directly to the desired position (no smoothing)
		this.node.setWorldPosition(this.offsetPos);

		// Point the camera directly at the player
		if (this.lookAtTarget) {
			this.node.lookAt(this.targetPos);
		}
	}
}
