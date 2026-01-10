import { router } from '../trpc';
import { userRouter } from './user';
import { imageRouter } from './image';

export const appRouter = router({
  user: userRouter,
  image: imageRouter,
});

export type AppRouter = typeof appRouter;
