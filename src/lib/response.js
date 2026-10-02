export function apiResponse(data = null, message = "Success") {
  return Response.json(
    {
      success: true,
      data,
      message,
    },
    { status: 200 }
  );
}

export function apiCreated(data = null, message = "Created successfully") {
  return Response.json(
    {
      success: true,
      data,
      message,
    },
    { status: 201 }
  );
}

export function apiError(message = "An error occurred", status = 400) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export function apiNotFound(message = "Resource not found") {
  return apiError(message, 404);
}

export function apiUnauthorized(message = "Unauthorized") {
  return apiError(message, 401);
}

export function apiForbidden(message = "Forbidden") {
  return apiError(message, 403);
}

export function apiValidationError(errors, message = "Validation failed") {
  return Response.json(
    {
      success: false,
      message,
      errors,
    },
    { status: 422 }
  );
}

export function handleApiError(error) {
  console.error("API Error:", error);
  if (error.name === "ZodError") {
    const formatted = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return apiValidationError(formatted);
  }
  if (error.message === "Authentication required") {
    return apiUnauthorized(error.message);
  }
  if (error.message === "Insufficient permissions") {
    return apiForbidden(error.message);
  }
  if (error.message === "Resource not found" || error.message?.includes("not found")) {
    return apiNotFound(error.message);
  }
  if (error.code === 11000) {
    return apiError("Duplicate entry - resource already exists", 409);
  }
  return apiError(error.message || "Internal server error", 500);
}

export async function validateRequest(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formatted = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    const err = new Error("Validation failed");
    err.name = "ZodError";
    err.issues = result.error.issues;
    err.formatted = formatted;
    throw err;
  }
  return result.data;
}
