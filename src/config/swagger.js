const swaggerJsdoc = require("swagger-jsdoc");
const version = require("../../package.json").version;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Salon API Documentation",
      version: version,
      description: "API documentation for the Salon Management System",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "Salon API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://your-firebase-function-url.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: [
    "./src/routes/*.js",
    "./src/models/*.js",
    "./src/index.js",
    "./src/swagger/*.js",
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
