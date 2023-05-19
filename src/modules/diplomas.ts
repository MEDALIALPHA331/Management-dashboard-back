import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import prisma from "../utils/prisma";

//* diplomas.route: api/diplomas
async function diplomaRoutes(server: FastifyInstance) {
    server.post("/", registerDiplomaHandler);
}
export default diplomaRoutes;

//* diploma.controller
async function registerDiplomaHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    //...
}

//* diploma.service
export async function createDiploma(input: createDiplomaInput) {
    const diploma = await prisma.diploma.create({
        data: input,
    });
    //...
}

//* diploma.schema
const createDiplomaSchema = z.object({
    name: z
        .string({
            required_error: "libellé de diplome est obligatoire",
            invalid_type_error: "libellé est de type chaine de charactére",
        })
        .min(4)
        .max(32),
    source: z.string().optional().nullable(),
    graduation_year: z.string().min(4).max(4).optional().nullable(),
});

type createDiplomaInput = z.infer<typeof createDiplomaSchema>;
