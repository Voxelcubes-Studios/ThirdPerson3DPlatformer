import { _decorator, Component, find, math, RigidBody, SkeletalAnimation, Vec2, Vec3 } from 'cc';
import { StateMachineCore } from '../../Core/StateMachineCore';
import { PlayerEnum } from '../../Enums/PlayerEnum';
import { PlayerRunState } from './PlayerRunState';
import { PlayerIdleState } from './PlayerIdleState';
import { GameEnum } from '../../Enums/GameEnum';
import { VirtualJoystickController } from '../VirtualJoystickController';
import { GamepadController } from '../GamepadController';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
	@property({ type: SkeletalAnimation })
	public skeletalAnim: SkeletalAnimation | null = null;

	private machine: StateMachineCore = new StateMachineCore();
	private joystickController: VirtualJoystickController = null;
	private gamepadController: GamepadController = null;
	private rigidBody: RigidBody | null = null;
	private velocity: Vec3 = new Vec3();
	private targetAngle: number = 0;
	private forward = new Vec3();
	public runSpeed: number = 5;

	private playIdleAnimation(): void {
		if (this.skeletalAnim) {
			this.machine.changeState(PlayerEnum.ANIM_STATE.IDLE);
		}
	}

	private playRunAnimation(): void {
		if (this.skeletalAnim) {
			this.machine.changeState(PlayerEnum.ANIM_STATE.RUN);
		}
	}

	private addAnimationStates(): void {
		if (this.skeletalAnim) {
			// Idle State
			this.machine.addState(
				PlayerEnum.ANIM_STATE.IDLE,
				new PlayerIdleState(this.skeletalAnim),
				[PlayerEnum.ANIM_STATE.RUN]
			);

			// Run State
			this.machine.addState(
				PlayerEnum.ANIM_STATE.RUN,
				new PlayerRunState(this.skeletalAnim),
				[PlayerEnum.ANIM_STATE.IDLE]
			);

			this.machine.changeState(PlayerEnum.ANIM_STATE.IDLE);
		}
	}

	private normalControl(
		controller: any,
		direction: Vec2,
		magnitude: number,
		isTouching: boolean
	): void {
		if (this.rigidBody && controller) {
			if (isTouching && direction.lengthSqr() > 0) {
				/**
				 * Calculate target Y-axis rotation angle.
				 * Use negative value to invert the direction if needed.
				 */
				this.targetAngle = math.toDegree(Math.atan2(direction.x, -direction.y));

				// 4. Calculate velocity vector in the forward direction
				this.forward.set(
					Math.sin(math.toRadian(this.targetAngle)),
					0,
					Math.cos(math.toRadian(this.targetAngle))
				);

				this.velocity.set(this.forward).multiplyScalar(magnitude * this.runSpeed);

				this.rigidBody.setLinearVelocity(this.velocity);
				this.node.setRotationFromEuler(0, this.targetAngle, 0);
				this.playRunAnimation();
			} else {
				this.playIdleAnimation();
				this.velocity.set(0, 0, 0);
				this.rigidBody.setLinearVelocity(this.velocity);
			}
		}
	}

	public start(): void {
		this.rigidBody = this.node.getComponent(RigidBody);

		this.joystickController = find(GameEnum.JOYSTICK_UI_CANVAS).getComponent(
			'VirtualJoystickController'
		) as VirtualJoystickController;

		this.gamepadController = find(GameEnum.SCENE_SCRIPT).getComponent(
			'GamepadController'
		) as GamepadController;

		this.addAnimationStates();
	}

	public update(deltaTime: number): void {
		// Gamepad Controller
		if (!this.joystickController.isTouching) {
			if (this.gamepadController && this.gamepadController.isConnected) {
				this.normalControl(
					this.gamepadController,
					this.gamepadController.direction,
					this.gamepadController.getMagnitude(),
					this.gamepadController.isTouching
				);
			}
		}

		// Virtual Joystick Controller
		if (!this.gamepadController.isTouching) {
			this.normalControl(
				this.joystickController,
				this.joystickController.direction,
				this.joystickController.getMagnitude(),
				this.joystickController.isTouching
			);
		}
	}
}
