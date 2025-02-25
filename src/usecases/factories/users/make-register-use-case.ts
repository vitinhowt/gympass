import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { RegisterUseCase } from '@/usecases/register'

export function makeRegisterUseCase() {
  const UsersRepository = new PrismaUsersRepository()
  const registerUserCase = new RegisterUseCase(UsersRepository)

  return registerUserCase
}
