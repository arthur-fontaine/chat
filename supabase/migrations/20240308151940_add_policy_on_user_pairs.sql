CREATE POLICY "OwnerCanReadItsUserPairs" ON "user_pairs"
  FOR SELECT
  USING (user_a = auth.uid() or user_b = auth.uid());

CREATE POLICY "NoOneCanInsertUserPairs" ON "user_pairs"
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "NoOneCanUpdateUserPairs" ON "user_pairs"
  FOR UPDATE
  USING (false);

CREATE POLICY "OwnerCanDeleteItsUserPair" ON "user_pairs"
  FOR DELETE
  USING (user_a = auth.uid() or user_b = auth.uid());
