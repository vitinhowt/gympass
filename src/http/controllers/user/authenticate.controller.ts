import { InvalidCredentialsError } from "@/usecases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/usecases/factories/users/make-authenticate-use-case";

import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    // dica: colocar nome mais contextualizado
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );



   

    return reply
    .setCookie("refreshToken", refreshToken,{
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true, 
    }) 
    .status(200)
    .send({ token})
    

    
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
