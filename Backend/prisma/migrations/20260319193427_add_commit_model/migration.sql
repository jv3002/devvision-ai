-- AlterTable
ALTER TABLE "AnalysisRun" ADD COLUMN     "result" JSONB;

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "author" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
