import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
    createReference,
    deleteRefById,
    getAllRefs,
    getRefById,
    updateRefById,
} from "./references.service";

import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { createReferenceInput } from "./references.schema";
export default async function referencesRoutes(server: FastifyInstance) {
    server.get("/", getAllReferencesHandler);
    server.get("/:refId", getOneReferenceHandler);
    server.post("/", registerReferenceHandler);
    server.delete("/:refId", deleteOneRefHandler);
    server.put("/:refId", updateRefHandler);
    //  server.get(
    //      "/byname",
    //      {
    //          schema: {
    //              querystring: {
    //                  type: "object",
    //                  properties: {
    //                      firstname: { type: "string" },
    //                      lastname: { type: "string" },
    //                  },
    //                  required: ["firstname", "lastname"],
    //              },
    //          },
    //      },
    //      getProfileByNameHandler
    //  );
}

async function registerReferenceHandler(
    request: FastifyRequest<{
        Body: createReferenceInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const ref = await createReference(body)
            .catch((error) => {
                console.error("Error creating reference:", error);
            })
            .finally(() => {
                prisma.$disconnect();
            });

        return reply.code(201).send(ref);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllReferencesHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const refs = await getAllRefs();
        return reply.code(200).send(refs);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneReferenceHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { refId } = request.params as { refId: string };

    try {
        const profile = await getRefById(Number(refId));

        if (profile) {
            reply.code(200).send(profile);
        } else {
            reply.code(404).send(`Reference WITH ID ${refId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

/*

async function getProfileByNameHandler(
    request: FastifyRequest<{
        Querystring: { firstname: string; lastname: string };
    }>,
    reply: FastifyReply
) {
    const firstname = request.query.firstname;
    const lastname = request.query.lastname;

    try {
        const profile = await getProfileByName(firstname, lastname);
        if (!profile) {
            reply
                .code(404)
                .send(`Profile ${firstname + " " + lastname} Not Found`);
        }
        reply.code(200).send(profile);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            //TODO
        }
        reply.code(500).send(e);
    }
}
*/

async function deleteOneRefHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { refId } = request.params as { refId: string };

    try {
        const deletedProfile = await deleteRefById(Number(refId));
        reply.code(200).send(deletedProfile);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Profile with id ${refId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

//! buggy
async function updateRefHandler(
    request: FastifyRequest<{ Body: createReferenceInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { refId } = request.params as { refId: string };

    try {
        const updatedProfile = await updateRefById(Number(refId), body);

        reply.code(200).send(updatedProfile);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Profile with id ${refId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}
