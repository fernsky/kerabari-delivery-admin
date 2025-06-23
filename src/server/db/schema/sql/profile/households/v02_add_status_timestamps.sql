-- Add updated_at column to acme_khajura_household table
ALTER TABLE acme_khajura_household 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add status column to acme_khajura_household table
ALTER TABLE acme_khajura_household 
ADD COLUMN status TEXT DEFAULT 'pending';

-- Create an index for faster searches by status
CREATE INDEX idx_acme_khajura_household_status ON acme_khajura_household(status);

-- Create an index for faster searches by updated_at
CREATE INDEX idx_acme_khajura_household_updated_at ON acme_khajura_household(updated_at);

-- Add a constraint to ensure status only contains allowed values
ALTER TABLE acme_khajura_household
ADD CONSTRAINT acme_khajura_household_status_check
CHECK (status IN ('pending', 'approved', 'rejected', 'requested_for_edit'));

-- Add a trigger to automatically update the updated_at timestamp when a record is modified
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_acme_khajura_household_timestamp
BEFORE UPDATE ON acme_khajura_household
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
