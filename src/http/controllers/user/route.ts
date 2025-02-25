import type { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller"; // Importa o controlador
import { verifyJWT } from "@/http/middlewares/verify.jwt";
import { profile } from "./get-user-profile.controller";

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/users",
    {
      schema: {
        description: "Registra um novo usuário",
        tags: ["Usuários"],
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", description: "Nome do usuário" },
            email: {
              type: "string",
              format: "email",
              description: "E-mail do usuário",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Senha do usuário",
            },
          },
        },
        response: {
          201: {
            description: "Usuário registrado com sucesso",
            type: "null",
          },
          400: {
            description: "Erro de validação",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          409: {
            description: "Usuário já existe",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    register
  );

  app.post(
    "/users/sessions",
    {
      schema: {
        description: "Autentica um usuário",
        tags: ["Usuários"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "E-mail do usuário",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Senha do usuário",
            },
          },
        },
        response: {
          200: {
            description: "Usuário autenticado com sucesso",
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          400: {
            description: "Erro de validação",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            description: "Credenciais inválidas",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    authenticate // Agora a rota chama o controlador correto
  );

  app.get(
    "/me",
    {
      schema: {
        description: "Obtém os dados do usuário autenticado",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }], // Indica que essa rota requer autenticação
        response: {
          200: {
            description: "Dados do usuário autenticado",
            type: "object",
            properties: {
              id: { type: "string", description: "ID do usuário" },
              name: { type: "string", description: "Nome do usuário" },
              email: { type: "string", description: "E-mail do usuário" },
              created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do usuário",
              },
            },
          },
          401: {
            description: "Token ausente ou inválido",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      onRequest: [verifyJWT], // Protege a rota com autenticação JWT
    },
    profile
  );
}
