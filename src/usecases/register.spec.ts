import { InMemoryUsersRepository } from "@/repositories/in-memory/users-repository";
import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { RegisterUseCase } from "./register";

// Starts the variables
let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
describe("RegisterUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  // Unit test
  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "flamengo",
    });

    const isPasswordCorrectlyHashed = await compare(
      "flamengo",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shouldn`t be able to register with same email twice", async () => {
    const email = "john.doe@gmail.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "flamengo",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "flamengo",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
  it("should be able to register an account", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "flamengo",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
