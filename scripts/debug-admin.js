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
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const ADMIN_EMAIL = 'manoj.iit09@gmail.com';

async function debugAdminAccess() {
    console.log('\n=== Admin Access Debug ===\n');

    // 1. Check if user exists in auth
    console.log('1. Checking if user exists in Supabase Auth...');
    const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers();

    if (listUsersError) {
        console.error('❌ Error listing users:', listUsersError.message);
        process.exit(1);
    }

    const user = users.find(u => u.email === ADMIN_EMAIL);

    if (!user) {
        console.log('❌ User NOT found in auth.users');
        console.log('   Run: node scripts/ensure-admin.js');
        process.exit(1);
    }

    console.log(`✅ User found with ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

    // 2. Check if user has admin role
    console.log('\n2. Checking admin role in user_roles table...');

    // Try without RLS (using service role)
    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

    if (roleError) {
        console.error('❌ Error querying user_roles:', roleError.message);
        if (roleError.message.includes('infinite recursion')) {
            console.log('\n⚠️  INFINITE RECURSION DETECTED!');
            console.log('   You need to apply the SQL migration:');
            console.log('   File: supabase/migrations/20260202_fix_infinite_recursion.sql');
            console.log('\n   Steps:');
            console.log('   1. Go to https://app.supabase.com');
            console.log('   2. Open SQL Editor');
            console.log('   3. Copy/paste the migration file contents');
            console.log('   4. Click Run');
        }
        process.exit(1);
    }

    if (!roleData || roleData.length === 0) {
        console.log('❌ No roles found for this user');
        console.log('   Run: node scripts/ensure-admin.js');
        process.exit(1);
    }

    console.log(`✅ User has ${roleData.length} role(s):`);
    roleData.forEach(role => {
        console.log(`   - ${role.role} (ID: ${role.id})`);
    });

    const hasAdminRole = roleData.some(r => r.role === 'admin');

    if (!hasAdminRole) {
        console.log('\n❌ User does NOT have admin role');
        console.log('   Run: node scripts/ensure-admin.js');
    } else {
        console.log('\n✅ User has admin role!');
    }

    // 3. Check if is_admin function exists
    console.log('\n3. Checking if is_admin() helper function exists...');
    const { data: functionData, error: functionError } = await supabase
        .rpc('is_admin', { user_id_param: user.id });

    if (functionError) {
        console.log('❌ is_admin() function does NOT exist or has error');
        console.log('   Error:', functionError.message);
        console.log('\n⚠️  You need to apply the SQL migration!');
        console.log('   File: supabase/migrations/20260202_fix_infinite_recursion.sql');
    } else {
        console.log(`✅ is_admin() function exists and returns: ${functionData}`);
    }

    // 4. Test authentication
    console.log('\n4. Summary:');
    if (hasAdminRole && !functionError) {
        console.log('✅ Everything looks good! Try logging in again.');
        console.log('\nLogin URL:');
        console.log('http://localhost:8080/secure-admin/1f6555db75bf446a3385d4e399dd45eac6e685683b31476da12b4110f632b8ce');
        console.log('\nCredentials:');
        console.log('Email: manoj.iit09@gmail.com');
        console.log('Password: temp-admin-password-123');
    } else {
        console.log('❌ Issues found. Please follow the steps above to fix.');
    }

    console.log('\n=== Debug Complete ===\n');
}

debugAdminAccess().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
