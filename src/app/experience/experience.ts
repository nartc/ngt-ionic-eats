import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgtCanvas } from 'angular-three';
import { Scene } from './scene';

@Component({
	selector: 'app-experience',
	standalone: true,
	template: `
		<ion-content [fullscreen]="true">
			<ngt-canvas [sceneGraph]="scene" />
		</ion-content>
	`,
	styles: `
		:host ion-content {
			height: 100vh;
		}
	`,
	imports: [NgtCanvas, IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
	scene = Scene;
}
