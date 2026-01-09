'use server'

import { db } from "@/server/db/db";
import { user } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { userSchema } from "@/lib/validations";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function addUser(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name") as string,
    hobby: formData.get("hobby") as string,
  };

  const validation = userSchema.safeParse(rawData);
  
  if (!validation.success) {
    return { 
      success: false, 
      error: validation.error.issues.map((e) => e.message).join(", ")
    };
  }

  try {
    await db.insert(user).values(validation.data);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, formData: FormData): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name") as string,
    hobby: formData.get("hobby") as string,
  };

  const validation = userSchema.safeParse(rawData);

  if (!validation.success) {
    return { 
      success: false, 
      error: validation.error.issues.map((e) => e.message).join(", ")
    };
  }

  try {
    await db.update(user)
      .set(validation.data)
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
