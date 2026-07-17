import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('StateMachineCore')
export class StateMachineCore extends Component {
	public id = '';
	public current: string | null = null;
	public previous: string | null = null;
	public states: any = {};

	/**
	 * Changes states of a given object
	 */
	public changeState(name: string): void {
		// If state is null then change to the new defined state
		if (this.current === null) {
			this.current = name;
			this.states[this.current].state.enter();
			return;
		}

		// Check if state is in current state
		if (this.current === name) {
			return;
		}

		// Check if state is in the list of states for the current state
		// and execute condition if state is found
		if (this.states[this.current].from.indexOf(name) !== -1) {
			this.states[this.current].state.exit();
			this.previous = this.current;
			this.current = name;
		} else {
			return;
		}

		// transition to new state
		this.states[this.current].state.enter();
	}

	/**
	 * Adds new state to states object
	 */
	public addState(name: string, stateObj: any, fromStates: any): void {
		this.states[name] = { state: stateObj, from: fromStates.toString() };
	}

	/**
	 * Calls the update method on the new state object
	 */
	public update(deltaTime: number): void {
		if (this.current !== null) {
			this.states[this.current].state.update(deltaTime);
		}
	}
}
