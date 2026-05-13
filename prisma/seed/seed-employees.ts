import { PrismaPg } from "@prisma/adapter-pg"
import chalk from "chalk"
import * as dotenv from "dotenv"
import * as path from "path"
import { PrismaClient } from "../../generated/prisma/client"
import { EMPLOYEES } from "./data/employees-data"
import { generateCode } from "@/actions/lib/generate-codes"

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

export async function seedEmployees() {
  console.log(chalk.blue("\n👔 Starting seeding of employees..."))

  let created = 0
  let skipped = 0
  let errors = 0

  for (const employeeData of EMPLOYEES) {
    try {
      // 1. Find or create the user first
      let user = await prisma.user.findUnique({
        where: { email: employeeData.email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          employee: { select: { id: true } },
        },
      })

      if (!user) {
        // Extract name from email for the user record
        const namePart = employeeData.email.split("@")[0]
        const nameParts = namePart.split(".")
        const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : "Employee"

        user = await prisma.user.create({
          data: {
            clerkId: `seed_emp_${employeeData.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
            email: employeeData.email,
            firstName,
            lastName,
            phone: "+254700000000",
            role: employeeData.isActive ? "EMPLOYEE" : "PASSENGER",
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            employee: { select: { id: true } },
          },
        })
        console.log(chalk.gray(`   Created user: ${employeeData.email}`))
      }

      // 2. Check if employee profile already exists
      if (user.employee) {
        console.log(chalk.yellow(`⚠️  Skipped: ${user.firstName} ${user.lastName} — already has employee profile`))
        skipped++
        continue
      }
      const employeeNo = await generateCode(prisma, "EMP")

      // 3. Create employee profile
      await prisma.employee.create({
        data: {
          employeeNo,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          department: employeeData.department,
          position: employeeData.position,
          isActive: employeeData.isActive,
        },
      })

      // 4. Update user role to EMPLOYEE if active
      if (employeeData.isActive && user.role === "PASSENGER") {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "EMPLOYEE" },
        })
      }

      console.log(chalk.green(`✅ Employee: ${user.firstName} ${user.lastName} — ${employeeData.position} (${employeeData.department}) ${employeeData.isActive ? "🟢 Active" : "🔴 Inactive"}`))
      created++
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create employee ${employeeData.email}:`), error)
      errors++
    }
  }

  console.log(chalk.yellow(`\n👔 Employees seeding completed — ${created} created, ${skipped} skipped, ${errors} errors`))
}

seedEmployees()
  .catch(e => {
    console.error("Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
