import { ReactNode } from "react";

export function RoleShell({ sidebar, children }: { sidebar?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        {sidebar}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
