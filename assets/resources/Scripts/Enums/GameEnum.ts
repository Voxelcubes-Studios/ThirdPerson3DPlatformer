import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameEnum')
export class GameEnum {
	// Node Names
	public static SCENE_SCRIPT = 'SceneScript';
	public static DEAD_ZONE = 'DeadZone';
	public static PLAYER = 'Player';
	public static JOYSTICK_UI_CANVAS = 'VirtualJoystickCanvas';
	public static PLAYER_RAY_CAST = 'PlayerRayCast';
	public static SPAWN_POSITION_NODE = 'SpawnNode';
}
