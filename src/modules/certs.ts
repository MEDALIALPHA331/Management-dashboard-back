import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import prisma from "../utils/prisma";

export default async function certRoutes(server: FastifyInstance) {
    server.post("/", registerCertHandler);
    server.get("/", getAllCertsHandler);
    server.get("/:certId", getOneCertHandler);
    server.delete("/:certId", deleteOneCertHandler);
    server.delete("/", deleteAllCertsHandler); //! danger
    server.put("/:certId", updateCertHandler);
}

//* controllers

async function registerCertHandler(
    request: FastifyRequest<{
        Body: CreateCertInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const cert = await createCert(body);
        reply.code(201).send(cert);
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function getAllCertsHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const allCerts = await getCerts();
        reply.code(200).send(allCerts);
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function getOneCertHandler(request: FastifyRequest, reply: FastifyReply) {
    const { certId } = request.params as { certId: string };

    try {
        const cert = await getCertById(Number(certId));
        if (cert) {
            reply.code(200).send(cert);
        } else {
            reply.code(404).send(`DIPLOMA WITH ID ${certId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneCertHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { certId } = request.params as { certId: string };

    try {
        const deletedCert = await deleteCertById(Number(certId));
        reply.code(200).send(deletedCert);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Diploma with id ${certId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function deleteAllCertsHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await deleteAllCerts();
        reply.code(200).send("All Certs are Deleted");
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function updateCertHandler(
    request: FastifyRequest<{ Body: CreateCertInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { certId } = request.params as { certId: string };

    try {
        const updatedCert = await updateCertById(Number(certId), body);

        reply.code(200).send(updatedCert);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Diploma with id ${certId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}

//* services
async function createCert(input: CreateCertInput) {
    return prisma.cert.create({
        data: input,
    });
}

async function getCerts() {
    return await prisma.cert.findMany();
}

async function getCertById(id: number) {
    return prisma.cert.findUnique({
        where: {
            id,
        },
    });
}

async function deleteCertById(id: number) {
    return await prisma.cert.delete({
        where: {
            id,
        },
    });
}

async function deleteAllCerts() {
    return await prisma.cert.deleteMany();
}

async function updateCertById(id: number, input: CreateCertInput) {
    return await prisma.cert.update({
        data: input,
        where: {
            id,
        },
    });
}

//* schemas
const createCertSchema = z.object({
    name: z.string(),
    completion_year: z.date().optional().nullable(),
});

type CreateCertInput = z.infer<typeof createCertSchema>;
