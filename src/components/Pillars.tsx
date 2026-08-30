export function Pillars({
  headline,
  sub,
  items,
}: {
  headline: string;
  sub?: string;
  items: { title: string; body: string }[];
}) {
  return (
    <section className="bg-day py-18 text-black md:py-28">
      <div className="container-site">
        <h2 className="text-heading-40 max-w-[36rem] text-pretty">{headline}</h2>
        {sub ? <p className="text-body-18-light mt-4 max-w-[36rem] opacity-70">{sub}</p> : null}
        <div className="mt-12 grid gap-px bg-dusk sm:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.title} className="bg-day p-6 dyas-sheet-rise" style={{ ["--i" as string]: i }}>
              <p className="text-mono-s text-sun">{"{ "}{i + 1}{" }"}</p>
              <h3 className="text-heading-24 mt-4">{item.title}</h3>
              <p className="text-body-16-light mt-3 opacity-70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
