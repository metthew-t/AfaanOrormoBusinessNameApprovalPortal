/**
 * Unified API response handler.
 * Extracts data from the standard backend envelope:
 *   { success: true, message: "...", data: {} }
 *   { success: false, message: "...", errors: [] }
 */
export const extractData = (response) => {
  return response?.data?.data ?? response?.data;
};

export const extractMessage = (response) => {
  return response?.data?.message ?? 'Request completed.';
};

/**
 * Extract a user-friendly error message from an Axios error.
 */
export const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.errors?.length > 0) {
    return error.response.data.errors[0];
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract validation errors from backend response as a flat object.
 * Backend may return: { errors: ["field: message", ...] } or { errors: { field: "message" } }
 */
export const extractFieldErrors = (error) => {
  const data = error?.response?.data;
  if (!data?.errors) return {};
  if (Array.isArray(data.errors)) {
    // Try to parse "field: message" format
    const result = {};
    data.errors.forEach((e) => {
      const colonIdx = e.indexOf(':');
      if (colonIdx > -1) {
        const field = e.slice(0, colonIdx).trim();
        result[field] = e.slice(colonIdx + 1).trim();
      }
    });
    return result;
  }
  if (typeof data.errors === 'object') {
    return data.errors;
  }
  return {};
};

/**
 * Build a FormData object from a plain object.
 * File values (instanceof File) are appended correctly.
 */
export const buildFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  return fd;
};
