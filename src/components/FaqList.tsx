import { Kicker } from "@/components/ui/Icons";

export function FaqList({
  kicker,
  sub,
  items,
  name,
}: {
  kicker: string;
  sub?: string;
  items: { q: string; a: string }[];
  name: string;
}) {
  return (
    <section className="dyas-sheet dyas-sheet__section">
      <div className="container-site max-w-[46rem]">
        <Kicker>FAQ</Kicker>
        <h2 className="text-heading-40 mt-6 text-pretty">{kicker}</h2>
        {sub ? <p className="text-body-18-light mt-4 opacity-70">{sub}</p> : null}
        <div className="mt-10">
          {items.map((item) => (
            <details key={item.q} name={name} className="faq-item group border-b border-stroke-1">
              <summary className="text-body-18-regular cursor-pointer py-5 pr-8">{item.q}</summary>
              <p className="text-body-16-light pb-5 opacity-80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
