export type UserRole = "student" | "lecturer" | "admin";

export const getUserRole = (): UserRole => {
  const role = localStorage.getItem("userRole");
  if (role === "admin" || role === "lecturer" || role === "student") {
    return role;
  }
  return "student";
};
