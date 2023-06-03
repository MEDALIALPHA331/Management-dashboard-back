import prisma from "../../utils/prisma";
import { CreateProjectInput } from "./projects.schema";

export async function createProfile(input: CreateProjectInput) {
    const { profiles, tool_list, ...rest } = input;

    const newProject = await prisma.project.create({
        data: rest,
    });

    //TODO: CONNECT Project with Profiles & tools arrays above
    // prisma.$connect

    return newProject;
}

export async function getAllProfiles() {
    return await prisma.project.findMany({
        take: 100,
        include: {
            tools_list: true,
            references: true,
            _count: true,
        },
    });
}

export async function getProfileById(id: number) {
    return await prisma.project.findFirst({
        where: {
            id,
        },
    });
}

export async function updateProfileById(id: number, input: CreateProjectInput) {
    const { profiles, tool_list, ...rest } = input;
    return await prisma.project.update({
        data: rest,
        where: {
            id,
        },
    });
}

export async function deleteProfileById(id: number) {
    return await prisma.project.delete({
        where: {
            id,
        },
    });
}
