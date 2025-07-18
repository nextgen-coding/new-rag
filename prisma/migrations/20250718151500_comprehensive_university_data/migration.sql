-- CreateTable
CREATE TABLE "university_programs" (
    "id" TEXT NOT NULL,
    "program_code" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "program_link" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "university_name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "criteria" TEXT,
    "bac_type_id" TEXT NOT NULL,
    "bac_type_name" TEXT NOT NULL,
    "seven_percent" TEXT,
    "historical_scores" JSONB,
    "latest_score" DOUBLE PRECISION,
    "latest_year" TEXT,
    "average_score" DOUBLE PRECISION,
    "raw_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_programs_program_id_key" ON "university_programs"("program_id");

-- CreateIndex
CREATE INDEX "university_programs_university_name_idx" ON "university_programs"("university_name");

-- CreateIndex
CREATE INDEX "university_programs_bac_type_name_idx" ON "university_programs"("bac_type_name");

-- CreateIndex
CREATE INDEX "university_programs_specialization_idx" ON "university_programs"("specialization");

-- CreateIndex
CREATE INDEX "university_programs_latest_score_idx" ON "university_programs"("latest_score");

-- CreateIndex
CREATE INDEX "university_programs_program_code_idx" ON "university_programs"("program_code");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
