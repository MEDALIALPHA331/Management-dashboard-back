import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import prisma from "../utils/prisma";

//* diplomas.route: api/diplomas
export default async function diplomaRoutes(server: FastifyInstance) {
    server.get("/", getAllDiplomasHandler);
    server.get("/:diplomaId", getOneDiplomaHandler);
    server.post(
        "/",
        {
            schema: {
                body: $ref("createDiplomaSchema"),
                response: {
                    201: $ref("createDiplomaResponseSchema"),
                },
            },
        },
        registerDiplomaHandler
    );
    server.delete("/:diplomaId", deleteOneDiplomaHandler);
    server.delete("/", deleteAllDiplomasHandler); //! danger
    server.put("/:diplomaId", updateDiplomaHandler);
}

/* -------------------------- */

//* diploma.controller
async function registerDiplomaHandler(
    request: FastifyRequest<{
        Body: createDiplomaInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const diploma = await createDiploma(body);
        return reply.code(201).send(diploma);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllDiplomasHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const diplomas = await getAllDiplomas();
        return reply.code(200).send(diplomas);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneDiplomaHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { diplomaId } = request.params as { diplomaId: string };

    try {
        const diploma = await getDiplomaById(Number(diplomaId));
        if (diploma) {
            reply.code(200).send(diploma);
        } else {
            reply.code(404).send(`DIPLOMA WITH ID ${diplomaId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneDiplomaHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { diplomaId } = request.params as { diplomaId: string };

    try {
        const deletedDiploma = await deleteDiplomaById(Number(diplomaId));
        reply.code(200).send(deletedDiploma);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Diploma with id ${diplomaId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function deleteAllDiplomasHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await deleteAllDiplomas();
        reply.code(200).send("All Diplomas are Deleted");
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function updateDiplomaHandler(
    request: FastifyRequest<{ Body: createDiplomaInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { diplomaId } = request.params as { diplomaId: string };

    try {
        const updatedDiploma = await updateDiplomaById(Number(diplomaId), body);

        reply.code(200).send(updatedDiploma);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Diploma with id ${diplomaId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}

/* -------------------------- */
//* diploma.service
async function createDiploma(input: createDiplomaInput) {
    const diploma = await prisma.diploma.create({
        data: input,
    });

    return diploma;
}

async function getAllDiplomas() {
    const diplomas = await prisma.diploma.findMany({
        take: 100,
    });

    return diplomas;
}

async function getDiplomaById(id: number) {
    const diploma = prisma.diploma.findUnique({
        where: {
            id,
        },
    });

    return diploma;
}

async function deleteDiplomaById(id: number) {
    const deletedDiploma = await prisma.diploma.delete({
        where: {
            id,
        },
    });

    return deletedDiploma;
}

async function deleteAllDiplomas() {
    //* batch
    const allDeletedDiplomas = await prisma.diploma.deleteMany();
    return;
}

async function updateDiplomaById(id: number, input: createDiplomaInput) {
    const updatedDiploma = await prisma.diploma.update({
        data: input,
        where: {
            id,
        },
    });

    return updatedDiploma;
}

/* -------------------------- */

//* diploma.schema
const coreDiplomaSchema = {
    name: z
        .string({
            required_error: "libellé de diplome est obligatoire",
            invalid_type_error: "libellé est de type chaine de charactére",
        })
        .min(4)
        .max(32),
    source: z.string().optional().nullable(),
};

const createDiplomaSchema = z.object({
    ...coreDiplomaSchema,
    graduation_year: z.date().optional().nullable(),
});

//TODO: Bring it back later (the graduation year)
//? For Response objects, omiting graduation_year from response
const createDiplomaResponseSchema = z.object({
    id: z.number(),
    ...coreDiplomaSchema,
});

export const { schemas: diplomaSchemas, $ref } = buildJsonSchemas({
    createDiplomaSchema,
    createDiplomaResponseSchema,
});

type createDiplomaInput = z.infer<typeof createDiplomaSchema>;
