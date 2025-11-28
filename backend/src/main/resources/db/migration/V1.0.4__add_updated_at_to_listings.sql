-- Add updated_at column to listings table
ALTER TABLE listings ADD COLUMN updated_at TIMESTAMP;

-- Set initial value for existing records (same as created_at)
UPDATE listings SET updated_at = created_at WHERE updated_at IS NULL;

-- Make the column NOT NULL after setting initial values
ALTER TABLE listings ALTER COLUMN updated_at SET NOT NULL;

-- Add index for sorting by updated_at
CREATE INDEX idx_listings_updated_at ON listings(updated_at DESC);


