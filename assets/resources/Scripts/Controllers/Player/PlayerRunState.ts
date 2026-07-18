import { _decorator, SkeletalAnimation } from 'cc';
import { PlayerEnum } from '../../Enums/PlayerEnum';
const { ccclass } = _decorator;

@ccclass('PlayerRunState')
export class PlayerRunState {
	protected skeletalAnim: SkeletalAnimation | null = null;

	constructor(skeletalAnim: SkeletalAnimation) {
		this.skeletalAnim = skeletalAnim;
	}

	public enter(): void {
		if (this.skeletalAnim) {
			this.skeletalAnim.getState(PlayerEnum.ANIM_STATE.RUN).speed = 1.2;
			this.skeletalAnim.crossFade(PlayerEnum.ANIM_STATE.RUN);
		}
	}

	public update(dt: number): void {
		//
	}

	public exit(): void {
		//
	}
}
