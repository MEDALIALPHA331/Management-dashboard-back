export interface Profile {
    firstname: string;
    lastname: string;
    competences: Competence[];
    certs: Cert[];
    diplomas: Diploma[];
    job_title: string;
    languages: Language[];
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
