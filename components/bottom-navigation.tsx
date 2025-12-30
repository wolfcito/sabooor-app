"use client"

import { Home, Utensils, ClipboardList, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

type NavItem = {
  icon: typeof Home
  label: string
  path: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Inicio", path: "/" },
  { icon: Utensils, label: "Menú", path: "/menu-semanal" },
  { icon: ClipboardList, label: "Lista", path: "/lista-compra" },
  { icon: User, label: "Perfil", path: "/configuracion" },
]

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className={`text-xs mt-1 ${active ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
