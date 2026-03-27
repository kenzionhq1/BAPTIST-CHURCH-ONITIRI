import { ReactNode } from "react";
import clsx from "clsx";

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
  action?: ReactNode;
};

const SectionHeader = ({ eyebrow, title, subtitle, alignment = "center", action }: SectionHeaderProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3",
        alignment === "center" ? "items-center text-center" : "items-start text-left"
      )}
    >
      {eyebrow &&
        (typeof eyebrow === "string" ? (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue/80">
            {eyebrow}
          </span>
        ) : (
          eyebrow
        ))}
      <h2 className="text-3xl font-bold text-brand-navy md:text-4xl">{title}</h2>
      {subtitle && <p className="max-w-3xl text-base text-slate-600">{subtitle}</p>}
      {action}
    </div>
  );
};

export default SectionHeader;
