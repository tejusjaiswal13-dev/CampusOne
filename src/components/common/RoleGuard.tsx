import type { ReactNode } from "react";
import { canAccessTab } from "../../services/routeAccess";
import type { UserRole } from "../../types";
export function RoleGuard({
  role,
  tab,
  children,
}: {
  role: UserRole;
  tab: string;
  children: ReactNode;
}) {
  return canAccessTab(role, tab) ? (
    children
  ) : (
    <section role="alert" className="co-empty">
      <h2>Not authorised</h2>
      <p>Your account cannot access this area.</p>
    </section>
  );
}
