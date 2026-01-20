import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from './NavBar';
import { RecipeCard } from './RecipeCard';
import { RecipeForm } from './RecipeForm';
import { DeleteModal } from './DeleteModal';
import { Plus, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import { selectCurrentUser, selectCurrentToken } from '../features/authSlice';
import { 
  useGetRecipesQuery, 
  useAddRecipeMutation, 
  useUpdateRecipeMutation, 
  useDeleteRecipeMutation 
} from '../api/recipeApi';
import type {Recipe} from '../api/recipeApi'
import { useGetCurrentUserQuery } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/authSlice';

export function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  // Fetch current user if not already loaded
  const { data: currentUserData } = useGetCurrentUserQuery(token || '', {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (currentUserData && !user) {
      dispatch(setUser({
        id: currentUserData.id,
        username: currentUserData.username,
        email: currentUserData.email,
        firstName: currentUserData.firstName,
        lastName: currentUserData.lastName,
        image: currentUserData.image,
      }));
    }
  }, [currentUserData, user, dispatch]);

  // Fetch recipes with pagination
  const { data: recipesData, isLoading } = useGetRecipesQuery({
    limit: recipesPerPage,
    skip: (currentPage - 1) * recipesPerPage,
    sortBy: 'name',
    order: 'asc',
  });

  const [addRecipe, { isLoading: isAdding }] = useAddRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  const totalPages = recipesData ? Math.ceil(recipesData.total / recipesPerPage) : 0;

  const handleCreate = async (recipe: Partial<Recipe>) => {
    try {
      await addRecipe(recipe).unwrap();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  const handleUpdate = async (recipe: Partial<Recipe>) => {
    if (editingRecipe) {
      try {
        await updateRecipe({ id: editingRecipe.id, recipe }).unwrap();
        setEditingRecipe(null);
      } catch (error) {
        console.error('Failed to update recipe:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (deletingRecipe) {
      try {
        await deleteRecipe(deletingRecipe.id).unwrap();
        setDeletingRecipe(null);
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-6">
            <img 
              src={user.image} 
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
            />
            <div className="flex-1">
              <h1 className="text-2xl text-gray-900 mb-1">
                Welcome back, {user.firstName} {user.lastName}!
              </h1>
              <div className="flex flex-col gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">@{user.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Recipe Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Recipe</span>
          </button>
        </div>

        {/* Recipes Section */}
        <div className="mb-6">
          <h2 className="text-xl text-gray-900 mb-4">All Recipes</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : recipesData && recipesData.recipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recipesData.recipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe}
                    showActions
                    onEdit={() => setEditingRecipe(recipe)}
                    onDelete={() => setDeletingRecipe(recipe)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition ${
                            currentPage === page
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-500 mb-4">No recipes found.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Create Your First Recipe
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateForm && (
        <RecipeForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isAdding}
        />
      )}

      {editingRecipe && (
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={handleUpdate}
          onCancel={() => setEditingRecipe(null)}
          isLoading={isUpdating}
        />
      )}

      {deletingRecipe && (
        <DeleteModal
          recipeName={deletingRecipe.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingRecipe(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
