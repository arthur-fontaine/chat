CREATE POLICY "UserCanSeeItsProfileAndProfilesOfItsPairs" ON "public"."profiles" FOR SELECT
    USING (
        "user" = auth.uid() OR
        "user" IN (
            SELECT "user_a" FROM "public"."user_pairs" WHERE "user_b" = auth.uid()
            UNION
            SELECT "user_b" FROM "public"."user_pairs" WHERE "user_a" = auth.uid()
        )
    );
