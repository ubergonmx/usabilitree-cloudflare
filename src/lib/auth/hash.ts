import { env } from "@/env";
// import { Argon2id } from "oslo/password";

// const argon2idOsloConfig = {
//   memorySize: 19456,
//   iterations: 2,
//   tagLength: 32,
//   parallelism: 1,
//   secret: Buffer.from(env.SECRET_HASH, "base64"),
// };

// const argon2id = new Argon2id(argon2idOsloConfig);

// export const hash = async (password: string): Promise<string> => await argon2id.hash(password);
// export const verify = async (hash: string, password: string): Promise<boolean> =>
//   await argon2id.verify(hash, password);

export const hash = async (password: string): Promise<string> => password;
export const verify = async (hash: string, password: string): Promise<boolean> => hash === password;
