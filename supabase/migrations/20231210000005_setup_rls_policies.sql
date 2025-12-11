-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES TABLE POLICIES
-- ========================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========================================
-- TALENT PROFILES TABLE POLICIES
-- ========================================

-- Anyone can view talent profiles (for public search/discovery)
CREATE POLICY "Public can view talent profiles"
  ON talent_profiles FOR SELECT
  USING (true);

-- Users can create their own talent profile
CREATE POLICY "Users can create own talent profile"
  ON talent_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own talent profile
CREATE POLICY "Users can update own talent profile"
  ON talent_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own talent profile
CREATE POLICY "Users can delete own talent profile"
  ON talent_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- BUSINESS PROFILES TABLE POLICIES
-- ========================================

-- Anyone can view business profiles (for public discovery)
CREATE POLICY "Public can view business profiles"
  ON business_profiles FOR SELECT
  USING (true);

-- Users can create their own business profile
CREATE POLICY "Users can create own business profile"
  ON business_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own business profile
CREATE POLICY "Users can update own business profile"
  ON business_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own business profile
CREATE POLICY "Users can delete own business profile"
  ON business_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- WAITLIST TABLE POLICIES
-- ========================================

-- Allow anyone to insert into waitlist (public signup)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can view waitlist (you can adjust this later)
-- For now, allow service_role access only
CREATE POLICY "Service role can view waitlist"
  ON waitlist FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');
