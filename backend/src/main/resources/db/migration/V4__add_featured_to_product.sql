ALTER TABLE product ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Set some products as featured for homepage
UPDATE product SET featured = TRUE WHERE id IN (1001,1003,1005,1014,1025);

-- Ensure existing NULLs are false
UPDATE product SET featured = FALSE WHERE featured IS NULL;