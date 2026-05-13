import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PassengerRelation, PrismaClient, Title } from "../../generated/prisma/client"
import { PASSENGERS } from "./data/passengers-data"

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

// ─── Helper: Create a user if they don't exist ───
async function findOrCreateUser(email: string, firstName: string, lastName: string, phone: string) {
  let user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!user) {
    // Create a user without Clerk (for seeding purposes)
    // Uses a placeholder clerkId since these are seed users
    user = await prisma.user.create({
      data: {
        clerkId: `seed_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
        email,
        firstName,
        lastName,
        phone,
        role: "PASSENGER",
      },
      select: { id: true },
    })
    console.log(chalk.gray(`   Created user: ${email}`))
  }

  return user
}

export async function seedPassengers() {
  console.log(chalk.blue("\n🧑‍✈️ Starting seeding of passengers..."))

  let created = 0
  let skipped = 0

  for (const passengerData of PASSENGERS) {
    try {
      // Find or create the associated user
      const user = await findOrCreateUser(passengerData.email, passengerData.firstName, passengerData.lastName, passengerData.phone)

      // Check if passenger profile already exists for this user
      const existingPassenger = await prisma.passenger.findFirst({
        where: {
          userId: user.id,
          passportNumber: passengerData.passportNumber,
        },
      })

      if (existingPassenger) {
        console.log(chalk.yellow(`⚠️  Skipped: ${passengerData.firstName} ${passengerData.lastName} — already exists`))
        skipped++
        continue
      }

      // Create passenger profile
      await prisma.passenger.create({
        data: {
          userId: user.id,
          title: passengerData.title as Title,
          firstName: passengerData.firstName,
          lastName: passengerData.lastName,
          email: passengerData.email,
          phone: passengerData.phone,
          passportNumber: passengerData.passportNumber,
          nationality: passengerData.nationality,
          dateOfBirth: passengerData.dateOfBirth,
          relationship: PassengerRelation.SELF,
        },
      })

      console.log(chalk.green(`✅ Passenger: ${passengerData.title} ${passengerData.firstName} ${passengerData.lastName} — ${passengerData.nationality}`))
      created++
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create ${passengerData.firstName} ${passengerData.lastName}:`), error)
    }
  }

  console.log(chalk.yellow(`\n🧑‍✈️ Passengers seeding completed — ${created} created, ${skipped} skipped`))
}

seedPassengers()
  .catch(e => {
    console.error("Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
