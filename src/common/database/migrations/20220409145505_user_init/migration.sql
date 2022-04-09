-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "about" TEXT,
    "password" TEXT NOT NULL,
    "avatarId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "mimetype" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "user_id" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
