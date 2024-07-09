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
				<ion-row style="height: 70%">
					<ion-col size="12">
						<ngt-canvas [sceneGraph]="scene" />
					</ion-col>
				</ion-row>
				<ion-row style="height: 30%">
					<app-ingredient-store-front />
				</ion-row>
			</ion-grid>
		</ion-content>
	`,
	styles: `
		:host ion-content {
			height: 100vh;
		}

		:host ion-grid {
			height: 100%;
		}
	`,
	imports: [NgtCanvas, IonicModule, IngredientStoreFront],
	providers: [SandwichStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
	scene = Scene;
}
