import { createClerkClient } from "@clerk/backend"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { Role } from "../../../../generated/prisma/enums"
import { SeedConfig } from "../index"

const envPath = path.resolve(process.cwd(), ".env")
dotenv.config({ path: envPath })

// Initialize Clerk client
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
})

export async function createOrUpdateClerkUser(config: SeedConfig) {
  console.log(chalk.blue("📋 Checking Clerk for existing user..."))

  try {
    // Search for existing user by email
    const response = await clerk.users.getUserList({
      emailAddress: [config.email],
      limit: 10,
    })

    const existingClerkUsers = response.data || []

    if (existingClerkUsers.length > 0) {
      const clerkUser = existingClerkUsers[0]
      console.log(chalk.green("✅ Clerk user already exists."))
      console.log(chalk.gray(`   Clerk User ID: ${clerkUser.id}`))
      console.log(chalk.gray(`   Email: ${clerkUser.emailAddresses[0]?.emailAddress}`))

      // Update metadata with role if not set
      const currentMetadata = (clerkUser.publicMetadata || {}) as Record<string, unknown>

      if (!currentMetadata.role) {
        await clerk.users.updateUser(clerkUser.id, {
          publicMetadata: {
            ...currentMetadata,
            role: Role.SUPER_ADMIN,
            seeded: true,
            seededAt: new Date().toISOString(),
          },
        })
        console.log(chalk.green("✅ Updated Clerk user metadata with SUPER_ADMIN role."))
      }

      return clerkUser
    }

    // Create new Clerk user
    console.log(chalk.blue("🔄 Creating new Clerk user..."))
    const clerkUser = await clerk.users.createUser({
      emailAddress: [config.email],
      password: config.password,
      firstName: config.firstName,
      lastName: config.lastName,
      publicMetadata: {
        role: Role.SUPER_ADMIN,
        seeded: true,
        seededAt: new Date().toISOString(),
      },
    })

    console.log(chalk.green("✅ Clerk user created successfully."))
    console.log(chalk.gray(`   Clerk User ID: ${clerkUser.id}`))
    console.log(chalk.gray(`   Email: ${clerkUser.emailAddresses[0]?.emailAddress}`))

    return clerkUser
  } catch (error: any) {
    console.error(chalk.red("❌ Failed to create/update Clerk user:"), error.message)

    if (error.message.includes("secret") || error.message.includes("unauthorized")) {
      console.error(chalk.yellow("\n💡 Clerk Secret Key issue:"))
      console.error(chalk.yellow("   1. Make sure you're using the correct key"))
      console.error(chalk.yellow("   2. Key should start with 'sk_test_' for development"))
      console.error(chalk.yellow(`   3. Current key starts with: ${process.env.CLERK_SECRET_KEY?.substring(0, 12)}...`))
    }

    throw error
  }
}
