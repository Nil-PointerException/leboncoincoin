-- Add role column to users table
ALTER TABLE users ADD COLUMN role VARCHAR(20);

-- Set default value for existing users
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Set default for future inserts
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'USER';

-- Set dev user as admin (if exists)
UPDATE users SET role = 'ADMIN' WHERE id = 'dev-user-123';

-- Create index for role queries
CREATE INDEX idx_users_role ON users(role);


