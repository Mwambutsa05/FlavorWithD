import { Star, Clock, Users } from 'lucide-react';
import type { Recipe } from '../api/recipeApi';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function RecipeCard({ recipe, onEdit, onDelete, showActions = false }: RecipeCardProps) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{recipe.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{recipe.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.cuisine} • {recipe.difficulty}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalTime} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}