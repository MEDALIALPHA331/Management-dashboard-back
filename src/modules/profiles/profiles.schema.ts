import { z } from "zod";
import { createCompetenceSchemaResponse } from "../competences";

const createProfileCompetenceSchema = z.object({
    level: z.number().positive().min(0).max(5),
    name: z.string().optional(),
    competence: createCompetenceSchemaResponse,
});

const createProfileCompetenceResponseSchema = z.object({
    id: z.number(),
    level: z.number().positive().min(0).max(5),
    name: z.string().optional(),
    competence: createCompetenceSchemaResponse,
});

const coreProfileSchema = {
    firstname: z.string().min(4).max(32),
    lastname: z.string().min(4).max(32),
    email: z.string().email(),
    years_of_experience: z.number().positive().max(60),
    job_title: z.string(),
    phone_number: z.string().optional().nullable(),
    competences: z.array(createProfileCompetenceSchema),
};

export const createProfileSchema = z.object({ ...coreProfileSchema });

export const createProfileResponseSchema = z.object({
    ...coreProfileSchema,
    id: z.number(),
    competences: z.array(createProfileCompetenceResponseSchema),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type CreateProfileInputResponse = z.infer<
    typeof createProfileResponseSchema
>;
