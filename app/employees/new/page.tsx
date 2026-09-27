import { createEmployee } from "@/lib/actions";

export default function NewEmployeePage() {
  return (
    <main className="max-w-content px-6 py-10 md:px-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Add employee
      </h1>
      <p className="mt-1 text-sm text-muted">
        Creates the employee record and generates a default onboarding
        checklist automatically.
      </p>

      <form
        action={createEmployee}
        className="mt-8 max-w-lg space-y-5 rounded-xl border border-line bg-surface p-6"
      >
        <div>
          <label htmlFor="name" className="text-xs text-muted">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs text-muted">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="role" className="text-xs text-muted">
            Job title
          </label>
          <input
            id="role"
            name="role"
            required
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="department" className="text-xs text-muted">
            Department
          </label>
          <input
            id="department"
            name="department"
            required
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          Create employee
        </button>
      </form>
    </main>
  );
}
