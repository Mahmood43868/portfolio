import { z } from "zod";

/** Shared by the client form and the API route so the rules can't drift. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "That name is too long."),
  email: z.email("That doesn't look like a valid email."),
  subject: z
    .string()
    .trim()
    .min(3, "Give the message a subject.")
    .max(120, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail, please — at least 20 characters.")
    .max(4000, "Message is too long."),
  /**
   * Honeypot. Real people never see this field, so a value means a bot.
   * Deliberately permissive: the route inspects it and returns a normal 200,
   * because rejecting it would tell the bot the field is a trap.
   */
  website: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
