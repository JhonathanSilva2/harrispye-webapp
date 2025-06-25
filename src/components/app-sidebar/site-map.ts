import { SidebarItem } from "@/components/app-sidebar/types";
import { clientEnv } from "@/lib/constants/config";
import {
    Briefcase,
    Calculator,
    ClipboardPen,
    Download,
    Home,
    Inbox,
    LifeBuoy,
    MonitorCheck,
    MonitorCog,
    ScrollTextIcon,
    Send,
    Star,
    UsersRound,
} from "lucide-react";
/**
 * @description Ideally, this should be fetched from an API
 */
export const modules: SidebarItem[] = [
    {
        title: "Home",
        url: clientEnv.NEXT_PUBLIC_URL,
        icon: Home,
    },
    {
        title: "Notifications",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Appraisal",
        url: `${clientEnv.NEXT_PUBLIC_URL}/i/appraisal`,
        icon: Star,
    },
    {
        title: "Fabrication Monitoring",
        url: `${clientEnv.NEXT_PUBLIC_URL}/i/fabrication-monitoring`,
        icon: MonitorCheck,
    },
    {
        title: "Help",
        url: "#",
        icon: LifeBuoy,
        content: [
            {
                title: "Support",
                url: `${clientEnv.NEXT_PUBLIC_URL}/i/support`,
                icon: MonitorCog,
            },
            {
                title: "Feedback",
                url: `${clientEnv.NEXT_PUBLIC_URL}/i/feedback`,
                icon: Send,
            },
        ],
    },
    {
        title: "Admin",
        url: "#",
        icon: MonitorCog,
        content: [
            {
                title: "Users",
                url: `${clientEnv.NEXT_PUBLIC_URL}/i/admin/users`,
                icon: UsersRound,
            },
            {
                title: "Policies",
                url: `${clientEnv.NEXT_PUBLIC_URL}/i/admin/policies`,
                icon: ScrollTextIcon,
            },
        ],
    },
];
