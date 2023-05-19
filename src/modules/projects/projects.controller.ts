import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { CreateProjectInput } from "./projects.schema";
import {
    createProfile as createProject,
    deleteProfileById as deleteProjectById,
    getAllProfiles as getAllProjects,
    getProfileById,
    updateProfileById,
} from "./projects.service";

export default async function projectRoutes(server: FastifyInstance) {
    server.get("/", getAllProjectsHandler);
    server.get("/:projectId", getOneProjectHandler);
    server.post("/", registerProjectHandler);
    server.delete("/:projectId", deleteOneProjectHandler);
    server.put("/:projectId", updateProjectHandler);
}

async function registerProjectHandler(
    request: FastifyRequest<{
        Body: CreateProjectInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const project = await createProject(body);
        return reply.code(201).send(project);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getAllProjectsHandler(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const projects = await getAllProjects();
        return reply.code(200).send(projects);
    } catch (e) {
        console.error(e);
        return reply.code(500).send(e);
    }
}

async function getOneProjectHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { projectId } = request.params as { projectId: string };

    try {
        const project = await getProfileById(Number(projectId));

        if (project) {
            reply.code(200).send(project);
        } else {
            reply.code(404).send(`Project WITH ID ${projectId} NOT FOUND`);
        }
    } catch (e) {
        reply.code(500).send(e);
    }
}

async function deleteOneProjectHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { projectId } = request.params as { projectId: string };

    try {
        const deletedProject = await deleteProjectById(Number(projectId));
        reply.code(200).send(deletedProject);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Project with id ${projectId} Not Found`);
            }
        }
        reply.code(500).send(e);
    }
}

async function updateProjectHandler(
    request: FastifyRequest<{ Body: CreateProjectInput }>,
    reply: FastifyReply
) {
    const body = request.body;
    const { projectId } = request.params as { projectId: string };

    try {
        const updatedProject = await updateProfileById(Number(projectId), body);

        reply.code(200).send(updatedProject);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                reply.code(404).send(`Project with id ${projectId} Not Found`);
            }
        } else {
            reply.code(500).send(e);
        }
    }
}
