import { PrismaClient } from "@prisma/client";
import { ONBOARDING_TASKS, OFFBOARDING_TASKS } from "../lib/tasks";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.employee.deleteMany();

  const maria = await prisma.employee.create({
    data: {
      name: "Maria Santos",
      email: "maria.santos@company.com",
      role: "Marketing Associate",
      department: "Marketing",
      status: "ONBOARDING",
      tasks: {
        create: ONBOARDING_TASKS.map((label, i) => ({
          label,
          phase: "ONBOARDING",
          done: i < 2,
        })),
      },
    },
  });

  const daniel = await prisma.employee.create({
    data: {
      name: "Daniel Cruz",
      email: "daniel.cruz@company.com",
      role: "Backend Engineer",
      department: "Engineering",
      status: "ACTIVE",
      tasks: {
        create: ONBOARDING_TASKS.map((label) => ({
          label,
          phase: "ONBOARDING",
          done: true,
        })),
      },
    },
  });

  const jasmine = await prisma.employee.create({
    data: {
      name: "Jasmine Reyes",
      email: "jasmine.reyes@company.com",
      role: "Support Specialist",
      department: "Customer Support",
      status: "OFFBOARDING",
      tasks: {
        create: [
          ...ONBOARDING_TASKS.map((label) => ({
            label,
            phase: "ONBOARDING" as const,
            done: true,
          })),
          ...OFFBOARDING_TASKS.map((label, i) => ({
            label,
            phase: "OFFBOARDING" as const,
            done: i < 1,
          })),
        ],
      },
    },
  });

  const paolo = await prisma.employee.create({
    data: {
      name: "Paolo Mendoza",
      email: "paolo.mendoza@company.com",
      role: "Sales Representative",
      department: "Sales",
      status: "OFFBOARDED",
      tasks: {
        create: [
          ...ONBOARDING_TASKS.map((label) => ({
            label,
            phase: "ONBOARDING" as const,
            done: true,
          })),
          ...OFFBOARDING_TASKS.map((label) => ({
            label,
            phase: "OFFBOARDING" as const,
            done: true,
          })),
        ],
      },
    },
  });

  await prisma.asset.createMany({
    data: [
      { name: "Dell Latitude 5440", type: "LAPTOP", serialNumber: "DL5440-1029", status: "ASSIGNED", employeeId: daniel.id },
      { name: "Microsoft 365 Business Standard", type: "LICENSE", status: "ASSIGNED", employeeId: daniel.id },
      { name: "MacBook Air M3", type: "LAPTOP", serialNumber: "MBA-3391", status: "ASSIGNED", employeeId: maria.id },
      { name: "Dell UltraSharp 27\"", type: "MONITOR", serialNumber: "DU27-7712", status: "ASSIGNED", employeeId: jasmine.id },
      { name: "iPhone 14", type: "PHONE", serialNumber: "IP14-5583", status: "AVAILABLE" },
      { name: "Google Workspace Business Plus", type: "LICENSE", status: "RETIRED", employeeId: paolo.id },
      { name: "Lenovo ThinkPad T14", type: "LAPTOP", serialNumber: "TP14-4420", status: "AVAILABLE" },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
