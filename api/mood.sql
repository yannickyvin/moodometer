CREATE TABLE mood (
	id serial,
  session text NOT NULL,
  day date  NOT NULL,
  rate integer  NOT NULL,
  CONSTRAINT session_day UNIQUE (session, day)
);