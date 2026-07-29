import { Link } from "react-router-dom";
import { Activity, CalendarCheck, FileHeart, FlaskConical, ShieldCheck, Stethoscope } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const features = [
  {
    icon: CalendarCheck,
    title: "Appointment booking",
    desc: "Patients book directly into real doctor availability — no phone tag.",
  },
  {
    icon: Stethoscope,
    title: "Consultation workspace",
    desc: "Doctors capture vitals, diagnosis, and prescriptions in one flow.",
  },
  {
    icon: FlaskConical,
    title: "Lab tracking",
    desc: "Requests move from ordered to resulted with a visible status trail.",
  },
  {
    icon: FileHeart,
    title: "Unified records",
    desc: "Every visit, prescription, and result lives on one patient timeline.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vital-coral/10 text-vital-coral">
            <Activity size={19} strokeWidth={2.25} />
          </div>
          <span className="font-display text-lg font-semibold">MedFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-20 text-center">
        {/* Signature element: a single hand-drawn heartbeat trace that draws
            itself once on load. This is the one deliberate motion moment in
            the whole app — nothing else animates on entry. */}
        <svg
          viewBox="0 0 240 48"
          className="mx-auto mb-8 h-10 w-60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0 24 H84 L96 6 L112 42 L124 24 H240"
            stroke="#E0483E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pulse-trace"
          />
        </svg>

        <h1 className="font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Smarter healthcare.
          <br />
          <span className="text-vital-coral">Better patient care.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[var(--text-muted)]">
          One platform for patients, doctors, and hospital staff to manage appointments,
          prescriptions, lab work, and billing — without the paperwork.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link to="/register">
            <Button variant="primary" className="px-7 py-3.5 text-base">
              Create an account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" className="px-7 py-3.5 text-base">
              I already have one
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="text-left" hoverable>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <f.icon size={20} strokeWidth={1.9} />
              </div>
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border-soft)] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} strokeWidth={1.9} /> Role-based access · JWT secured
          </span>
          <span>© {new Date().getFullYear()} MedFlow</span>
        </div>
      </footer>
    </div>
  );
}
