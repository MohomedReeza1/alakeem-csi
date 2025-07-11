import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Button,
  Slider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

export default function Dashboard() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [criterion, setCriterion] = useState("");
  const [criterionValue, setCriterionValue] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      fetchFeedbacks();
    }
  }, [token, role, page]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = {
        skip: page * pageSize,
        limit: pageSize,
      };
      if (name) params.name = name;
      if (startDate) params.start_date = startDate.toISOString().split("T")[0];
      if (endDate) params.end_date = endDate.toISOString().split("T")[0];
      if (minRating) params.min_rating = minRating;
      if (maxRating) params.max_rating = maxRating;
      if (criterion) params.criterion = criterion;
      if (criterionValue) params.criterion_value = criterionValue;

      const res = await api.get("/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPage(0);
    fetchFeedbacks();
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "passport_number", headerName: "Passport No", flex: 1 },
    { field: "reference_number", headerName: "Ref No", flex: 1 },
    {
      field: "created_at",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => new Date(params.row.created_at).toLocaleDateString(),
    },
    {
      field: "avg_rating",
      headerName: "Avg Rating",
      flex: 1,
      valueGetter: (params) => {
        const {
          criteria_1,
          criteria_2,
          criteria_3,
          criteria_4,
          criteria_5,
          criteria_6,
          criteria_7,
        } = params.row;
        const avg =
          (criteria_1 +
            criteria_2 +
            criteria_3 +
            criteria_4 +
            criteria_5 +
            criteria_6 +
            criteria_7) /
          7;
        return avg.toFixed(2);
      },
    },
    { field: "comment", headerName: "Comment", flex: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-4 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">CSI Admin Dashboard</h2>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField
            label="Search Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>

          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-600">Rating Range</p>
            <Slider
              value={[minRating, maxRating]}
              onChange={(e, newValue) => {
                setMinRating(newValue[0]);
                setMaxRating(newValue[1]);
              }}
              min={1}
              max={5}
              valueLabelDisplay="auto"
            />
          </div>

          <FormControl size="small">
            <InputLabel>Criterion</InputLabel>
            <Select
              value={criterion}
              label="Criterion"
              onChange={(e) => setCriterion(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {[...Array(7)].map((_, i) => (
                <MenuItem key={i} value={`criteria_${i + 1}`}>
                  Criteria {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Criterion Value"
            type="number"
            size="small"
            value={criterionValue}
            onChange={(e) => setCriterionValue(e.target.value)}
            disabled={!criterion}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            disabled={loading}
          >
            Apply Filters
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          <DataGrid
            rows={feedbacks}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            pageSizeOptions={[10, 15, 20, 50, 100]} 
            pagination
            // rowCount={feedbacks.length}
            autoHeight
          />
        </div>
      </main>
    </div>
  );
}