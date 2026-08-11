import type { Bay, Plan } from '../domain/types';

interface Props {
  plan: Plan;
  parked: number;
  free: Bay[];
}

const isBusBay = (bay: Bay) => bay.length > 6;

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-ink-700 uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm font-semibold text-ink-950">{value}</dd>
    </div>
  );
}

export function GarageHeader({ plan, parked, free }: Props) {
  const carBays = plan.bays.filter((bay) => !isBusBay(bay));
  const busBays = plan.bays.filter(isBusBay);
  const freeCarBays = free.filter((bay) => !isBusBay(bay)).length;
  const freeBusBays = free.filter(isBusBay).length;

  return (
    <header className="flex items-center gap-8 overflow-x-auto border-2 border-white px-6 py-4">
      <h1 className="shrink-0 text-sm font-semibold tracking-[0.3em] text-ink-950 uppercase">
        Minigaraget
      </h1>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className="font-counter text-5xl leading-none text-ink-950"
          style={{ fontVariationSettings: "'BLED' 0, 'SCAN' 60" }}
        >
          {free.length}
        </span>
        <span className="max-w-16 text-[10px] leading-tight font-semibold tracking-[0.12em] text-ink-700 uppercase">
          Lediga platser
        </span>
      </div>

      <dl className="ml-auto flex shrink-0 items-start gap-6">
        <Metric label="Antal bilar i garaget" value={parked} />
        <Metric label="Kapacitet" value={plan.bays.length} />
        <Metric label="Bilplatser" value={`${freeCarBays} / ${carBays.length}`} />
        <Metric label="Bussplatser" value={`${freeBusBays} / ${busBays.length}`} />
      </dl>
    </header>
  );
}
