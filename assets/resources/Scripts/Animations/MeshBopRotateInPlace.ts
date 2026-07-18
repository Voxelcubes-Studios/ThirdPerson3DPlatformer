import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MeshBopRotateInPlace')
export class MeshBopRotateInPlace extends Component {
	@property
	public rotationSpeed = 50; // degrees per second

	@property
	public bopHeight = 0.02;

	@property
	public bopSpeed = 0.02;

	@property
	public maxBopHeight = 0.4;

	private currentPostion = new Vec3();
	private currentRotation = new Vec3();

	private intBopAnimation(dt: number): void {
		const bop = this.currentPostion.y + this.maxBopHeight * Math.sin(this.bopHeight) * dt;
		this.node.setPosition(this.currentPostion.x, bop, this.currentPostion.z);
		this.bopHeight += this.bopSpeed;
	}

	private initRotateAnimation(dt: number): void {
		const rotationAmount = this.rotationSpeed * dt;

		this.node.setRotationFromEuler(
			new Vec3(
				this.currentRotation.x,
				this.currentRotation.y + rotationAmount,
				this.currentRotation.z
			)
		);
	}

	public start(): void {
		this.currentPostion = this.node.position;
		this.currentRotation = this.node.eulerAngles;
	}

	public update(dt: number): void {
		// Rotate
		this.initRotateAnimation(dt);

		// Bop
		this.intBopAnimation(dt);
	}
}
