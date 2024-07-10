import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
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
					<ngt-canvas [sceneGraph]="scene" [shadows]="true" [camera]="{ position: [-2, 2.5, 5], fov: 30 }" />
				</div>
				<app-ingredient-store-front />
			</div>
		</ion-content>
	`,
	styles: `
		:host {
			& .container {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				& .canvas-container {
					width: 100%;
					flex: 1;
				}
			}
		}
	`,
	imports: [NgtCanvas, IonContent, IngredientStoreFront],
	providers: [SandwichStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
	scene = Scene;
}
