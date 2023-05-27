import { z } from "zod";
import { createProfileResponseSchema } from "../profiles/profiles.schema";
import { createProjectResponseSchema } from "../projects/projects.schema";

// export const createTaskInput = z.object({
//     tache_label: z.string(),
//     desc_tache: z.string(),
//     // references: z.array(createReferenceInput),
// });

// export const createTeamMemberSchema = z.object({
//     profile: createProfileSchema,
//     // reference: createReferenceSchema,
//     post: z.string(),
// });

export const createReferenceSchema = z.object({
    // team: z.array(createTeamMemberSchema),
    // tasks: z.array(createTaskInput),
    client: z.string(),
    end_date: z.date(),
    start_date: z.date(),
    project: createProjectResponseSchema,
    team: z.array(createProfileResponseSchema),
});

export const createReferenceResponseSchema = z.object({
    id: z.number(),
    updatedAt: z.date(),
    createdAt: z.date(),
    client: z.string(),
    end_date: z.date(),
    start_date: z.date(),
    project: createProjectResponseSchema,
    team: z.array(createProfileResponseSchema),
});

export type createReferenceInput = z.infer<typeof createReferenceSchema>;
export type createReferenceInputResponse = z.infer<
    typeof createReferenceResponseSchema
>;
