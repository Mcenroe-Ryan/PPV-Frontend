// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   Paper,
//   CircularProgress,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Fade,
// } from "@mui/material";
// import {
//   ResponsiveContainer,
//   ComposedChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Line,
//   Bar,
//   ReferenceLine,
//   Customized,
// } from "recharts";

// /* ==========================  COLORS & CONSTANTS  =========================== */
// const API_BASE = "http://localhost:5002/api";
// const DEFAULT_SUPPLIER = 1;
// const DEFAULT_START = "2023-10-01";
// const DEFAULT_END = "2025-09-01";
// const FORECAST_START_ISO = "2025-04-01";

// // --- Figma Color Palette ---
// const COLOR_STANDARD = "#DB2777"; // Pink
// const COLOR_ACTUAL = "#EA580C"; // Orange
// const COLOR_QUANTITY = "#7EC8F0"; // Figma soft blue
// const COLOR_FORECAST_BAR_STROKE = "#60A5FA";
// const COLOR_GRID = "#F1F5F9";
// const COLOR_AXIS = "#475569";
// const COLOR_TEXT = "#1E293B";
// const COLOR_DIVIDER = "#94A3B8";
// const COLOR_CARD_BORDER = "#E5E7EB";
// const COLOR_TABLE_HEAD_BG = "#F8FAFC";
// const COLOR_TABLE_SUBHEAD_BG = "#F1F5F9";
// const FONT_MONO = "'Poppins', sans-serif";

// /* ==============================  HELPERS  ================================== */
// const num = (v) => (Number.isFinite(+v) ? +v : 0);
// const compareDateOnly = (a, b) =>
//   new Date(a).setHours(0, 0, 0, 0) - new Date(b).setHours(0, 0, 0, 0);
// const isHistorical = (iso) => compareDateOnly(iso, FORECAST_START_ISO) < 0;
// const monthShort = (iso) =>
//   new Date(iso).toLocaleString("en-US", { month: "short" });
// const yearNum = (iso) => new Date(iso).getFullYear();

// function ForecastBarShape({ x, y, width, height, fill }) {
//   if (height <= 0 || !Number.isFinite(height)) return null;
//   return (
//     <rect
//       x={x}
//       y={y}
//       width={width}
//       height={height}
//       rx={6}
//       ry={6}
//       fill={fill}
//       fillOpacity={0.15}
//       stroke={COLOR_FORECAST_BAR_STROKE}
//       strokeWidth={1.5}
//       strokeDasharray="4 4"
//     />
//   );
// }

// function YearLabels({ xAxisMap, yearSpans }) {
//   const axis = xAxisMap?.[0];
//   if (!axis) return null;
//   const scale = axis.scale;
//   // Move year labels closer to month ticks (Figma-style)
//   const textY = axis?.height + axis?.top + 20;
//   return (
//     <g>
//       {yearSpans.map(({ year, startIdx, endIdx }) => {
//         const mid = scale(startIdx) + (scale(endIdx) - scale(startIdx)) / 2;
//         return (
//           <text
//             key={year}
//             x={mid}
//             y={textY}
//             textAnchor="middle"
//             fontSize={12}
//             fill={COLOR_AXIS}
//             fontFamily={FONT_MONO}
//             fontWeight={500}
//           >
//             {year}
//           </text>
//         );
//       })}
//     </g>
//   );
// }

// /* ==============================  MAIN  ===================================== */
// export default function SAQ() {
//   const [gran, setGran] = useState("m");
//   const [forecastType, setForecastType] = useState("6");
//   const [supplier, setSupplier] = useState("Bharat Supplier");
//   const [loading, setLoading] = useState(true);
//   const [rows, setRows] = useState([]);

//   const [showStandard, setShowStandard] = useState(true);
//   const [showActual, setShowActual] = useState(true);
//   const [showQuantity, setShowQuantity] = useState(true);

