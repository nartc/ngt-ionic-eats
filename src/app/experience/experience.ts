import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgtCanvas } from 'angular-three';
import { IngredientStoreFront } from './ingredient-store-front';
import { Scene } from './scene';
import { SandwichStore } from './state';

@Component({
	selector: 'app-experience',
	standalone: true,
	template: `
		<ion-content [fullscreen]="true">
			<div class="container">
				<div class="canvas-container">
					<ngt-canvas [sceneGraph]="scene" [camera]="{ position: [-2, 2.5, 5], fov: 30 }" />
				</div>
				<app-ingredient-store-front />
			</div>
		</ion-content>
	`,
	styles: `
		:host {
			& ion-content {
				height: 100vh;
			}

			& .container {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				& .canvas-container {
					height: 65%;
					width: 100%;
				}

				& app-ingredient-store-front {
					height: 35%;
				}
			}
		}
	`,
	imports: [NgtCanvas, IonicModule, IngredientStoreFront],
	providers: [SandwichStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
	scene = Scene;
}
