import chalk from "chalk"

export async function validateEnvironment() {
  console.log(chalk.blue("🔍 Validating environment variables..."))

  const requiredEnvVars = ["SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_FIRST_NAME", "SUPER_ADMIN_LAST_NAME", "DATABASE_URL", "CLERK_SECRET_KEY"]

  const missing = requiredEnvVars.filter(varName => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  console.log(chalk.green("✅ All required environment variables are set"))
}
