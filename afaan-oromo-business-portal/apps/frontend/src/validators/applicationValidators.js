// Validation helpers for business application forms

export const validateBusinessName = (name) => {
  if (!name || !name.trim()) return 'Proposed business name is required.';
  if (name.trim().length < 2) return 'Business name must be at least 2 characters.';
  if (name.trim().length > 100) return 'Business name must not exceed 100 characters.';
  // Only Afaan Oromo characters, numbers, spaces, and common punctuation
  // Note: actual character validation deferred to backend per requirements
  return null;
};

export const validateBusinessCategory = (category) => {
  if (!category) return 'Business category is required.';
  return null;
};

export const validateBusinessDescription = (description) => {
  if (!description || !description.trim()) return 'Business description is required.';
  if (description.trim().length < 10) return 'Description must be at least 10 characters.';
  return null;
};

export const validateBusinessAddress = (address) => {
  if (!address || !address.trim()) return 'Business address is required.';
  if (address.trim().length < 5) return 'Address must be at least 5 characters.';
  return null;
};

export const validatePermissionDocument = (file) => {
  if (!file) return 'Business permission document is required.';
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) return 'Only PDF, JPG, and PNG files are allowed.';
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) return 'File size must not exceed 10 MB.';
  return null;
};

// Validate appeal form fields
export const validateAppealReason = (reason) => {
  if (!reason || !reason.trim()) return 'Appeal reason is required.';
  if (reason.trim().length < 20) return 'Please provide a more detailed reason (at least 20 characters).';
  return null;
};

// Validate officer comment (for rejection / correction)
export const validateOfficerComment = (comment) => {
  if (!comment || !comment.trim()) return 'A comment is required for this action.';
  if (comment.trim().length < 10) return 'Comment must be at least 10 characters.';
  return null;
};
