import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import { NgtsText3D } from 'angular-three-soba/abstractions';
import { injectGLTF } from 'angular-three-soba/loaders';
import { NgtsContactShadows, NgtsFloat } from 'angular-three-soba/staging';
import * as THREE from 'three';
import { Mesh } from 'three';
import { INGREDIENTS, SandwichStore } from './state';

extend(THREE);

const INGREDIENT_SPACING = 0.2;
const INGREDIENT_SPACING_FINAL = 0.06;

const INGREDIENT_SCALE = 3;
const INGREDIENT_SCALE_Y = 5;

@Component({
	selector: 'app-ingredient',
	standalone: true,
	template: `
		<ngt-group [position]="position()">
			@if (showPrice() && !sandwichStore.addedToCart()) {
				<ngt-group (click)="$event.stopPropagation(); sandwichStore.removeIngredient(ingredient().id)">
					<ngt-mesh [position]="[0.7, 0.042, 0]">
						<ngt-plane-geometry *args="[0.9, 0.16]" />
						<ngt-mesh-standard-material color="white" [opacity]="0.42" [transparent]="true" />
					</ngt-mesh>

					<ngts-text-3d
						font="./assets/fonts/Poppins_Bold.json"
						[text]="(price() | currency)!"
						[options]="{
							scale: 0.1,
							bevelSegments: 3,
							bevelEnabled: true,
							bevelThickness: 0.001,
							position: [0.42, 0, 0],
						}"
					/>

					<ngts-text-3d
						font="./assets/fonts/Poppins_Bold.json"
						text="X"
						[options]="{
							scale: 0.1,
							bevelSegments: 3,
							bevelEnabled: true,
							bevelThickness: 0.001,
							position: [0.82, 0, 0],
						}"
					>
						<ngt-mesh-basic-material color="red" />
					</ngts-text-3d>
				</ngt-group>
			}

			<ngts-float
				[options]="{
					floatingRange: sandwichStore.addedToCart() ? [0, 0] : [-0.01, 0.01],
					speed: sandwichStore.addedToCart() ? 0 : 4,
					rotationIntensity: 0.5,
				}"
			>
				<ngt-primitive
					*args="[scene()]"
					[parameters]="{
						scale: [INGREDIENT_SCALE, INGREDIENT_SCALE_Y + (ingredient().name === 'bread' ? 5 : 0), INGREDIENT_SCALE],
					}"
				/>
			</ngts-float>
		</ngt-group>
	`,

	//   </group>
	//   </Suspense>
	// )}
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtsFloat, NgtArgs, NgtsText3D, CurrencyPipe],
})
export class Ingredient {
	INGREDIENT_SCALE = INGREDIENT_SCALE;
	INGREDIENT_SCALE_Y = INGREDIENT_SCALE_Y;

	showPrice = input.required<boolean>();
	ingredient = input.required<{ id: number; name: keyof typeof INGREDIENTS }>();
	position = input([0, 0, 0]);

	price = computed(() => INGREDIENTS[this.ingredient().name].price);

	sandwichStore = inject(SandwichStore);

	gltf = injectGLTF(() => INGREDIENTS[this.ingredient().name].src);
	scene = computed(() => {
		const gltf = this.gltf();
		if (!gltf) return null;
		const { scene } = gltf;

		scene.traverse((child) => {
			if ((child as Mesh).isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		return scene.clone(true);
	});
	protected readonly INGREDIENTS = INGREDIENTS;
}

@Component({
	selector: 'app-sandwich',
	standalone: true,
	template: `
		<ngt-group [position]="[0, (-sandwichStore.ingredients().length * ingredientSpacing()) / 2, 0]">
			<ngt-group #sandwich>
				@for (ingredient of sandwichStore.ingredients(); track ingredient.id) {
					<app-ingredient
						[ingredient]="ingredient"
						[showPrice]="!$last && !$first"
						[position]="[0, $index * ingredientSpacing(), 0]"
					/>
				}
			</ngt-group>
			<ngts-contact-shadows [options]="{ opacity: 0.6, position: [0, -0.5, 0] }" />
		</ngt-group>
	`,

	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtsContactShadows, Ingredient],
})
export class Sandwich {
	sandwichStore = inject(SandwichStore);

	ingredientSpacing = computed(() =>
		this.sandwichStore.addedToCart() ? INGREDIENT_SPACING_FINAL : INGREDIENT_SPACING,
	);

	constructor() {}

	//   useFrame(() => {
	//   if (addedToCart) {
	//     sandwich.current.rotation.y += 0.01;
	//   } else {
	//   sandwich.current.rotation.y = 0;
	// }
	// });
}

@Component({
	standalone: true,
	template: `
		<ngt-color *args="['#841cd9']" attach="background" />
		<app-sandwich />
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtArgs, Sandwich],
})
export class Scene {}
