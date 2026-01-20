import { useState, useMemo } from 'react';
import { Navbar } from './NavBar';
import { RecipeCard } from './RecipeCard';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useGetRecipesQuery } from '../api/recipeApi';

type SortOption = 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc';

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('rating-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  // Extract sortBy and order from sortOption
  const [sortBy, order] = useMemo(() => {
    switch (sortOption) {
      case 'name-asc':
        return ['name', 'asc'] as const;
      case 'name-desc':
        return ['name', 'desc'] as const;
      case 'rating-asc':
        return ['rating', 'asc'] as const;
      case 'rating-desc':
        return ['rating', 'desc'] as const;
      default:
        return ['name', 'asc'] as const;
    }
  }, [sortOption]);

  const { data, isLoading, error } = useGetRecipesQuery({
    limit: recipesPerPage,
    skip: (currentPage - 1) * recipesPerPage,
    q: searchQuery,
    sortBy,
    order,
  });

  const totalPages = data ? Math.ceil(data.total / recipesPerPage) : 0;

  const scrollToRecipes = () => {
    document.getElementById('recipes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-50 to-orange-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
            Discover Delicious Recipes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore thousands of recipes from around the world. Find your next favorite dish and start cooking today!
          </p>
          <button 
            onClick={scrollToRecipes}
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Recipes
          </button>
        </div>
      </section>

      {/* Recipes Section */}
      <section id="recipes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes, tags, ingredients..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg">Error loading recipes. Please try again.</p>
          </div>
        )}

        {/* Recipe Cards Grid */}
        {!isLoading && !error && data && (
          <>
            {data.recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {data.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No recipes found. Try a different search term.</p>
              </div>
            )}

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
        )}
      </section>
    </div>
  );
}
