-- Ensure product.name, description, slug are text (not bytea)
-- If already text, this is a no-op
ALTER TABLE product ALTER COLUMN name TYPE text USING COALESCE(convert_from(name, 'UTF8'), name::text);
ALTER TABLE product ALTER COLUMN description TYPE text USING COALESCE(convert_from(description, 'UTF8'), description::text);
ALTER TABLE product ALTER COLUMN slug TYPE text USING COALESCE(convert_from(slug, 'UTF8'), slug::text);
