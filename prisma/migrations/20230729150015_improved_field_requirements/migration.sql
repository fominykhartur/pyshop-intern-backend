-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "telNumber" TEXT,
    "address" TEXT,
    "info" TEXT
);
INSERT INTO "new_User" ("address", "email", "id", "info", "login", "name", "password", "telNumber") SELECT "address", "email", "id", "info", "login", "name", "password", "telNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
