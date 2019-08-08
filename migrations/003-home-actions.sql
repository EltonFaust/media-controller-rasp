--------------------------------------------------------------------------------
-- up
--------------------------------------------------------------------------------

CREATE TABLE home_action (
    id       INTEGER PRIMARY KEY,
    type     INTEGER NOT NULL,
    data     TEXT    NULL,
    sequence INTEGER NOT NULL,
    updated  TEXT    NULL
);

INSERT INTO home_action VALUES
(NULL, 1, NULL, 0, datetime('now')),
(NULL, 2, NULL, 1, datetime('now')),
(NULL, 3, NULL, 1, datetime('now'));

--------------------------------------------------------------------------------
-- down
--------------------------------------------------------------------------------


DROP TABLE home_action;
