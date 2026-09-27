import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

type EmployeeRow = Prisma.EmployeeGetPayload<{}>;

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-content px-6 py-10 md:px-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Employees
          </h1>
          <p className="mt-1 text-sm text-muted">
            {employees.length} total — manage onboarding and offboarding.
          </p>
        </div>
        <Link
          href="/employees/new"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          Add employee
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee: EmployeeRow) => (
              <tr key={employee.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/employees/${employee.id}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {employee.name}
                  </Link>
                  <p className="text-xs text-muted">{employee.email}</p>
                </td>
                <td className="px-4 py-3 text-muted">{employee.role}</td>
                <td className="px-4 py-3 text-muted">{employee.department}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={employee.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
