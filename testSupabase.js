import { supabase } from './lib/supabaseClient.js'

async function testConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1)
  if (error) console.error('Error connecting:', error)
  else console.log('✅ Supabase connected! Example data:', data)
}

testConnection()
