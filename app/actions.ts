'use server'

import { db } from "@/server/db/db";
import { Users } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name) {
    return { error: "Name is required" };
  }

  const hobby = formData.get("hobby") as string;

  try {
    await db.insert(Users).values({
      name,
      hobby,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add user:", error);
    return { error: "Failed to create user" };
  }
}

export async function updateUser(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const hobby = formData.get("hobby") as string;

  if (!name) {
    return { error: "Name is required" };
  }

  try {
    await db.update(Users)
      .set({ name, hobby })
      .where(eq(Users.id, id));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(id: number) {
  try {
    await db.delete(Users).where(eq(Users.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user" };
  }
}
