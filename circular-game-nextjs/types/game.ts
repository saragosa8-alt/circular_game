export interface Question {
  id: string;
  pack_id: string;
  term: string;
  definition: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GamePack {
  id: string;
  module_id: string;
  name: string;
  description: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
}

export interface GameData {
  term: string;
  definition: string;
  id: string;
}

export interface PieceData {
  element: HTMLDivElement;
  type: 'term' | 'definition';
  id: string;
  x: number;
  y: number;
  rotation: number;
  matched: boolean;
}

export interface DifficultySettings {
  pairCount: number;
  snapDistance: number;
  proximityDistance: number;
  starThresholds: {
    three: number;
    two: number;
  };
}
