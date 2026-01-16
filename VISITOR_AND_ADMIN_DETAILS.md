# Waitlist: Visitor Details & Admin Details Summary

## 📋 VISITOR DETAILS CAPTURED

### What Visitors Submit

When a visitor clicks "Join the Waitlist" on any pricing page and fills out the form:

```
┌─────────────────────────────────────────┐
│  JOIN THE WAITLIST                      │
├─────────────────────────────────────────┤
│                                         │
│  Name *                                 │
│  ┌─────────────────────────────────────┐│
│  │ John Doe                            ││
│  └─────────────────────────────────────┘│
│                                         │
│  Email *                                │
│  ┌─────────────────────────────────────┐│
│  │ john@example.com                    ││
│  └─────────────────────────────────────┘│
│                                         │
│  Phone (Optional)                       │
│  ┌─────────────────────────────────────┐│
│  │ +1 (555) 123-4567                  ││
│  └─────────────────────────────────────┘│
│                                         │
│  [Join Waitlist]                        │
│                                         │
└─────────────────────────────────────────┘
```

### Data Captured by Field

| Field | Type | Required? | Captured | Example |
|-------|------|-----------|----------|---------|
| **Name** | Text | YES | ✅ | John Doe |
| **Email** | Email | YES | ✅ | john@example.com |
| **Phone** | Text | NO | ✅ | +1-555-1234 |

### Auto-Generated Fields

| Field | Type | How Generated | Example |
|-------|------|---------------|---------|
| **ID** | UUID | Database | 550e8400-e29b-41d4-a716-446655440000 |
| **Joined** | Timestamp | Database (now()) | 2026-01-16T14:30:45Z |

---

## 📊 DATABASE STORAGE

### Visitor Data in `waitlist` Table

```sql
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Sample Data

```
id                                   | name         | email                | phone           | created_at
─────────────────────────────────────┼──────────────┼──────────────────────┼─────────────────┼──────────────────────
550e8400-e29b-41d4-a716-446655440000 | John Doe     | john@example.com     | +1-555-1234     | 2026-01-16 14:30:45
550e8400-e29b-41d4-a716-446655440001 | Jane Smith   | jane@example.com     | NULL            | 2026-01-16 10:15:30
550e8400-e29b-41d4-a716-446655440002 | Bob Wilson   | bob@example.com      | +1-555-5678     | 2026-01-15 16:45:22
550e8400-e29b-41d4-a716-446655440003 | Alice Brown  | alice@example.com    | +1-555-9999     | 2026-01-15 09:20:15
550e8400-e29b-41d4-a716-446655440004 | Charlie Lee  | charlie@example.com  | NULL            | 2026-01-14 13:55:00
```

---

## 🔐 ADMIN DETAILS & ACCESS

### Who Can Access Visitor Data?

**Requirements for Admin Access:**
1. ✅ Must have email account (Supabase auth)
2. ✅ Must be logged in
3. ✅ Must have `admin` role in `user_roles` table

### Admin Access Verification Flow

```
User clicks /admin
  ↓
Supabase checks: Is user logged in?
  → NO → Redirect to /auth
  → YES → Continue
  ↓
Supabase checks: Does user have admin role?
  → NO → Show error, sign out
  → YES → Continue
  ↓
Load waitlist data
  ↓
Display in admin dashboard
```

### Admin Role Check Query

```sql
-- Check if user has admin role
SELECT role FROM public.user_roles 
WHERE user_id = 'user-uuid'
  AND role = 'admin'
LIMIT 1;
```

### Current Admins in System

**Access controlled by:** `user_roles` table

```sql
SELECT u.email, ur.role, ur.created_at
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

**Example output:**
```
email                      | role  | created_at
───────────────────────────┼───────┼──────────────────
admin@askscrooge.ai        | admin | 2026-01-16 08:00
boss@askscrooge.ai         | admin | 2026-01-10 14:22
```

---

## 👁️ WHAT ADMINS SEE

### Admin Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│ AskScrooge Admin                              [Sign Out] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Waitlist Entries                                        │
│ View all users who have joined the waitlist             │
│                                                          │
│ ┌──────────────┬─────────────────┬─────────┬─────────┐ │
│ │ Name         │ Email           │ Phone   │ Joined  │ │
│ ├──────────────┼─────────────────┼─────────┼─────────┤ │
│ │ John Doe     │ john@example... │ +1-555- │ Jan 16, │ │
│ │ Jane Smith   │ jane@example... │ —       │ Jan 15, │ │
│ │ Bob Wilson   │ bob@example...  │ +1-555- │ Jan 14, │ │
│ │ Alice Brown  │ alice@example.. │ +1-555- │ Jan 14, │ │
│ │ Charlie Lee  │ charlie@examp.. │ —       │ Jan 13, │ │
│ └──────────────┴─────────────────┴─────────┴─────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Admin Actions Available

| Action | Current | Possible Future |
|--------|---------|-----------------|
| **View all entries** | ✅ | - |
| **See full details** | ✅ | ✅ |
| **Sort by date** | ✅ | ✅ |
| **Search/filter** | ❌ | 📋 Possible |
| **Export to CSV** | ❌ | 📋 Possible |
| **Send emails** | ❌ | 📋 Possible |
| **Delete entries** | ❌ | 📋 Possible |
| **Analytics/stats** | ❌ | 📋 Possible |

---

## 🎯 DATA USAGE SCENARIOS

