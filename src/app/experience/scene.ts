import { CurrencyPipe } from '@angular/common';
import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	inject,
	input,
	viewChild,
} from '@angular/core';
import { extend, injectBeforeRender, NgtArgs, NgtThreeEvent } from 'angular-three';
import { NgtsText3D } from 'angular-three-soba/abstractions';
import { injectGLTF } from 'angular-three-soba/loaders';
import { NgtsContactShadows, NgtsFloat } from 'angular-three-soba/staging';
import gsap from 'gsap';
import { injectAutoEffect } from 'ngxtension/auto-effect';
import * as THREE from 'three';
import { Group, Mesh } from 'three';
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
		<ngt-group #ingredientGroup>
			@if (showPrice() && !sandwichStore.addedToCart()) {
				<ngt-group (click)="onRemove($any($event))">
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
				<ngt-primitive *args="[scene()]" [parameters]="{ scale: ingredientScale() }" />
			</ngts-float>
		</ngt-group>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtsFloat, NgtArgs, NgtsText3D, CurrencyPipe],
})
export class Ingredient {
	showPrice = input.required<boolean>();
	ingredient = input.required<{ id: number; name: keyof typeof INGREDIENTS }>();
	position = input([0, 0, 0]);

	private ingredientGroup = viewChild.required<ElementRef<Group>>('ingredientGroup');

	price = computed(() => INGREDIENTS[this.ingredient().name].price);
	ingredientScale = computed(() => [
		INGREDIENT_SCALE,
		INGREDIENT_SCALE_Y + (this.ingredient().name === 'bread' ? 5 : 0),
		INGREDIENT_SCALE,
	]);

	sandwichStore = inject(SandwichStore);

	private gltf = injectGLTF(() => INGREDIENTS[this.ingredient().name].src);
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

	constructor() {
		const autoEffect = injectAutoEffect();

		afterNextRender(() => {
			const [ingredientGroup, { id }] = [this.ingredientGroup().nativeElement, this.ingredient()];

			autoEffect(() => {
				const position = this.position();
				gsap.to(ingredientGroup.position, {
					ease: 'elastic.inOut',
					duration: 0.5,
					x: position[0],
					y: position[1],
					z: position[2],
				});
			});

			if (id !== 1 && id !== 2) {
				gsap.fromTo(
					ingredientGroup.scale,
					{ x: 0.5, y: 0.5, z: 0.5 },
					{ x: 1, y: 1, z: 1, duration: 0.5, ease: 'elastic.inOut' },
				);
			}
		});
	}

	onRemove($event: NgtThreeEvent<MouseEvent>) {
		$event.stopPropagation();
		gsap.to(this.ingredientGroup().nativeElement.scale, {
			x: 0.5,
			y: 0.5,
			z: 0.5,
			duration: 0.5,
			onComplete: () => {
				this.sandwichStore.removeIngredient(this.ingredient().id);
			},
		});
	}
}

@Component({
	selector: 'app-sandwich',
	standalone: true,
	template: `
		<ngt-group [position]="[0, (-sandwichStore.ingredients().length * ingredientSpacing()) / 2, 0]">
			<ngt-group #sandwich>
				@for (ingredient of sandwichStore.ingredients(); track ingredient.id + ingredient.name) {
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

	private sandwich = viewChild.required<ElementRef<Group>>('sandwich');

	constructor() {
		injectBeforeRender(({ delta }) => {
			if (this.sandwichStore.addedToCart()) {
				this.sandwich().nativeElement.rotation.y += delta * 0.25;
			} else {
				this.sandwich().nativeElement.rotation.y = 0;
			}
		});
	}
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
