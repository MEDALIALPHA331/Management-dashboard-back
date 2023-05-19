import { z } from "zod";

export const createProfileSchema = z.object({
    firstname: z.string().min(4).max(32),
    lastname: z.string().min(4).max(32),
    email: z.string().email(),
    years_of_experience: z.number().positive().max(60),
    job_title: z.string(), //dunno bout dat
    phone_number: z.string().optional().nullable(),
    competences: z.array(
        z.object({
            name: z.string().min(4).max(32),
            //   tools_list Tool[]
            //   profile Profile[]
        })
    ),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
