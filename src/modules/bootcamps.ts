import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import prisma from "../utils/prisma";

//* bootcamp.route: api/bootcamps
export default async function bootcampRoutes(server: FastifyInstance) {
    server.get("/", getAllBootcampsHandler);
    server.get("/:bootcampId", getOneBootcampHandler);
    server.post(
        "/",
        // {
        //     schema: {
        //         body: $ref("createBootcampSchemas"),
        //     },
        // },
        registerBootcampHandler
    );
    server.delete("/:bootcampId", deleteOneBootcampHandler);
    server.delete("/", deleteAllBootcampsHandler); //! danger
    server.put("/:bootcampId", updateBootcampHandler);
}

/* -------------------------- */

//* bootcamp.controller
async function registerBootcampHandler(
    request: FastifyRequest<{
        Body: createBootcampInput;
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
        reply.code(200).send(deletedBootcamp);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply
                    .code(404)
                    .send(`Bootcamp with id ${bootcampId} Not Found`);
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
    request: FastifyRequest<{ Body: createBootcampInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { bootcampId } = request.params as { bootcampId: string };

    try {
        const updatedDiploma = await updateBootcampById(
            Number(bootcampId),
            body
        );

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
//* bootcamp.service
async function createBootcamp(input: createBootcampInput) {
    const bootcamp = await prisma.bootcamp.create({
        data: input,
    });

    return bootcamp;
}

async function getAllBootcamps() {
    const bootcamps = await prisma.bootcamp.findMany({
        take: 100,
    });

    return bootcamps;
}

async function getBootcampById(id: number) {
    const bootcamp = prisma.bootcamp.findUnique({
        where: {
            id,
        },
    });

    return bootcamp;
}

async function deleteBootcampById(id: number) {
    const deletedBootcamp = await prisma.bootcamp.delete({
        where: {
            id,
        },
    });

    return deletedBootcamp;
}

async function deleteAllBootcamps() {
    //* batch
    const allDeletedBootcamps = await prisma.bootcamp.deleteMany();
    return;
}

async function updateBootcampById(id: number, input: createBootcampInput) {
    const updatedBootcamp = await prisma.bootcamp.update({
        data: input,
        where: {
            id,
        },
    });

    return updatedBootcamp;
}

/* -------------------------- */

//* bootcamp.schema
const createBootcampSchemas = z.object({
    name: z
        .string({
            required_error: "libellé de formation est obligatoire",
            invalid_type_error: "libellé est de type chaine de charactére",
        })
        .min(4)
        .max(32),
    source: z.string().optional().nullable(),
});

export const { schemas: bootcampSchemas, $ref } = buildJsonSchemas({
    createBootcampSchemas,
});

type createBootcampInput = z.infer<typeof createBootcampSchemas>;
