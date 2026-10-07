export default function validate(
  name,
  username,
  email,
  password,
  confirmPassword
) {
  if (!name || !username || !email || !password || !confirmPassword) {
    return "All fields are required";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (username.trim().length < 3) {
    return "Username must be at least 3 characters";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please provide a valid email address";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
}
