import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import prisma from "../utils/prisma";

//* diplomas.route: api/diplomas
export default async function bootcampRoutes(server: FastifyInstance) {
    server.get("/", getAllBootcampsHandler);
    server.get("/:bootcampId", getOneBootcampHandler);
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
        registerBootcampHandler
    );
    server.delete("/:bootcampId", deleteOneBootcampHandler);
    server.delete("/", deleteAllBootcampsHandler); //! danger
    server.put("/:bootcampId", updateBootcampHandler);
}

/* -------------------------- */

//* diploma.controller
async function registerBootcampHandler(
    request: FastifyRequest<{
        Body: createDiplomaInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const bootcamp = await createBootcamp(body);
        return reply.code(201).send(bootcamp);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllBootcampsHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const bootcamps = await getAllBootcamps();
        return reply.code(200).send(bootcamps);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneBootcampHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { bootcampId } = request.params as { bootcampId: string };

    try {
        const bootcamp = await getBootcampById(Number(bootcampId));

        if (bootcamp) {
            reply.code(200).send(bootcamp);
        } else {
            reply.code(404).send(`Bootcamp WITH ID ${bootcampId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneBootcampHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { bootcampId } = request.params as { bootcampId: string };

    try {
        const deletedBootcamp = await deleteBootcampById(Number(bootcampId));
        reply.code(204).send(deletedBootcamp);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Bootcamp with id ${bootcampId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function deleteAllBootcampsHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await deleteAllBootcamps();
        reply.code(200).send("Tous Formations sont supprimer");
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function updateBootcampHandler(
    request: FastifyRequest<{ Body: createDiplomaInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const {  bootcampId } = request.params as { bootcampId: string };

    try {
        const updatedDiploma = await updateBootcampById(Number(bootcampId), body);

        reply.code(200).send(updatedDiploma);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Diploma with id ${bootcampId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}

/* -------------------------- */
//* diploma.service
async function createBootcamp(input: createDiplomaInput) {
    const diploma = await prisma.diploma.create({
        data: input,
    });

    return diploma;
}

async function getAllBootcamps() {
    const diplomas = await prisma.diploma.findMany();

    return diplomas;
}

async function getBootcampById(id: number) {
    const diploma = prisma.diploma.findUnique({
        where: {
            id,
        },
    });

    return diploma;
}

async function deleteBootcampById(id: number) {
    const deletedDiploma = await prisma.diploma.delete({
        where: {
            id,
        },
    });

    return deletedDiploma;
}

async function deleteAllBootcamps() {
    //* batch
    const allDeletedDiplomas = await prisma.diploma.deleteMany();
    return;
}

async function updateBootcampById(id: number, input: createDiplomaInput) {
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
