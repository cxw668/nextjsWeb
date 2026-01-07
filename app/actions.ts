'use server'

import { db } from "@/server/db/db";
import { Users } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name) {
    return { error: "Name is required" };
  }

  try {
    await db.insert(Users).values({
      name,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add user:", error);
    return { error: "Failed to create user" };
  }
}
