import { _decorator, SkeletalAnimation } from 'cc';
import { PlayerEnum } from '../../Enums/PlayerEnum';
const { ccclass } = _decorator;

@ccclass('PlayerIdleState')
export class PlayerIdleState {
	protected skeletalAnim: SkeletalAnimation | null = null;

	constructor(skeletalAnim: SkeletalAnimation) {
		this.skeletalAnim = skeletalAnim;
	}

	public enter(): void {
		if (this.skeletalAnim) {
			this.skeletalAnim.getState(PlayerEnum.ANIM_STATE.IDLE).speed = 1.3;
			this.skeletalAnim.crossFade(PlayerEnum.ANIM_STATE.IDLE, 0.1);
		}
	}

	public update(dt: number): void {
		//
	}

	public exit(): void {
		//
	}
}
