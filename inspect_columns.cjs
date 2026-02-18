const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jddjeqnpszsnpoxgdkwe.supabase.co';
const supabaseKey = 'sb_publishable_zRU7eOS0Bl0YVjnM7R1zbA_HzsUY7-z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Fetching existing completions to see columns ---');

    // Get a user ID first
    const { data: userData } = await supabase.from('profiles').select('id').limit(1);
    const userId = userData?.[0]?.id;

    if (!userId) {
        console.log('No user found.');
        return;
    }

    const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .limit(5);

    if (error) {
        console.error('Fetch failed:', error.message);
    } else if (data && data.length > 0) {
        console.log('SUCCESS. Found records.');
        console.log('Columns found in record:', Object.keys(data[0]));
        console.log('Sample record data:', data[0]);
    } else {
        console.log('No records found for user:', userId);
        // Try without filter just in case
        const { data: allData, error: allErr } = await supabase.from('habit_completions').select('*').limit(1);
        if (allData && allData.length > 0) {
            console.log('Found records from other users. Columns:', Object.keys(allData[0]));
        } else {
            console.log('Truly empty table.');
        }
    }
}

checkSchema();
