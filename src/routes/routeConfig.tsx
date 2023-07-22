import { lazyImport } from "@/utils/lazyImport";
const { Find } = lazyImport(() => import("@/features/find"), "Find");
const { FindDetail } = lazyImport(
  () => import("@/features/find"),
  "FindDetail",
);
const { MemberCenter } = lazyImport(
  () => import("@/features/memberCenter"),
  "MemberCenter",
);
const { ModifyData } = lazyImport(() => import('@/features/memberCenter'), "ModifyData");

export const routeConfig = [
  { path: "/", element: <Find /> },
  { path: "/find", element: <Find /> },
  { path: "/findDetail", element: <FindDetail /> },
  { path: "/memberCenter", element: <MemberCenter /> },
  { path: "/modifyData", element: <ModifyData /> },
];
