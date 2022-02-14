set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."quotes" (
  "quoteId" serial NOT NULL,
  "content" TEXT NOT NULL,
  CONSTRAINT "quotes_pk" PRIMARY KEY ("quoteId")
) WITH (OIDS = FALSE);
