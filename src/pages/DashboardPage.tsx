
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DashboardView from "@/components/dashboard/DashboardView";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agleblue"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {user && <DashboardView />}
    </Layout>
  );
};

export default DashboardPage;
