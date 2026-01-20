import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { recipesApi } from "./api/recipeApi";
import authReducer from './features/authSlice';
import recipesReducer from './features/recipeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [recipesApi.reducerPath]: recipesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, recipesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
