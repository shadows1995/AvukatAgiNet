
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifucmyghemzrvccejdjr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdWNteWdoZW16cnZjY2VqZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjcyNzgsImV4cCI6MjA3OTQwMzI3OH0.PqsAMzBRvr1BpwhBKAZfsPn9lvxw2Orq77QnsSSKEH0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
    console.log('Testing check_duplicate_user RPC...');
    const { data, error } = await supabase.rpc('check_duplicate_user', {
        check_email: 'test@example.com',
        check_phone: '5555555555'
    });

    if (error) {
        console.error('RPC Error:', error);
    } else {
        console.log('RPC Success:', data);
    }
}

testRpc();
