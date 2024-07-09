import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { injectGLTF } from 'angular-three-soba/loaders';

export const INGREDIENTS = {
	bacon: {
		src: 'assets/models/Bacon_Slice_Bacon_0.glb',
		icon: '🥓',
		price: 1,
	},
	bread: {
		src: 'assets/models/Bread_Slice_Bread_0.glb',
		icon: '🍞',
		price: 0.5,
	},
	butter: {
		src: 'assets/models/Melted_Butter_Butter_0.glb',
		icon: '🧈',
		price: 0.5,
	},
	cheese: {
		src: 'assets/models/Cheese_Slice_Cheese_0.glb',
		icon: '🧀',
		price: 1,
	},
	chicken: {
		src: 'assets/models/Chicken_Slice_Chicken_0.glb',
		icon: '🍗',
		price: 1,
	},
	cucumber: {
		src: 'assets/models/Cucumber_Slice_Cucumber_0.glb',
		icon: '🥒',
		price: 0.5,
	},
	egg: {
		src: 'assets/models/Egg_Slice_Egg_0.glb',
		icon: '🥚',
		price: 0.5,
	},
	fries: {
		src: 'assets/models/Fries_Slice_Fries_0.glb',
		icon: '🍟',
		price: 0.5,
	},
	lettuce: {
		src: 'assets/models/Lettuce_Slice_Lettuce_0.glb',
		icon: '🥬',
		price: 0.5,
	},
	mushroom: {
		src: 'assets/models/Mushroom_Slice_Mushroom_0.glb',
		icon: '🍄',
		price: 0.5,
	},
	onion: {
		src: 'assets/models/Onion_Slice_Onion_0.glb',
		icon: '🧅',
		price: 0.5,
	},
	patty: {
		src: 'assets/models/Patty_Slice_Patty_0.glb',
		icon: '🍔',
		price: 1,
	},
	pepper: {
		src: 'assets/models/Pepper_Slice_Pepper_0.glb',
		icon: '🫑',
		price: 0.5,
	},
	pickles: {
		src: 'assets/models/Pickle_Slice_Pickles_0.glb',
		icon: '🥒',
		price: 0.5,
	},
	tomato: {
		src: 'assets/models/Tomato_Slice_Tomato_0.glb',
		icon: '🍅',
		price: 0.5,
	},
} as const;

// preload all ingredients
injectGLTF.preload(() => Object.values(INGREDIENTS).map(({ src }) => src));

export const ingredientNames = Object.keys(INGREDIENTS) as Array<keyof typeof INGREDIENTS>;

export const SandwichStore = signalStore(
	withState({
		ingredients: [
			{ id: 0, name: 'bread' },
			{ id: 1, name: 'bread' },
		] as Array<{ id: number; name: keyof typeof INGREDIENTS }>,
		addedToCart: false,
	}),
	withComputed(({ ingredients }) => ({
		total: computed(() => ingredients().reduce((sum, { name }) => sum + INGREDIENTS[name].price, 4)),
		allowAddIngredient: computed(() => ingredients().length < 12),
	})),
	withMethods((store) => ({
		addIngredient: (ingredient: keyof typeof INGREDIENTS) => {
			if (store.allowAddIngredient()) {
				patchState(store, (state) => ({
					ingredients: [
						...state.ingredients.slice(0, -1),
						{ name: ingredient, id: state.ingredients.length },
						{ name: 'bread' as const, id: 1 },
					],
				}));
			}
		},
		removeIngredient: (ingredientId: number) => {
			patchState(store, (state) => ({
				ingredients: state.ingredients.filter((ing) => ing.id !== ingredientId),
			}));
		},
		setAddedToCart: (addedToCart: boolean) => {
			patchState(store, { addedToCart });
		},
	})),
);
