import { NavLink, Outlet } from "react-router-dom";
import { Activity, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { navByRole, roleLabel, DEFAULT_NAV_ITEMS } from "./navConfig";
import { getDisplayName } from "@/utils/role";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  // Defensive fallback: AuthContext normalizes user.role before it ever
  // reaches this component, so navByRole[user.role] should always be
  // defined. But this line is what actually stopped the white-screen crash
  // reported earlier — .map() was being called on undefined here whenever
  // user.role held a value outside the six canonical roles. Never index into
  // a role-keyed lookup here without a fallback again.
  const navItems = navByRole[user.role] ?? DEFAULT_NAV_ITEMS;

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <aside className="hidden w-64 flex-col px-4 py-7 md:flex">
        <div className="mb-9 flex items-center gap-2.5 px-2">
          {/* Signature mark: the pulse-red echoes the Apple Health icon and
              is otherwise used only for the hero pulse-line and destructive
              actions — restrained, not repeated as a general theme color. */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vital-coral/10 text-vital-coral">
            <Activity size={19} strokeWidth={2.25} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none">MedFlow</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{roleLabel[user.role] ?? "Staff"}</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          {navItems?.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-500 text-white"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              <item.icon size={17} strokeWidth={1.9} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between border-t border-[var(--border-soft)] pt-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{getDisplayName(user)}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-vital-coral/10 hover:text-vital-coral"
            aria-label="Log out"
          >
            <LogOut size={17} strokeWidth={1.9} />
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <p className="font-display text-sm text-[var(--text-muted)] md:hidden">MedFlow</p>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)]"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={17} strokeWidth={1.9} /> : <Sun size={17} strokeWidth={1.9} />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
