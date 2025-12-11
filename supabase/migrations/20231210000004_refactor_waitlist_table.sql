-- Refactor waitlist table to standardized format
-- This handles both creating new table and migrating existing data

-- Drop existing waitlist table if it exists (will recreate with proper structure)
DROP TABLE IF EXISTS waitlist CASCADE;

-- Create waitlist table with standardized columns
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Add comment to table
COMMENT ON TABLE waitlist IS 'Pre-launch waitlist signups';
