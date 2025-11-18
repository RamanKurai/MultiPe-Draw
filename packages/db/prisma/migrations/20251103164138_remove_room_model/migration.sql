/*
  Warnings:

  - You are about to drop the column `message` on the `Shape` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shape" DROP CONSTRAINT "Shape_roomId_fkey";

-- AlterTable
ALTER TABLE "public"."Shape" DROP COLUMN "message",
ADD COLUMN     "data" JSONB NOT NULL,
ALTER COLUMN "roomId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Room";
