import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export interface RecipesQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  tagTypes: ['Recipes'],
  endpoints: (builder) => ({
    getRecipes: builder.query<RecipesResponse, RecipesQueryParams>({
      query: ({ limit = 10, skip = 0, q = '', sortBy = 'name', order = 'asc' }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: skip.toString(),
          sortBy,
          order,
        });
        
        if (q) {
          return `/recipes/search?q=${encodeURIComponent(q)}&${params.toString()}`;
        }
        
        return `/recipes?${params.toString()}`;
      },
      providesTags: ['Recipes'],
    }),
    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/recipes/${id}`,
      providesTags: ['Recipes'],
    }),
    addRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (recipe) => ({
        url: '/recipes/add',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: recipe,
      }),
      invalidatesTags: ['Recipes'],
    }),
    updateRecipe: builder.mutation<Recipe, { id: number; recipe: Partial<Recipe> }>({
      query: ({ id, recipe }) => ({
        url: `/recipes/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: recipe,
      }),
      invalidatesTags: ['Recipes'],
    }),
    deleteRecipe: builder.mutation<{ id: number; isDeleted: boolean }, number>({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recipes'],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApi;
