import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  hobby: z.string().min(1, "Hobby is required").max(100),
});

export type UserInput = z.infer<typeof userSchema>;
