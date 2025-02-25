import { PrismaUsersRepository } from "@/repositories/prisma/users-repository";
import { GetUserProfileUseCase } from "@/usecases/get-user-profile";

export function makeGetUserProfileUseCase() {
  const UsersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(UsersRepository);

  return useCase;
}
