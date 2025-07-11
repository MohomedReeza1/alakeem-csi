import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Analytics() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [monthlyData, setMonthlyData] = useState([]);
  const [topComplaints, setTopComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      fetchAnalytics();
    }
  }, [token, role]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [monthlyRes, complaintsRes] = await Promise.all([
        api.get("/feedbacks/monthly_counts", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/feedbacks/top_complaints", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setMonthlyData(monthlyRes.data);
      setTopComplaints(complaintsRes.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const monthlyChartData = {
    labels: monthlyData.map(item => `${item.year}-${String(item.month).padStart(2, '0')}`),
    datasets: [
      {
        label: "Feedback Count",
        data: monthlyData.map(item => item.count),
        fill: false,
        borderColor: "#6366f1",
        tension: 0.1,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Feedback Counts" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 max-w-7xl mx-auto">
        <Typography variant="h5" className="mb-6 text-center">
          📈 CSI Analytics Dashboard
        </Typography>

        {loading ? (
          <div className="flex justify-center mt-12">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Monthly Line Chart */}
            <Card>
              <CardContent>
                <Line data={monthlyChartData} options={monthlyChartOptions} />
              </CardContent>
            </Card>

            {/* Top Complaints List */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📝 Top Complaints (Lowest Ratings)
                </Typography>
                {topComplaints.length === 0 ? (
                  <Typography>No complaints with low ratings found.</Typography>
                ) : (
                  <List>
                    {topComplaints.map((item, index) => (
                      <ListItem key={item.id} divider>
                        <ListItemText
                          primary={`${item.name} (${item.passport_number})`}
                          secondary={item.comment}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}