### Scenario 1: Visitor Signs Up
```
Sarah Chen enters data:
  Name: "Sarah Chen"
  Email: "sarah@acme.com"
  Phone: "+1-415-555-1234"

System action:
  → Validates all fields ✓
  → Checks email format ✓
  → Inserts into database ✓
  → Auto-generates ID: 550e8400-...
  → Auto-generates timestamp: 2026-01-16 15:45:30
  → Shows success message ✓

Result in database:
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    phone: '+1-415-555-1234',
    created_at: '2026-01-16T15:45:30Z'
  }
```

### Scenario 2: Admin Reviews Signups
```
Admin logs into /admin:
  → Session verified ✓
  → Admin role checked ✓
  → Waitlist loaded ✓

Admin sees:
  - Sarah Chen | sarah@acme.com | +1-415-555-1234 | Jan 16, 3:45PM
  - (+ other signups)

Admin can:
  - Review contact info
  - Identify trends (time of signups, phone vs no phone)
  - Plan outreach strategy
  - Export for email campaigns (future)
```

---

## 🔍 DATA VISIBILITY RULES

### Who Sees What?

```
┌──────────────┬─────────────┬─────────────┬──────────────┐
│ User Type    │ Can Submit? │ Can View?   │ Restrictions │
├──────────────┼─────────────┼─────────────┼──────────────┤
│ Visitor      │ ✅ YES      │ ❌ NO       │ Can submit   │
│ (Public)     │             │             │ own data     │
├──────────────┼─────────────┼─────────────┼──────────────┤
│ Logged-in    │ ✅ YES      │ ❌ NO       │ If no admin  │
│ (Non-admin)  │             │             │ role         │
├──────────────┼─────────────┼─────────────┼──────────────┤
│ Admin        │ ✅ YES      │ ✅ YES      │ Full access  │
│ (Authorized) │             │ (all data)  │              │
└──────────────┴─────────────┴─────────────┴──────────────┘
```

---

## 📈 METRICS ADMIN CAN DERIVE

### From Captured Data

**Simple Metrics:**
- Total signups (COUNT)
- Latest signup (MAX created_at)
- Oldest signup (MIN created_at)
- Signups per day (DATE_TRUNC + GROUP BY)

**Phone Coverage:**
- % with phone: (COUNT where phone != NULL) / COUNT
- % without phone: (COUNT where phone = NULL) / COUNT

**Growth Rate:**
- Signups last 7 days: WHERE created_at > now() - interval '7 days'
- Signups last 30 days: WHERE created_at > now() - interval '30 days'

**Example Query:**
```sql
SELECT 
  COUNT(*) as total_signups,
  COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone,
  COUNT(CASE WHEN phone IS NULL THEN 1 END) as without_phone,
  ROUND(100.0 * COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) / COUNT(*), 1) as phone_percentage,
  DATE_TRUNC('day', created_at)::DATE as signup_date,
  COUNT(*) as daily_count
FROM public.waitlist
WHERE created_at > now() - interval '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;
```

---

## ✅ SECURITY & COMPLIANCE

### Data Protection

| Aspect | Protection | Details |
|--------|-----------|---------|
| **Visitor privacy** | RLS Policy | Non-admins can't see others' data |
| **Admin access** | Role check | Must have admin role in DB |
| **Transmission** | HTTPS | All data encrypted in transit |
| **Storage** | PostgreSQL | Encrypted at rest (Supabase) |
| **Validation** | Zod Schema | Bad data rejected before storage |

### Data Rights

**Visitor can:**
- Submit information ✅
- Opt-out (not yet implemented)
- Request deletion (GDPR - future feature)

**Admin can:**
- View all submitted data ✅
- Export for campaigns (future)
- Delete entries (future)
- Cannot modify visitor data (by design)

---

## 📞 CONTACT INFORMATION COLLECTED

### Purpose of Each Field

**Name:**
- ✅ Personalization for emails
- ✅ Build relationships
- ✅ Identify duplicate signups

**Email:**
- ✅ Primary contact method
- ✅ Send product updates
- ✅ Verify uniqueness
- ✅ Re-engagement campaigns

**Phone (Optional):**
- ✅ Secondary contact method
- ✅ Direct outreach capability
- ✅ SMS notifications (future)
- ✅ Sales follow-up

---

## 🎯 SUMMARY

### Visitor Side ✅
- Visitors provide: Name, Email, Phone (optional)
- System adds: ID (UUID), Timestamp
- Data stored securely in database
- Visitors see: Success confirmation

### Admin Side ✅
- Admins must be authenticated + have admin role
- Admins see: Complete table of all signups
- Data sorted: Newest first
- Columns visible: Name, Email, Phone, Join Date/Time
- Can view anytime, anywhere (with credentials)

### Security ✅
- RLS prevents unauthorized access
- Role-based access control
- Validation prevents bad data
- Timestamps auto-generated (tamper-proof)
- Email indexed for fast queries

---

## 🚀 NEXT STEPS (Optional Enhancements)

1. **Email Confirmation** - Send confirm link to visitor
2. **Double Opt-in** - Verify email before adding to list
3. **Segmentation** - Tag signups by which page they came from
4. **Export Function** - Admin can download CSV
5. **Bulk Email** - Send campaigns to waitlist
6. **Analytics Dashboard** - Visual charts of signup trends
7. **GDPR Compliance** - Delete/unsubscribe functionality
8. **SMS Support** - Send SMS to those with phone numbers

---

**Status:** ✅ VERIFIED & PRODUCTION READY  
**Last Updated:** January 16, 2026  
**Visitors Protected:** ✅ Via RLS  
**Admins Authorized:** ✅ Via Role Check  
