import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="flex-grow-1">

        <Navbar />

        <div className="container mt-4">

          <h2>Welcome Admin 👋</h2>
          <div className="row mt-4">

    <DashboardCard
        title="Students"
        value={stats.students}
        color="primary"
    />

    <DashboardCard
        title="Teachers"
        value={stats.teachers}
        color="success"
    />

    <DashboardCard
        title="Subjects"
        value={stats.subjects}
        color="warning"
    />

</div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;