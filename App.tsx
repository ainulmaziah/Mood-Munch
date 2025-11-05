
import React, { useState, useCallback } from 'react';
import { FoodRecommendation, Mood, SelectableOption } from './types';
import { MOODS, MEAL_TYPES, CUISINE_TYPES } from './constants';
import { getFoodRecommendations } from './services/geminiService';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import RecommendationCard from './components/RecommendationCard';

const App: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<SelectableOption | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<FoodRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCuisineToggle = (cuisineName: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineName)
        ? prev.filter(c => c !== cuisineName)
        : [...prev, cuisineName]
    );
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedMood || !selectedMealType) {
      setError("Please select a mood and a meal type.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await getFoodRecommendations(selectedMood.name, selectedMealType.name, selectedCuisines);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedMood, selectedMealType, selectedCuisines]);
  
  const handleStartOver = () => {
    setSelectedMood(null);
    setSelectedMealType(null);
    setSelectedCuisines([]);
    setRecommendations(null);
    setError(null);
    setIsLoading(false);
  };
  
  const StepIndicator: React.FC<{ step: number, title: string, isComplete: boolean }> = ({ step, title, isComplete }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isComplete ? 'bg-green-500' : 'bg-orange-500'}`}>
            {isComplete ? '✓' : step}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        {!recommendations && !isLoading && (
             <div className="space-y-12">
                <section>
                    <StepIndicator step={1} title="How are you feeling?" isComplete={!!selectedMood} />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MOODS.map(mood => (
                            <button
                                key={mood.name}
                                onClick={() => setSelectedMood(mood)}
                                className={`p-4 rounded-xl shadow-md text-center transition-all duration-200 transform hover:scale-105 ${selectedMood?.name === mood.name ? 'ring-4 ring-orange-400 scale-105' : 'hover:shadow-lg'} ${mood.bgColor} ${mood.textColor}`}
                            >
                                <span className="text-4xl">{mood.emoji}</span>
                                <p className="mt-2 font-semibold">{mood.name}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {selectedMood && (
                    <section className="animate-fade-in">
                        <StepIndicator step={2} title="What kind of meal?" isComplete={!!selectedMealType} />
                         <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                            {MEAL_TYPES.map(meal => (
                                <button
                                    key={meal.name}
                                    onClick={() => setSelectedMealType(meal)}
                                    className={`p-4 rounded-xl shadow-md flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 ${selectedMealType?.name === meal.name ? 'bg-orange-500 text-white ring-4 ring-orange-300' : 'bg-white dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600'}`}
                                >
                                    <span className="text-3xl">{meal.emoji}</span>
                                    <p className="mt-2 font-semibold">{meal.name}</p>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
                
                {selectedMealType && (
                     <section className="animate-fade-in">
                        <StepIndicator step={3} title="Any cuisine preferences? (Optional)" isComplete={true} />
                        <div className="mt-4 flex flex-wrap gap-3">
                            {CUISINE_TYPES.map(cuisine => (
                                <button
                                    key={cuisine.name}
                                    onClick={() => handleCuisineToggle(cuisine.name)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${selectedCuisines.includes(cuisine.name) ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {cuisine.name}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {selectedMood && selectedMealType && (
                    <div className="text-center pt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Get Recommendations
                        </button>
                    </div>
                )}
             </div>
        )}

        {isLoading && <div className="mt-12"><LoadingSpinner /></div>}
        
        {error && <div className="mt-12 text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {recommendations && (
            <div className="mt-12 animate-fade-in">
                 <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
                    Your mood-matched recommendations!
                </h2>
                <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
                    {recommendations.map((rec, index) => (
                        <RecommendationCard key={rec.name} recommendation={rec} index={index}/>
                    ))}
                </div>
                <div className="mt-12 flex justify-center space-x-4">
                     <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={handleStartOver}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
