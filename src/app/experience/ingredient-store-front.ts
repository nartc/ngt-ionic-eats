import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { INGREDIENTS, SandwichStore, ingredientNames } from './state';

@Component({
	selector: 'app-ingredient-store-front',
	standalone: true,
	template: `
		<div class="container ion-padding">
			<ion-text>
				<h3>
					Sandwich Shop
					<span class="ion-margin-start">⭐⭐⭐⭐⭐</span>
				</h3>
			</ion-text>
			<ion-text>
				<p style="font-weight: lighter">Fresh and delicious sandwiches made with love</p>
			</ion-text>
			@if (sandwichStore.addedToCart()) {
				<ion-text class="cart-success">
					<p>This project is ported from Wawa Sensei's 3D Sandwich Configurator</p>
				</ion-text>
				<ion-button color="danger" (click)="sandwichStore.setAddedToCart(false)">
					Cancel order ({{ sandwichStore.total() | currency }})
				</ion-button>
			} @else {
				<div class="scroll-container">
					@for (ingredient of ingredientNames; track ingredient) {
						<ion-card
							[disabled]="!sandwichStore.allowAddIngredient()"
							(click)="sandwichStore.addIngredient(ingredient)"
						>
							<ion-card-content>
								<div class="ingredient-card-content">
									<ion-text>{{ INGREDIENTS[ingredient].icon }}</ion-text>
									<div class="ingredient-info">
										<ion-text class="ingredient">{{ ingredient | titlecase }}</ion-text>
										<ion-text class="price" color="success">(+{{ INGREDIENTS[ingredient].price | currency }})</ion-text>
									</div>
								</div>
							</ion-card-content>
						</ion-card>
					}
				</div>
				<ion-button (click)="sandwichStore.setAddedToCart(true)">
					Add to cart ({{ sandwichStore.total() | currency }})
				</ion-button>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonicModule, TitleCasePipe, CurrencyPipe],
	styles: `
		:host {
			display: block;
			overflow: hidden;
			width: 100%;
		}

		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		.scroll-container {
			display: flex;
			flex-wrap: nowrap;

			overflow-x: auto;
			-webkit-overflow-scrolling: touch;

			&::-webkit-scrollbar {
				display: none;
			}

			& ion-card {
				flex: 0 0 auto;
			}
		}

		.cart-success {
			flex: 1;
		}

		.ingredient-card-content {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			> ion-text {
				font-size: larger;
			}

			& .ingredient-info {
				display: flex;
				gap: 0.25rem;
				align-items: center;

				& .ingredient {
					font-weight: bold;
				}

				& .price {
					font-size: small;
				}
			}
		}

		ion-button {
			width: 100%;
		}
	`,
})
export class IngredientStoreFront {
	INGREDIENTS = INGREDIENTS;
	ingredientNames = ingredientNames;

	sandwichStore = inject(SandwichStore);
}
