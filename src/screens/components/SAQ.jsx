import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Typography,
  Select,
  MenuItem,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Bar,
} from "recharts";

// ================================
// Config
// ================================
const API_BASE = "http://localhost:5002/api";
const DEFAULT_SUPPLIER = 1;
const DEFAULT_START = "2023-10-01";
const DEFAULT_END = "2025-09-01";

const COLOR_STANDARD = "#DB2777"; // pink
const COLOR_ACTUAL = "#EA580C"; // orange
const COLOR_QUANTITY = "#38BDF8"; // blue
const COLOR_INACTIVE = "#D1D5DB"; // gray

// ================================
// Helpers
// ================================
const monthLabel = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

// ================================
// Component
// ================================
export default function App() {
  const [tab, setTab] = useState("saq");
  const [gran, setGran] = useState("m");
  const [forecastType, setForecastType] = useState("6");
  const [supplier, setSupplier] = useState("Bharat Supplier");
  const [loading, setLoading] = useState(true);
  const [chartRows, setChartRows] = useState([]);

  const [showStandard, setShowStandard] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showQuantity, setShowQuantity] = useState(true);

  // Fetch or mock data
  useEffect(() => {
    async function run() {
      setLoading(true);
      try {
        const url = `${API_BASE}/ppv-forecast`;
        const params = {
          supplierId: DEFAULT_SUPPLIER,
          startDate: DEFAULT_START,
          endDate: DEFAULT_END,
          metric: "chart",
        };
        const { data } = await axios.get(url, { params });
        setChartRows(data?.chartData || []);
      } catch (e) {
        console.warn("⚠️ Using mock data (API unavailable)");
        const mockData = [
          { date_value: "2023-10-01", standard_price: 12.06, actual_price: 10.25, quantity: 2700 },
          { date_value: "2023-11-01", standard_price: 11.28, actual_price: 9.93, quantity: 2600 },
          { date_value: "2023-12-01", standard_price: 11.47, actual_price: 10.32, quantity: 2650 },
          { date_value: "2024-01-01", standard_price: 11.82, actual_price: 10.76, quantity: 2750 },
          { date_value: "2024-02-01", standard_price: 11.04, actual_price: 9.88, quantity: 2680 },
          { date_value: "2024-03-01", standard_price: 11.39, actual_price: 10.36, quantity: 2720 },
          { date_value: "2024-04-01", standard_price: 11.58, actual_price: 10.65, quantity: 2800 },
          { date_value: "2024-05-01", standard_price: 11.72, actual_price: 10.72, quantity: 2820 },
          { date_value: "2024-06-01", standard_price: 11.58, actual_price: 10.63, quantity: 2850 },
          { date_value: "2024-07-01", standard_price: 11.45, actual_price: 10.54, quantity: 2870 },
          { date_value: "2024-08-01", standard_price: 11.32, actual_price: 10.48, quantity: 2890 },
          { date_value: "2024-09-01", standard_price: 11.18, actual_price: 10.45, quantity: 2900 },
          { date_value: "2025-03-01", standard_price: 10.50, actual_price: 9.80, quantity: 2800 },
          { date_value: "2025-04-01", standard_price: 9.90, actual_price: 9.30, quantity: 2700 },
          { date_value: "2025-05-01", standard_price: 9.60, actual_price: 9.10, quantity: 2650 },
          { date_value: "2025-06-01", standard_price: 9.40, actual_price: 9.00, quantity: 2600 },
          { date_value: "2025-07-01", standard_price: 9.20, actual_price: 9.00, quantity: 2550 },
          { date_value: "2025-08-01", standard_price: 9.00, actual_price: 9.10, quantity: 2580 },
        ];
        setChartRows(mockData);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  // Transform for chart
  const chartData = useMemo(
    () =>
      chartRows.map((r) => ({
        month: monthLabel(r.date_value),
        standard: Number(r.standard_price ?? 0),
        actual: Number(r.actual_price ?? 0),
        quantity: Number(r.quantity ?? 0),
        year: new Date(r.date_value).getFullYear(),
      })),
    [chartRows]
  );

  // Group by year for table
  const groupedByYear = useMemo(() => {
    const map = {};
    chartData.forEach((d) => {
      if (!map[d.year]) map[d.year] = [];
      map[d.year].push(d);
    });
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, arr]) => ({ year, months: arr }));
  }, [chartData]);

  // ================================
  // UI
  // ================================
  return (
    <Box sx={{ p: 3, fontFamily: "'Poppins', sans-serif" }}>
      {/* ================= Savings Section ================= */}
      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Savings by supplier in $
        </Typography>

        <Grid container spacing={2}>
          {[
            { name: "AutoMech Gumby", value: -18.46, color: "#DC2626" },
            { name: "Bharat Supplier", value: 1763.99, color: "#16A34A" },
            { name: "Global Parts", value: 3216.34, color: "#16A34A" },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderColor: "#E5E7EB",
                  "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                    alt="supplier"
                    width={24}
                    height={24}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ color: item.color }}>
                    {item.value < 0
                      ? `-$${Math.abs(item.value).toFixed(2)}`
                      : `$${item.value.toFixed(2)}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= Tabs Section ================= */}
      <Box sx={{ borderBottom: "1px solid #E5E7EB", background: "#F9FAFB", px: 2, pt: 2, mt: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            ".MuiTab-root": { textTransform: "none", fontWeight: 600, color: "#374151" },
            ".Mui-selected": {
              backgroundColor: "#E5F3FF",
              borderRadius: "6px",
              color: "#0284C7 !important",
            },
          }}
        >
          <Tab label="PPV Trends" value="ppvTrends" />
          <Tab label="SAQ" value="saq" />
          <Tab label="Factors & Explainability" value="factors" />
          <Tab label="Commodity Forecasting" value="commodity" />
        </Tabs>
      </Box>

      {/* ================= Controls ================= */}
      <Grid container alignItems="center" spacing={2} sx={{ mt: 1, px: 2 }}>
        {/* Granularity */}
        <Grid item>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={gran}
            onChange={(_, val) => val && setGran(val)}
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: "8px !important",
                border: "1px solid #E5E7EB",
                fontWeight: 600,
                color: "#374151",
                "&.Mui-selected": { backgroundColor: "#0284C7", color: "#fff" },
              },
            }}
          >
            <ToggleButton value="d">D</ToggleButton>
            <ToggleButton value="w">W</ToggleButton>
            <ToggleButton value="m">M</ToggleButton>
            <ToggleButton value="y">Y</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Forecast Dropdown */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={forecastType} onChange={(e) => setForecastType(e.target.value)}>
              <MenuItem value="6">6 Months Forecast</MenuItem>
              <MenuItem value="3">3 Months Forecast</MenuItem>
              <MenuItem value="global">Global Events</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Supplier Dropdown */}
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <MenuItem value="AutoMech Gumby">AutoMech Gumby</MenuItem>
              <MenuItem value="Bharat Supplier">Bharat Supplier</MenuItem>
              <MenuItem value="Global Parts">Global Parts</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* ================= Legend ================= */}
      <Box sx={{ mt: 1.5, px: 2, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        {[
          {
            label: "Standard Price ($)",
            color: COLOR_STANDARD,
            active: showStandard,
            toggle: () => setShowStandard((p) => !p),
          },
          {
            label: "Actual Price ($)",
            color: COLOR_ACTUAL,
            active: showActual,
            toggle: () => setShowActual((p) => !p),
          },
          {
            label: "Quantity",
            color: COLOR_QUANTITY,
            active: showQuantity,
            toggle: () => setShowQuantity((p) => !p),
          },
        ].map((item) => (
          <Box
            key={item.label}
            onClick={item.toggle}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              border: "1px solid #E5E7EB",
              borderRadius: "20px",
              px: 1.5,
              py: 0.5,
              cursor: "pointer",
              backgroundColor: "#FFFFFF",
              "&:hover": { backgroundColor: "#F3F4F6" },
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.active ? item.color : COLOR_INACTIVE,
              }}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: item.active ? "#374151" : "#9CA3AF" }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ================= Chart + Table ================= */}
      {tab === "saq" && (
        <>
          <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 2 }}>
            {/* Chart Header Icons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Standard & Actual Price Trends
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {["grid", "comment", "share", "settings"].map((icon) => (
                  <Box
                    key={icon}
                    component="img"
                    src={`/icons/${icon}.svg`}
                    alt={icon}
                    sx={{
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      opacity: 0.8,
                      "&:hover": { opacity: 1, transform: "scale(1.1)", transition: "0.2s" },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    key={`${showStandard}-${showActual}-${showQuantity}`}
                    data={chartData}
                    margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid stroke="#EEF2F7" vertical={false} />
                    <XAxis dataKey="month" tickMargin={8} tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      domain={["auto", "auto"]}
                      label={{
                        value: "Standard & Actual Price ($)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 12 },
                      }}
                    />
                    {showQuantity && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Quantity",
                          angle: 90,
                          position: "insideRight",
                          style: { fontSize: 12 },
                        }}
                      />
                    )}
                    <Tooltip />
                    {showQuantity && (
                      <Bar
                        yAxisId="right"
                        dataKey="quantity"
                        fill={COLOR_QUANTITY}
                        opacity={0.6}
                        barSize={20}
                        radius={[6, 6, 0, 0]}
                      />
                    )}
                    {showStandard && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="standard"
                        stroke={COLOR_STANDARD}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    )}
                    {showActual && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="actual"
                        stroke={COLOR_ACTUAL}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>

          {/* Table */}
          <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#F3F4F6", fontWeight: 700 }}>Month</TableCell>
                    {groupedByYear.map(({ months }) =>
                      months.map((m) => (
                        <TableCell
                          key={m.month}
                          align="center"
                          sx={{ bgcolor: "#F3F4F6", fontWeight: 700 }}
                        >
                          {m.month}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showStandard && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Standard Price ($)</TableCell>
                      {groupedByYear.flatMap(({ months }) =>
                        months.map((m) => (
                          <TableCell key={`std-${m.month}`}>{m.standard.toFixed(2)}</TableCell>
                        ))
                      )}
                    </TableRow>
                  )}
                  {showActual && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Actual Price ($)</TableCell>
                      {groupedByYear.flatMap(({ months }) =>
                        months.map((m) => (
                          <TableCell key={`act-${m.month}`}>{m.actual.toFixed(2)}</TableCell>
                        ))
                      )}
                    </TableRow>
                  )}
                  {showQuantity && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                      {groupedByYear.flatMap(({ months }) =>
                        months.map((m) => (
                          <TableCell key={`qty-${m.month}`}>{m.quantity.toLocaleString()}</TableCell>
                        ))
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}
