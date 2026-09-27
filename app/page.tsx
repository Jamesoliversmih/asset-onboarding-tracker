import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

type EmployeeWithTasks = Prisma.EmployeeGetPayload<{
  include: { tasks: true };
}>;

export default async function DashboardPage() {
  const [total, onboarding, active, offboarding, assetsAssigned, assetsAvailable] =
    await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ONBOARDING" } }),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.employee.count({ where: { status: "OFFBOARDING" } }),
      prisma.asset.count({ where: { status: "ASSIGNED" } }),
      prisma.asset.count({ where: { status: "AVAILABLE" } }),
    ]);

  const needsAttention = await prisma.employee.findMany({
    where: { status: { in: ["ONBOARDING", "OFFBOARDING"] } },
    include: { tasks: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Total employees", value: total },
    { label: "Onboarding", value: onboarding },
    { label: "Active", value: active },
    { label: "Offboarding", value: offboarding },
    { label: "Assets assigned", value: assetsAssigned },
    { label: "Assets available", value: assetsAvailable },
  ];

  return (
    <main className="max-w-content px-6 py-10 md:px-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted">
        Overview of onboarding, offboarding, and asset assignments.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <p className="text-2xl font-semibold text-ink">{stat.value}</p>
            <p className="mt-1 text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-ink">Needs attention</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
          {needsAttention.length === 0 ? (
            <p className="p-6 text-sm text-muted">
              Nothing pending — every employee is fully onboarded or offboarded.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Checklist progress</th>
                </tr>
              </thead>
              <tbody>
                {needsAttention.map((employee: EmployeeWithTasks) => {
                  const relevant = employee.tasks.filter(
                    (t) =>
                      t.phase ===
                      (employee.status === "OFFBOARDING"
                        ? "OFFBOARDING"
                        : "ONBOARDING")
                  );
                  const done = relevant.filter((t) => t.done).length;
                  return (
                    <tr
                      key={employee.id}
                      className="border-b border-line last:border-0"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/employees/${employee.id}`}
                          className="font-medium text-ink hover:text-accent"
                        >
                          {employee.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={employee.status} />
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {done}/{relevant.length} tasks complete
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
