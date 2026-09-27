import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import {
  toggleTask,
  startOffboarding,
  completeOffboarding,
  activateEmployee,
  unassignAsset,
} from "@/lib/actions";

type TaskRow = Prisma.TaskGetPayload<{}>;
type AssetRow = Prisma.AssetGetPayload<{}>;

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { tasks: true, assets: true },
  });

  if (!employee) notFound();

  const activePhase =
    employee.status === "OFFBOARDING" ? "OFFBOARDING" : "ONBOARDING";
  const checklist = employee.tasks.filter((t) => t.phase === activePhase);
  const allDone = checklist.length > 0 && checklist.every((t) => t.done);

  return (
    <main className="max-w-content px-6 py-10 md:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {employee.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {employee.role} · {employee.department} · {employee.email}
          </p>
        </div>
        <StatusBadge status={employee.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">
              {activePhase === "OFFBOARDING" ? "Offboarding" : "Onboarding"}{" "}
              checklist
            </h2>
            <span className="text-xs text-muted">
              {checklist.filter((t) => t.done).length}/{checklist.length} complete
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {checklist.map((task: TaskRow) => (
              <li key={task.id}>
                <form action={toggleTask.bind(null, task.id, employee.id)}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-paper"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        task.done
                          ? "border-accent bg-accent text-white"
                          : "border-line"
                      }`}
                    >
                      {task.done && "✓"}
                    </span>
                    <span
                      className={task.done ? "text-muted line-through" : "text-ink"}
                    >
                      {task.label}
                    </span>
                  </button>
                </form>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {employee.status === "ONBOARDING" && (
              <form action={activateEmployee.bind(null, employee.id)}>
                <button
                  type="submit"
                  disabled={!allDone}
                  className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Mark as active
                </button>
              </form>
            )}
            {employee.status === "ACTIVE" && (
              <form action={startOffboarding.bind(null, employee.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-status-offboarding hover:text-status-offboarding"
                >
                  Start offboarding
                </button>
              </form>
            )}
            {employee.status === "OFFBOARDING" && (
              <form action={completeOffboarding.bind(null, employee.id)}>
                <button
                  type="submit"
                  disabled={!allDone}
                  className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Complete offboarding
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 className="text-sm font-semibold text-ink">Assigned assets</h2>
          {employee.assets.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No assets assigned yet. Assign one from the Assets page.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {employee.assets.map((asset: AssetRow) => (
                <li
                  key={asset.id}
                  className="flex items-center justify-between rounded-md border border-line px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-ink">{asset.name}</p>
                    <p className="text-xs text-muted">
                      {asset.type.toLowerCase()}
                      {asset.serialNumber ? ` · ${asset.serialNumber}` : ""}
                    </p>
                  </div>
                  <form action={unassignAsset.bind(null, asset.id, employee.id)}>
                    <button
                      type="submit"
                      className="text-xs text-muted transition-colors hover:text-status-offboarding"
                    >
                      Unassign
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
