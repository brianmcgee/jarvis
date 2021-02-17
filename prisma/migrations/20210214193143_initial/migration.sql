-- CreateTable
CREATE TABLE "Workspace" (
    "gid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isOrganization" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Team" (
    "gid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "descriptionHtml" TEXT,
    "createdAt" DATETIME,
    "workspaceId" TEXT NOT NULL,
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "gid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "photo" TEXT
);

-- CreateTable
CREATE TABLE "Tag" (
    "gid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "gid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "color" TEXT,
    "teamId" TEXT,
    "createdAt" DATETIME,
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("gid") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("teamId") REFERENCES "Team" ("gid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "gid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "notesHtml" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "numLikes" INTEGER NOT NULL,
    "numSubtasks" INTEGER NOT NULL,
    "parentId" TEXT,
    "permalinkUrl" TEXT NOT NULL,
    "assigneeId" TEXT,
    "workspaceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "modifiedAt" DATETIME NOT NULL,
    "startOn" DATETIME,
    "dueAt" DATETIME,
    "completed" BOOLEAN NOT NULL,
    "completedAt" DATETIME,
    FOREIGN KEY ("parentId") REFERENCES "Task" ("gid") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("assigneeId") REFERENCES "User" ("gid") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Team" ("gid") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "User" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TaskFollowers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Task" ("gid") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "User" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TagFollowers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Tag" ("gid") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "User" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProjectToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Project" ("gid") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Task" ("gid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Task.createdAt_index" ON "Task"("createdAt");

-- CreateIndex
CREATE INDEX "Task.modifiedAt_index" ON "Task"("modifiedAt");

-- CreateIndex
CREATE INDEX "Task.startOn_index" ON "Task"("startOn");

-- CreateIndex
CREATE INDEX "Task.dueAt_index" ON "Task"("dueAt");

-- CreateIndex
CREATE INDEX "Task.completedAt_index" ON "Task"("completedAt");

-- CreateIndex
CREATE INDEX "Task.completed_index" ON "Task"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TaskFollowers_AB_unique" ON "_TaskFollowers"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskFollowers_B_index" ON "_TaskFollowers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagFollowers_AB_unique" ON "_TagFollowers"("A", "B");

-- CreateIndex
CREATE INDEX "_TagFollowers_B_index" ON "_TagFollowers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTask_AB_unique" ON "_ProjectToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTask_B_index" ON "_ProjectToTask"("B");
