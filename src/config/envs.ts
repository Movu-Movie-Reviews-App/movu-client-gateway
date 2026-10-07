
import 'dotenv/config'
import Joi, * as joi from 'joi';


interface EnvVars {

    PORT: number;
    NATS_SERVERS: string[];
    CORS_ORIGINS: string[];

}

const envsSchema = Joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    CORS_ORIGINS: joi.array().items(joi.string()).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(','),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    corsOrigins: envVars.CORS_ORIGINS,
}