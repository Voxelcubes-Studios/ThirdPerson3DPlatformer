import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameEnum')
export class GameEnum {
	// Node Names
	public static MAIN_CAMERA = 'MainCamera';
	public static SCENE_SCRIPT = 'SceneScript';
	public static SPAWN_POSITION = 'SpawnPosition';
	public static DEAD_ZONE = 'DeadZone';
	public static PLAYER_RAY_CAST = 'PlayerRayCast';
	public static PLAYER_CORE = 'PlayerCore';
	public static PLAYER_FOOT = 'PlayerFoot';
	public static PLAYER_SPHERE = 'PlayerSphere';
	public static PLAYER = 'Player';
	public static JOYSTICK_UI_CANVAS = 'JoystickUICanvas';
}
