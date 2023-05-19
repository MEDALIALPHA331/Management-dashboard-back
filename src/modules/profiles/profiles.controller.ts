import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateProfileInput } from "./profiles.schema";

import {
    createProfile,
    deleteProfileById,
    getAllProfiles,
    getProfileById,
    updateProfileById,
} from "./profiles.service";

export default async function profileRoutes(server: FastifyInstance) {
    server.get("/", getAllProfilesHandler);
    server.get("/:profileId", getOneProfileHandler);
    server.post("/", registerProfileHandler);
    server.delete("/:profileId", deleteOneProfileHandler);
    server.put("/:profileId", updateProfileHandler);
}

async function registerProfileHandler(
    request: FastifyRequest<{
        Body: CreateProfileInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const profile = await createProfile(body);
        return reply.code(201).send(profile);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllProfilesHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const profiles = await getAllProfiles();
        return reply.code(200).send(profiles);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneProfileHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { profileId } = request.params as { profileId: string };

    try {
        const profile = await getProfileById(Number(profileId));

        if (profile) {
            reply.code(200).send(profile);
        } else {
            reply.code(404).send(`Profile WITH ID ${profileId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneProfileHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { profileId } = request.params as { profileId: string };

    try {
        const deletedProfile = await deleteProfileById(Number(profileId));
        reply.code(204).send(deletedProfile);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Profile with id ${profileId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function updateProfileHandler(
    request: FastifyRequest<{ Body: CreateProfileInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { profileId } = request.params as { profileId: string };

    try {
        const updatedProfile = await updateProfileById(Number(profileId), body);

        reply.code(200).send(updatedProfile);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Profile with id ${profileId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}
