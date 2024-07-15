-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LAWYER', 'STUDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WAITLIST');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "LeadStatus" NOT NULL,
    "waitListNumber" INTEGER NOT NULL,
    "descriptionRole" TEXT NOT NULL,
    "invitesUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadInvite" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "originLeadId" TEXT NOT NULL,
    "destinyLeadId" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "inviteStatus" "InviteStatus" NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phone_key" ON "Lead"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_inviteCode_key" ON "Lead"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "LeadInvite_originLeadId_destinyLeadId_key" ON "LeadInvite"("originLeadId", "destinyLeadId");

-- AddForeignKey
ALTER TABLE "LeadInvite" ADD CONSTRAINT "LeadInvite_originLeadId_fkey" FOREIGN KEY ("originLeadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInvite" ADD CONSTRAINT "LeadInvite_destinyLeadId_fkey" FOREIGN KEY ("destinyLeadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
