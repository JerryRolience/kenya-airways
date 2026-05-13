import chalk from "chalk"
import { PrismaClient } from "../../../../generated/prisma/client"
import { Role } from "../../../../generated/prisma/enums"
import { SeedConfig } from "../index"

interface CreateOrUpdateDatabaseUserData {
  clerkUserId: string
  config: SeedConfig
  prisma: PrismaClient
}

export async function createOrUpdateDatabaseUser({ clerkUserId, config, prisma }: CreateOrUpdateDatabaseUserData) {
  console.log(chalk.blue("📋 Checking database for existing user..."))

  try {
    // Check by clerkId
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (dbUser) {
      console.log(chalk.green("✅ Database user already exists."))
      console.log(chalk.gray(`   Database User ID: ${dbUser.id}`))
      console.log(chalk.gray(`   Email: ${dbUser.email}`))
      console.log(chalk.gray(`   Role: ${dbUser.role}`))

      // Ensure role is SUPER_ADMIN
      if (dbUser.role !== Role.SUPER_ADMIN) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: Role.SUPER_ADMIN },
        })
        console.log(chalk.green("✅ Updated user role to SUPER_ADMIN."))
      }

      return dbUser
    }

    // Check by email
    const existingByEmail = await prisma.user.findUnique({
      where: { email: config.email },
    })

    if (existingByEmail) {
      console.log(chalk.yellow("⚠️  User exists with this email but is not linked to Clerk. Linking..."))

      dbUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkId: clerkUserId,
          role: Role.SUPER_ADMIN,
          firstName: config.firstName,
          lastName: config.lastName,
        },
      })

      console.log(chalk.green("✅ Linked existing user with Clerk."))
      console.log(chalk.gray(`   Database User ID: ${dbUser.id}`))
      console.log(chalk.gray(`   Email: ${dbUser.email}`))

      return dbUser
    }

    // Create new database user
    console.log(chalk.blue("🔄 Creating new database user..."))
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: config.email,
        firstName: config.firstName,
        lastName: config.lastName,
        role: Role.SUPER_ADMIN,
      },
    })

    console.log(chalk.green("✅ Database user created successfully."))
    console.log(chalk.gray(`   Database User ID: ${dbUser.id}`))
    console.log(chalk.gray(`   Email: ${dbUser.email}`))

    return dbUser
  } catch (error: any) {
    console.error(chalk.red("❌ Failed to create/update database user:"), error.message)
    throw error
  }
}
