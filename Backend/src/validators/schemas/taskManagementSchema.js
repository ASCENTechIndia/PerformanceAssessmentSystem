import { z } from "zod";

export const aoptTaskInsUpdSchema = z.object({
  IN_MODE: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  IN_TASK_ID: z
    .number({
      invalid_type_error: "Task Id must be a number",
    })
    .int("Task Id must be an integer")
    .nullable()
    .optional(),

  IN_TASKTYPE_ID: z
    .number({
      required_error: "Task Type Id is required",
      invalid_type_error: "Task Type Id must be a number",
    })
    .int("Task Type Id must be an integer"),

  IN_TASK_TITLE: z
    .string({
      required_error: "Task Title is required",
      invalid_type_error: "Task Title must be a string",
    })
    .trim()
    .min(1, "Task Title is required"),

  IN_TASK_DESCRIPTION: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .nullish(),

  IN_TASK_COMPLETIONCRITERIA: z
    .string()
    .trim()
    .max(2000, "Completion criteria is too long")
    .nullish(),

  IN_TASK_EXCEPCTEDDAYS: z
    .number({
      invalid_type_error: "Expected days must be a number",
    })
    .int("Expected days must be an integer")
    .min(0, "Expected days cannot be negative")
    .nullable()
    .optional(),

  IN_TASK_PARENTID: z
    .number({
      invalid_type_error: "Parent Id must be a number",
    })
    .int("Parent Id must be an integer")
    .nullable()
    .optional(),

  IN_TASK_ISACTIVE: z
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

export const aoptTaskStatusInsUpdSchema = z.object({
  IN_MODE: z
    .string({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a string",
    })
    .trim()
    .min(1, "Mode is required"),

  IN_TASKSTATUS_ID: z
    .number({
      invalid_type_error: "Task Status Id must be a number",
    })
    .int("Task Status Id must be an integer")
    .nullable()
    .optional(),

  IN_TASKSTATUS_CODE: z
    .string({
      required_error: "Task Status Code is required",
      invalid_type_error: "Task Status Code must be a string",
    })
    .trim()
    .min(1, "Task Status Code is required")
    .max(50, "Task Status Code is too long"),

  IN_TASKSTATUS_NAME: z
    .string({
      required_error: "Task Status Name is required",
      invalid_type_error: "Task Status Name must be a string",
    })
    .trim()
    .min(1, "Task Status Name is required")
    .max(200, "Task Status Name is too long"),

  IN_TASKSTATUS_BGCOLOR: z
    .string()
    .trim()
    .max(20, "Background color value is too long")
    .nullish(),

  IN_TASKSTATUS_FORECOLOR: z
    .string()
    .trim()
    .max(20, "Foreground color value is too long")
    .nullish(),

  IN_DISPLAYORDER: z
    .number({
      invalid_type_error: "Display order must be a number",
    })
    .int("Display order must be an integer")
    .min(0, "Display order cannot be negative")
    .nullable()
    .optional(),

  IN_FINALSTATUS: z
    .number({
      invalid_type_error: "Final status must be a number",
    })
    .int("Final status must be an integer")
    .nullable()
    .optional(),

  IN_ISACTIVE: z
    .number({
      required_error: "Is Active is required",
      invalid_type_error: "Is Active must be a number",
    })
    .int("Is Active must be an integer"),

  IN_USERID: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),
});

export const aoptTaskAssignmentInsUpdSchema = z.object({
  IN_MODE: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  IN_TASKASSIGNMENT_ID: z
    .number({
      invalid_type_error: "Task Assignment ID must be a number",
    })
    .int("Task Assignment ID must be an integer")
    .nullable()
    .optional(),

  IN_TASKID: z
    .number({
      required_error: "Task ID is required",
      invalid_type_error: "Task ID must be a number",
    })
    .int("Task ID must be an integer"),

  IN_DEPTID: z
    .number({
      required_error: "Department ID is required",
      invalid_type_error: "Department ID must be a number",
    })
    .int("Department ID must be an integer"),

  IN_ASSIGNEDBY: z
    .number({
      required_error: "Assigned By is required",
      invalid_type_error: "Assigned By must be a number",
    })
    .int("Assigned By must be an integer"),

  IN_ASSIGNEDTO: z
    .number({
      required_error: "Assigned To is required",
      invalid_type_error: "Assigned To must be a number",
    })
    .int("Assigned To must be an integer"),

  IN_ASSIGNEDDATE: z
    .string({
      required_error: "Assigned Date is required",
      invalid_type_error: "Assigned Date must be a string",
    })
    .min(1, "Assigned Date cannot be empty"),

  IN_STARTDATE: z
    .string({
      required_error: "Start Date is required",
      invalid_type_error: "Start Date must be a string",
    })
    .min(1, "Start Date cannot be empty"),

  IN_DUEDATE: z
    .string({
      required_error: "Due Date is required",
      invalid_type_error: "Due Date must be a string",
    })
    .min(1, "Due Date cannot be empty"),

  IN_STATUSID: z
    .number({
      required_error: "Status ID is required",
      invalid_type_error: "Status ID must be a number",
    })
    .int("Status ID must be an integer"),

  IN_PRIORITY: z
    .string({
      required_error: "Priority is required",
      invalid_type_error: "Priority must be a string",
    })
    .trim()
    .min(1, "Priority is required"),

  IN_FINISHEDDATE: z.string().nullable().optional(),

  IN_COMPLETEDDATE: z.string().nullable().optional(),

  IN_ISACTIVE: z
    .string({
      required_error: "Is Active flag is required",
      invalid_type_error: "Is Active must be a string",
    })
    .trim()
    .regex(/^[YN]$/, "Is Active must be 'Y' or 'N'"),

  IN_ACTIONREMARK: z
    .string({
      required_error: "Action Remark is required",
      invalid_type_error: "Action Remark must be a string",
    })
    .trim()
    .min(1, "Action Remark is required"),

  IN_meetingreference: z
    .string({
      required_error: "Metting reference is required",
      invalid_type_error: "Metting reference must be string",
    })
    .nullable()
    .optional(),

  IN_USERID: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),
});
