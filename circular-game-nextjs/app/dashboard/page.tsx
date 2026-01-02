'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CircularGame from '@/components/CircularGame';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (isGuest) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [isGuest, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Match the Terms</h1>
          <div className="flex items-center gap-4">
            {isGuest ? (
              <span className="text-white/80 text-sm">Playing as Guest</span>
            ) : (
              <span className="text-white/80 text-sm">{user?.email}</span>
            )}
            {!isGuest && (
              <button
                onClick={handleSignOut}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <CircularGame />
      </main>
    </div>
  );
}
