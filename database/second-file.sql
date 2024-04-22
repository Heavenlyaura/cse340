
-- Insert tony stark into database
INSERT INTO account
VALUES (
    DEFAULT,
    'Tony',
    'Stark',
    'tony@stark.com',
    'Iam1ronm@n',
    'Admin'::account_type
  );

-- delete tony stark from database
DELETE FROM account;

-- Update Inventory
UPDATE inventory
SET 
inv_description 
= REPLACE(inv_description, 'small interiors', 'huge interior');

-- Join tables
SELECT inv_make, inv_model
FROM inventory
JOIN classification
ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

-- Update rows

UPDATE inventory
SET 
inv_image = REPLACE(inv_image, 'images','images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail,'images/vehicles');








