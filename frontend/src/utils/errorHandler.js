import { toast } from 'react-toastify';

/**
 * Centralized error handler for API responses
 */
export const handleApiError = (error) => {
  // Network error
  if (!error.response) {
    toast.error('Network error. Please check your connection.');
    return {
      message: 'Network error',
      status: 0,
    };
  }

  const { status, data } = error.response;

  // Backend error response format
  const errorResponse = {
    message: data?.message || getDefaultMessage(status),
    status: status,
    timestamp: data?.timestamp || new Date().toISOString(),
    details: data?.details || null,
  };

  // Show toast based on error type
  switch (status) {
    case 400:
      toast.error(errorResponse.message);
      break;
    case 401:
      toast.warning('Please login to continue');
      break;
    case 403:
      toast.error('You do not have permission to perform this action');
      break;
    case 404:
      toast.error(errorResponse.message || 'Resource not found');
      break;
    case 409:
      toast.error(errorResponse.message || 'Conflict occurred');
      break;
    case 422:
      // Validation errors
      if (data?.errors) {
        Object.values(data.errors).forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorResponse.message);
      }
      break;
    case 500:
      toast.error('Server error. Please try again later.');
      break;
    default:
      toast.error(errorResponse.message);
  }

  return errorResponse;
};

/**
 * Get default error message based on status code
 */
const getDefaultMessage = (status) => {
  const messages = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    422: 'Validation error',
    500: 'Internal server error',
  };
  return messages[status] || 'An error occurred';
};

/**
 * Extract validation errors from response
 */
export const getValidationErrors = (error) => {
  if (error.response?.status === 422 && error.response?.data?.errors) {
    return error.response.data.errors;
  }
  return {};
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

/**
 * Calculate days until due
 */
export const daysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
