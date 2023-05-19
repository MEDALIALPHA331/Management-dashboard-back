import prisma from "../../utils/prisma";
import { CreateProjectInput } from "./projects.schema";

export async function createProfile(input: CreateProjectInput) {
    const { profiles, tool_list, ...rest } = input;

    const newProject = prisma.project.create({
        data: rest,
    });

    //TODO: CONNECT Project with Profiles & tools arrays above
    // prisma.$connect

    return newProject;
}

export async function getAllProfiles() {
    return prisma.project.findMany({
        include: {
            tools_list: true,
            profile: true,
        },
    });
}

export async function getProfileById(id: number) {
    return prisma.project.findFirst({
        where: {
            id,
        },
    });
}

export async function updateProfileById(id: number, input: CreateProjectInput) {
    const { profiles, tool_list, ...rest } = input;
    return prisma.project.update({
        data: rest,
        where: {
            id,
        },
    });
}

export async function deleteProfileById(id: number) {
    return prisma.project.delete({
        where: {
            id,
        },
    });
}
