const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  const { data, error } = await supabase.from('User').select('count');
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
    process.exit(1);
  }
  console.log('Successfully connected to Supabase!');
  console.log('User count:', data);
}

test();
