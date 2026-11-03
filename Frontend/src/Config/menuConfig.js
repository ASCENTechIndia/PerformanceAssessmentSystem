import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Plus,
  BarChart3,
  ShieldCheck,
  ClipboardCheck,
  LayoutList,
  UserCog,
  FileChartPie,
  ChartColumnBig
} from "lucide-react";

export const HOME_ITEM = {
  id: "home",
  label: "Home",
  path: "/dashboard",
  icon: LayoutDashboard,
  group: "Navigate",
};

export const STATIC_MENU = [
  {
    MENUID: 1,
    MENUTITLE: "Master",
    children: [
      {
        MENUID: 101,
        MENUTITLE: "Employees",
        PAGEPATH: "/master/employees",
        ICON: Users,
      },
      {
        MENUID: 102,
        MENUTITLE: "Departments",
        PAGEPATH: "/master/departments",
        ICON: Building2,
      },
      {
        MENUID: 103,
        MENUTITLE: "Criteria",
        PAGEPATH: "/master/criteria",
        ICON: ClipboardCheck,
      },
      {
        MENUID: 104,
        MENUTITLE: "Task Type Master",
        PAGEPATH: "/Master/FrmTaskTypeMst",
        ICON: LayoutList,
      },
      {
        MENUID: 105,
        MENUTITLE: "Designation Master",
        PAGEPATH: "/master/DesignationMaster",
        ICON: UserCog,
      },
    ],
  },
  {
    MENUID: 2,
    MENUTITLE: "Assessments",
    children: [
      {
        MENUID: 201,
        MENUTITLE: "New Assessment",
        PAGEPATH: "/assessments/new",
        ICON: Plus,
      },
      {
        MENUID: 202,
        MENUTITLE: "My Assessments",
        PAGEPATH: "/assessments/my",
        ICON: ClipboardList,
      },
      {
        MENUID: 203,
        MENUTITLE: "Team Reviews",
        PAGEPATH: "/assessments/team",
        ICON: ShieldCheck,
      },
    ],
  },
  {
    MENUID: 3,
    MENUTITLE: "Reports",
    children: [
      {
        MENUID: 301,
        MENUTITLE: "Performance Report",
        PAGEPATH: "/reports/performance",
        ICON: FileChartPie,
      },
      {
        MENUID: 302,
        MENUTITLE: "Department Comparison",
        PAGEPATH: "/reports/departments",
        ICON: ChartColumnBig,
      },
    ],
  },
];

/** Flattened, command-palette-ready list */
export const ALL_NAV = [
  HOME_ITEM,
  ...STATIC_MENU.flatMap((section) => [
    {
      id: `section-${section.MENUID}`,
      label: section.MENUTITLE,
      path: null,
      icon: null,
      group: "Section",
    },
    ...(section.children || []).map((item) => ({
      id: `item-${item.MENUID}`,
      label: item.MENUTITLE,
      path: item.PAGEPATH,
      icon: item.ICON,
      group: section.MENUTITLE,
    })),
  ]),
];
