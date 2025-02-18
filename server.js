'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const baseRouter = require('./src/Routes')
// const userRoute = require("./Routes/UserRoute")


const server = Hapi.server({
    port: process.env.PORT || 5500,
    host: process.env.HOST || 'localhost'
});

const init = async () => {
    const swaggerOptions = {
        info: {
            title: 'BlueHR API Documentation',
            version: Pack.version,
        },
        schemes: ['http', 'https'],
        grouping: 'tags'
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return '<h3>Hello!</h3>'
        }
    });

    // Adding plugins for swagger docs;
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    await server.register(baseRouter, {
        routes: {
            prefix: '/v1'
        }
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);

};

init();
