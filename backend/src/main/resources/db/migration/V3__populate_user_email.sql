ALTER TABLE orders ALTER COLUMN user_email SET DEFAULT '';
UPDATE orders SET user_email = u.email FROM users u WHERE orders.user_id = u.id AND orders.user_email IS NULL;
UPDATE orders SET user_email = '' WHERE user_email IS NULL;