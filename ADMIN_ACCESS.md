# Admin Dashboard Access Guide

## Overview

The AskScrooge admin dashboard has been secured with an obscured URL and token-based access system. This prevents unauthorized discovery and access attempts while maintaining ease of use for authorized administrators.

## Security Model

The admin dashboard uses a two-layer security approach:

1. **URL Token Authentication**: Access to the login page requires a secret token in the URL
2. **Supabase Authentication**: Standard email/password authentication via Supabase
3. **Role-Based Access Control**: Users must have an "admin" role in the `user_roles` table

## Setup Instructions

### 1. Configure Your Access Token

Add the following to your `.env` file (create a strong, random token):

```bash
VITE_ADMIN_ACCESS_TOKEN=your_secure_random_token_here
```

**Important**: 
- Use a long, random string (e.g., generate with: `openssl rand -hex 32`)
- Keep this token secret and secure
- Do not commit the actual token to version control

### 2. Update Your Local Environment

After adding the token to your `.env` file:

```bash
# Restart your development server to load the new environment variable
npm run dev
```

### 3. Access the Admin Dashboard

Navigate to the secure admin URL:

```
https://yourdomain.com/secure-admin/YOUR_TOKEN_HERE
```

For local development:

```
http://localhost:5173/secure-admin/YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the actual token from your `.env` file.

## Usage

### First Time Access

1. Navigate to the secure admin URL with your token
2. You'll see the AskScrooge Admin login page
3. Sign in with your Supabase credentials
4. You'll be redirected to the admin dashboard showing waitlist entries

### Subsequent Access

If you're already logged in (have an active session):
- Navigating to the secure URL will automatically redirect you to the dashboard
- Your session persists until you sign out

### Signing Out

Click the "Sign Out" button in the admin dashboard navbar to end your session.

## Troubleshooting

### "Access Denied" Error

**Cause**: The token in the URL doesn't match the configured token in your environment

**Solution**:
1. Verify your `.env` file contains `VITE_ADMIN_ACCESS_TOKEN`
2. Ensure you're using the correct token in the URL
3. Restart your development server after updating `.env`

### "Failed to Sign In" Error

**Cause**: Invalid credentials or missing admin role

**Solution**:
1. Verify your email and password are correct
2. Check that your user has an "admin" role in the `user_roles` table in Supabase
3. Run the `scripts/ensure-admin.js` script to add an admin user if needed

### Public Routes No Longer Work

The following routes have been removed for security:
- `/auth` - No longer accessible (removed from public routing)
- Admin link in footer - Removed from the main website

This is intentional to prevent unauthorized access discovery.

## Production Deployment

### Environment Variables

Ensure your production environment (Vercel, Netlify, etc.) has the `VITE_ADMIN_ACCESS_TOKEN` configured:

**Vercel:**
```bash
vercel env add VITE_ADMIN_ACCESS_TOKEN
```

**Netlify:**
Add via Netlify dashboard → Site settings → Environment variables

### Sharing Access

To grant admin access to others:

1. **Share the secure URL** (including token) via a secure channel (not email or public chat)
2. **Create their Supabase account** or have them create one
3. **Grant admin role** by adding an entry to the `user_roles` table:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('their-user-uuid', 'admin');
   ```

### Rotating the Access Token

If you suspect the token has been compromised:

1. Generate a new random token
2. Update `VITE_ADMIN_ACCESS_TOKEN` in your environment (local and production)
3. Redeploy your application
4. Share the new URL with authorized administrators

## Security Best Practices

1. **Keep the token secret** - Treat it like a password
2. **Use a strong token** - Minimum 32 characters, randomly generated
3. **Limit sharing** - Only share the URL via secure channels
4. **Rotate periodically** - Change the token every few months
5. **Monitor access** - Check Supabase auth logs for suspicious activity
6. **Use strong passwords** - Ensure all admin users have strong, unique passwords

## Database Schema Reference

### user_roles Table

The `user_roles` table controls admin access:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| role | text | User role ("admin" or "user") |
| created_at | timestamp | When role was assigned |

Only users with `role = 'admin'` can access the admin dashboard.
