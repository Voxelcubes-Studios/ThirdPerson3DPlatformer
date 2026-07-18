import {
	_decorator,
	Component,
	find,
	geometry,
	math,
	PhysicsSystem,
	RigidBody,
	SkeletalAnimation,
	Vec2,
	Vec3,
} from 'cc';
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

	@property({ tooltip: 'Gravity pull force when player is not grounded' })
	public gravityForce: number = -50.0;

	private machine: StateMachineCore = new StateMachineCore();
	private joystickController: VirtualJoystickController = null;
	private gamepadController: GamepadController = null;
	private rigidBody: RigidBody | null = null;
	private velocity: Vec3 = new Vec3();
	private targetAngle: number = 0;
	private forward = new Vec3();
	public runSpeed: number = 5;
	private isGrounded = false;
	private raycastMask = 0xffffffff;
	private raycastMaxDistance = 0.2; // 1; // 10000000;
	private raycastQueryTrigger = true;

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

	private initRaycast(): void {
		/**
		 * This a tiny rectangular 3d box that is used to detect if the player is grounded or not.
		 * The box is positioned at the bottom of the player and is used to detect if the player is standing
		 * on the ground or not.
		 */
		const raycastNode = this.node.getChildByName(GameEnum.PLAYER_RAY_CAST);
		if (!raycastNode) {
			return;
		}

		const startPos = raycastNode.worldPosition.clone();
		const worldRay = new geometry.Ray(startPos.x, startPos.y, startPos.z, 0, -1, 0);

		const bResult = PhysicsSystem.instance.raycast(
			worldRay,
			this.raycastMask,
			this.raycastMaxDistance,
			this.raycastQueryTrigger
		);

		if (bResult) {
			const results = PhysicsSystem.instance.raycastResults;

			if (results.length > 0) {
				/**
				 * Extra collision checks.
				 */
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					const collider = result.collider;

					if (result.collider) {
						/**
						 * Check if collided with DeadZone node which we want
						 * to exclude from floor colliders.
						 * Use this function to exclude unwanted colliders we
						 * don't want to use in isGrounded detection logic.
						 */
						if (collider.node.name === GameEnum.DEAD_ZONE) {
							console.log('Deadzone');
							this.isGrounded = false;
							return;
						}
					}
				}

				this.isGrounded = true;
				console.log('Player is grounded:', this.isGrounded);
			}
		} else {
			this.isGrounded = false;
			console.log('Player is not grounded:', this.isGrounded);
		}
	}

	/**
	 * If the player is not grounded, apply
	 * fall acceleration.
	 * @param dt
	 */
	private increaseGravity(dt: number): void {
		if (!this.isGrounded) {
			let velocity = new Vec3();
			this.rigidBody.getLinearVelocity(velocity);

			velocity.y += this.gravityForce * dt; // Increase downward speed
			this.rigidBody.setLinearVelocity(velocity);
		}
	}

	public respawn(): void {
		const spawnPosNode = find(GameEnum.SPAWN_POSITION_NODE);
		if (spawnPosNode) {
			this.node.setWorldPosition(spawnPosNode.getWorldPosition());
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
		// Start detecting ground using raycast
		this.initRaycast();

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

		// Accelerates players gravity.
		this.increaseGravity(deltaTime);
	}
}
