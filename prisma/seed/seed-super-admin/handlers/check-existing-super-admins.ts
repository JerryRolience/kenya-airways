import chalk from "chalk"
import { PrismaClient } from "../../../../generated/prisma/client"
import { Role } from "../../../../generated/prisma/enums"

interface CheckExistingSuperAdminsData {
  prisma: PrismaClient
}

export async function checkExistingSuperAdmins({ prisma }: CheckExistingSuperAdminsData): Promise<boolean> {
  try {
    await prisma.$connect()
    console.log(chalk.green("✅ Database connected successfully"))

    const existingSuperAdmins = await prisma.user.count({
      where: { role: Role.SUPER_ADMIN },
    })

    if (existingSuperAdmins > 0) {
      console.log(chalk.yellow("⚠️  Warning: Super admin(s) already exist in the database."))
      console.log(chalk.gray(`   Found ${existingSuperAdmins} super admin(s).`))

      const admins = await prisma.user.findMany({
        where: { role: Role.SUPER_ADMIN },
        select: { email: true, firstName: true, lastName: true, createdAt: true },
      })

      admins.forEach(admin => {
        console.log(chalk.gray(`   - ${admin.email} (${admin.firstName} ${admin.lastName}) — Created ${admin.createdAt.toLocaleDateString()}`))
      })

      return true
    }

    console.log(chalk.gray("No existing super admins found."))
    return false
  } catch (error: any) {
    console.error(chalk.red("❌ Database connection failed:"), error.message)
    throw error
  }
}
