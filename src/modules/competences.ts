import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { buildJsonSchemas } from "fastify-zod";
import { number, z } from "zod";
import prisma from "../utils/prisma";

//* competences.route: api/diplomas
export default async function competenceRoutes(server: FastifyInstance) {
    server.get("/", getAllCompetencesHandler);
    server.get("/:competenceId", getOneCompetenceHandler);
    server.post("/", registerCompetenceHandler);
    server.delete("/:competenceId", deleteOneCompetenceHandler);
    server.delete("/", deleteAllCompetencesHandler); //! danger
    server.put("/:competenceId", updateCompetenceHandler);
}

/* -------------------------- */

//* competences.controller
async function registerCompetenceHandler(
    request: FastifyRequest<{
        Body: createCompetenceInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const competence = await createCompetence(body);
        return reply.code(201).send(competence);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllCompetencesHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const competences = await getAllCompetences();
        return reply.code(200).send(competences);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneCompetenceHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { competenceId } = request.params as { competenceId: string };

    try {
        const competence = await getCompetenceById(Number(competenceId));
        if (competence) {
            reply.code(200).send(competence);
        } else {
            reply
                .code(404)
                .send(`competence WITH ID ${competenceId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneCompetenceHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { competenceId } = request.params as { competenceId: string };

    try {
        const deletedCompetence = await deleteCompetenceById(
            Number(competenceId)
        );
        reply.code(200).send(deletedCompetence);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply
                    .code(404)
                    .send(`Competence with id ${competenceId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function deleteAllCompetencesHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await deleteAllCompetences();
        reply.code(200).send("All Competences are Deleted");
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function updateCompetenceHandler(
    request: FastifyRequest<{ Body: createCompetenceInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { competenceId } = request.params as { competenceId: string };

    try {
        // console.log(body.tools_list);
        const updatedCompetence = await updateCompetenceById(
            Number(competenceId),
            body
        );

        reply.code(200).send(updatedCompetence);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply
                    .code(404)
                    .send(`Competence with id ${competenceId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}

/* -------------------------- */
//* competences.service
async function createCompetence(input: createCompetenceInput) {
    const { tools_list, ...rest } = input;
    //TODO: use the tools list, connect or create
    const competence = await prisma.competence.create({
        data: rest,
    });

    return competence;
}

async function getAllCompetences() {
    return await prisma.competence.findMany({
        include: {
            profile: true,
            tools_list: true,
        },
    });
}

async function getCompetenceById(id: number) {
    return prisma.competence.findUnique({
        where: {
            id,
        },
        include: {
            profile: true,
            tools_list: true,
        },
    });
}

async function deleteCompetenceById(id: number) {
    return await prisma.competence.delete({
        where: {
            id,
        },
    });
}

async function updateCompetenceById(id: number, input: createCompetenceInput) {
    const { tools_list, ...rest } = input;

    //TODO: use the tools list, connect or create
    return await prisma.competence.update({
        data: rest,
        where: {
            id,
        },
        include: {
            profile: true,
            tools_list: true,
        },
    });
}

async function deleteAllCompetences() {
    return await prisma.competence.deleteMany();
}

/* -------------------------- */

//* competences.schema

export const createCompetenceSchema = z.object({
    name: z.string({
        required_error: "libellé de compétence est obligatoire",
        invalid_type_error: "libellé est de type chaine de charactére",
    }),

    //TODO: replace it by createToolSchema
    tools_list: z
        .array(z.object({ name: z.string() }))
        .optional()
        .nullable(),
});

export const createCompetenceSchemaResponse = z.object({
    id: number(),
    name: z.string({
        required_error: "libellé de compétence est obligatoire",
        invalid_type_error: "libellé est de type chaine de charactére",
    }),

    //TODO: replace it by createToolSchema
    tools_list: z
        .array(z.object({ name: z.string() }))
        .optional()
        .nullable(),
});

//TODO: use it in app
export const { schemas: CompetenceSchemas, $ref } = buildJsonSchemas({
    createCompetenceSchema,
});

type createCompetenceInput = z.infer<typeof createCompetenceSchema>;
