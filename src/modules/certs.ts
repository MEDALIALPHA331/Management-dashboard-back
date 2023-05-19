import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import prisma from "../utils/prisma";

export default async function certRoutes(server: FastifyInstance) {
    server.post("/", createCertHandler);
}

async function createCertHandler(
    request: FastifyRequest<{
        Body: CreateCertInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    const cert = await createCert(body);

    try {
        reply.code(201).send(cert);
    } catch (e) {
        console.error(e);
        reply.code(500).send(e);
    }
}

async function createCert(input: CreateCertInput) {
    const cert = await prisma.cert.create({
        data: input,
        include: {
            profile: true,
        },
    });

    return cert;
}

const createCertSchema = z.object({
    name: z.string(),
    completion_year: z.date().optional().nullable(),
});

type CreateCertInput = z.infer<typeof createCertSchema>;
