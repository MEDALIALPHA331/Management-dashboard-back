import { NewProfile, Profile } from "../types";

export function getTemplateOne({
    certs,
    competences,
    diplomas,
    firstname,
    job_title,
    lastname,
    references,
}: Profile) {
    const cv_template = `<html>
    <head>
        <style>
            body {
                font-family: "Poppins", sans-serif;
            }

            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid orangered;
                color: rgb(41, 41, 107);
            }

            .title {
                padding: 10px;
                background-color: orangered;
                color: white;
            }

            .diploma {
                padding-bottom: 20px;
                border-bottom: 2px solid orangered;
            }
            .titre {
                font-weight: bold;
                color: rgb(51, 51, 135);
            }
            .section {
                padding: 20px 0;
                border-bottom: 2px solid orangered;
            }
            .ref {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .taches {
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <header class="">
            <h3>
                CV
                <span>${firstname}</span>
                <span>${lastname}</span>
            </h3>
            <div>
                <!-- <img src="./logo.png" alt="" /> -->
                logo
            </div>
        </header>
        <h2 class="title">
            Profil:
            <span>${job_title}</span>
        </h2>
        <div class="diploma">
            <span class="titre">Diplomes:</span>
            <div class="">
                ${diplomas
                    .map(
                        ({ graduation_year, nom_diplome, source_diplome }) =>
                            `✔️
                <span>${graduation_year}</span>:
                <span>${nom_diplome}</span>
                <span>${source_diplome}</span>`
                    )
                    .join("")}
            </div>
        </div>
        <div class="section">
            <span class="titre">Expérience proffissionel: </span>
            <span>${20}ans</span>
        </div>


        <div class="section">
            <span class="titre">Formations et Cerifications: </span>
            <div>
                ${certs
                    .map(
                        ({ completion_year, nom_certification }) =>
                            `
                ✔️
                <span>${completion_year}</span>:
                <span>${nom_certification}</span>`
                    )
                    .join("")}
            </div>
        </div>

        <div class="section">
            <span class="titre">Résumé des principales compétences : </span>
            <div>
             ${competences
                 .map(
                     ({ list_outils, nom_competence }) =>
                         `   
                ✔️
                <span>${nom_competence}: </span>
                <!-- map -->
                <span>${list_outils.map((outil) => `${outil}`).join("")}</span>`
                 )
                 .join("")}
            </div>
        </div>

        <h2 class="title">Résumé des principales références</h2>
        <p class="">
            Seules les références significatives sont mentionnées dans ce
            récapitulatif.
        </p>

          ${references
              .map(
                  ({
                      client,
                      end_date,
                      post,
                      start_date,
                      tasks,
                      project_name,
                  }) =>
                      `
                    <div class="section">
            <h3 class="mini_header">
                ${start_date}-${end_date}: ${project_name}
            </h3>

            <div class="ref">
                <div>
                    <span class="titre">Poste: </span>
                    <span>${post}</span>
                </div>
                <div>
                    <span class="titre">Client: </span>
                    <span>${client}</span>
                </div>
            </div>
            <div class="taches">
                <div>
                    
                  ${tasks
                      .map(
                          ({ desc_tache, nom_tache }) => `
      ✔️
      <span>${nom_tache}: </span>
      <span>${desc_tache}</span>
      `
                      )
                      .join("")}
                </div>
            </div>
        </div>`
              )
              .join("")}
    </body>
</html>
`;

    return cv_template;
}

export function getTemplateTwo(profileData: NewProfile) {
    const {
        about,
        email,
        firstname,
        lastname,
        job_title,
        phone_number,
        years_of_experience,
        ...rest
    } = profileData;

    const { certs, competences, formations, diplomas, languages, references } =
        rest;

    const cv_template = `<html>
    <head>
        <style>
            body {
                font-family: "Poppins", sans-serif;
            }

            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid orangered;
                color: rgb(41, 41, 107);
            }

            .title {
                padding: 10px;
                background-color: orangered;
                color: white;
            }

            .diploma {
                padding-bottom: 20px;
                border-bottom: 2px solid orangered;
            }
            .titre {
                font-weight: bold;
                color: rgb(51, 51, 135);
            }
            .section {
                padding: 20px 0;
                border-bottom: 2px solid orangered;
            }
            .ref {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .taches {
                margin-top: 15px;
            }
            .list {
                display: flex; 
                flex-direction: column; 
                justify-content: center;
                gap: 10px; 
            }
        </style>
    </head>
    <body>
        <header class="">
            <h3>
                CV
                <span>${firstname}</span>
                <span>${lastname}</span>
            </h3>
            <div>
                <!-- <img src="./logo.png" alt="" /> -->
                logo
            </div>
        </header>
        <h2 class="title">
            Profil:
            <span>${job_title}</span>
        </h2>
        <div class="diploma">
            <span class="titre">Diplomes:</span>
            <div class="list">
                ${diplomas
                    .map(
                        ({ graduation_year, name, source }) =>
                            `<div>✔️
                <span>${new Date(graduation_year).toLocaleDateString()}</span>:
                <span>${name}</span>
                <span>${source}</span>
                </div>
                `
                    )
                    .join("")}
            </div>
        </div>
        <div class="section">
            <span class="titre">Expérience proffissionel: </span>
            <span>${years_of_experience}ans</span>
        </div>


        <div class="section">
            <span class="titre">Formations et Cerifications: </span>
            <div class="list">
                ${certs
                    .map(
                        ({ completion_year, name }) =>
                            `<div>
                ✔️
                <span>${new Date(completion_year).toLocaleDateString()}</span>:
                <span>${name}</span></div>`
                    )
                    .join("")}
            </div>
        </div>

        <div class="section">
            <span class="titre">Résumé des principales compétences : </span>
            <div class="list">
             ${competences
                 .map(
                     ({ level, competence_name }) =>
                         `<div>
                ✔️
                <span>${competence_name}: </span>
                <span>${level}/5</span></div>`
                 )
                 .join("")}
            </div>
        </div>

        
        <div class="section">
            <span class="titre">Language : </span>
            <div class="list">
             ${languages
                 .map(
                     (language) =>
                         `<div> 
                ✔️
                <span>${language}</span></div>`
                 )
                 .join("")}
            </div>
        </div>

        <h2 class="title">Résumé des principales références</h2>
        <p class="">
            Seules les références significatives sont mentionnées dans ce
            récapitulatif.
        </p>

          ${references
              .map(
                  ({ client, end_date, start_date, project: { name } }) =>
                      `
                    <div class="section">
            <h3 class="mini_header">
                ${new Date(start_date).toLocaleDateString()}-${new Date(
                          end_date
                      ).toLocaleDateString()}: ${name}
            </h3>

            <div class="ref">
                <div>
                    <span class="titre">Poste: </span>
                    <span>${"N/A"}</span>
                </div>
                <div>
                    <span class="titre">Client: </span>
                    <span>${client}</span>
                </div>
            </div>
        </div>`
              )
              .join("")}
    </body>
</html>
`;

    return cv_template;
}
