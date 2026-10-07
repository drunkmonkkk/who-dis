CREATE TABLE IF NOT EXISTS rooms (
  code text PRIMARY KEY,
  state jsonb NOT NULL,
  version integer NOT NULL DEFAULT 0,
  updated bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS rooms_updated_idx ON rooms(updated DESC);
CREATE INDEX IF NOT EXISTS rooms_phase_idx ON rooms ((state->>'phase'));
