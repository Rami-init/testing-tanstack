import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(12, "Password must be at most 12 characters long"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
