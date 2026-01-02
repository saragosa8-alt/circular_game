import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Question, GameData } from '@/types/game';

export function useGameData(packId?: string) {
  const [data, setData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // If no packId provided, get the first available pack
        let targetPackId = packId;

        if (!targetPackId) {
          const { data: packs, error: packsError } = await supabase
            .from('game_packs')
            .select('id')
            .limit(1)
            .single();

          if (packsError) throw packsError;
          targetPackId = packs.id;
        }

        // Fetch questions for the pack
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('pack_id', targetPackId)
          .order('order_index');

        if (questionsError) throw questionsError;

        // Transform to GameData format
        const gameData: GameData[] = questions.map((q: Question) => ({
          term: q.term,
          definition: q.definition,
          id: q.id,
        }));

        setData(gameData);
      } catch (err: any) {
        console.error('Error fetching game data:', err);
        setError(err.message || 'Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [packId]);

  const refetch = () => {
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refetch };
}
