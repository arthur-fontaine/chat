CREATE POLICY "ParticipantsCanReadTheirMessages" ON "messages"
  FOR SELECT
  USING (
    (sender = auth.uid()) OR
    (sender IN (SELECT user_a FROM user_pairs WHERE user_b = auth.uid())) OR
    (sender IN (SELECT user_b FROM user_pairs WHERE user_a = auth.uid()))
  );

CREATE POLICY "SenderCanCreateItsOwnMessages" ON "messages"
  FOR INSERT
  WITH CHECK (sender = auth.uid());

CREATE POLICY "SenderCanUpdateItsOwnMessages" ON "messages"
  FOR UPDATE
  USING (sender = auth.uid());

CREATE POLICY "SenderCanDeleteItsOwnMessages" ON "messages"
  FOR DELETE
  USING (sender = auth.uid());
