import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, CardContent, Typography } from "@mui/material";
import Header from "../components/Header";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#4f46e5", "#e5e7eb"];

export default function DashboardStatistics() {
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    api.get("/feedbacks/average")
      .then((res) => setAverages(res.data))
      .catch((err) => console.error(err));
  }, []);

  const criteria = [
    { key: "criteria_1", label: "Welcome" },
    { key: "criteria_2", label: "Friendliness" },
    { key: "criteria_3", label: "Information" },
    { key: "criteria_4", label: "Hospitality" },
    { key: "criteria_5", label: "Time Taken" },
    { key: "criteria_6", label: "Satisfaction Compared to Others" },
    { key: "criteria_7", label: "Overall Satisfaction" },
  ];

    const overallValue = averages ? averages["criteria_7"] : 0;
    const data = [
        { name: "Overall Satisfaction", value: overallValue },
        { name: "Remaining", value: 5 - overallValue },
    ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard Statistics" />
        <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {criteria.map(({ key, label }) => (
            <Card 
                key={key}
                className="rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:scale-[1.02]"
                style={{ cursor: "default" }}
            >
                <CardContent className="flex flex-col items-center space-y-2 py-6">
                    <Typography variant="h6" className="text-center">{label}</Typography>
                    <Typography variant="h4" className="font-bold">
                        {averages ? averages[key]?.toFixed(1) : "-"}
                    </Typography>
                </CardContent>
            </Card>
        ))}
        </div>

        <div className="p-8 flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold">Overall Satisfaction (Out of 5)</h2>
            <div className="w-64 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Typography variant="h6" className="text-center">
                        {overallValue?.toFixed(1) || "-"} / 5
                    </Typography>
                </div>
            </div>
        </div>



    </div>
  );
}
