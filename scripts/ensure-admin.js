
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Required environment variables are missing.');
    console.error('Please ensure VITE_SUPABASE_URL is in .env');
    console.error('and you provide SUPABASE_SERVICE_ROLE_KEY when running this script.');
    console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/ensure-admin.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

console.log('--- Debug Info ---');
console.log(`Using Supabase URL: ${SUPABASE_URL}`);
console.log(`Key Length: ${SUPABASE_SERVICE_ROLE_KEY.length}`);
console.log(`Key First 5 Chars: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 5)}...`);
console.log('------------------');


const ADMIN_EMAIL = 'manoj.iit09@gmail.com';
const ADMIN_PASSWORD = 'temp-admin-password-123'; // User should change this after first login

async function ensureAdminUser() {
    console.log(`Checking for admin user: ${ADMIN_EMAIL}...`);

    // 1. Check if user already exists in Auth
    // We use listUsers to find by email.
    const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers();

    if (listUsersError) {
        console.error('Error listing users:', listUsersError.message);
        process.exit(1);
    }

    let user = users.find(u => u.email === ADMIN_EMAIL);

    if (!user) {
        console.log('User not found. Creating new admin user...');
        const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
        });

        if (createUserError) {
            console.error('Error creating user:', createUserError.message);
            process.exit(1);
        }

        user = newUser.user;
        console.log(`User created with ID: ${user.id}`);
        console.log(`Initial Password: ${ADMIN_PASSWORD}`);
    } else {
        console.log(`User already exists with ID: ${user.id}`);
    }

    // 2. Check/Assign Admin Role in user_roles table
    console.log('Verifying admin role...');

    const { data: existingRole, error: fetchRoleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

    if (fetchRoleError && fetchRoleError.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error checking user_roles:', fetchRoleError.message);
        process.exit(1);
    }

    if (!existingRole) {
        console.log('Assigning admin role...');
        const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({
                user_id: user.id,
                role: 'admin',
            });

        if (insertRoleError) {
            console.error('Error assigning admin role:', insertRoleError.message);
            process.exit(1);
        }
        console.log('Admin role assigned successfully.');
    } else {
        console.log('User already has admin role.');
    }

    console.log('Done.');
}

ensureAdminUser().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
