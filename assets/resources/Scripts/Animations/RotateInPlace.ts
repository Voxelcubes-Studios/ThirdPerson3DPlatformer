import { _decorator, Component, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotateInPlace')
export class RotateInPlace extends Component {
	@property
	public rotationSpeed = 50;

	@property
	public rotationVector = new Vec3(0, 0, 0);

	public start(): void {
		tween(this.node)
			.by(this.rotationSpeed, { eulerAngles: this.rotationVector })
			.repeatForever()
			.start();
	}
}
