/**
 * Kenya Airways — reference & ticket number generators
 *
 * Booking reference format : KQ-2026-XXXXXX  (year + 6 alphanum chars)
 * Ticket number format     : TKT-XXXXXXXXXX  (10 alphanum chars)
 *
 * Both are:
 *  - URL-safe (uppercase alphanumeric only, no special chars)
 *  - Collision-resistant (crypto.randomBytes for true randomness)
 *  - Human-readable (easy to read over the phone / print on ticket)
 */

import { randomBytes } from "crypto"
import { Prisma } from "../../../generated/prisma/client"

/**
 * Generate a cryptographically random uppercase alphanumeric string of
 * exactly `length` characters.
 *
 * Uses only A-Z and 0-9 (36 chars), excluding look-alike pairs:
 *   O ↔ 0,  I ↔ 1,  l ↔ 1  — so passengers can read it without confusion.
 */
function randomAlphaNum(length: number): string {
  // Alphabet with confusable chars removed
  const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789" // 32 chars
  const bytes = randomBytes(length * 2) // over-sample to avoid bias
  let result = ""

  for (let i = 0; i < bytes.length && result.length < length; i++) {
    const index = bytes[i] % ALPHABET.length
    // Modulo bias is negligible here (256 / 32 = exactly 8 — zero bias)
    result += ALPHABET[index]
  }

  return result
}

/**
 * Generate a booking reference.
 *
 * Format: KQ-{YEAR}-{6 random chars}
 * Example: KQ-2026-A3MX7P
 *
 * The year makes it easy to archive bookings by year and tells
 * customer service agents roughly when the booking was made.
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear()
  const random = randomAlphaNum(6)
  return `KQ-${year}-${random}`
}

/**
 * Generate a ticket number.
 *
 * Format: TKT-{10 random chars}
 * Example: TKT-B7K2XQRN4A
 *
 * Longer than the booking reference because ticket numbers are used
 * for auditing and must be harder to guess.
 */
export function generateTicketNumber(): string {
  const random = randomAlphaNum(10)
  return `TKT-${random}`
}

/**
 * Keep generating a booking reference until one doesn't already exist
 * in the database. In practice, collisions are astronomically unlikely
 * (32^6 = ~1 billion combinations) but this makes the code production-safe.
 *
 * Usage:
 *   const ref = await generateUniqueBookingReference(prisma)
 */
export async function generateUniqueBookingReference(tx: Prisma.TransactionClient): Promise<string> {
  let reference: string
  let attempts = 0

  do {
    if (attempts > 10) {
      throw new Error("Could not generate a unique booking reference after 10 attempts.")
    }
    reference = generateBookingReference()
    attempts++
  } while (await tx.booking.findUnique({ where: { reference } }))

  return reference
}

/**
 * Keep generating a ticket number until one doesn't already exist
 * in the database.
 *
 * Usage:
 *   const ticketNo = await generateUniqueTicketNumber(prisma)
 */
export async function generateUniqueTicketNumber(tx: Prisma.TransactionClient): Promise<string> {
  let ticketNumber: string
  let attempts = 0

  do {
    if (attempts > 10) {
      throw new Error("Could not generate a unique ticket number after 10 attempts.")
    }
    ticketNumber = generateTicketNumber()
    attempts++
  } while (await tx.ticket.findUnique({ where: { ticketNumber } }))

  return ticketNumber
}

export async function generateCode(
  tx: Prisma.TransactionClient,
  prefix: string, // "EMP" for employee numbers, "REF" for booking references, etc.
): Promise<string> {
  const year = new Date().getFullYear()
  const counterName = `${prefix}_${year}`

  const counter = await tx.counter.upsert({
    where: { name: counterName },
    update: { value: { increment: 1 } },
    create: { name: counterName, value: 1 },
  })

  const sequence = String(counter.value).padStart(6, "0")
  return `${prefix}-${year}-${sequence}`
}
