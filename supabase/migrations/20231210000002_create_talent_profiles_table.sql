-- Create talent_profiles table (for Talent users only)
CREATE TABLE IF NOT EXISTS talent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT, -- NULL until ID verification
  last_name TEXT, -- NULL until ID verification
  age INTEGER,
  city TEXT,
  height TEXT,
  hair_color TEXT,
  eye_color TEXT,
  gender TEXT,
  hourly_rate DECIMAL(10, 2),
  profile_photo_url TEXT,
  bio TEXT,
  availability JSONB DEFAULT '[]'::jsonb, -- Store calendar/availability data
  preferences JSONB DEFAULT '{}'::jsonb, -- Job types, radius, notice period, etc.
  instagram_handle TEXT,
  instagram_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_talent_profiles_user_id ON talent_profiles(user_id);
CREATE INDEX idx_talent_profiles_city ON talent_profiles(city);
CREATE INDEX idx_talent_profiles_hourly_rate ON talent_profiles(hourly_rate);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_talent_profiles_updated_at
  BEFORE UPDATE ON talent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
