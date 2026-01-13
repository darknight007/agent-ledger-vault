# Vercel Environment Variables Setup - Step by Step

## The Problem

Your site shows: **"Uncaught Error: supabaseUrl is required."**

This happens because **Vercel doesn't automatically load your `.env` file**. Unlike local development (where `npm run dev` reads `.env`), the **deployed version needs variables added through the Vercel Dashboard**.

---

## The Solution (5 Minutes)

### STEP 1: Go to Vercel Dashboard

1. Open: **https://vercel.com/dashboard**
2. You should see your projects listed
3. Find: **"AskScroogeAI"**
4. Click on it

**Result**: You're now in your project page

---

### STEP 2: Open Project Settings

1. In the top right, click: **Settings**
2. You'll see a menu on the left

**Result**: You're in the Settings page

---

### STEP 3: Find Environment Variables

1. On the left menu, scroll down
2. Click: **Environment Variables**
3. You'll see a section with a text box and "Add new" button

**Result**: You're in the Environment Variables section

---

### STEP 4: Add First Variable - VITE_SUPABASE_URL

**Do this 3 times** (one for each variable below):

#### Variable 1 of 3:
1. In the "Name" field, type:
   ```
   VITE_SUPABASE_URL
   ```

2. In the "Value" field, type:
   ```
   https://lwjlhiiuxyjoxdwapezi.supabase.co
   ```

3. Make sure "Production" is selected in the dropdown

4. Click: **Add**

5. You should see it appear in the list below

**Result**: First variable added ✅

---

#### Variable 2 of 3:
1. Click **Add new** again (or the form reappears)

2. In the "Name" field, type:
   ```
   VITE_SUPABASE_PROJECT_ID
   ```

3. In the "Value" field, type:
   ```
   lwjlhiiuxyjoxdwapezi
   ```

4. Make sure "Production" is selected

5. Click: **Add**

**Result**: Second variable added ✅

---

#### Variable 3 of 3:
1. Click **Add new** again

2. In the "Name" field, type:
   ```
   VITE_SUPABASE_PUBLISHABLE_KEY
   ```

3. In the "Value" field, paste (this is a long token):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlb2Z4enp4ZnhrcnVyd2ltZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDkyMzIsImV4cCI6MjA4MzI4NTIzMn0.UnEvgYQq_Aksml-0uT8RG1l0lYbt-l-5dcK93P_E7m0
   ```

4. Make sure "Production" is selected

5. Click: **Add**

**Result**: All three variables added ✅

---

### STEP 5: Verify All Variables Are Listed

Look at the list below. You should see:
```
✓ VITE_SUPABASE_URL
✓ VITE_SUPABASE_PROJECT_ID
✓ VITE_SUPABASE_PUBLISHABLE_KEY
```

All three should show with a checkmark and "Production" label.

**Result**: Setup complete ✅

---

### STEP 6: Redeploy Your Project

1. Click on **Deployments** tab (at the top)
2. Find your most recent deployment (the top one)
3. Click the **three dots (...)** menu on the right
4. Select: **Redeploy**
5. Confirm if asked

**Result**: Project is being redeployed with the new variables

---

### STEP 7: Wait for Deploy to Finish

The deployment should take 2-5 minutes. You'll see:
- First: "Analyzing" (spinning)
- Then: "Building" (spinning)
- Finally: "Ready" with a green checkmark

**Result**: Deployment complete ✅

---

### STEP 8: Test Your Site

1. Click the **Domains** section (or just visit your URL)
2. Click your domain: **askscrooge.com** (or the Vercel URL)
3. Wait for page to load
4. Open DevTools: **F12** or **Cmd+Option+I**
5. Go to **Console** tab
6. Look for red errors

**Expected Result**: 
- ✅ No red error about "supabaseUrl is required"
- ✅ Page loads normally
- ✅ You can navigate around

---

## If It Still Doesn't Work

### Option A: Hard Refresh Browser
1. Press: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
2. Wait for page to reload
3. Check console again

### Option B: Clear Browser Cache
1. Open DevTools: **F12**
2. Right-click the reload button
3. Click: **Empty cache and hard refresh**
4. Wait for page to reload

### Option C: Wait a Bit
Vercel sometimes caches old versions. Wait 5-10 minutes and try again.

### Option D: Check Variables in Vercel
1. Go back to Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Verify all 3 variables are listed
4. Verify the values are correct (no truncation)
5. If missing any, add them again

---

## Important Notes

⚠️ **DO NOT**:
- Share these keys publicly (even though they're marked "public")
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (it's server-only)
- Use environment variable names without `VITE_` prefix

✅ **DO**:
- Copy values exactly from your `.env` file
- Include the entire JWT token (it's very long)
- Make sure "Production" is selected
- Redeploy after adding variables

---

## Summary Checklist

- [ ] Went to vercel.com/dashboard
- [ ] Clicked on AskScroogeAI project
- [ ] Clicked Settings → Environment Variables
- [ ] Added VITE_SUPABASE_URL
- [ ] Added VITE_SUPABASE_PROJECT_ID
- [ ] Added VITE_SUPABASE_PUBLISHABLE_KEY
- [ ] All three show in the list with "Production"
- [ ] Clicked Deployments → Redeploy
- [ ] Waited for "Ready" status (green checkmark)
- [ ] Visited the site and checked console
- [ ] No more "supabaseUrl is required" error ✅

---

## Success!

If you followed all steps and see no errors, **you're done!** 🎉

Your site should now load correctly on Vercel with all Supabase functionality working.

---

## Questions?

See companion files:
- **VERCEL_SETUP_GUIDE.md** - Detailed explanations
- **VERCEL_QUICK_FIX.md** - Troubleshooting guide
- **.env.example** - What variables look like
