# Quick Start Guide: Connecting WordBuddy to Supabase

This is a step-by-step checklist to get your database connected.

## ✅ Checklist

### [ ] 1. Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in details:
   - **Name:** wordbuddy
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to your location
5. Click "Create new project"
6. ⏳ Wait 2-3 minutes for setup to complete

### [ ] 2. Get API Credentials (1 minute)

1. In Supabase dashboard, click the **Settings** gear icon
2. Click **API** in the left sidebar
3. Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
4. Copy **anon public** key (a very long string starting with `eyJ...`)

### [ ] 3. Update Environment File (1 minute)

1. Open `.env.local` in your project
2. Replace these lines:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   With your real values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Save the file
4. **Important:** Restart your dev server:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

### [ ] 4. Create Database Table (2 minutes)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase_schema.sql` (in your project folder)
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"
7. Verify: Click **Table Editor** → you should see the "words" table

### [ ] 5. Enable Authentication (3 minutes)

1. In Supabase dashboard, click **Authentication**
2. Click **Providers**
3. Find "Email" and click to expand
4. Toggle **Enable Email provider** to ON
5. Leave settings as default
6. Click **Save**

### [ ] 6. Test the Connection (2 minutes)

1. Open your app: http://localhost:8080
2. Search for a word (e.g., "happy")
3. Check browser console (F12 → Console tab)
4. Look for either:
   - ✅ "Word saved successfully: happy" (good!)
   - ⚠️ "User not authenticated - word not saved" (expected - need login)
   - ❌ Any red errors about Supabase (connection issue)

### [ ] 7. Create Login/Signup Pages (Optional but Recommended)

**You still need to build these pages**. For now, you can test with a quick workaround:

#### Quick Test Without Login Pages:

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `test@test.com`
   - Password: `test123456`
4. Click **Create user**
5. Then in your browser console, manually log in:
   ```javascript
   // Paste this in browser console (F12)
   const { data, error } = await supabase.auth.signInWithPassword({
     email: "test@test.com",
     password: "test123456",
   });
   console.log("Login result:", data, error);
   ```
6. Refresh the page
7. Now try searching and saving a word!

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Console shows "Word saved successfully"
2. ✅ No Supabase red errors in console
3. ✅ Toast notification shows "Word Saved!"
4. ✅ Word appears in Vocabulary page
5. ✅ Can take quizzes
6. ✅ Progress page shows statistics

---

## 🐛 Troubleshooting

### Error: "Invalid API key"

- Double-check your `.env.local` values
- Make sure you copied the **anon** key, not the service_role key
- Restart dev server after changing `.env.local`

### Error: "relation 'words' does not exist"

- The SQL schema wasn't run successfully
- Go back to Step 4 and run the SQL again

### Words not saving but no errors

- User is not authenticated
- Complete Step 7 to test with a user
- Or build login/signup pages

### Can't see saved words in Vocabulary page

- Check if RLS policies were created (in the SQL)
- Make sure you're logged in as the same user who saved the words

---

## 📞 Need More Help?

Check the full documentation in `project_overview.md` for:

- Complete database schema
- Technical architecture
- Feature documentation
- What's working vs. what's not
