-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "gender" "public"."Gender",
    "theme" "public"."Theme" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "moodScore" INTEGER NOT NULL,
    "emotions" TEXT[],
    "tags" TEXT[],
    "text" TEXT NOT NULL,
    "aiSummary" TEXT,
    "aiAffirmation" TEXT,
    "sentiment" DOUBLE PRECISION,
    "sleepHours" DOUBLE PRECISION,
    "steps" INTEGER,
    "stressLevel" INTEGER,
    "triggers" TEXT[],

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attachment" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filename" TEXT,
    "size" INTEGER,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Insight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromptPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cadence" TEXT NOT NULL,
    "categories" TEXT[],

    CONSTRAINT "PromptPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "JournalEntry_userId_idx" ON "public"."JournalEntry"("userId");

-- CreateIndex
CREATE INDEX "JournalEntry_date_idx" ON "public"."JournalEntry"("date");

-- CreateIndex
CREATE INDEX "Attachment_entryId_idx" ON "public"."Attachment"("entryId");

-- CreateIndex
CREATE INDEX "Reflection_userId_idx" ON "public"."Reflection"("userId");

-- CreateIndex
CREATE INDEX "Insight_userId_idx" ON "public"."Insight"("userId");

-- CreateIndex
CREATE INDEX "Insight_kind_idx" ON "public"."Insight"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "PromptPreference_userId_key" ON "public"."PromptPreference"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "public"."Notification"("read");

-- AddForeignKey
ALTER TABLE "public"."JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reflection" ADD CONSTRAINT "Reflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Insight" ADD CONSTRAINT "Insight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromptPreference" ADD CONSTRAINT "PromptPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
