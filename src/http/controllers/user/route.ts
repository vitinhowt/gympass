import type { FastifyInstance } from 'fastify'
import { register } from './register.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        description: 'Registra um novo usuário',
        tags: ['Usuários'],
        body: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', description: 'Nome do usuário' },
            email: {
              type: 'string',
              format: 'email',
              description: 'E-mail do usuário',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Senha do usuário',
            },
          },
        },
        response: {
          201: {
            description: 'Usuário registrado com sucesso',
            type: 'null',
          },
          400: {
            description: 'Erro de validação',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          409: {
            description: 'Usuário já existe',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    register
  )
}
