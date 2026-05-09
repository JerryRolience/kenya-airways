import chalk from "chalk"
import { seedAirports } from "./seed-airports"
import { seedAircraftLayouts } from "./seed-aircraft-layouts"
import { seedFlights } from "./seed-flights"

async function main() {
  console.log(chalk.cyan("\n═══════════════════════════════════════════"))
  console.log(chalk.cyan("   ✈️  KENYA AIRWAYS — DATABASE SEEDER"))
  console.log(chalk.cyan("═══════════════════════════════════════════\n"))

  // Run SEQUENTIALLY — each awaits completion
  console.log(chalk.magenta("▶ Step 1/3: Seeding Airports..."))
  await seedAirports()

  console.log(chalk.magenta("\n▶ Step 2/3: Seeding Aircraft Layouts..."))
  await seedAircraftLayouts()

  console.log(chalk.magenta("\n▶ Step 3/3: Seeding Flights, Seat Classes & Seats..."))
  await seedFlights()

  console.log(chalk.cyan("\n═══════════════════════════════════════════"))
  console.log(chalk.green("   ✅ ALL SEEDING COMPLETED SUCCESSFULLY!"))
  console.log(chalk.cyan("═══════════════════════════════════════════\n"))
}

main().catch(e => {
  console.error(chalk.red("\n❌ Seeding failed:"), e)
  process.exit(1)
})
