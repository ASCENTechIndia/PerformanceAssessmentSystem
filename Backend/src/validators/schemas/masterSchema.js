import { z } from "zod";

export const aoptTaskTypeInsUpdSchema = z.object({
  IN_MODE: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  IN_TASKTYPE_ID: z
    .number({
      invalid_type_error: "Task Type Id must be a number",
    })
    .int("Task Type Id must be an integer")
    .nullable()
    .optional(),

  IN_TASKTYPE_NAME: z
    .string({
      required_error: "Task Type Name is required",
      invalid_type_error: "Task Type Name must be a string",
    })
    .trim()
    .min(1, "Task Type Name is required"),

  IN_TASKTYPE_ULBID: z
    .number({
      required_error: "Task Type ULB Id is required",
      invalid_type_error: "Task Type ULB Id must be a number",
    })
    .int("Task Type ULB Id must be an integer"),

  IN_TASKTYPE_DESC: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .nullish(),

  IN_TASKTYPE_ISACTIVE: z
    .string({
      required_error: "Is Active flag is required",
      invalid_type_error: "Is Active must be a string",
    })
    .trim()
    .regex(/^[YN]$/, "Is Active must be 'Y' or 'N'"),

  IN_USERID: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),
});

export const aoptEmployeeMappingInsUpdSchema = z.object({
  IN_MODE: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  IN_ULBID: z
    .number({
      required_error: "ULB Id is required",
      invalid_type_error: "ULB Id must be a number",
    })
    .int("ULB Id must be an integer"),

  IN_EMPLOYEE_ID: z
    .number({
      required_error: "Employee Id is required",
      invalid_type_error: "Employee Id must be a number",
    })
    .int("Employee Id must be an integer"),

  IN_REPORTINGTO: z
    .number({
      required_error: "Reporting Id is required",
      invalid_type_error: "Reporting To must be a number",
    })
    .int("Reporting To must be an integer"),

  IN_ISACTIVE: z
    .string({
      required_error: "Is Active flag is required",
      invalid_type_error: "Is Active must be a string",
    })
    .trim()
    .regex(/^[YN]$/, "Is Active must be 'Y' or 'N'"),

  IN_USERID: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),
});