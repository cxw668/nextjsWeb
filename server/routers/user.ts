import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../db/db';
import { user as userSchema } from '../db/schema';
import { userSchema as userValidation } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export const userRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(userSchema);
  }),
  add: publicProcedure
    .input(userValidation)
    .mutation(async ({ input }) => {
      const [newUser] = await db.insert(userSchema).values(input).returning();
      return newUser;
    }),
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: userValidation
    }))
    .mutation(async ({ input }) => {
      const [updatedUser] = await db
        .update(userSchema)
        .set(input.data)
        .where(eq(userSchema.id, input.id))
        .returning();
      return updatedUser;
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.delete(userSchema).where(eq(userSchema.id, input));
      return { success: true };
    }),
});
