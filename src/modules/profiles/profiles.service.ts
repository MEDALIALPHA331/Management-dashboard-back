import prisma from "../../utils/prisma";
import { CreateProfileInput } from "./profiles.schema";

export async function createProfile(input: CreateProfileInput) {
    const {
        competences,
        email,
        firstname,
        job_title,
        lastname,
        years_of_experience,
        phone_number,
    } = input;

    const newProfile = await prisma.profile.create({
        data: {
            firstname,
            lastname,
            email,
            job_title,
            years_of_experience,
            phone_number,
            competences: {
                create: competences.map((competence) => ({
                    level: competence.level,
                    competenceId: competence.competence.id,
                })),
            },
        },
    });

    return newProfile;
}

export async function getAllProfiles() {
    return await prisma.profile.findMany({
        take: 100,
        include: {
            references: true,
            competences: {
                take: 100,
                include: {
                    competence: true,
                },
            },
            _count: true,
        },
    });
}

export async function getProfileById(id: number) {
    return await prisma.profile.findFirst({
        where: {
            id,
        },
        include: {
            references: true,
            competences: {
                take: 100,
                include: {
                    competence: true,
                },
            },
            _count: true,
        },
    });
}

export async function getProfileByName(firstname: string, lastname: string) {
    return await prisma.profile.findFirst({
        where: {
            firstname,
            lastname,
        },
        include: {
            references: true,
            competences: true,
        },
    });
}

export async function updateProfileById(id: number, input: CreateProfileInput) {
    const { competences, ...rest } = input;

    // async function findRelatedCompetences() {
    //     const profile = await prisma.profile.findFirst({
    //         where: {
    //             id,
    //         },
    //         include: {
    //             competences: true,
    //         },
    //     });

    //     if (!profile) {
    //         console.log("Profile not found");
    //         return;
    //     }

    //     return profile.competences.map((competence) => competence.id);
    // }

    return await prisma.profile.update({
        data: {
            ...rest,
            //? shoud be update instead, this is cost a lot! many db queyries
            competences: {
                deleteMany: {},

                create: competences.map((competence) => ({
                    level: competence.level,
                    competenceId: competence.competence.id,
                })),
            },
        },

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
