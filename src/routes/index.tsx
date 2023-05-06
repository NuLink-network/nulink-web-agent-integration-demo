import { useRoutes } from "react-router-dom";
import { routeConfig } from "./routeConfig";
import { protectedRoutes } from "./protected";

export const MyRoutes = () => {
  const element = useRoutes([...routeConfig, ...protectedRoutes]);
  return <>{element}</>;
};
