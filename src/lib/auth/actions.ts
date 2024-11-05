"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isWithinExpirationDate, TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { eq } from "drizzle-orm";
import { initializeDB } from "@/db";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { emailVerificationCodes, passwordResetTokens, users } from "@/db/schema";
import { sendMail, EmailTemplate } from "@/lib/email";
import { CODE_LENGTH, Paths } from "../constants";
import { env } from "@/env";
import { verify, hash } from "./hash";
import { generateId, invalidateSession, invalidateUserSessions } from "@/lib/auth";
import { deleteSessionTokenCookie, getCurrentUser, setSession } from "./session";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
}

export async function login(_: any, formData: FormData): Promise<ActionResponse<LoginInput>> {
  const db = await initializeDB();
  const obj = Object.fromEntries(formData.entries());

  const parsed = loginSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const [existingUser] = await db.select().from(users).where(eq(users.email, email));

  if (!existingUser || !existingUser?.hashedPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const validPassword = await verify(existingUser.hashedPassword, password);
  if (!validPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  await setSession(existingUser.id);
  return redirect(Paths.Dashboard);
}

export async function signup(_: any, formData: FormData): Promise<ActionResponse<SignupInput>> {
  const db = await initializeDB();
  const obj = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const [existingUser] = await db.select().from(users).where(eq(users.email, email));

  if (existingUser) {
    return {
      formError: "Cannot create account with that email",
    };
  }

  const userId = generateId(21);
  const hashedPassword = await hash(password);
  await db.insert(users).values({
    id: userId,
    email,
    hashedPassword,
  });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendMail(email, EmailTemplate.EmailVerification, { code: verificationCode });

  await setSession(userId);
  return redirect(Paths.VerifyEmail);
}

export async function logout(): Promise<{ error: string } | void> {
  const db = await initializeDB();
  const session = await getCurrentUser();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  await invalidateSession(session.id);
  deleteSessionTokenCookie();
  return redirect("/");
}

export async function resendVerificationEmail(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const db = await initializeDB();
  const user = await getCurrentUser();
  if (!user) {
    return redirect(Paths.Login);
  }
  const [lastSent] = await db
    .select()
    .from(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, user.id));

  if (lastSent && isWithinExpirationDate(lastSent.expiresAt)) {
    return {
      error: `Please wait ${timeFromNow(lastSent.expiresAt)} before resending`,
    };
  }
  const verificationCode = await generateEmailVerificationCode(user.id, user.email);
  await sendMail(user.email, EmailTemplate.EmailVerification, { code: verificationCode });

  return { success: true };
}

export async function verifyEmail(_: any, formData: FormData): Promise<{ error: string } | void> {
  const db = await initializeDB();
  const code = formData.get("code");
  if (typeof code !== "string" || code.length !== CODE_LENGTH) {
    return { error: "Invalid code" };
  }
  const user = await getCurrentUser();
  if (!user) {
    return redirect(Paths.Login);
  }

  const [dbCode] = await db
    .select()
    .from(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, user.id));

  if (!dbCode || dbCode.code !== code) return { error: "Invalid verification code" };

  if (!isWithinExpirationDate(dbCode.expiresAt)) return { error: "Verification code expired" };

  if (dbCode.email !== user.email) return { error: "Email does not match" };

  await db.batch([
    db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.id, dbCode.id)),
    db.update(users).set({ emailVerified: true }).where(eq(users.id, user.id)),
  ]);

  await invalidateUserSessions(user.id);
  await setSession(user.id);
  redirect(Paths.Dashboard);
}

export async function sendPasswordResetLink(
  _: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const db = await initializeDB();
  const email = formData.get("email");
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) {
    return { error: "Provided email is invalid." };
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data));

    if (!user || !user.emailVerified) return { error: "Provided email is invalid." };

    const verificationToken = await generatePasswordResetToken(user.id);

    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${verificationToken}`;

    await sendMail(user.email, EmailTemplate.PasswordReset, { link: verificationLink });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send verification email." };
  }
}

export async function resetPassword(
  _: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const db = await initializeDB();
  const obj = Object.fromEntries(formData.entries());

  const parsed = resetPasswordSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      error: err.fieldErrors.password?.[0] ?? err.fieldErrors.token?.[0],
    };
  }
  const { token, password } = parsed.data;

  const [dbToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.id, token));

  if (dbToken) await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, dbToken.id));

  if (!dbToken) return { error: "Invalid password reset link" };

  if (!isWithinExpirationDate(dbToken.expiresAt)) return { error: "Password reset link expired." };

  await invalidateUserSessions(dbToken.userId);
  const hashedPassword = await hash(password);
  await db.update(users).set({ hashedPassword }).where(eq(users.id, dbToken.userId));
  await setSession(dbToken.userId);
  redirect(Paths.Dashboard);
}

const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};

async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
  const db = await initializeDB();
  await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, userId));
  const code = generateRandomString(CODE_LENGTH, alphabet("0-9")); // 8 digit code
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(10, "m")), // 10 minutes
  });
  return code;
}

async function generatePasswordResetToken(userId: string): Promise<string> {
  const db = await initializeDB();
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  const tokenId = generateId(40);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });
  return tokenId;
}
