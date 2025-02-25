import { PrismaUsersRepository } from "@/repositories/prisma/users-repository";
import { AuthenticUseCase } from "@/usecases/authenticate";

export function makeAuthenticateUseCase() {
  const UsersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticUseCase(UsersRepository);

  return authenticateUseCase;
}
