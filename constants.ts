
import { Mood, SelectableOption } from './types';

export const MOODS: Mood[] = [
  { name: 'Happy', emoji: '😄', bgColor: 'bg-yellow-300', textColor: 'text-yellow-800' },
  { name: 'Stressed', emoji: '😫', bgColor: 'bg-red-300', textColor: 'text-red-800' },
  { name: 'Comforting', emoji: '🤗', bgColor: 'bg-blue-300', textColor: 'text-blue-800' },
  { name: 'Adventurous', emoji: '🤠', bgColor: 'bg-green-300', textColor: 'text-green-800' },
  { name: 'Energetic', emoji: '⚡️', bgColor: 'bg-orange-300', textColor: 'text-orange-800' },
  { name: 'Relaxed', emoji: '😌', bgColor: 'bg-purple-300', textColor: 'text-purple-800' },
  { name: 'Sad', emoji: '😢', bgColor: 'bg-gray-400', textColor: 'text-gray-800' },
];

export const MEAL_TYPES: SelectableOption[] = [
  { name: 'Breakfast', emoji: '🥞' },
  { name: 'Lunch', emoji: '🥗' },
  { name: 'Dinner', emoji: '🍝' },
  { name: 'Snack', emoji: '🥨' },
  { name: 'Dessert', emoji: '🍰' },
];

export const CUISINE_TYPES: SelectableOption[] = [
  { name: 'Western' },
  { name: 'Asian' },
  { name: 'Italian' },
  { name: 'Mexican' },
  { name: 'Indian' },
  { name: 'Spicy' },
  { name: 'Sweet' },
  { name: 'Savory' },
  { name: 'Comfort Food' },
  { name: 'Healthy' },
];
