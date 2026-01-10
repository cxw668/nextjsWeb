import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../db/db';
import { imageUploads } from '../db/schema';

export const imageRouter = router({
  upload: publicProcedure
    .input(z.object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
      data: z.string(), // base64
    }))
    .mutation(async ({ input }) => {
      const [newUpload] = await db.insert(imageUploads).values({
        name: input.name,
        type: input.type,
        size: input.size,
        data: input.data,
      }).returning();
      return newUpload;
    }),
  list: publicProcedure.query(async () => {
    return await db.select().from(imageUploads).orderBy(imageUploads.createdAt);
  }),
});
