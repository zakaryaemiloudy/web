-- Fix medecin_prescripteur column to allow NULL values
-- Run this script manually against your database

ALTER TABLE demandes_sang MODIFY COLUMN medecin_prescripteur VARCHAR(255) NULL;
