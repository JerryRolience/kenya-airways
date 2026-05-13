import chalk from "chalk"
import { seedAirports } from "./seed-airports"
import { seedAircraftLayouts } from "./seed-aircraft-layouts"
import { seedFlights } from "./seed-flights"
import { seedPassengers } from "./seed-passengers"
import { seedEmployees } from "./seed-employees"
import { seedJobOpenings } from "./seed-job-openings"
import { seedSuperAdmin } from "./seed-super-admin"

async function main() {
  console.log(chalk.cyan("\n═══════════════════════════════════════════"))
  console.log(chalk.cyan("   ✈️  KENYA AIRWAYS — DATABASE SEEDER"))
  console.log(chalk.cyan("═══════════════════════════════════════════\n"))

  console.log(chalk.magenta("▶ Step 1: Seeding Airports..."))
  await seedAirports()

  console.log(chalk.magenta("\n▶ Step 2: Seeding Aircraft Layouts..."))
  await seedAircraftLayouts()

  console.log(chalk.magenta("\n▶ Step 3: Seeding Flights, Seat Classes & Seats..."))
  await seedFlights()

  console.log(chalk.magenta("\n▶ Step 4: Seeding Passengers..."))
  await seedPassengers()

  console.log(chalk.magenta("\n▶ Step 5: Seeding Employees..."))
  await seedEmployees()

  console.log(chalk.magenta("\n▶ Step 6: Seeding Job Openings..."))
  await seedJobOpenings()

  console.log(chalk.magenta("\n▶ Step 7: Seeding Super Admin User..."))
  await seedSuperAdmin()

  console.log(chalk.cyan("\n═══════════════════════════════════════════"))
  console.log(chalk.green("   ✅ ALL SEEDING COMPLETED SUCCESSFULLY!"))
  console.log(chalk.cyan("═══════════════════════════════════════════\n"))
}

main().catch(e => {
  console.error(chalk.red("\n❌ Seeding failed:"), e)
  process.exit(1)
})
