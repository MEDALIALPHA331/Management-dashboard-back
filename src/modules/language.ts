import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import prisma from "../utils/prisma";
/**
 *
 * @see This thing should not be in db
 */

//* language.route: api/languages
export default async function languageRoutes(server: FastifyInstance) {
    server.get("/", getAllLanguagesHandler);
    server.get("/:langId", getOneLanguageHandler);
    server.post("/", registerLanguageHandler);
    server.delete("/:langId", deleteOneLanguageHandler);
    server.delete("/", deleteAllLanguagesHandler); //! danger
    server.put("/:langId", updateLanguageHandler);
}

/* -------------------------- */

//* language.controller
async function registerLanguageHandler(
    request: FastifyRequest<{
        Body: createLanguageInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const lang = await createLanguage(body);
        return reply.code(201).send(lang);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllLanguagesHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const langs = await getAllLangs();
        return reply.code(200).send(langs);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneLanguageHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { langId } = request.params as { langId: string };

    try {
        const bootcamp = await getBootcampById(Number(langId));

        if (bootcamp) {
            reply.code(200).send(bootcamp);
        } else {
            reply.code(404).send(`Language WITH ID ${langId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneLanguageHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { langId } = request.params as { langId: string };

    try {
        const deletedLanguage = await deleteLanguageById(Number(langId));
        reply.code(204).send(deletedLanguage);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Bootcamp with id ${langId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function deleteAllLanguagesHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await deleteAllLangs();
        reply.code(200).send("Tous Languages sont supprimer");
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function updateLanguageHandler(
    request: FastifyRequest<{ Body: createLanguageInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { langId } = request.params as { langId: string };

    try {
        const updatedLangyage = await updateLanguageById(Number(langId), body);

        reply.code(200).send(updatedLangyage);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Lang with id ${langId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}

/* -------------------------- */
//* language.service
async function createLanguage(input: createLanguageInput) {
    const lang = await prisma.language.create({
        data: input,
    });

    return lang;
}

async function getAllLangs() {
    const langs = await prisma.language.findMany();

    return langs;
}

async function getBootcampById(id: number) {
    const lang = prisma.language.findUnique({
        where: {
            id,
        },
    });

    return lang;
}

async function deleteLanguageById(id: number) {
    const deletedLang = await prisma.language.delete({
        where: {
            id,
        },
    });

    return deletedLang;
}

async function deleteAllLangs() {
    //* batch
    const allDeletedLangs = await prisma.language.deleteMany();
    return;
}

async function updateLanguageById(id: number, input: createLanguageInput) {
    const updatedLanguage = await prisma.language.update({
        data: input,
        where: {
            id,
        },
    });

    return updatedLanguage;
}

/* -------------------------- */

//* language.schema
const createLanguageSchemas = z.object({
    name: z
        .string({
            required_error: "libellé de formation est obligatoire",
            invalid_type_error: "libellé est de type chaine de charactére",
        })
        .min(4)
        .max(32),
});

export const { schemas: LangSchemas, $ref } = buildJsonSchemas({
    createLanguageSchemas,
});

type createLanguageInput = z.infer<typeof createLanguageSchemas>;
