import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PrismaClient } from "../../../generated/prisma/client"
import { Role } from "../../../generated/prisma/enums"
import { validateEnvironment, checkExistingSuperAdmins, createOrUpdateDatabaseUser, createOrUpdateClerkUser } from "./handlers"

// Load env
const envPath = path.resolve(process.cwd(), ".env")
console.log(chalk.blue(`📁 Loading env from: ${envPath}`))
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error(chalk.red("❌ Failed to load .env file:"), result.error.message)
  process.exit(1)
}

console.log(chalk.green("✅ Environment variables loaded"))
console.log(chalk.gray(`   DATABASE_URL exists: ${!!process.env.DATABASE_URL}`))
console.log(chalk.gray(`   CLERK_SECRET_KEY exists: ${!!process.env.CLERK_SECRET_KEY}`))

// Create Prisma client
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export interface SeedConfig {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
}

export async function seedSuperAdmin() {
  console.log(chalk.cyan("\n═══════════════════════════════════════════"))
  console.log(chalk.cyan("   👑 SUPER ADMIN SEEDER"))
  console.log(chalk.cyan("═══════════════════════════════════════════\n"))

  const startTime = Date.now()

  try {
    // 1. Validate environment
    await validateEnvironment()

    // 2. Get configuration from env
    const config: SeedConfig = {
      email: process.env.SUPER_ADMIN_EMAIL!,
      password: process.env.SUPER_ADMIN_PASSWORD!,
      firstName: process.env.SUPER_ADMIN_FIRST_NAME!,
      lastName: process.env.SUPER_ADMIN_LAST_NAME!,
      role: Role.SUPER_ADMIN,
    }

    console.log(chalk.gray(`   Email: ${config.email}`))
    console.log(chalk.gray(`   Name: ${config.firstName} ${config.lastName}`))
    console.log(chalk.gray(`   Role: ${config.role}\n`))

    // 3. Check existing super admins
    await checkExistingSuperAdmins({ prisma })

    // 4. Create/update Clerk user
    const clerkUser = await createOrUpdateClerkUser(config)

    // 5. Create/update database user
    const dbUser = await createOrUpdateDatabaseUser({
      clerkUserId: clerkUser.id,
      config,
      prisma,
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(chalk.cyan("\n═══════════════════════════════════════════"))
    console.log(chalk.green("   ✅ SUPER ADMIN SEEDED SUCCESSFULLY!"))
    console.log(chalk.cyan("═══════════════════════════════════════════"))

    console.log(chalk.cyan("\n📊 Summary:"))
    console.log(chalk.gray(`   Duration: ${duration}s`))
    console.log(chalk.gray(`   Clerk User ID: ${clerkUser.id}`))
    console.log(chalk.gray(`   Database User ID: ${dbUser.id}`))
    console.log(chalk.gray(`   Email: ${dbUser.email}`))
    console.log(chalk.gray(`   Role: ${dbUser.role}`))

    console.log(chalk.cyan("\n🔑 Login credentials:"))
    console.log(chalk.gray(`   Email: ${config.email}`))
    console.log(chalk.gray(`   Password: ${config.password}`))
  } catch (error: any) {
    console.error(chalk.red("\n❌ Super admin seeding failed:"), error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run
seedSuperAdmin()
