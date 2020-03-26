CREATE DATABASE mood;

USE mood;

CREATE TABLE mood (
	id serial,
  session text NOT NULL,
  day date  NOT NULL,
  rate integer  NOT NULL,
  team text,
  information text,
  CONSTRAINT session_day_team UNIQUE (session, day, team)
);

CREATE TABLE team (
	id serial,
  nom text NOT NULL,
  publicid text NOT NULL
);

CREATE TABLE login (
	id serial,
  email text CONSTRAINT email_unique UNIQUE,
  name text,
  social_id text,
  social_token text
);