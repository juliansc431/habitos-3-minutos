const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jddjeqnpszsnpoxgdkwe.supabase.co';
const supabaseKey = 'sb_publishable_zRU7eOS0Bl0YVjnM7R1zbA_HzsUY7-z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Querying Column Names via SQL (if possible) ---');
    // Supabase allows querying views. Maybe there is a view for this.
    // Otherwise, we can try to guess or use RPC if exists.
    // Try to select a non-existent column to see if the error lists available ones.
    const { error } = await supabase
        .from('habit_completions')
        .select('random_column_to_trigger_error');

    if (error) {
        console.log('Error message (might list columns):', error.message);
    }

    console.log('\n--- Checking if there are OTHER tables ---');
    // We can't list tables easily via JS client, but we can try common names.
    const tables = ['habit_completions', 'compleciones de hábitos', 'habit_history', 'history'];
    for (const t of tables) {
        const { error } = await supabase.from(t).select('count').limit(1);
        if (!error) console.log(`Table exists: ${t}`);
        else console.log(`Table NOT confirmed: ${t} (${error.message})`);
    }
}

checkSchema();
