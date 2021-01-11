USE AltTextApp;

SELECT * FROM shops;

ALTER TABLE shops ADD COLUMN `shop_name` VARCHAR(255) AFTER `id`;