import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";

export default function Dashboard() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // (Optional) restrict by role
    if (role !== "admin") {
      navigate("/login");
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />

      {/* Content */}
      <main className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Admin Panel</h2>
        <p className="text-gray-600">
          This will soon show analytics, filters, and feedback summaries.
        </p>

        {/* Placeholder Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2">📊 Average Ratings</h3>
            <p className="text-gray-500">Analytics chart placeholder</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2">📝 Feedback Table</h3>
            <p className="text-gray-500">Paginated table placeholder</p>
          </div>
        </div>
      </main>
    </div>
  );
}
