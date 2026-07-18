import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameEnum')
export class GameEnum {
	// Node Names
	public static MAIN_CAMERA = 'MainCamera';
	public static SCENE_SCRIPT = 'SceneScript';
	public static DEAD_ZONE = 'DeadZone';
	public static PLAYER = 'Player';
	public static JOYSTICK_UI_CANVAS = 'VirtualJoystickCanvas';
}
