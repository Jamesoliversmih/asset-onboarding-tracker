"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ONBOARDING_TASKS, OFFBOARDING_TASKS } from "@/lib/tasks";

export async function createEmployee(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();

  if (!name || !email || !role || !department) {
    throw new Error("All fields are required.");
  }

  const employee = await prisma.employee.create({
    data: {
      name,
      email,
      role,
      department,
      status: "ONBOARDING",
      tasks: {
        create: ONBOARDING_TASKS.map((label) => ({
          label,
          phase: "ONBOARDING",
        })),
      },
    },
  });

  revalidatePath("/employees");
  revalidatePath("/");
  redirect(`/employees/${employee.id}`);
}

export async function toggleTask(taskId: string, employeeId: string) {
  const task = await prisma.task.findUniqueOrThrow({ where: { id: taskId } });
  await prisma.task.update({
    where: { id: taskId },
    data: { done: !task.done },
  });
  revalidatePath(`/employees/${employeeId}`);
}

export async function startOffboarding(employeeId: string) {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: "OFFBOARDING" },
  });

  const existing = await prisma.task.findMany({
    where: { employeeId, phase: "OFFBOARDING" },
  });

  if (existing.length === 0) {
    await prisma.task.createMany({
      data: OFFBOARDING_TASKS.map((label) => ({
        label,
        phase: "OFFBOARDING" as const,
        employeeId,
      })),
    });
  }

  revalidatePath(`/employees/${employeeId}`);
  revalidatePath("/employees");
  revalidatePath("/");
}

export async function completeOffboarding(employeeId: string) {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: "OFFBOARDED" },
  });
  await prisma.asset.updateMany({
    where: { employeeId },
    data: { employeeId: null, status: "AVAILABLE" },
  });
  revalidatePath(`/employees/${employeeId}`);
  revalidatePath("/employees");
  revalidatePath("/assets");
  revalidatePath("/");
}

export async function activateEmployee(employeeId: string) {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: "ACTIVE" },
  });
  revalidatePath(`/employees/${employeeId}`);
  revalidatePath("/employees");
  revalidatePath("/");
}

export async function createAsset(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "OTHER");
  const serialNumber = String(formData.get("serialNumber") ?? "").trim();

  if (!name) throw new Error("Asset name is required.");

  await prisma.asset.create({
    data: {
      name,
      type: type as never,
      serialNumber: serialNumber || null,
      status: "AVAILABLE",
    },
  });

  revalidatePath("/assets");
}

export async function assignAsset(assetId: string, employeeId: string) {
  if (!employeeId) return;
  await prisma.asset.update({
    where: { id: assetId },
    data: { employeeId, status: "ASSIGNED" },
  });
  revalidatePath("/assets");
  revalidatePath(`/employees/${employeeId}`);
}

export async function unassignAsset(assetId: string, employeeId: string) {
  await prisma.asset.update({
    where: { id: assetId },
    data: { employeeId: null, status: "AVAILABLE" },
  });
  revalidatePath("/assets");
  if (employeeId) revalidatePath(`/employees/${employeeId}`);
}
