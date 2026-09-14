export const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value.trim());

export function validateLogin(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(form.email))
    errors.email = "Please enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  return errors;
}

export function validateRegister(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(form.email))
    errors.email = "Please enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (!form.password_confirmation)
    errors.password_confirmation = "Please confirm your password.";
  else if (form.password !== form.password_confirmation)
    errors.password_confirmation = "Passwords do not match.";
  if (!form.terms)
    errors.terms = "You must accept the Terms and Privacy Policy.";
  return errors;
}

export function validateForgotPassword(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(form.email))
    errors.email = "Please enter a valid email address.";
  return errors;
}

export function validateResetPassword(form) {
  const errors = {};
  if (!form.token.trim()) errors.token = "Reset token is required.";
  // if (!form.email.trim()) errors.email = "Email is required.";
  // else if (!isValidEmail(form.email))
  //   errors.email = "Please enter a valid email address.";
  if (!form.password) errors.password = "New password is required.";
  else if (form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (!form.password_confirmation)
    errors.password_confirmation = "Please confirm your password.";
  else if (form.password !== form.password_confirmation)
    errors.password_confirmation = "Passwords do not match.";
  return errors;
}

