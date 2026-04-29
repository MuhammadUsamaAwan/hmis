import {
  Activity,
  CalendarCheck,
  ClipboardList,
  HospitalIcon,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Stethoscope,
  UserRoundPlus,
  Users,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
        isActive: true,
      },
    ],
  },
  {
    label: "Patient Management",
    items: [
      {
        title: "Patients",
        url: "/patients",
        icon: Users,
        items: [
          { title: "All Patients", url: "/patients" },
          { title: "Register Patient", url: "/patients/register" },
        ],
      },
      {
        title: "Visits",
        url: "/visits",
        icon: CalendarCheck,
        items: [
          { title: "All Visits", url: "/visits" },
          { title: "Schedule Visit", url: "/visits/schedule" },
        ],
      },
    ],
  },
  {
    label: "Clinical",
    items: [
      {
        title: "Consultations",
        url: "/consultations",
        icon: Stethoscope,
      },
      {
        title: "Vital Signs",
        url: "/vitals",
        icon: Activity,
      },
      {
        title: "Medical Records",
        url: "/records",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Staff",
        url: "/staff",
        icon: UserRoundPlus,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export const hospitalInfo = {
  name: "HMIS",
  fullName: "Hospital Management",
  icon: HospitalIcon,
};
