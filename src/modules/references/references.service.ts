import prisma from "../../utils/prisma";
import { createReferenceInput } from "./references.schema";

export async function createReference(input: createReferenceInput) {
    const { client, start_date, end_date, project, team } = input;

    const connectedProject = await prisma.project.findUnique({
        where: { id: project.id },
    });

    const connectedProfiles = await prisma.profile.findMany({
        where: { id: { in: team.map((profile) => profile.id) } },
    });

    const reference = await prisma.reference.create({
        data: {
            client: client,
            start_date: start_date,
            end_date: end_date,
            projectId: connectedProject?.id!, //? potential null
            team: {
                connect: connectedProfiles.map((profile) => ({
                    id: profile.id,
                })),
            },
        },
    });

    return reference;
}

export async function getAllRefs() {
    return await prisma.reference.findMany({
        include: {
            project: true,
            team: true,
            _count: true,
        },
    });
}

export async function getRefById(id: number) {
    return await prisma.reference.findFirst({
        where: {
            id,
        },
        include: {
            project: true,
            team: true,
            _count: true,
        },
    });
}

/*

export async function getProfileByName(firstname: string, lastname: string) {
    return await prisma.profile.findFirst({
        where: {
            firstname,
            lastname,
        },
    });
}

*/

//! untested
export async function updateRefById(id: number, input: createReferenceInput) {
    const { client, start_date, end_date, project, team } = input;

    const connectedProject = await prisma.project.findUnique({
        where: { id: project.id },
    });

    const connectedProfiles = await prisma.profile.findMany({
        where: { id: { in: team.map((profile) => profile.id) } },
    });

    return await prisma.reference.update({
        data: {
            client: client,
            start_date: start_date,
            end_date: end_date,
            projectId: connectedProject?.id!, //? potential null
            team: {
                connect: connectedProfiles.map((profile) => ({
                    id: profile.id,
                })),
            },
        },
        where: {
            id,
        },
    });
}

export async function deleteRefById(id: number) {
    return await prisma.reference.delete({
        where: {
            id,
        },
    });
}
