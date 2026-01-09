'use server'

import { db } from "@/server/db/db";
import { user } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function addUser(formData: FormData): Promise<ActionResponse> {
  const name = formData.get("name") as string;
  const hobby = formData.get("hobby") as string;
  
  if (!name || name.trim() === "") {
    return { success: false, error: "Name is required" };
  }

  try {
    await db.insert(user).values({
      name,
      hobby,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, formData: FormData): Promise<ActionResponse> {
  const name = formData.get("name") as string;
  const hobby = formData.get("hobby") as string;

  if (!name || name.trim() === "") {
    return { success: false, error: "Name is required" };
  }

  try {
    await db.update(user)
      .set({ name, hobby })
      .where(eq(user.id, id));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    await db.delete(user).where(eq(user.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
