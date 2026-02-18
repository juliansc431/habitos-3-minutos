import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export function useHabitCompletion() {
    const { user, refreshProfile } = useAuth();
    const [isCompleting, setIsCompleting] = useState(false);

    const completeHabit = async (habitData) => {
        if (!user) return { error: 'No user logged in' };

        setIsCompleting(true);
        try {
            // 1. Log completion (Smart Retry Logic)
            try {
                // Try full insert first (requires SQL columns)
                const { error: fullError } = await supabase
                    .from('habit_completions')
                    .insert({
                        user_id: user.id,
                        xp_earned: 10,
                        habit_name: habitData?.text || 'Hábito Micro',
                        category: habitData?.category || 'all',
                        duration: habitData?.duration || '1 min',
                        emoji: habitData?.emoji || '🎯'
                    });

                if (fullError && fullError.message.includes('column')) {
                    console.log('Falling back to minimal insert (SQL columns missing)');
                    const { error: minError } = await supabase
                        .from('habit_completions')
                        .insert({
                            user_id: user.id,
                            xp_earned: 10
                        });
                    if (minError) throw minError;
                } else if (fullError) {
                    throw fullError;
                }
            } catch (err) {
                console.error('Completion log error:', err);
                // We don't throw here to avoid blocking XP gain if history fails
            }

            // 2. Update Profile (Daily Streak Logic)
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            let lastDate = null;
            if (user.last_completion_at) {
                const lastFullDate = new Date(user.last_completion_at);
                lastDate = new Date(lastFullDate.getFullYear(), lastFullDate.getMonth(), lastFullDate.getDate());
            }

            let newStreak = user.streak || 0;
            const diffTime = lastDate ? today.getTime() - lastDate.getTime() : null;
            const diffDays = diffTime !== null ? Math.round(diffTime / (1000 * 60 * 60 * 24)) : null;

            if (lastDate === null || diffDays > 1) {
                // First habit ever OR missed at least one day
                newStreak = 1;
            } else if (diffDays === 1) {
                // Completed yesterday, streak continues!
                newStreak += 1;
            }
            // If diffDays === 0, we already completed a habit today, streak stays the same

            const newXp = (user.xp || 0) + 10;
            const newTotal = (user.total_completed || 0) + 1;
            const newLevel = Math.floor(newXp / 100) + 1;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    xp: newXp,
                    streak: newStreak,
                    total_completed: newTotal,
                    level: newLevel,
                    last_completion_at: now.toISOString()
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 3. Refresh Auth Profile for UI
            if (refreshProfile) await refreshProfile();

            return { success: true, newXp, newStreak };

        } catch (error) {
            console.error('Error completing habit:', error);
            return { error };
        } finally {
            setIsCompleting(false);
        }
    };

    return { completeHabit, isCompleting };
}
