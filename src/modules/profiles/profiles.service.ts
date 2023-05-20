import prisma from "../../utils/prisma";
import { CreateProfileInput } from "./profiles.schema";

export async function createProfile(input: CreateProfileInput) {
    const { competences, ...rest } = input;

    /*
    const competenceIncluded = competences?.map(async (competence) => {
         const comp = await prisma.competence.upsert({
            create: { 
                name: competence.name,
            },
        });
    });
    */

    const newProfile = await prisma.profile.create({
        data: rest,
    });

    //TODO: CONNECT OR CREATE and connect Profile with Competences array above
    // prisma.$connect

    return newProfile;
}

export async function getAllProfiles() {
    return await prisma.profile.findMany({
        //? whatever
        include: {
            projects: true,
            competences: true,
        },
    });
}

export async function getProfileById(id: number) {
    return await prisma.profile.findFirst({
        where: {
            id,
        },
    });
}

export async function updateProfileById(id: number, input: CreateProfileInput) {
    const { competences, ...rest } = input;
    return await prisma.profile.update({
        data: rest,
        where: {
            id,
        },
    });
}

export async function deleteProfileById(id: number) {
    return await prisma.profile.delete({
        where: {
            id,
        },
    });
}
