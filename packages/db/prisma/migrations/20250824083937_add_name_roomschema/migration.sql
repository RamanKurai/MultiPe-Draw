/*
  Warnings:

  - Added the required column `roomname` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "roomname" TEXT NOT NULL;
