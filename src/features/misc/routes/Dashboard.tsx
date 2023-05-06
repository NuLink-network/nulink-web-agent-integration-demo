import { MainLayout } from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const logout = () => {
    // TODO
    navigate("/")
  };
  return (
    <MainLayout>
      <h1 className="font-18">
        Welcome
      </h1>
      <p>TEST BELOW</p>
      <p><Link to="/" onClick={() => logout()}>Logout</Link></p>

    </MainLayout>
  );
};