//   /* ============================  FETCH DATA  =============================== */
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(`${API_BASE}/ppv-forecast`, {
//           params: {
//             supplierId: DEFAULT_SUPPLIER,
//             startDate: DEFAULT_START,
//             endDate: DEFAULT_END,
//             metric: "chart",
//           },
//         });
//         setRows(data?.chartData || []);
//       } catch {
//         // fallback demo data
//         setRows([
//           { date_value: "2023-10-01", standard_price: 12.06, actual_price: 10.25, quantity: 2629 },
//           { date_value: "2023-11-01", standard_price: 11.28, actual_price: 9.93, quantity: 2584 },
//           { date_value: "2023-12-01", standard_price: 11.47, actual_price: 10.32, quantity: 2661 },
//           { date_value: "2024-01-01", standard_price: 11.82, actual_price: 10.76, quantity: 2701 },
//           { date_value: "2024-02-01", standard_price: 11.04, actual_price: 9.88, quantity: 2685 },
//           { date_value: "2024-03-01", standard_price: 11.39, actual_price: 10.36, quantity: 2716 },
//           { date_value: "2024-04-01", standard_price: 11.58, actual_price: 10.65, quantity: 2592 },
//           { date_value: "2024-05-01", standard_price: 11.72, actual_price: 10.72, quantity: 2578 },
//           { date_value: "2024-06-01", standard_price: 11.58, actual_price: 10.63, quantity: 2658 },
//           { date_value: "2024-07-01", standard_price: 11.45, actual_price: 10.54, quantity: 2663 },
//           { date_value: "2024-08-01", standard_price: 11.32, actual_price: 10.48, quantity: 2750 },
//           { date_value: "2024-09-01", standard_price: 11.18, actual_price: 10.45, quantity: 2767 },
//           { date_value: "2025-01-01", standard_price: 10.16, actual_price: 10.16, quantity: 2649 },
//           { date_value: "2025-02-01", standard_price: 10.27, actual_price: 10.47, quantity: 2599 },
//           { date_value: "2025-03-01", standard_price: 10.45, actual_price: 10.76, quantity: 2822 },
//           { date_value: "2025-04-01", standard_price: 9.46, actual_price: 9.93, quantity: 2733 },
//           { date_value: "2025-05-01", standard_price: 9.43, actual_price: 9.90, quantity: 2855 },
//           { date_value: "2025-06-01", standard_price: 9.67, actual_price: 9.00, quantity: 2871 },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   /* ===========================  PROCESS DATA  ============================== */
//   const normalized = useMemo(() => {
//     return [...rows]
//       .sort((a, b) => compareDateOnly(a.date_value, b.date_value))
//       .map((r) => ({
//         iso: r.date_value,
//         year: yearNum(r.date_value),
//         monthShort: monthShort(r.date_value),
//         isHist: isHistorical(r.date_value),
//         std: num(r.standard_price),
//         act: num(r.actual_price),
//         qty: num(r.quantity),
//       }));
//   }, [rows]);

//   const firstForecastIdx = useMemo(
//     () => Math.max(0, normalized.findIndex((d) => !d.isHist)),
//     [normalized]
//   );

//   const chartData = useMemo(() => {
//     const lastHistIdx = firstForecastIdx > 0 ? firstForecastIdx - 1 : -1;
//     return normalized.map((d, idx) => ({
//       xLabel: d.monthShort,
//       year: d.year,
//       quantity_hist: d.isHist ? d.qty : null,
//       quantity_fore: !d.isHist ? d.qty : null,
//       standard_hist: d.isHist ? d.std : null,
//       standard_fore: !d.isHist || idx === lastHistIdx ? d.std : null,
//       actual_hist: d.isHist ? d.act : null,
//       actual_fore: !d.isHist || idx === lastHistIdx ? d.act : null,
//     }));
//   }, [normalized, firstForecastIdx]);

//   const yearSpans = useMemo(() => {
//     const map = new Map();
//     normalized.forEach((d, i) => {
//       const arr = map.get(d.year) || [];
//       arr.push(i);
//       map.set(d.year, arr);
//     });
//     return Array.from(map.entries()).map(([year, idxs]) => ({
//       year,
//       startIdx: idxs[0],
//       endIdx: idxs[idxs.length - 1],
//     }));
//   }, [normalized]);

//   const janIndexes = useMemo(
//     () => normalized.map((d, i) => (d.monthShort === "Jan" ? i : -1)).filter((i) => i !== -1),
//     [normalized]
//   );

//   const tableGroups = useMemo(() => {
//     const map = new Map();
//     normalized.forEach((d) => {
//       const arr = map.get(d.year) || [];
//       arr.push(d);
//       map.set(d.year, arr);
//     });
//     return Array.from(map.entries()).map(([year, months]) => ({ year, months }));
//   }, [normalized]);

//   /* ==============================  UI  ===================================== */
//   return (
//     <Box sx={{ p: 3, fontFamily: FONT_MONO }}>
//       {/* Controls */}
//       <Grid container alignItems="center" spacing={2} sx={{ mb: 1 }}>
//         {["W", "M", "Q"].map((label) => (
//           <Grid item key={label}>
//             <Box
//               onClick={() => setGran(label.toLowerCase())}
//               sx={{
//                 border: "1.5px solid #0284C7",
//                 borderRadius: "9999px",
//                 px: 1.8,
//                 py: 0.3,
//                 minWidth: 32,
//                 textAlign: "center",
//                 cursor: "pointer",
//                 fontWeight: 600,
//                 fontSize: "0.8rem",
//                 color: gran === label.toLowerCase() ? "#fff" : "#0284C7",
//                 backgroundColor:
//                   gran === label.toLowerCase() ? "#0284C7" : "#fff",
//               }}
//             >
//               {label}
//             </Box>
//           </Grid>
//         ))}

//         <Grid item>
//           <Box
//             sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
//             onClick={() => setForecastType(forecastType === "6" ? "" : "6")}
//           >
//             <input
//               type="checkbox"
//               checked={forecastType === "6"}
//               readOnly
//               style={{ accentColor: "#0284C7", width: 16, height: 16 }}
//             />
//             <Typography variant="body2" fontWeight={600} sx={{ color: "#374151" }}>
//               6 Months Forecast
//             </Typography>
//           </Box>
//         </Grid>

//         <Grid item>
//           <FormControl size="small" sx={{ minWidth: 160 }}>
//             <Select
//               value={supplier}
//               onChange={(e) => setSupplier(e.target.value)}
//               sx={{
//                 fontWeight: 600,
//                 fontSize: "0.85rem",
//                 "& .MuiOutlinedInput-notchedOutline": { border: "none" },
//               }}
//             >
//               <MenuItem value="AutoMech Gumby">AutoMech Gumby</MenuItem>
//               <MenuItem value="Bharat Supplier">Bharat Supplier</MenuItem>
//               <MenuItem value="Global Parts">Global Parts</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       {/* Legend Buttons */}
//       <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
//         {[
//           { label: "Standard Price ($)", color: COLOR_STANDARD, active: showStandard, toggle: () => setShowStandard((p) => !p) },
//           { label: "Actual Price ($)", color: COLOR_ACTUAL, active: showActual, toggle: () => setShowActual((p) => !p) },
//           { label: "Quantity", color: COLOR_QUANTITY, active: showQuantity, toggle: () => setShowQuantity((p) => !p) },
//         ].map((btn) => (
//           <Box
//             key={btn.label}
//             onClick={btn.toggle}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               px: 1.8,
//               py: 0.8,
//               borderRadius: "8px",
//               cursor: "pointer",
//               backgroundColor: btn.active ? "#F8FBFF" : "#F8FAFC",
//               border: btn.active
//                 ? `1.5px solid ${btn.color}`
//                 : "1.5px solid #E2E8F0",
//               boxShadow: btn.active
//                 ? "0px 2px 5px rgba(0,0,0,0.05)"
//                 : "0px 1px 3px rgba(0,0,0,0.03)",
//               transition: "all 0.25s ease",
//               "&:hover": {
//                 backgroundColor: "#F1F5F9",
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: "50%",
//                 backgroundColor: btn.color,
//               }}
//             />
//             <Typography
//               variant="body2"
//               fontWeight={600}
//               sx={{
//                 color: "#374151",
//                 fontSize: "0.9rem",
//               }}
//             >
//               {btn.label}
//             </Typography>
//           </Box>
//         ))}
//       </Box>

//       {/* Chart */}
//       <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 2 }}>
//         <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
//           Standard & Actual Price Trends
//         </Typography>

//         {loading ? (
//           <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Box sx={{ height: 440 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedChart
//                 data={chartData}
//                 margin={{ top: 10, right: 40, bottom: 40, left: 8 }}
//               >
//                 <CartesianGrid stroke={COLOR_GRID} vertical={false} />
//                 <XAxis
//                   dataKey="xLabel"
//                   tickMargin={8}
//                   tick={{ fontSize: 12, fill: COLOR_TEXT }}
//                   axisLine={{ stroke: COLOR_AXIS }}
//                   tickLine={{ stroke: COLOR_GRID }}
//                   interval={0}
//                 />
//                                 {/* LEFT Y AXIS — Standard & Actual Price ($) */}
//                 <YAxis
//                 yAxisId="left"
//                 tick={{ fontSize: 12, fill: COLOR_TEXT }}
//                 axisLine={{ stroke: COLOR_AXIS, strokeWidth: 1 }}
//                 tickLine={{ stroke: COLOR_GRID }}
//                 label={{
//                     value: "Standard & Actual Price ($)",
//                     angle: -90,
//                     position: "insideLeft",
//                     offset: 10,
//                     dy: 90, // keep this as is
//                     dx: -5,
//                     style: {
//                     fontSize: 13,
//                     fill: COLOR_AXIS,
//                     fontFamily: FONT_MONO,
//                     fontWeight: 500,
//                     },
//                 }}
//                 />

//                 {/* RIGHT Y AXIS — Quantity */}
//                 {showQuantity && (
//                 <YAxis
//                     yAxisId="right"
//                     orientation="right"
//                     tick={{ fontSize: 12, fill: COLOR_TEXT }}
//                     axisLine={{ stroke: COLOR_AXIS, strokeWidth: 1 }}
//                     tickLine={{ stroke: COLOR_GRID }}
//                     label={{
//                     value: "Quantity",
//                     angle: 90,
//                     position: "insideRight",
//                     offset: 10,
//                     dy: 40, // 👈 reduced from 90 to 80 to align with left label
//                     dx: 5,
//                     style: {
//                         fontSize: 13,
//                         fill: COLOR_AXIS,
//                         fontFamily: FONT_MONO,
//                         fontWeight: 500,
//                     },
//                     }}
//                 />
//                 )}


//                 {janIndexes.map((x) => (
//                   <ReferenceLine
//                     key={x}
//                     x={x}
//                     stroke={COLOR_DIVIDER}
//                     strokeWidth={1.5}
//                     ifOverflow="extendDomain"
//                   />
//                 ))}
//                 <Customized component={<YearLabels yearSpans={yearSpans} />} />

//                 {/* Bars */}
//                 {showQuantity && (
//                   <>
//                     <Bar
//                       yAxisId="right"
//                       dataKey="quantity_hist"
//                       fill={COLOR_QUANTITY}
//                       barSize={18}
//                       radius={[6, 6, 0, 0]}
//                     />
//                     <Bar
//                       yAxisId="right"
//                       dataKey="quantity_fore"
//                       fill={COLOR_QUANTITY}
//                       barSize={18}
//                       shape={<ForecastBarShape />}
//                     />
//                   </>
//                 )}

//                 {/* Lines */}
//                 {showStandard && (
//                   <>
//                     <Line
//                       yAxisId="left"
//                       type="linear"
//                       dataKey="standard_hist"
//                       stroke={COLOR_STANDARD}
//                       strokeWidth={2}
//                       dot={{ r: 2 }}
//                       connectNulls
//                     />
//                     <Line
//                       yAxisId="left"
//                       type="linear"
//                       dataKey="standard_fore"
//                       stroke={COLOR_STANDARD}
//                       strokeWidth={2}
//                       strokeDasharray="4 4"
//                       dot={{ r: 2 }}
//                       connectNulls
//                     />
//                   </>
//                 )}
//                 {showActual && (
//                   <>
//                     <Line
//                       yAxisId="left"
//                       type="linear"
//                       dataKey="actual_hist"
//                       stroke={COLOR_ACTUAL}
//                       strokeWidth={2}
//                       dot={{ r: 2 }}
//                       connectNulls
//                     />
//                     <Line
//                       yAxisId="left"
//                       type="linear"
//                       dataKey="actual_fore"
//                       stroke={COLOR_ACTUAL}
//                       strokeWidth={2}
//                       strokeDasharray="4 4"
//                       dot={{ r: 2 }}
//                       connectNulls
//                     />
//                   </>
//                 )}

//                 <Tooltip
//                   cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
//                   contentStyle={{
//                     borderRadius: 8,
//                     border: `1px solid ${COLOR_CARD_BORDER}`,
//                     backgroundColor: "#F8FAFC",
//                     fontSize: "0.8rem",
//                   }}
//                 />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </Paper>

//       {/* Table */}
//       <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>
//         <TableContainer sx={{ overflowX: "auto" }}>
//           <Table
//             size="small"
//             sx={{
//               borderCollapse: "collapse",
//               "& td, & th": { border: `1px solid ${COLOR_CARD_BORDER}` },
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ bgcolor: COLOR_TABLE_HEAD_BG, fontWeight: 700, width: 200 }} />
//                 {tableGroups.map(({ year, months }) => (
//                   <TableCell
//                     key={year}
//                     align="center"
//                     colSpan={months.length}
//                     sx={{ bgcolor: COLOR_TABLE_HEAD_BG, fontWeight: 700, color: COLOR_TEXT }}
//                   >
//                     {year}
//                   </TableCell>
//                 ))}
//               </TableRow>
//               <TableRow>
//                 <TableCell sx={{ bgcolor: COLOR_TABLE_SUBHEAD_BG, fontWeight: 700 }} />
//                 {tableGroups.flatMap(({ months }) =>
//                   months.map((m) => (
//                     <TableCell
//                       key={m.iso}
//                       align="center"
//                       sx={{ bgcolor: COLOR_TABLE_SUBHEAD_BG, fontWeight: 700, fontSize: "0.8rem" }}
//                     >
//                       {m.monthShort}
//                     </TableCell>
//                   ))
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {showStandard && (
//                 <Fade in={showStandard} timeout={400}>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600 }}>Standard Price ($)</TableCell>
//                     {tableGroups.flatMap(({ months }) =>
//                       months.map((m) => (
//                         <TableCell key={`std-${m.iso}`} align="center">
//                           {m.std.toFixed(2)}
//                         </TableCell>
//                       ))
//                     )}
//                   </TableRow>
//                 </Fade>
//               )}
//               {showActual && (
//                 <Fade in={showActual} timeout={400}>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600 }}>Actual Price ($)</TableCell>
//                     {tableGroups.flatMap(({ months }) =>
//                       months.map((m) => (
//                         <TableCell key={`act-${m.iso}`} align="center">
//                           {m.act.toFixed(2)}
//                         </TableCell>
//                       ))
//                     )}
//                   </TableRow>
//                 </Fade>
//               )}
//               {showQuantity && (
//                 <Fade in={showQuantity} timeout={400}>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
//                     {tableGroups.flatMap(({ months }) =>
//                       months.map((m) => (
//                         <TableCell key={`qty-${m.iso}`} align="center">
//                           {m.qty.toLocaleString()}
//                         </TableCell>
//                       ))
//                     )}
//                   </TableRow>
//                 </Fade>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }


//NEW CODE 


import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GridOn from "@mui/icons-material/GridOn";
import Settings from "@mui/icons-material/Settings";
import Share from "@mui/icons-material/Share";

/* ======================
   Shared constants
====================== */
const monthLabels = [
  { label: "Oct", year: "2023" },
  { label: "Nov", year: "" },
  { label: "Dec", year: "" },
  { label: "Jan", year: "" },
  { label: "Feb", year: "" },
  { label: "Mar", year: "" },
  { label: "Apr", year: "" },
  { label: "May", year: "" },
  { label: "Jun", year: "" },
  { label: "Jul", year: "2024" },
  { label: "Aug", year: "" },
  { label: "Sep", year: "" },
  { label: "Oct", year: "" },
  { label: "Nov", year: "" },
  { label: "Dec", year: "" },
  { label: "Jan", year: "" },
  { label: "Feb", year: "" },
  { label: "Mar", year: "" },
  { label: "Apr", year: "" },
  { label: "May", year: "" },
  { label: "Jun", year: "2025" },
  { label: "Jul", year: "" },
  { label: "Aug", year: "" },
  { label: "Sep", year: "" },
];

const leftYAxisLabels = ["14", "13", "12", "11", "10", "9", "8"];
const rightYAxisLabels = ["3000", "2900", "2800", "2700", "2600", "2500", "2400"];

const legendItems = [
  { color: "#EC4899", label: "Standard Price ($)" },
  { color: "#F97316", label: "Actual Price ($)" },
  { color: "#0EA5E9", label: "Quantity" },
];

// Designed widths of the static artwork / table layout
const DESIGN_WIDTH = 1710;          // chart art width (px)
const TABLE_MIN_WIDTH = 1940;       // forces table to scroll horizontally

/* ======================
   ChartSection (horizontal scroll)
====================== */
export const ChartSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("M");
  const [forecastChecked, setForecastChecked] = useState(true);

  return (
    <Box sx={{ width: "100%", p: 1.25 }}>
      <Box sx={{ height: 31 }} />

      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.400",
          p: 2,
        }}
      >
        <Stack spacing={1.125}>
          <Stack direction="row" spacing={1.125} alignItems="center">
            <Stack direction="row" spacing={2.5}>
              <Stack direction="row" spacing={1.25}>
                <Button
                  variant={selectedPeriod === "W" ? "outlined" : "outlined"}
                  onClick={() => setSelectedPeriod("W")}
                  sx={{
                    minWidth: 38,
                    width: 38,
                    height: 24,
                    borderRadius: "50px",
                    borderColor: "#0369A1",
                    color: "text.primary",
                    bgcolor: "transparent",
                    fontSize: 12,
                    fontWeight: 600,
                    p: 0,
                  }}
                >
                  W
                </Button>
                <Button
                  variant={selectedPeriod === "M" ? "contained" : "outlined"}
                  onClick={() => setSelectedPeriod("M")}
                  sx={{
                    minWidth: 38,
                    width: 38,
                    height: 24,
                    borderRadius: "50px",
                    borderColor: "#0369A1",
                    bgcolor: selectedPeriod === "M" ? "#2563EB" : "transparent",
                    color: selectedPeriod === "M" ? "#fff" : "text.primary",
                    fontSize: 12,
                    fontWeight: 600,
                    p: 0,
                    "&:hover": {
                      bgcolor: selectedPeriod === "M" ? "#2563EB" : "transparent",
                    },
                  }}
                >
                  M
                </Button>
                <Button
                  variant={selectedPeriod === "Q" ? "outlined" : "outlined"}
                  onClick={() => setSelectedPeriod("Q")}
                  sx={{
                    minWidth: 38,
                    width: 38,
                    height: 24,
                    borderRadius: "50px",
                    borderColor: "#0369A1",
                    color: "text.primary",
                    bgcolor: "transparent",
                    fontSize: 12,
                    fontWeight: 600,
                    p: 0,
                  }}
                >
                  Q
                </Button>
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={forecastChecked}
                      onChange={(e) => setForecastChecked(e.target.checked)}
                      size="small"
                    />
                  }
                  label="6 Months Forecast"
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: 16,
                      color: "text.primary",
                    },
                  }}
                />
                <ExpandMore sx={{ width: 16, height: 16, color: "text.secondary" }} />
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                  Suppliers
                </Typography>
                <ExpandMore sx={{ width: 16, height: 16, color: "text.secondary" }} />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 1.25 }}
          >
            <Stack direction="row" spacing={1.25}>
              {legendItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1.25,
                    py: 0.625,
                    bgcolor: "#EFF6FF",
                    borderRadius: "5px",
                    border: 1,
                    borderColor: "grey.400",
                  }}
                >
                  <Box sx={{ width: 10, height: 10, bgcolor: item.color, borderRadius: "5px" }} />
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={2.5}>
              <IconButton size="small" sx={{ p: 0 }}>
                <GridOn sx={{ width: 20, height: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ p: 0 }}>
                <ChatBubbleOutline sx={{ width: 20, height: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ p: 0 }}>
                <Share sx={{ width: 20, height: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ p: 0 }}>
                <Settings sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>

        {/* CHART SCROLLER */}
        <Box sx={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
          <Box sx={{ position: "relative", height: 429, mt: 2, width: `${DESIGN_WIDTH}px` }}>
            <Stack
              direction="row"
              sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }}
            >
              {/* Left Y Axis */}
              <Box sx={{ width: 71, position: "relative" }}>
                <Stack spacing="41.9px" sx={{ position: "absolute", top: 0, left: 43, height: 378 }}>
                  {leftYAxisLabels.map((label, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "text.secondary",
                        textAlign: "right",
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {label}
                    </Typography>
                  ))}
                </Stack>

                <Typography
                  sx={{
                    position: "absolute",
                    top: 173,
                    left: -101,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "text.secondary",
                    transform: "rotate(-90deg)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Standard & Actual Price ($)
                </Typography>
              </Box>

              {/* Plot area */}
              <Box sx={{ flex: 1, position: "relative" }}>
                {/* grid lines */}
                <Stack spacing={0} sx={{ position: "absolute", top: 8, left: 0, right: 0, height: 361 }}>
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-59.svg" sx={{ width: "100%", height: 1 }} />
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-59.svg" sx={{ width: "100%", height: 1, mt: "60px" }} />
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-59.svg" sx={{ width: "100%", height: 1, mt: "60px" }} />
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-59.svg" sx={{ width: "100%", height: 1, mt: "60px" }} />
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-59.svg" sx={{ width: "100%", height: 1, mt: "60px" }} />
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-60.svg" sx={{ width: "100%", height: 1, mt: "60px" }} />
                  <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/line-61.svg" sx={{ width: "100%", height: 1, mt: "60px" }} />
                </Stack>

                {/* (static artwork placeholders) */}
                <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/group-295.png" sx={{ position: "absolute", top: 77, left: 24, width: 1675, height: 291 }} />
                <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/vector-486.svg" sx={{ position: "absolute", top: 201, left: 38, width: 1292, height: 69 }} />
                <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/vector-485.svg" sx={{ position: "absolute", top: 120, left: 39, width: 1290, height: 162 }} />
                <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/vector-488.svg" sx={{ position: "absolute", top: 274, left: 1330, width: 367, height: 52 }} />
                <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/vector-487.svg" sx={{ position: "absolute", top: 225, left: 1328, width: 369, height: 79 }} />

                {/* x-axis labels */}
                <Box sx={{ position: "absolute", top: 376, left: 0, right: 0, height: 53 }}>
                  <Stack direction="row" spacing={0}>
                    {monthLabels.map((month, index) => (
                      <Box
                        key={index}
                        sx={{
                          width:
                            index === 1 || index === 10
                              ? 76
                              : index === 3
                              ? 79
                              : index === 6
                              ? 77
                              : 74,
                          textAlign: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", height: 27, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {month.label}
                        </Typography>
                        {month.year && (
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", height: 18, display: "flex", alignItems: "center", justifyContent: "center", mt: 0.5 }}>
                            {month.year}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>

              {/* Right Y Axis */}
              <Box sx={{ width: 71, position: "relative" }}>
                <Stack spacing="41.9px" sx={{ position: "absolute", top: 2, right: 24, height: 378 }}>
                  {rightYAxisLabels.map((label, index) => (
                    <Typography key={index} sx={{ fontSize: 12, fontWeight: 600, color: "text.primary", height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {label}
                    </Typography>
                  ))}
                </Stack>
                <Typography sx={{ position: "absolute", top: 152, right: -26, fontSize: 16, fontWeight: 600, color: "text.primary", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
                  Quantity
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/* ======================
   DataTableSection (forced horizontal scroll)
====================== */
const yearData = [
  {
    year: "2023",
    months: ["Oct", "Nov", "Dec"],
    standardPrices: ["12.06", "11.28", "11.47"],
    actualPrices: ["10.25", "9.93", "10.32"],
    quantities: ["2629", "2584", "2661"],
  },
  {
    year: "2024",
    months: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    standardPrices: ["11.82","11.04","11.39","11.39","11.58","10.72","11.15","11.28","10.35","11.27","10.26","10.06"],
    actualPrices:   ["10.76","9.88","10.36","10.48","10.65","9.97","10.15","10.15","9.52","10.48","9.75","9.76"],
    quantities:     ["2701","2685","2716","2592","2578","2658","2663","2750","2767","2780","2687","2624"],
  },
  {
    year: "2025",
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],
    standardPrices: ["10.16","10.27","10.45","9.46","9.43","9.67","9.51","8.75","9.02"],
    actualPrices:   ["10.16","10.47","10.76","9.93","9.9","10.38","10.15","9.62","10.38"],
    quantities:     ["2649","2599","2822","2733","2855","2871","2897","2740","2746"],
  },
];

export const DataTableSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 1.25,
        bgcolor: "white",
        border: "1px solid",
        borderColor: "grey.400",
        overflowX: "auto",     // outer scroller
        overflowY: "hidden",
      }}
    >
      {/* inner content is wider than viewport, so it scrolls */}
      <Box sx={{ minWidth: `${TABLE_MIN_WIDTH}px` }}>
        <Stack spacing={1.875}>
          <Box>
            {/* Header row with years + months */}
            <Stack direction="row" sx={{ borderTop: "1px solid", borderColor: "grey.300" }}>
              <Box
                sx={{
                  width: "165px",
                  bgcolor: "grey.300",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderLeft: "1px solid",
                  borderColor: "grey.400",
                  flexShrink: 0,
                }}
              />
              {yearData.map((yearGroup, yearIndex) => (
                <Stack
                  key={yearIndex}
                  sx={{
                    width:
                      yearGroup.months.length === 3 ? "220px"
                      : yearGroup.months.length === 12 ? "889px"
                      : "auto",
                    flex: yearGroup.months.length === 9 ? 1 : undefined,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1.25,
                      py: 0.375,
                      bgcolor: "grey.200",
                      borderTop: "1px solid",
                      borderLeft: "1px solid",
                      borderColor: "grey.400",
                      ...(yearIndex === yearData.length - 1 && { borderRight: "1px solid" }),
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.secondary", textAlign: "center" }}>
                      {yearGroup.year}
                    </Typography>
                  </Box>

                  <Stack direction="row">
                    {yearGroup.months.map((month, monthIndex) => (
                      <Box
                        key={monthIndex}
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 1.25,
                          py: 0.625,
                          bgcolor: "grey.300",
                          borderTop: "1px solid",
                          borderBottom: "1px solid",
                          borderLeft: "1px solid",
                          borderColor: "grey.400",
                          ...(yearIndex === yearData.length - 1 &&
                            monthIndex === yearGroup.months.length - 1 && {
                              borderRight: "1px solid",
                            }),
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.secondary", textAlign: "center" }}>
                          {month}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>

            {/* Standard Price row */}
            <Stack direction="row" sx={{ height: "36px", bgcolor: "white", borderBottom: "1px solid", borderColor: "grey.300" }}>
              <Box
                sx={{
                  width: "165px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 1.25,
                  bgcolor: "grey.100",
                  borderBottom: "1px solid",
                  borderLeft: "1px solid",
                  borderColor: "grey.400",
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.secondary", textAlign: "center" }}>
                  Standard Price ($)
                </Typography>
              </Box>

              {yearData.map((yearGroup, yearIndex) => (
                <Stack
                  key={yearIndex}
                  direction="row"
                  sx={{
                    width:
                      yearGroup.months.length === 3 ? "220px"
                      : yearGroup.months.length === 12 ? "889px"
                      : "auto",
                    flex: yearGroup.months.length === 9 ? 1 : undefined,
                  }}
                >
                  {yearGroup.standardPrices.map((price, priceIndex) => (
                    <Box
                      key={priceIndex}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        px: 1.25,
                        borderBottom: "1px solid",
                        borderLeft: "1px solid",
                        borderColor: "grey.400",
                        ...(yearIndex === yearData.length - 1 &&
                          priceIndex === yearGroup.standardPrices.length - 1 && {
                            borderRight: "1px solid",
                          }),
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: "Poppins, Helvetica",
                          fontWeight: 500,
                          fontSize: "14px",
                          color:
                            yearIndex === 0
                              ? "text.primary"
                              : yearIndex === 1 && priceIndex >= 9
                              ? "text.secondary"
                              : "text.secondary",
                          textAlign: "right",
                          letterSpacing: "0.25px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {price}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ))}
            </Stack>

            {/* Actual Price row */}
            <Stack direction="row" sx={{ height: "36px", bgcolor: "white", borderBottom: "1px solid", borderColor: "grey.300" }}>
              <Box
                sx={{
                  width: "165px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 1.25,
                  bgcolor: "grey.100",
                  borderBottom: "1px solid",
                  borderLeft: "1px solid",
                  borderColor: "grey.400",
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.secondary", textAlign: "center" }}>
                  Actual Price ($)
                </Typography>
              </Box>

              {yearData.map((yearGroup, yearIndex) => (
                <Stack
                  key={yearIndex}
                  direction="row"
                  sx={{
                    width:
                      yearGroup.months.length === 3 ? "220px"
                      : yearGroup.months.length === 12 ? "889px"
                      : "auto",
                    flex: yearGroup.months.length === 9 ? 1 : undefined,
                  }}
                >
                  {yearGroup.actualPrices.map((price, priceIndex) => (
                    <Box
                      key={priceIndex}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        px: 1.25,
                        borderBottom: "1px solid",
                        borderLeft: "1px solid",
                        borderColor: "grey.400",
                        ...(yearIndex === yearData.length - 1 &&
                          priceIndex === yearGroup.actualPrices.length - 1 && {
                            borderRight: "1px solid",
                          }),
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: "Poppins, Helvetica",
                          fontWeight: 500,
                          fontSize: "14px",
                          color:
                            yearIndex === 0
                              ? "text.primary"
                              : yearIndex === 1 && priceIndex >= 9
                              ? "text.secondary"
                              : "text.secondary",
                          textAlign: "right",
                          letterSpacing: "0.25px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {price}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ))}
            </Stack>

            {/* Quantity row */}
            <Stack direction="row" sx={{ height: "36px", borderBottom: "1px solid", borderColor: "grey.300" }}>
              <Box
                sx={{
                  width: "165px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 1.25,
                  bgcolor: "grey.100",
                  borderBottom: "1px solid",
                  borderLeft: "1px solid",
                  borderColor: "grey.400",
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.secondary", textAlign: "center" }}>
                  Quantity
                </Typography>
              </Box>

              {yearData.map((yearGroup, yearIndex) => (
                <Stack
                  key={yearIndex}
                  direction="row"
                  sx={{
                    width:
                      yearGroup.months.length === 3 ? "220px"
                      : yearGroup.months.length === 12 ? "889px"
                      : "auto",
                    flex: yearGroup.months.length === 9 ? 1 : undefined,
                  }}
                >
                  {yearGroup.quantities.map((quantity, quantityIndex) => (
                    <Box
                      key={quantityIndex}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        px: 1.25,
                        borderBottom: "1px solid",
                        borderLeft: "1px solid",
                        borderColor: "grey.400",
                        ...(yearIndex === yearData.length - 1 &&
                          quantityIndex === yearGroup.quantities.length - 1 && {
                            borderRight: "1px solid",
                          }),
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: "Poppins, Helvetica",
                          fontWeight: 500,
                          fontSize: "14px",
                          color:
                            yearIndex === 0
                              ? "text.primary"
                              : yearIndex === 1 && quantityIndex >= 3
                              ? "text.secondary"
                              : "text.secondary",
                          textAlign: "right",
                          letterSpacing: "0.25px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {quantity}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box component="img" src="https://c.animaapp.com/PlSFAOl8/img/frame-6680.svg" alt="Frame" sx={{ width: "100%", height: "8px" }} />
        </Stack>
      </Box>
    </Box>
  );
};

/* ======================
   Parent wrapper
====================== */
export const SAQ = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd",
        width: "100%",
        minWidth: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        gap: 1.25,
      }}
      data-model-id="24175:2023"
    >
      <ChartSection />
      <DataTableSection />
    </Box>
  );
};

export default SAQ;


