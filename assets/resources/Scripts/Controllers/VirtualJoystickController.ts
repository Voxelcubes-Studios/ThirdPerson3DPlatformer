import { _decorator, Component, EventTouch, input, Input, Node, Vec2, Vec3 } from 'cc';
import { GameDataService } from '../Services/GameDataService';
const { ccclass, property } = _decorator;

@ccclass('VirtualJoystickController')
export class VirtualJoystickController extends Component {
	@property
	hideOnLoad: boolean = false;

	@property(Node)
	joystickBase: Node | null = null;

	@property(Node)
	joystickKnob: Node | null = null;

	private maxRadius: number = 100;
	private startPos = new Vec2();
	public direction = new Vec2();
	public isTouching: boolean = false;
	private isJoystickActive = true;
	private gameDataService = GameDataService.getInstance();

	/**
	 *
	 * @param touchPos
	 */
	private updateJoystick(event: EventTouch) {
		if (!this.isTouching || !this.joystickBase || !this.joystickKnob) return;

		const touchLocation = event.getUILocation();
		const delta = new Vec2(
			touchLocation.x - this.startPos.x,
			touchLocation.y - this.startPos.y
		);

		// Limit the knob's movement to the max radius
		const clampedDistance = Math.min(delta.length(), this.maxRadius);
		const angle = Math.atan2(delta.y, delta.x);

		const x = Math.cos(angle) * clampedDistance;
		const y = Math.sin(angle) * clampedDistance;

		// Move the joystick knob
		this.joystickKnob.setPosition(new Vec3(x, y, 0));

		// Use the delta or direction here for any game logic
		this.direction = new Vec2(delta.x / clampedDistance, delta.y / clampedDistance);

		// Normalize the direction vector
		this.direction = delta.normalize();
	}

	public enableJoystick(): void {
		this.isJoystickActive = true;
	}

	public disableJoystick(): void {
		this.isJoystickActive = false;
	}

	public hideJoystick(): void {
		this.disableJoystick();
		this.joystickBase.active = false;
	}

	public showJoystick(): void {
		this.enableJoystick();
	}

	public resetJoystick() {
		this.joystickKnob.setPosition(Vec3.ZERO);
		this.direction.set(0, 0);
	}

	private resetTouch(): void {
		this.isTouching = false;
		this.resetJoystick();
	}

	/**
	 * Returns the distance of the handle from the center, which
	 * can be used to determine movement speed.
	 * @returns
	 */
	public getMagnitude(): number {
		return this.direction.length();
	}

	private onTouchStart(event: EventTouch): void {
		if (this.isJoystickActive) {
			const touchLocation = event.getUILocation();

			/**
			 * Only render the joystick if set to true in settings
			 */
			if (this.gameDataService.showJoystickOnScreen) {
				this.joystickBase.active = true;
			}

			// Set the joystick base to the touch position
			const worldPos = new Vec3(touchLocation.x, touchLocation.y, 0);
			this.joystickBase.setWorldPosition(worldPos);

			// Set the joystick knob to the center of the base
			this.joystickKnob.setPosition(Vec3.ZERO);

			// Record the start position
			this.startPos.set(touchLocation);
			this.isTouching = true;
		}
	}

	private onTouchMove(event: EventTouch): void {
		if (this.isJoystickActive) {
			this.updateJoystick(event);
		}
	}

	private onTouchEnd(event: EventTouch): void {
		if (this.isJoystickActive) {
			this.resetTouch();

			/**
			 * Only remove the joystick if set to true in settings
			 * @see GameDataService.showJoystickOnScreen
			 */
			if (this.gameDataService.showJoystickOnScreen) {
				this.joystickBase.active = false;
			}
		}
	}

	private onTouchCancel(event: EventTouch): void {
		if (this.isJoystickActive) {
			this.resetTouch();
		}
	}

	protected onLoad(): void {
		if (this.hideOnLoad) {
			this.hideJoystick();
		}
	}

	public start(): void {
		input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
		input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
		input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
		input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
	}

	public onDestroy(): void {
		input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
		input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
		input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
		input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
	}
}
