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
  ChartColumnBig,
  GitGraph,
  ListChecks,
  Hourglass,
  Menu,
  ListTodo,
  UsersRound
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
      {
        MENUID: 106,
        MENUTITLE: "Hierarchy Mapping",
        PAGEPATH: "/master/HierarchyMapping",
        ICON: GitGraph,
      },
    ],
  },
  {
    MENUID: 4,
    MENUTITLE: "My Work",
    children: [
      {
        MENUID: 401,
        MENUTITLE: "My Task",
        PAGEPATH: "/Task/MyTask",
        ICON: Menu,
      },
    ],
  },
  {
    MENUID: 2,
    MENUTITLE: "Tasks",
    children: [
      {
        MENUID: 202,
        MENUTITLE: "Assign Task",
        PAGEPATH: "/Task/AssignTask",
        ICON: ListTodo,
      },
      {
        MENUID: 203,
        MENUTITLE: "Team Tasks",
        PAGEPATH: "/Task/TeamTasks",
        ICON: UsersRound,
      },
      {
        MENUID: 204,
        MENUTITLE: "Review Queue",
        PAGEPATH: "/Task/ReviewQueue",
        ICON: Hourglass,
      },
      {
        MENUID: 205,
        MENUTITLE: "Extension Queue",
        PAGEPATH: "/Task/ExtensionQueue",
        ICON: Hourglass,
      },
    ],
  },
  {
    MENUID: 3,
    MENUTITLE: "Admin",
    children: [
      {
        MENUID: 301,
        MENUTITLE: "User Access",
        PAGEPATH: "/admin/userAccess",
      },
    ],
  },
  {
    MENUID: 4,
    MENUTITLE: "Performance Details",
    children: [
      {
        MENUID: 401,
        MENUTITLE: "Junior Employee",
        PAGEPATH: "/performance/junior"
      },
      {
        MENUID: 402,
        MENUTITLE: "Senior Employee",
        PAGEPATH: "/performance/senior"
      }
    ]
  }

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
