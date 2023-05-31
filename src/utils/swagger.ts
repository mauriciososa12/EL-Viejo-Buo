import swaggerJSDoc, { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion",
      description:
        "Documentacion del ecommerce para el curso de backend en coderhouse",
      version: "0.1",
    },
  },
  apis: [`./src/docs/**/*.yaml`],
};

const initSwagger = () => {
  const specs = swaggerJSDoc(swaggerOptions);
  return specs;
};

export default initSwagger;
