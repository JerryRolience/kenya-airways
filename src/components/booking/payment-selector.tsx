"use client"

import { PaymentMethod } from "../../../generated/prisma/enums"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Smartphone, CreditCard, Building2, Banknote } from "lucide-react"

interface PaymentSelectorProps {
  selected: PaymentMethod | null
  transactionRef: string
  totalAmount: number
  onMethodChange: (method: PaymentMethod) => void
  onRefChange: (ref: string) => void
  error?: string
}

const METHODS: {
  value: PaymentMethod
  label: string
  description: string
  icon: React.ElementType
}[] = [
  { value: PaymentMethod.MPESA, label: "M-Pesa", description: "Kenya mobile money", icon: Smartphone },
  { value: PaymentMethod.VISA, label: "Visa", description: "Credit / debit card", icon: CreditCard },
  { value: PaymentMethod.MASTERCARD, label: "Mastercard", description: "Credit / debit card", icon: CreditCard },
  { value: PaymentMethod.AMEX, label: "Amex", description: "American Express", icon: CreditCard },
  { value: PaymentMethod.BANK_TRANSFER, label: "Bank transfer", description: "Direct bank transfer", icon: Building2 },
  { value: PaymentMethod.CASH, label: "Cash", description: "Pay at counter", icon: Banknote },
]

export function PaymentSelector({ selected, transactionRef, totalAmount, onMethodChange, onRefChange, error }: PaymentSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Method grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {METHODS.map(m => {
          const Icon = m.icon
          const isActive = selected === m.value
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => onMethodChange(m.value)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all duration-150",
                isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border/60 bg-card hover:border-border hover:bg-muted/30 hover:cursor-pointer",
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className={cn("text-xs font-semibold leading-none", isActive ? "text-primary" : "text-foreground")}>{m.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">{m.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* M-Pesa instructions */}
      {selected === PaymentMethod.MPESA && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-primary mb-2">How to pay with M-Pesa</p>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Go to M-Pesa on your phone</li>
              <li>
                Select <span className="font-medium text-foreground">Lipa na M-Pesa → Paybill</span>
              </li>
              <li>
                Business number: <span className="font-bold text-foreground">522533</span>
              </li>
              <li>
                {/* Account number: <span className="font-bold text-foreground">booking reference (generated after confirm)</span> */}
                Account number: <span className="font-bold text-foreground">your phone number</span>
              </li>
              <li>
                Amount: <span className="font-bold text-foreground">KES {totalAmount.toLocaleString()}</span>
              </li>
              <li>Enter your M-Pesa PIN and send</li>
              <li>You will receive an SMS confirmation code — enter it below</li>
            </ol>
          </div>

          {/* Transaction code input */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              M-Pesa confirmation code <span className="text-destructive">*</span>
            </Label>
            <Input
              value={transactionRef}
              onChange={e => onRefChange(e.target.value.toUpperCase())}
              placeholder="e.g. QJK7A3X2Y1"
              className={cn("h-11 rounded-xl font-mono tracking-wider uppercase", error && "border-destructive")}
              maxLength={12}
            />
            {error && <p className="text-[11px] text-destructive">{error}</p>}
          </div>
        </div>
      )}

      {/* Card / bank info */}
      {selected && selected !== PaymentMethod.MPESA && selected !== PaymentMethod.CASH && (
        <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {selected === PaymentMethod.BANK_TRANSFER
              ? "Bank transfer details will be emailed to you after confirmation. Payment must be received within 24 hours."
              : "Card payment processing is simulated in this demo. Enter any reference code to proceed."}
          </p>
          {selected !== PaymentMethod.BANK_TRANSFER && (
            <div className="mt-3 space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Card / reference number</Label>
              <Input value={transactionRef} onChange={e => onRefChange(e.target.value)} placeholder="e.g. 4111 1111 1111 1111" className="h-11 rounded-xl" />
            </div>
          )}
        </div>
      )}

      {/* Cash info */}
      {selected === PaymentMethod.CASH && (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/40 px-4 py-3">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Cash payment must be completed at a Kenya Airways ticketing counter within <span className="font-semibold">2 hours</span> of booking. Bring your booking reference and pay{" "}
            <span className="font-semibold">KES {totalAmount.toLocaleString()}</span>.
          </p>
        </div>
      )}
    </div>
  )
}
