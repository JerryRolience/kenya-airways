const stats = [
  { value: "12M+", label: "Bookings completed" },
  { value: "98.7%", label: "On-time reliability" },
  { value: "240+", label: "Destinations served" },
  { value: "24/7", label: "Global support" },
];

export function Stats() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                <span className="text-accent">{s.value}</span>
              </div>
              <div className="mt-2 text-sm text-primary-foreground/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
