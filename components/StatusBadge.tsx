const styles: Record<string, string> = {
  ONBOARDING: "bg-status-onboarding/10 text-status-onboarding",
  ACTIVE: "bg-status-active/10 text-status-active",
  OFFBOARDING: "bg-status-offboarding/10 text-status-offboarding",
  OFFBOARDED: "bg-status-offboarded/10 text-status-offboarded",
  AVAILABLE: "bg-status-active/10 text-status-active",
  ASSIGNED: "bg-accent/10 text-accent",
  RETIRED: "bg-status-offboarded/10 text-status-offboarded",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        styles[status] ?? "bg-line text-muted"
      }`}
    >
      {status.toLowerCase()}
    </span>
  );
}
