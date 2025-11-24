export type Role = "patient" | "doctor" | "admin";

export type MockUser = {
  email: string;
  password: string;
  role: Role;
  name: string;
};

export const mockUsers: MockUser[] = [
  { email: "patient@example.com", password: "patient123", role: "patient", name: "Riya Sharma" },
  { email: "doctor@example.com", password: "doctor123", role: "doctor", name: "Dr. Aisha Kapoor" },
  { email: "admin@example.com", password: "admin123", role: "admin", name: "System Admin" },
];

export function authenticate(email: string, password: string): { ok: true; role: Role; name: string } | { ok: false } {
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false };
  return { ok: true, role: user.role, name: user.name };
}

export function getRedirectForRole(role: Role): string {
  switch (role) {
    case "patient":
      return "/patient/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}
