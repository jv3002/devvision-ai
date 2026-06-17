-- CreateTable
CREATE TABLE "ProjectScoreHistory" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "trend" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectScoreHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectScoreHistory" ADD CONSTRAINT "ProjectScoreHistory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
