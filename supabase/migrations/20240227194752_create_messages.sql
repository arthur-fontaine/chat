create table "public"."message_attachments" (
    "created_at" timestamp with time zone not null default now(),
    "attachment" text not null,
    "message" bigint not null
);


alter table "public"."message_attachments" enable row level security;

create table "public"."messages" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "user_pair" bigint not null,
    "sender" uuid not null,
    "message" text
);


alter table "public"."messages" enable row level security;

CREATE UNIQUE INDEX message_attachments_attachment_key ON public.message_attachments USING btree (attachment);

CREATE UNIQUE INDEX message_attachments_pkey ON public.message_attachments USING btree (attachment);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

alter table "public"."message_attachments" add constraint "message_attachments_pkey" PRIMARY KEY using index "message_attachments_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."message_attachments" add constraint "message_attachments_attachment_key" UNIQUE using index "message_attachments_attachment_key";

alter table "public"."message_attachments" add constraint "public_message_attachments_attachment_fkey" FOREIGN KEY (attachment) REFERENCES storage.buckets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."message_attachments" validate constraint "public_message_attachments_attachment_fkey";

alter table "public"."message_attachments" add constraint "public_message_attachments_message_fkey" FOREIGN KEY (message) REFERENCES messages(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."message_attachments" validate constraint "public_message_attachments_message_fkey";

alter table "public"."messages" add constraint "public_messages_sender_fkey" FOREIGN KEY (sender) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "public_messages_sender_fkey";

alter table "public"."messages" add constraint "public_messages_user_pair_fkey" FOREIGN KEY (user_pair) REFERENCES user_pairs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "public_messages_user_pair_fkey";

grant delete on table "public"."message_attachments" to "anon";

grant insert on table "public"."message_attachments" to "anon";

grant references on table "public"."message_attachments" to "anon";

grant select on table "public"."message_attachments" to "anon";

grant trigger on table "public"."message_attachments" to "anon";

grant truncate on table "public"."message_attachments" to "anon";

grant update on table "public"."message_attachments" to "anon";

grant delete on table "public"."message_attachments" to "authenticated";

grant insert on table "public"."message_attachments" to "authenticated";

grant references on table "public"."message_attachments" to "authenticated";

grant select on table "public"."message_attachments" to "authenticated";

grant trigger on table "public"."message_attachments" to "authenticated";

grant truncate on table "public"."message_attachments" to "authenticated";

grant update on table "public"."message_attachments" to "authenticated";

grant delete on table "public"."message_attachments" to "service_role";

grant insert on table "public"."message_attachments" to "service_role";

grant references on table "public"."message_attachments" to "service_role";

grant select on table "public"."message_attachments" to "service_role";

grant trigger on table "public"."message_attachments" to "service_role";

grant truncate on table "public"."message_attachments" to "service_role";

grant update on table "public"."message_attachments" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

