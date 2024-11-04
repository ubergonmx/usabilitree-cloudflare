import { scrypt, randomBytes } from "crypto";

// Define the type for the promisified scrypt function
const scryptAsync = (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
};

const scryptConfig = {
  N: 131072, // Cost parameter (higher for better security)
  r: 8, // Block size parameter
  p: 1, // Parallelization parameter
  maxmem: 134217856, // 128 MB (calculated for N = 131072)
};

export const hash = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 32, scryptConfig);
  return salt.toString("base64") + ":" + derivedKey.toString("base64");
};

export const verify = async (hash: string, password: string): Promise<boolean> => {
  const [salt, key] = hash.split(":");
  const derivedKey = await scryptAsync(password, Buffer.from(salt, "base64"), 32, scryptConfig);
  return key === derivedKey.toString("base64");
};
