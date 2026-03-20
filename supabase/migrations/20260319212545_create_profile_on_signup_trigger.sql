/*
  # Auto-create profile on user signup

  1. New Functions
    - `handle_new_user()` - Trigger function that creates a profile row when a new user signs up
      - Uses the user's ID as the profile ID
      - Extracts username from user metadata (if provided during signup)
      - Sets sensible defaults for all profile fields

  2. New Triggers
    - `on_auth_user_created` - Fires after a new user is inserted into auth.users
      - Calls `handle_new_user()` to create the corresponding profile

  3. Important Notes
    - The profile ID matches the auth.users ID, enabling RLS policies based on auth.uid()
    - If no username is provided in metadata, generates one from the email prefix
    - All existing RLS policies continue to work since they check auth.uid() = id
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  raw_username text;
BEGIN
  raw_username := COALESCE(
    new.raw_user_meta_data ->> 'username',
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    raw_username,
    COALESCE(
      CONCAT_WS(' ',
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name'
      ),
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
