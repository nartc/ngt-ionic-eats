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
			<ion-grid>
				<ion-row style="height: 65%">
					<ion-col size="12">
						<ngt-canvas [sceneGraph]="scene" [camera]="{ position: [-2, 2.5, 5], fov: 30 }" />
					</ion-col>
				</ion-row>
				<ion-row style="height: 35%">
					<app-ingredient-store-front />
				</ion-row>
			</ion-grid>
		</ion-content>
	`,
	styles: `
		:host {
			--ion-grid-padding: 0;
			--ion-grid-column-padding: 0;

			& ion-content {
				height: 100vh;
			}

			& ion-grid {
				height: 100%;
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
