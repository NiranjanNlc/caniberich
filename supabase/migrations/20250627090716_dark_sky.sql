/*
  # Add onboarding data field to profiles

  1. Changes
    - Add `onboarding_data` JSONB column to profiles table to store comprehensive onboarding information
    - This will store additional data like secondary goals, timeline, experience level, etc.

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

-- Add onboarding_data column to store comprehensive onboarding information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_data'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_data JSONB DEFAULT NULL;
  END IF;
END $$;