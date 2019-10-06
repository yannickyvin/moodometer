CREATE TABLE mood (
	id serial,
  session text NOT NULL,
  day date  NOT NULL,
  rate integer  NOT NULL,
  team text,
  CONSTRAINT session_day_team UNIQUE (session, day, team)
);

CREATE TABLE team (
	id serial,
  nom text NOT NULL,
);