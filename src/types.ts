export interface Profile {
    firstname: string;
    lastname: string;
    job_title: string;

    languages: Language[];
    competences: Competence[];
    certs: Cert[];
    diplomas: Diploma[];
    references: Reference[];
}

export interface Competence {
    nom_competence: string;
    list_outils: any[];
}

export interface Cert {
    nom_certification: string;
    completion_year: number;
}

export interface Diploma {
    nom_diplome: string;
    graduation_year: number;
    source_diplome: string;
}

export interface Language {
    name: string;
    level: string;
}

export interface Reference {
    project_name: string;
    client: string;
    end_date: number;
    start_date: number;
    post: string;
    tasks: any[];
}

// -------------

export type NewProfile = {
    firstname: string;
    lastname: string;
    job_title: string;
    email: string;
    years_of_experience: number;

    phone_number: string | null | undefined;
    about: string | null | undefined;

    languages: string[];
    competences: ProfileCompetence[];

    formations: NewBootcamp[];
    certs: NewCert[];
    diplomas: NewDiploma[];
    references: NewReference[];
};

export interface ProfileCompetence {
    level: number;
    competence_name: string;
}

export interface NewCert {
    name: string;
    completion_year: number;
}

export interface NewDiploma {
    name: string;
    graduation_year: number;
    source: string;
}

export interface NewBootcamp {
    name: string;
    source: string;
}

//?
export interface NewReference {
    project: Project;
    client: string;
    end_date: string;
    start_date: string;
}

export interface Project {
    name: string;
}
