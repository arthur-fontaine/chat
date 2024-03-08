alter table "public"."messages" alter column "sender" set default auth.uid();


