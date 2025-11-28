-- Add deletion feedback tracking to listings table
ALTER TABLE listings
    ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN deletion_reason VARCHAR(50),
    ADD COLUMN was_sold BOOLEAN;

-- Create index for analytics queries
CREATE INDEX idx_listings_deleted_at ON listings (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_listings_was_sold ON listings (was_sold) WHERE was_sold IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN listings.deleted_at IS 'Timestamp when the listing was soft-deleted';
COMMENT ON COLUMN listings.deletion_reason IS 'Reason for deletion: SOLD, NO_LONGER_AVAILABLE, OTHER';
COMMENT ON COLUMN listings.was_sold IS 'Whether the item was successfully sold (true/false/null if not answered)';



