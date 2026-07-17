import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('PlayerEnum')
export class PlayerEnum {
	public static ANIM_STATE = {
		IDLE: 'Character|Idle',
		RUN: 'Character|Run',
	};
}
