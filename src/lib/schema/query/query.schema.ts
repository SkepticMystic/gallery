import z from "zod";

export const query_schema = <T extends z.ZodRawShape>(where: z.ZodObject<T>) =>
  z.object({
    where,

    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(100).default(10),
  });
