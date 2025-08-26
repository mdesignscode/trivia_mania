import { z } from 'zod';

export const CategoryStatSchema = z.object({
        category: z.string(),

        total: z.number().default(0),
        totalCorrect: z.number().default(0),

        totalEasy: z.number().default(0),
        totalEasyCorrect: z.number().default(0),

        totalMedium: z.number().default(0),
        totalMediumCorrect: z.number().default(0),

        totalHard: z.number().default(0),
        totalHardCorrect: z.number().default(0),
});

export const NewStatsSchema = z.record(z.string(), CategoryStatSchema);

export type TNewStatsInput = z.infer<typeof CategoryStatSchema>;

