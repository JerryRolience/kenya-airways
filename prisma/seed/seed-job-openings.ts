import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PrismaClient } from "../../generated/prisma/client"
import { JOB_OPENINGS } from "./data/job-openings-data"

const envPath = path.resolve(process.cwd(), ".env")
console.log(chalk.blue(`📁 Loading env from: ${envPath}`))
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error(chalk.red("❌ Failed to load .env file:"), result.error.message)
  process.exit(1)
}

console.log(chalk.green("✅ Environment variables loaded"))

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function seedJobOpenings() {
  console.log(chalk.blue("\n💼 Starting seeding of job openings..."))

  let created = 0
  let skipped = 0

  for (const opening of JOB_OPENINGS) {
    try {
      // Check if a similar opening already exists (by title + department)
      const existing = await prisma.jobOpening.findFirst({
        where: {
          title: opening.title,
          department: opening.department,
        },
      })

      if (existing) {
        console.log(chalk.yellow(`⚠️  Skipped: ${opening.title} — already exists`))
        skipped++
        continue
      }

      await prisma.jobOpening.create({
        data: {
          title: opening.title,
          department: opening.department,
          description: opening.description,
          isOpen: opening.isOpen,
          closedAt: opening.closedAt || null,
        },
      })

      console.log(chalk.green(`✅ Opening: ${opening.title} (${opening.department}) — ${opening.isOpen ? "🟢 Open" : "🔴 Closed"}`))
      created++
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create opening: ${opening.title}`), error)
    }
  }

  console.log(chalk.yellow(`\n💼 Job openings seeding completed — ${created} created, ${skipped} skipped`))
}

seedJobOpenings()
  .catch(e => {
    console.error("Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
