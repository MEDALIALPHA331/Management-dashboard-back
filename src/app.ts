import cors from "@fastify/cors";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

import puppeteer from "puppeteer";
import { getTemplateOne } from "./pdf/templates";
import { Profile } from "./types";

import bootcampRoutes from "./modules/bootcamps";
import certRoutes from "./modules/certs";
import diplomaRoutes, { diplomaSchemas } from "./modules/diplomas";
import languageRoutes from "./modules/language";
import profileRoutes from "./modules/profiles/profiles.controller";

//? env logger
const envToLogger = {
    development: {
        transport: {
            target: "pino-pretty",
        },
    },
    production: true,
    test: false,
};

//? app instance
const fastify = Fastify({
    logger: envToLogger["development"] ?? true,
});

//TODO: change cors config in Prod
fastify.register(cors, {
    origin: "*",
    methods: ["POST"],
});

//? dunno
fastify.get("/", {
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
        return reply.code(200).send("hello");
    },
});

//? Health Check
fastify.get("/health_check", {
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
        return reply
            .code(200)
            .header("Content-Type", "application/json")
            .send({ message: "alive" });
    },
});

//? cv generation endpoint
fastify.post("/generate_cv", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const profile = request.body as Profile;

        //TODO: https://developer.chrome.com/articles/new-headless/
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Generate the HTML for the resume based on the request body
        await page.setContent(getTemplateOne(profile));

        // Generate the PDF using Puppeteer and send it back as a response
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            // margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
        });

        await browser.close();

        return reply
            .code(200)
            .header("Content-Type", "application/pdf")
            .header("Content-Length", pdf.length)
            .send(pdf);
    },
});

//? configure server
async function main() {
    //* Should be before regestering Routes
    for (const schema of diplomaSchemas) {
        fastify.addSchema(schema);
    }
    // for (const schema of bootcampSchemas) {
    //     fastify.addSchema(schema);
    // }

    /* Registering api routes */

    fastify.register(diplomaRoutes, {
        prefix: "api/diplomas",
    });

    fastify.register(bootcampRoutes, {
        prefix: "api/bootcamps",
    });

    fastify.register(languageRoutes, {
        prefix: "api/languages",
    });

    fastify.register(certRoutes, {
        prefix: "api/certs",
    });

    fastify.register(profileRoutes, {
        prefix: "api/profiles",
    });

    //? listen to port 8000
    try {
        await fastify.listen({
            port: 8000,
            host: "0.0.0.0",
        });
    } catch (e) {
        console.error("Failed to listen to port 8000: ", e);
    }
}

//? Gracefull Shutdown
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await fastify.close();

        process.exit(0);
    });
});

//? run server
main();
