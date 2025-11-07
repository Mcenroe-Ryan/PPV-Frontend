import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Fade,
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
  ReferenceLine,
  Customized,
} from "recharts";

/* ==========================  COLORS & CONSTANTS  =========================== */
const API_BASE_URL = "http://localhost:5002/api";
const COLOR_STANDARD = "#DB2777";
const COLOR_ACTUAL = "#EA580C";
const COLOR_QUANTITY = "#7EC8F0";
const COLOR_FORECAST_BAR_STROKE = "#60A5FA";
const COLOR_GRID = "#F1F5F9";
const COLOR_AXIS = "#475569";
const COLOR_TEXT = "#1E293B";
const COLOR_DIVIDER = "#94A3B8";
const COLOR_CARD_BORDER = "#E5E7EB";
const COLOR_TABLE_HEAD_BG = "#F8FAFC";
const COLOR_TABLE_SUBHEAD_BG = "#F1F5F9";
const FONT_MONO = "'Poppins', sans-serif";

/* ==============================  HELPERS  ================================== */
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const compareDateOnly = (a, b) =>
  new Date(a).setHours(0, 0, 0, 0) - new Date(b).setHours(0, 0, 0, 0);
const today = new Date();
const isHistorical = (iso) => new Date(iso) < today;
const monthShort = (iso) =>
  new Date(iso).toLocaleString("en-US", { month: "short" });
const yearNum = (iso) => new Date(iso).getFullYear();

function ForecastBarShape({ x, y, width, height, fill }) {
  if (height <= 0 || !Number.isFinite(height)) return null;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={6}
      ry={6}
      fill={fill}
      fillOpacity={0.15}
      stroke={COLOR_FORECAST_BAR_STROKE}
      strokeWidth={1.5}
      strokeDasharray="4 4"
    />
  );
}

function YearLabels({ xAxisMap, yearSpans }) {
  const axis = xAxisMap?.[0];
  if (!axis) return null;
  const scale = axis.scale;
  const textY = axis?.height + axis?.top + 20;

  return (
    <g>
      {yearSpans.map(({ year, startIdx, endIdx }) => {
        const mid = scale(startIdx) + (scale(endIdx) - scale(startIdx)) / 2;
        return (
          <text
            key={year}
            x={mid}
            y={textY}
            textAnchor="middle"
            fontSize={12}
            fill={COLOR_AXIS}
            fontFamily={FONT_MONO}
            fontWeight={500}
          >
            {year}
          </text>
        );
      })}
    </g>
  );
}

