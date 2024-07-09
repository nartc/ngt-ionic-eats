import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SandwichStore } from './state';

@Component({
	selector: 'app-ingredient-store-front',
	standalone: true,
	template: `
		<div class="ion-padding">
			<ion-text>
				<h3>Sandwich Shop</h3>
			</ion-text>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonicModule],
})
export class IngredientStoreFront {
	sandwichStore = inject(SandwichStore);
}
