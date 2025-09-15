import { LayoutDashboard, SquareCheckBig, FolderKanban, LogOut, Users } from "lucide-react"

export const sideNavData = [
    {
        id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/"
    },
    {
        id: 2,
        title: "Projects",
        icon: FolderKanban,
        path: "/projects"
    },
    {
        id: 3,
        title: "Tickets",
        icon: SquareCheckBig,
        path: "/tickets"
    },
    {
        id: 4,
        title: "Users",
        icon: Users,
        path: "/users"
    },
    {
        id: 5,
        title: "Logout",
        icon: LogOut,
        path: "/sign-in"
    }
]