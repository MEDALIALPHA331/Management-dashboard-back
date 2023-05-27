import { z } from "zod";
import { createProfileSchema } from "../profiles/profiles.schema";

export const createProjectSchema = z.object({
    name: z.string().min(1), //? libellé projet
    tool_list: z
        .array(
            //TODO: replace it by createToolSchema
            z.object({
                name: z.string().min(4).max(32),
            })
        )
        .optional()
        .nullable(),
    profiles: z.array(createProfileSchema).optional().nullable(),
});
export const createProjectResponseSchema = z.object({
    id: z.number(),
    name: z.string().min(1), //? libellé projet
    tool_list: z
        .array(
            //TODO: replace it by createToolSchema
            z.object({
                name: z.string().min(4).max(32),
            })
        )
        .optional()
        .nullable(),
    profiles: z.array(createProfileSchema).optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
