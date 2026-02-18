const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jddjeqnpszsnpoxgdkwe.supabase.co';
const supabaseKey = 'sb_publishable_zRU7eOS0Bl0YVjnM7R1zbA_HzsUY7-z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Attempting dummy insert to verify structure ---');
    // Using julian's ID if possible, or just a dummy.
    const dummyId = '7d2a71d7-8b01-4c1d-8b01-7d2a71d78b01'; // Just a format check

    // Check for user julian's id first
    const { data: userData } = await supabase.from('profiles').select('id').limit(1);
    const userId = userData?.[0]?.id;

    if (!userId) {
        console.log('No user found to test insert.');
        return;
    }

    console.log(`Using User ID: ${userId}`);

    const { data, error } = await supabase
        .from('habit_completions')
        .insert({
            user_id: userId,
            xp_earned: 1
        })
        .select();

    if (error) {
        console.error('Insert failed:', error.message);
    } else {
        console.log('Insert SUCCESS. Record structure:', data[0]);
    }
}

checkSchema();