/* ==============================  MAIN COMPONENT  =========================== */
export default function SAQ({
  startDate,
  endDate,
  supplierIds, // number | string | (number[] | string[])
  skuIds,
  plantIds,
  countryIds,
  stateIds,
}) {
  const [gran, setGran] = useState("m");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [showStandard, setShowStandard] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showQuantity, setShowQuantity] = useState(true);

  /* ============================  FETCH DATA  =============================== */
  useEffect(() => {
    if (!startDate || !endDate) return;

    // --- Normalize to a SINGLE numeric supplier_id ---
    let supplierId;

    if (Array.isArray(supplierIds) && supplierIds.length > 0) {
      supplierId = Number(supplierIds[0]);
    } else if (supplierIds !== null && supplierIds !== undefined) {
      supplierId = Number(supplierIds);
    }

    // Fallback: if nothing valid selected, either default or stop.
    if (!Number.isFinite(supplierId)) {
      // If you want no data until a supplier is selected, use:
      // setRows([]);
      // setLoading(false);
      // return;

      // Using 7 as default as per your service code:
      supplierId = 7;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = {
          supplier_id: supplierId, // ✅ always number
          start_date: startDate,
          end_date: endDate,
          country_ids: Array.isArray(countryIds) ? countryIds : [],
          state_ids: Array.isArray(stateIds) ? stateIds : [],
          plant_ids: Array.isArray(plantIds) ? plantIds : [],
          sku_ids: Array.isArray(skuIds) ? skuIds : [],
        };

        console.log("📤 SAQ payload:", payload);

        const { data } = await axios.post(`${API_BASE_URL}/saq/chart`, payload);

        const formatted =
          Array.isArray(data) && data.length > 0
            ? data.map((item) => ({
                date_value: item.date_value,
                standard_price: parseFloat(item.standard_price),
                actual_price: parseFloat(item.actual_price),
                quantity: parseFloat(item.quantity),
              }))
            : [];

        setRows(formatted);
      } catch (error) {
        console.error("❌ Error fetching SAQ chart:", error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supplierIds, startDate, endDate, countryIds, stateIds, plantIds, skuIds]);

  /* ===========================  PROCESS DATA  ============================== */
  const normalized = useMemo(
    () =>
      [...rows]
        .sort((a, b) => compareDateOnly(a.date_value, b.date_value))
        .map((r) => ({
          iso: r.date_value,
          year: yearNum(r.date_value),
          monthShort: monthShort(r.date_value),
          isHist: isHistorical(r.date_value),
          std: num(r.standard_price),
          act: num(r.actual_price),
          qty: num(r.quantity),
        })),
    [rows]
  );

  const firstForecastIdx = useMemo(
    () => Math.max(0, normalized.findIndex((d) => !d.isHist)),
    [normalized]
  );

  const chartData = useMemo(() => {
    const lastHistIdx = firstForecastIdx > 0 ? firstForecastIdx - 1 : -1;
    return normalized.map((d, idx) => ({
      xLabel: `${d.monthShort} ${d.year}`,
      iso: d.iso,
      year: d.year,
      quantity_hist: d.isHist ? d.qty : null,
      quantity_fore: !d.isHist ? d.qty : null,
      standard_hist: d.isHist ? d.std : null,
      standard_fore: !d.isHist || idx === lastHistIdx ? d.std : null,
      actual_hist: d.isHist ? d.act : null,
      actual_fore: !d.isHist || idx === lastHistIdx ? d.act : null,
    }));
  }, [normalized, firstForecastIdx]);

  const yearSpans = useMemo(() => {
    const map = new Map();
    normalized.forEach((d, i) => {
      const arr = map.get(d.year) || [];
      arr.push(i);
      map.set(d.year, arr);
    });
    return Array.from(map.entries()).map(([year, idxs]) => ({
      year,
      startIdx: idxs[0],
      endIdx: idxs[idxs.length - 1],
    }));
  }, [normalized]);

  const janIndexes = useMemo(
    () =>
      normalized
        .map((d, i) => (d.monthShort === "Jan" ? i : -1))
        .filter((i) => i !== -1),
    [normalized]
  );

  const tableGroups = useMemo(() => {
    const map = new Map();
    normalized.forEach((d) => {
      const arr = map.get(d.year) || [];
      arr.push(d);
      map.set(d.year, arr);
    });
    return Array.from(map.entries()).map(([year, months]) => ({
      year,
      months,
    }));
  }, [normalized]);

  /* ==============================  UI  ===================================== */
  return (
    <Box sx={{ pt: 1.3, px: 2, pb: 2, fontFamily: FONT_MONO }}>
      {/* Top Granularity Pills */}
      <Grid container alignItems="center" spacing={2} sx={{ mb: 1 }}>
        {["W", "M", "Q"].map((label) => (
          <Grid item key={label}>
            <Box
              onClick={() => setGran(label.toLowerCase())}
              sx={{
                border: "1.5px solid #0284C7",
                borderRadius: "9999px",
                px: 1.8,
                py: 0.3,
                minWidth: 32,
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.8rem",
                color: gran === label.toLowerCase() ? "#fff" : "#0284C7",
                backgroundColor:
                  gran === label.toLowerCase() ? "#0284C7" : "#fff",
              }}
            >
              {label}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Metric Toggles */}
      <Box
        sx={{
          mt: 1,
          mb: 1.5,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
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
        ].map((btn) => (
          <Box
            key={btn.label}
            onClick={btn.toggle}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.8,
              py: 0.8,
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: btn.active ? "#F8FBFF" : "#F8FAFC",
              border: "1.5px solid #D1D5DB",
              boxShadow: btn.active
                ? "0px 2px 5px rgba(0,0,0,0.05)"
                : "0px 1px 3px rgba(0,0,0,0.03)",
              transition: "all 0.25s ease",
              "&:hover": { backgroundColor: "#F1F5F9" },
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: btn.color,
              }}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "#374151", fontSize: "0.9rem" }}
            >
              {btn.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Chart */}
      <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No SAQ data for the selected filters.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                height: 440,
                minWidth: Math.max(chartData.length * 80, 1200),
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 40, bottom: 40, left: 8 }}
                >
                  <CartesianGrid stroke={COLOR_GRID} vertical={false} />

                  <XAxis
                    dataKey="xLabel"
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: COLOR_TEXT }}
                    axisLine={{ stroke: COLOR_AXIS }}
                    tickLine={{ stroke: COLOR_GRID }}
                    interval={0}
                  />

                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: COLOR_TEXT }}
                    axisLine={{ stroke: COLOR_AXIS }}
                    tickLine={{ stroke: COLOR_GRID }}
                    label={{
                      value: "Standard & Actual Price ($)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      dy: 40,
                      dx: -4,
                      style: {
                        fontSize: 13,
                        fill: COLOR_AXIS,
                        fontFamily: FONT_MONO,
                        fontWeight: 500,
                      },
                    }}
                  />

                  {showQuantity && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12, fill: COLOR_TEXT }}
                      axisLine={{ stroke: COLOR_AXIS, strokeWidth: 1 }}
                      tickLine={{ stroke: COLOR_GRID }}
                      label={{
                        value: "Quantity",
                        angle: 90,
                        position: "insideRight",
                        style: {
                          fontSize: 13,
                          fill: COLOR_AXIS,
                          fontFamily: FONT_MONO,
                          fontWeight: 500,
                        },
                      }}
                    />
                  )}

                  {janIndexes.map((x) => (
                    <ReferenceLine
                      key={x}
                      x={x}
                      stroke={COLOR_DIVIDER}
                      strokeWidth={1.5}
                      ifOverflow="extendDomain"
                    />
                  ))}

                  <Customized component={<YearLabels yearSpans={yearSpans} />} />

                  {showQuantity && (
                    <>
                      <Bar
                        yAxisId="right"
                        dataKey="quantity_hist"
                        fill={COLOR_QUANTITY}
                        barSize={18}
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="quantity_fore"
                        fill={COLOR_QUANTITY}
                        barSize={18}
                        shape={<ForecastBarShape />}
                      />
                    </>
                  )}

                  {showStandard && (
                    <>
                      <Line
                        yAxisId="left"
                        type="linear"
                        dataKey="standard_hist"
                        stroke={COLOR_STANDARD}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        connectNulls
                      />
                      <Line
                        yAxisId="left"
                        type="linear"
                        dataKey="standard_fore"
                        stroke={COLOR_STANDARD}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2 }}
                        connectNulls
                      />
                    </>
                  )}

                  {showActual && (
                    <>
                      <Line
                        yAxisId="left"
                        type="linear"
                        dataKey="actual_hist"
                        stroke={COLOR_ACTUAL}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        connectNulls
                      />
                      <Line
                        yAxisId="left"
                        type="linear"
                        dataKey="actual_fore"
                        stroke={COLOR_ACTUAL}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2 }}
                        connectNulls
                      />
                    </>
                  )}

                  <Tooltip
                    cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${COLOR_CARD_BORDER}`,
                      backgroundColor: "#F8FAFC",
                      fontSize: "0.8rem",
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Table */}
      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              borderCollapse: "collapse",
              "& td, & th": { border: `1px solid ${COLOR_CARD_BORDER}` },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: COLOR_TABLE_HEAD_BG,
                    fontWeight: 700,
                    width: 200,
                  }}
                />
                {tableGroups.map(({ year, months }) => (
                  <TableCell
                    key={year}
                    align="center"
                    colSpan={months.length}
                    sx={{
                      bgcolor: COLOR_TABLE_HEAD_BG,
                      fontWeight: 700,
                      color: COLOR_TEXT,
                    }}
                  >
                    {year}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ bgcolor: COLOR_TABLE_SUBHEAD_BG, fontWeight: 700 }}
                />
                {tableGroups.flatMap(({ months }) =>
                  months.map((m) => (
                    <TableCell
                      key={m.iso}
                      align="center"
                      sx={{
                        bgcolor: COLOR_TABLE_SUBHEAD_BG,
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      {m.monthShort}
                    </TableCell>
                  ))
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {showStandard && (
                <Fade in={showStandard} timeout={400}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Standard Price ($)
                    </TableCell>
                    {tableGroups.flatMap(({ months }) =>
                      months.map((m) => (
                        <TableCell key={`std-${m.iso}`} align="center">
                          {m.std.toFixed(2)}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </Fade>
              )}

              {showActual && (
                <Fade in={showActual} timeout={400}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Actual Price ($)
                    </TableCell>
                    {tableGroups.flatMap(({ months }) =>
                      months.map((m) => (
                        <TableCell key={`act-${m.iso}`} align="center">
                          {m.act.toFixed(2)}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </Fade>
              )}

              {showQuantity && (
                <Fade in={showQuantity} timeout={400}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    {tableGroups.flatMap(({ months }) =>
                      months.map((m) => (
                        <TableCell key={`qty-${m.iso}`} align="center">
                          {m.qty.toLocaleString()}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </Fade>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
