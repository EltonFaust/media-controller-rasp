--------------------------------------------------------------------------------
-- up
--------------------------------------------------------------------------------

CREATE TABLE setting (
    id      INTEGER PRIMARY KEY,
    type    INTEGER NOT NULL,
    value   TEXT    NOT NULL,
    updated TEXT    NULL
);

INSERT INTO setting VALUES
(NULL, 1, 2, datetime('now')),
(NULL, 2, 3, datetime('now')),
(NULL, 3, 1, datetime('now'));

--------------------------------------------------------------------------------
-- down
--------------------------------------------------------------------------------


DROP TABLE setting;
