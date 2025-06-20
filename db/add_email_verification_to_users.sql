-- Migration: Add email verification fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- If you want to backfill existing users as verified (optional):
-- UPDATE users SET verified = TRUE WHERE ...;

-- To revert (down migration):
-- ALTER TABLE users DROP COLUMN IF EXISTS verified;
-- ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
-- ALTER TABLE users DROP COLUMN IF EXISTS verification_token_expires;
