const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jddjeqnpszsnpoxgdkwe.supabase.co';
const supabaseKey = 'sb_publishable_zRU7eOS0Bl0YVjnM7R1zbA_HzsUY7-z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('--- Checking for habit_name and category columns ---');
    const { error } = await supabase
        .from('habit_completions')
        .select('habit_name, category')
        .limit(1);

    if (error) {
        if (error.message.includes('column') && error.message.includes('does not exist')) {
            console.log('STATUS: COLUMNS_MISSING');
            console.log('Error:', error.message);
        } else {
            console.error('Unexpected error:', error.message);
        }
    } else {
        console.log('STATUS: COLUMNS_EXIST');
    }
}

checkColumns();
