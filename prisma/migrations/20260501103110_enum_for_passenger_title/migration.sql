/*
  Warnings:

  - The `title` column on the `passengers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Title" AS ENUM ('MR', 'MRS', 'MS', 'DR');

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "title",
ADD COLUMN     "title" "Title";
