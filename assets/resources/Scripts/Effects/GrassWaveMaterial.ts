// GrassWaveMaterial.ts
import { _decorator, Material, Vec2, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GrassWaveMaterial')
export class GrassWaveMaterial extends Component {
	@property(Material)
	grassMaterial: Material = null;

	@property
	waveHeight: number = 0.5;

	@property
	waveSpeed: number = 1.0;

	@property
	waveFrequency: number = 2.0;

	@property
	swayAmount: number = 0.3;

	@property
	grassHeight: number = 1.0;

	@property
	bendAmount: number = 0.5;

	@property(Vec2)
	windDirection: Vec2 = new Vec2(1, 0);

	private time: number = 0;

	start() {
		this.updateMaterialProperties();
	}

	update(deltaTime: number) {
		this.time += deltaTime;

		if (this.grassMaterial) {
			this.grassMaterial.setProperty('time', this.time);
		}
	}

	updateMaterialProperties() {
		if (!this.grassMaterial) return;

		this.grassMaterial.setProperty('waveHeight', this.waveHeight);
		this.grassMaterial.setProperty('waveSpeed', this.waveSpeed);
		this.grassMaterial.setProperty('waveFrequency', this.waveFrequency);
		this.grassMaterial.setProperty('swayAmount', this.swayAmount);
		this.grassMaterial.setProperty('grassHeight', this.grassHeight);
		this.grassMaterial.setProperty('bendAmount', this.bendAmount);
		this.grassMaterial.setProperty('windDirection', this.windDirection);
		this.grassMaterial.setProperty('time', this.time);
	}
}
