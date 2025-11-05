
export interface FoodRecommendation {
  name: string;
  description: string;
  reason: string;
}

export interface Mood {
    name: string;
    emoji: string;
    bgColor: string;
    textColor: string;
}

export interface SelectableOption {
    name: string;
    emoji?: string;
}
