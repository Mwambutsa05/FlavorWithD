import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Recipe } from '../api/recipeApi';

interface RecipesState {
  localRecipes: Recipe[];
}

const initialState: RecipesState = {
  localRecipes: [],
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addLocalRecipe: (state, action: PayloadAction<Recipe>) => {
      state.localRecipes.unshift(action.payload);
    },
    updateLocalRecipe: (state, action: PayloadAction<{ id: number; recipe: Partial<Recipe> }>) => {
      const index = state.localRecipes.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.localRecipes[index] = { ...state.localRecipes[index], ...action.payload.recipe };
      }
    },
    deleteLocalRecipe: (state, action: PayloadAction<number>) => {
      state.localRecipes = state.localRecipes.filter((r) => r.id !== action.payload);
    },
  },
});

export const { addLocalRecipe, updateLocalRecipe, deleteLocalRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;

export const selectLocalRecipes = (state: RootState) => state.recipes.localRecipes;
