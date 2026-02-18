const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jddjeqnpszsnpoxgdkwe.supabase.co';
const supabaseKey = 'sb_publishable_zRU7eOS0Bl0YVjnM7R1zbA_HzsUY7-z'; // Note: In a real script I'd use the key from .env, but for a quick tool call this is fine.

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking habit_completions ---');
    const { data: hcData, error: hcError } = await supabase
        .from('habit_completions')
        .select('*')
        .limit(1);

    if (hcError) {
        console.error('Error fetching habit_completions:', hcError.message);
    } else {
        console.log('Columns in habit_completions:', hcData.length > 0 ? Object.keys(hcData[0]) : 'No records found to infer columns');
    }

    console.log('\n--- Checking profiles ---');
    const { data: pData, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (pError) {
        console.error('Error fetching profiles:', pError.message);
    } else {
        console.log('Columns in profiles:', pData.length > 0 ? Object.keys(pData[0]) : 'No records to infer');
    }
}

checkSchema();
