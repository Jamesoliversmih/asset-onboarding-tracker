import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import StatusBadge from "@/components/StatusBadge";
import { createAsset, assignAsset, unassignAsset } from "@/lib/actions";

export const dynamic = "force-dynamic";

type AssetWithEmployee = Prisma.AssetGetPayload<{
  include: { assignedTo: true };
}>;
type EmployeeRow = Prisma.EmployeeGetPayload<{}>;

const ASSET_TYPES = ["LAPTOP", "MONITOR", "PHONE", "LICENSE", "OTHER"];

export default async function AssetsPage() {
  const [assets, employees] = await Promise.all([
    prisma.asset.findMany({
      include: { assignedTo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employee.findMany({
      where: { status: { in: ["ONBOARDING", "ACTIVE"] } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="max-w-content px-6 py-10 md:px-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Assets
      </h1>
      <p className="mt-1 text-sm text-muted">
        {assets.length} total — laptops, monitors, phones, and licenses.
      </p>

      <form
        action={createAsset}
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface p-5"
      >
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="name" className="text-xs text-muted">
            Asset name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Dell Latitude 5440"
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div className="min-w-[140px]">
          <label htmlFor="type" className="text-xs text-muted">
            Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            {ASSET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px]">
          <label htmlFor="serialNumber" className="text-xs text-muted">
            Serial number
          </label>
          <input
            id="serialNumber"
            name="serialNumber"
            placeholder="optional"
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          Add asset
        </button>
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assigned to</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset: AssetWithEmployee) => (
              <tr key={asset.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="text-ink">{asset.name}</p>
                  {asset.serialNumber && (
                    <p className="font-mono text-xs text-muted">
                      {asset.serialNumber}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted capitalize">
                  {asset.type.toLowerCase()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={asset.status} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {asset.assignedTo ? asset.assignedTo.name : "—"}
                </td>
                <td className="px-4 py-3">
                  {asset.status === "ASSIGNED" ? (
                    <form
                      action={unassignAsset.bind(
                        null,
                        asset.id,
                        asset.employeeId ?? ""
                      )}
                    >
                      <button
                        type="submit"
                        className="text-xs text-muted transition-colors hover:text-status-offboarding"
                      >
                        Unassign
                      </button>
                    </form>
                  ) : asset.status === "AVAILABLE" ? (
                    <form
                      action={async (formData: FormData) => {
                        "use server";
                        const employeeId = String(formData.get("employeeId"));
                        await assignAsset(asset.id, employeeId);
                      }}
                      className="flex items-center gap-2"
                    >
                      <select
                        name="employeeId"
                        required
                        className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink outline-none focus:border-accent"
                      >
                        <option value="">Assign to…</option>
                        {employees.map((employee: EmployeeRow) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-xs font-medium text-accent hover:text-accent-dark"
                      >
                        Assign
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs text-muted">Retired</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
