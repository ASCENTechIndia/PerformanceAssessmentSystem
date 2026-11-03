import { z } from "zod";

export const senderInsSchema = z.object({
  in_UserId: z
    .string({ required_error: "UserId is required" })
    .trim()
    .min(1, "UserId is required"),

  in_Mode: z
    .number({ invalid_type_error: "Mode must be a number" })
    .int("Mode must be an integer"),

  in_SenderId: z
    .number({ invalid_type_error: "SenderId must be a number" })
    .int("SenderId must be an integer")
    .nullable()
    .optional(),

  in_SenderName: z
    .string({ required_error: "Sender name is required" })
    .trim()
    .min(1, "Sender name is required"),

  in_UlbId: z
    .number({ invalid_type_error: "UlbId must be a number" })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({ required_error: "IP address is required" })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({ required_error: "Source is required" })
    .trim()
    .min(1, "Source is required"),
});
