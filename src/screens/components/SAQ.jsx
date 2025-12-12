import React, { useEffect, useMemo, useState, useRef } from "react";
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
  IconButton,
  Dialog,
} from "@mui/material";
import { Drawer, Divider, Stack, Popover, Button } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

/* ==========================  CONFIG & CONSTANTS  =========================== */

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
const DEFAULT_SAQ_SERIES_COLORS = {
  standard: COLOR_STANDARD,
  actual: COLOR_ACTUAL,
  quantity: COLOR_QUANTITY,
};
const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let parsed = hex.replace("#", "");
  if (parsed.length === 3) {
    parsed = parsed
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const hexToHsv = (hex) => {
  let parsed = (hex || "#000000").replace("#", "");
  if (parsed.length === 3) {
    parsed = parsed
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(parsed.slice(0, 2), 16) / 255;
  const g = parseInt(parsed.slice(2, 4), 16) / 255;
  const b = parseInt(parsed.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  return { h, s, v };
};

const hsvToHex = ({ h, s, v }) => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (value) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Default SAQ filter values when parent doesn't pass anything
 * or passes empty arrays.
 */
const DEFAULT_SAQ_FILTERS = {
  startDate: "2024-05-30",
  endDate: "2026-06-30",
  skuIds: [8],
  countryIds: [12],
  stateIds: [27],
  plantIds: [15],
  supplierIds: [7],
};

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
  const strokeColor = fill || COLOR_FORECAST_BAR_STROKE;
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
      stroke={strokeColor}
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

/**
 * Format the X-axis label so that:
 * - First month of each year -> "Jun 2024"
 * - Remaining months of same year -> "Jul 24", "Aug 24", ...
 */
const formatXAxisLabel = (d, idx, arr) => {
  const yearFull = d.year.toString();
  const yearShort = yearFull.slice(-2);
  if (idx === 0) return `${d.monthShort} ${yearFull}`;

  const prevYear = arr[idx - 1]?.year;
  if (prevYear !== d.year) {
    // first month of a new year
    return `${d.monthShort} ${yearFull}`;
  }

  // same year as previous -> use 2-digit year
  return `${d.monthShort} ${yearShort}`;
};

const TOOLTIP_ORDER = {
  "Actual Price": 0,
  "Standard Price": 1,
  Quantity: 2,
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const seen = new Set();
  const uniquePayload = [];
  payload.forEach((item) => {
    const key = item?.name;
    if (!key || seen.has(key)) return;
    seen.add(key);
    uniquePayload.push(item);
  });
  uniquePayload.sort((a, b) => {
    const orderA = TOOLTIP_ORDER.hasOwnProperty(a.name)
      ? TOOLTIP_ORDER[a.name]
      : 99;
    const orderB = TOOLTIP_ORDER.hasOwnProperty(b.name)
      ? TOOLTIP_ORDER[b.name]
      : 99;
    return orderA - orderB;
  });

  return (
    <Box
      sx={{
        p: 1.2,
        borderRadius: 1.5,
        border: `1px solid ${COLOR_CARD_BORDER}`,
        backgroundColor: "#fff",
        minWidth: 170,
      }}
    >
      <Typography sx={{ fontWeight: 600, mb: 0.5, color: COLOR_TEXT }}>
        {label}
      </Typography>
      {uniquePayload.map((item) => (
        <Typography
          key={item.name}
          sx={{
            fontSize: "0.8rem",
            lineHeight: 1.4,
            color: item.color || item.stroke || COLOR_TEXT,
          }}
        >
          {item.name}:{" "}
          <strong>
            {typeof item.value === "number"
              ? item.value.toLocaleString("en-US", { maximumFractionDigits: 2 })
              : item.value}
          </strong>
        </Typography>
      ))}
    </Box>
  );
};

/* ==============================  MAIN COMPONENT  =========================== */

export default function SAQ({
  startDate,
  endDate,
  supplierIds,
  skuIds,
  plantIds,
  countryIds,
  stateIds,
}) {
  const [gran] = useState("m");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [showStandard, setShowStandard] = useState(true);
  const [showStandardForecast, setShowStandardForecast] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showActualForecast, setShowActualForecast] = useState(true);
  const [showQuantity, setShowQuantity] = useState(true); // actual quantity
  const [showQuantityForecast, setShowQuantityForecast] = useState(true);

  const [fullscreen, setFullscreen] = useState(false);
  const [downloadingChart, setDownloadingChart] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [seriesColors, setSeriesColors] = useState(
    DEFAULT_SAQ_SERIES_COLORS
  );

  const baseLineStyle = useRef({
    strokeWidth: 2.6,
    dot: false,
    strokeLinecap: "round",
  }).current;

  const buildActiveDot = (color) => ({
    stroke: color,
    strokeWidth: 2,
    fill: "#fff",
    r: 4.5,
  });
  const HUE_SLIDER_HEIGHT = 140;
  const [colorPicker, setColorPicker] = useState({
    open: false,
    key: "",
    anchorEl: null,
    hsv: { h: 0, s: 0, v: 1 },
  });
  const handleColorSwatchClick = (key) => (event) => {
    const current = seriesColors[key];
    setColorPicker({
      open: true,
      key,
      anchorEl: event.currentTarget,
      hsv: hexToHsv(current),
    });
  };
  const closeColorPicker = () =>
    setColorPicker((prev) => ({ ...prev, open: false, anchorEl: null }));
  const colorPickerLabel = useMemo(() => {
    if (!colorPicker.key) return "Series";
    switch (colorPicker.key) {
      case "standard":
        return "Standard Price";
      case "actual":
        return "Actual Price";
      case "quantity":
        return "Quantity";
      default:
        return "Series";
    }
  }, [colorPicker.key]);
  const colorPopoverHex = useMemo(
    () => hsvToHex(colorPicker.hsv),
    [colorPicker.hsv]
  );
  const huePreviewHex = useMemo(
    () => hsvToHex({ h: colorPicker.hsv.h, s: 1, v: 1 }),
    [colorPicker.hsv.h]
  );
  const satPointerLeft = `${Math.min(Math.max(colorPicker.hsv.s, 0), 1) * 100}%`;
  const satPointerTop = `${
    (1 - Math.min(Math.max(colorPicker.hsv.v, 0), 1)) * 100
  }%`;
  const normalizedHue = ((colorPicker.hsv.h % 360) + 360) % 360 || 0;
  const huePointerTopPx = useMemo(() => {
    const ratio = Math.max(0, Math.min(1, normalizedHue / 360));
    return ratio * HUE_SLIDER_HEIGHT;
  }, [normalizedHue]);
  const satRef = useRef(null);
  const hueRef = useRef(null);
  const dragState = useRef({ mode: null });
  const chartCaptureRef = useRef(null);
  const applyPickedColor = (nextHsv, target = colorPicker) => {
    const hex = hsvToHex(nextHsv);
    setSeriesColors((prev) => ({ ...prev, [target.key]: hex }));
  };
  const beginDrag = (mode) => {
    dragState.current = { mode };
  };
  const stopDrag = () => {
    dragState.current = { mode: null };
  };
  const normalizePointerEvent = (event) =>
    event?.touches?.[0] || event?.changedTouches?.[0] || event;
  const updateSatFromEvent = (event) => {
    if (!satRef.current) return;
    const point = normalizePointerEvent(event);
    if (!point) return;
    const rect = satRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, point.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, point.clientY - rect.top), rect.height);
    const s = x / rect.width;
    const v = 1 - y / rect.height;
    setColorPicker((prev) => {
      const hsv = { ...prev.hsv, s, v };
      applyPickedColor(hsv, prev);
      return { ...prev, hsv };
    });
  };
  const updateHueFromEvent = (event) => {
    if (!hueRef.current) return;
    const point = normalizePointerEvent(event);
    if (!point) return;
    const rect = hueRef.current.getBoundingClientRect();
    const sliderHeight = rect.height || HUE_SLIDER_HEIGHT;
    const offset = point.clientY - rect.top;
    const y = Math.min(Math.max(0, offset), sliderHeight);
    const h = Math.min(359.999, Math.max(0, (y / sliderHeight) * 360));
    setColorPicker((prev) => {
      const hsv = { ...prev.hsv, h };
      applyPickedColor(hsv, prev);
      return { ...prev, hsv };
    });
  };
  useEffect(() => {
    const handleMove = (event) => {
      if (dragState.current.mode === "sat") updateSatFromEvent(event);
      else if (dragState.current.mode === "hue") updateHueFromEvent(event);
    };
    const handleUp = () => stopDrag();
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    window.addEventListener("touchcancel", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("touchcancel", handleUp);
    };
  }, []);
  useEffect(() => {
    if (!colorPicker.open) stopDrag();
  }, [colorPicker.open]);

  const handleDownloadChart = async () => {
    if (!chartCaptureRef.current || downloadingChart) return;
    try {
      setDownloadingChart(true);
      const canvas = await html2canvas(chartCaptureRef.current, {
        backgroundColor: "#ffffff",
        scale: window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2) : 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const orientation = canvas.width >= canvas.height ? "l" : "p";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("saq-chart.pdf");
    } catch (error) {
      console.error("Failed to download SAQ chart", error);
    } finally {
      setDownloadingChart(false);
    }
  };

  /* =======================  EFFECTIVE FILTERS (WITH DEFAULTS)  ======================= */

  const effectiveFilters = useMemo(() => {
    const safeArrayOrDefault = (value, defaultArr) => {
      if (Array.isArray(value) && value.length > 0) return value;
      return defaultArr;
    };

    return {
      startDate: startDate || DEFAULT_SAQ_FILTERS.startDate,
      endDate: endDate || DEFAULT_SAQ_FILTERS.endDate,
      supplierIds: safeArrayOrDefault(
        supplierIds,
        DEFAULT_SAQ_FILTERS.supplierIds
      ),
      skuIds: safeArrayOrDefault(skuIds, DEFAULT_SAQ_FILTERS.skuIds),
      countryIds: safeArrayOrDefault(
        countryIds,
        DEFAULT_SAQ_FILTERS.countryIds
      ),
      stateIds: safeArrayOrDefault(stateIds, DEFAULT_SAQ_FILTERS.stateIds),
      plantIds: safeArrayOrDefault(plantIds, DEFAULT_SAQ_FILTERS.plantIds),
    };
  }, [startDate, endDate, supplierIds, skuIds, plantIds, countryIds, stateIds]);

  /* ============================  FETCH DATA  =============================== */

  useEffect(() => {
    const {
      startDate: effStart,
      endDate: effEnd,
      supplierIds: effSupplierIds,
      countryIds: effCountryIds,
      stateIds: effStateIds,
      plantIds: effPlantIds,
      skuIds: effSkuIds,
    } = effectiveFilters;

    if (!effStart || !effEnd) return;

    // Normalize to a single numeric supplier_id
    let supplierId = null;

    if (Array.isArray(effSupplierIds) && effSupplierIds.length > 0) {
      supplierId = Number(effSupplierIds[0]);
    } else if (effSupplierIds !== null && effSupplierIds !== undefined) {
      supplierId = Number(effSupplierIds);
    }

    if (!Number.isFinite(supplierId) || supplierId <= 0) {
      supplierId = DEFAULT_SAQ_FILTERS.supplierIds[0]; // safety net
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = {
          supplier_id: supplierId,
          start_date: effStart,
          end_date: effEnd,
          country_ids: effCountryIds,
          state_ids: effStateIds,
          plant_ids: effPlantIds,
          sku_ids: effSkuIds,
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
  }, [effectiveFilters]);

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
    () =>
      Math.max(
        0,
        normalized.findIndex((d) => !d.isHist)
      ),
    [normalized]
  );

  const chartData = useMemo(() => {
    const lastHistIdx = firstForecastIdx > 0 ? firstForecastIdx - 1 : -1;

    return normalized.map((d, idx, arr) => ({
      xLabel: formatXAxisLabel(d, idx, arr),
      iso: d.iso,
      year: d.year,

      // Quantity
      quantity_hist: d.isHist ? d.qty : null,
      quantity_fore: !d.isHist ? d.qty : null,

      // Standard Price
      standard_hist: d.isHist ? d.std : null,
      standard_fore: !d.isHist || idx === lastHistIdx ? d.std : null,

      // Actual Price
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

  /* ==============================  CHART RENDER HELPER  ==================== */

  const renderChartContent = () => {
    if (loading) {
      return (
        <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (rows.length === 0) {
      return (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No SAQ data for the selected filters.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ overflowX: "auto" }}>
        <Box
          sx={{
            height: 440,
            minWidth: Math.max(chartData.length * 55, 800),
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 40, bottom: 40, left: 8 }}
              barCategoryGap="10%"
            >
              <CartesianGrid stroke={COLOR_GRID} vertical={false} />

              <XAxis
                dataKey="xLabel"
                tickMargin={8}
                tick={{ fontSize: 12, fill: COLOR_TEXT }}
                axisLine={{ stroke: COLOR_AXIS }}
                tickLine={{ stroke: COLOR_GRID }}
                interval={0}
                padding={{ left: 0, right: 0 }}
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

              {(showQuantity || showQuantityForecast) && (
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

              {(showQuantity || showQuantityForecast) && (
                <>
                  {showQuantity && (
                    <Bar
                      yAxisId="right"
                      dataKey="quantity_hist"
                      name="Quantity"
                      fill={seriesColors.quantity}
                      barSize={18}
                      radius={[6, 6, 0, 0]}
                      stackId="qty"
                    />
                  )}
                  {showQuantityForecast && (
                    <Bar
                      yAxisId="right"
                      dataKey="quantity_fore"
                      name="Quantity Forecast"
                      fill={seriesColors.quantity}
                      barSize={18}
                      shape={<ForecastBarShape />}
                      stackId="qty"
                    />
                  )}
                </>
              )}

              {showStandard && (
                <>
                  <Line
                    yAxisId="left"
                    type="linear"
                    dataKey="standard_hist"
                    name="Standard Price"
                    stroke={seriesColors.standard}
                    activeDot={buildActiveDot(seriesColors.standard)}
                    connectNulls={false}
                    {...baseLineStyle}
                  />
                  {showStandardForecast && (
                    <Line
                      yAxisId="left"
                      type="linear"
                      dataKey="standard_fore"
                      name="Standard Price Forecast"
                      stroke={seriesColors.standard}
                      strokeDasharray="4 4"
                      activeDot={buildActiveDot(seriesColors.standard)}
                      connectNulls={false}
                      {...baseLineStyle}
                    />
                  )}
                </>
              )}

              {showActual && (
                <>
                  <Line
                    yAxisId="left"
                    type="linear"
                    dataKey="actual_hist"
                    name="Actual Price"
                    stroke={seriesColors.actual}
                    activeDot={buildActiveDot(seriesColors.actual)}
                    connectNulls={false}
                    {...baseLineStyle}
                  />
                  {showActualForecast && (
                    <Line
                      yAxisId="left"
                      type="linear"
                      dataKey="actual_fore"
                      name="Actual Price Forecast"
                      stroke={seriesColors.actual}
                      strokeDasharray="4 4"
                      activeDot={buildActiveDot(seriesColors.actual)}
                      connectNulls={false}
                      {...baseLineStyle}
                    />
                  )}
                </>
              )}

              <Tooltip
                cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                content={<ChartTooltip />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  };

  /* ==============================  UI  ===================================== */

  return (
    <Box sx={{ pt: 1.3, px: 2, pb: 2, fontFamily: FONT_MONO }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 16,
          color: "#6b6b6b",
          mb: 2,
        }}
      >
        SAQ Monthly Performance Chart
      </Typography>

      {/* Metric + Forecast legends + Top-right Icons */}
      <Box
        sx={{
          mt: 1,
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Legend-like metric toggles + forecast chips (left) */}
        <Box
          sx={{
            display: "flex",
            gap: 1.4,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "Standard Price ($)",
              color: seriesColors.standard,
              active: showStandard,
              toggle: () => setShowStandard((p) => !p),
            },
            {
              label: "Actual Price ($)",
              color: seriesColors.actual,
              active: showActual,
              toggle: () => setShowActual((p) => !p),
            },
            {
              label: "Quantity",
              color: seriesColors.quantity,
              active: showQuantity,
              toggle: () => setShowQuantity((p) => !p),
            },
            // Forecast legend chips (independent toggles)
            ...[
              {
                label: "Quantity Forecast",
                color: seriesColors.quantity,
                active: showQuantityForecast,
                isForecast: true,
                toggle: () => setShowQuantityForecast((p) => !p),
              },
              {
                label: "Actual Price Forecast",
                color: seriesColors.actual,
                active: showActualForecast,
                isForecast: true,
                toggle: () => setShowActualForecast((p) => !p),
              },
              {
                label: "Standard Price Forecast",
                color: seriesColors.standard,
                active: showStandardForecast,
                isForecast: true,
                toggle: () => setShowStandardForecast((p) => !p),
              },
            ],
          ].flat().map((btn) => (
            <Box
              key={btn.label}
              onClick={btn.toggle}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: btn.isForecast ? 0.8 : 0.6,
                px: 1.1,
                py: 0.55,
                borderRadius: "10px",
                cursor: "pointer",
                minWidth: 140,
                height: 32,
                backgroundColor: btn.active ? "#F8FBFF" : "#F9FAFB",
                border: btn.active
                  ? "1px solid #D1D5DB"
                  : "1px solid #E5E7EB",
                boxShadow: btn.active
                  ? "0px 1px 3px rgba(0,0,0,0.06)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: btn.active ? "#EEF2FF" : "#F3F4F6",
                },
                opacity: btn.active ? 1 : 0.6,
                }}
              >
                {btn.isForecast ? (
                  <Box
                    sx={{
                      width: 24,
                      height: 3,
                      backgroundImage: `repeating-linear-gradient(90deg, ${btn.active ? btn.color : "#CBD5E1"}, ${btn.active ? btn.color : "#CBD5E1"} 6px, transparent 6px, transparent 12px)`,
                      borderRadius: "3px",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: btn.active ? btn.color : "#D1D5DB",
                      flexShrink: 0,
                    }}
                  />
                )}
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  color: btn.active ? "#374151" : "#9CA3AF",
                  fontSize: "0.8rem",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                {btn.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Icons on the right (same style as your Highcharts toolbar) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.3,
          }}
        >
          <IconButton
            size="small"
            onClick={handleDownloadChart}
            disabled={downloadingChart}
            aria-label="Download chart as PDF"
          >
            <DownloadIcon
              sx={{
                width: 20,
                height: 20,
                color: "text.secondary",
              }}
            />
          </IconButton>
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Chart */}
      <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton
            size="small"
            onClick={() => setFullscreen(true)}
            aria-label="Fullscreen chart"
          >
            <FullscreenIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box ref={chartCaptureRef}>{renderChartContent()}</Box>
      </Paper>

      {/* Fullscreen dialog */}
      <Dialog fullScreen open={fullscreen} onClose={() => setFullscreen(false)}>
        <Box
          sx={{
            p: 2,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">SAQ Chart</Typography>
            <IconButton
              onClick={() => setFullscreen(false)}
              aria-label="Exit fullscreen"
            >
              <FullscreenExitIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>{renderChartContent()}</Box>
        </Box>
      </Dialog>

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
                <Fade in={showStandard} timeout={600}>
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
                <Fade in={showActual} timeout={600}>
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

      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: { width: 320, p: 3 },
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <SettingsIcon sx={{ color: "#6b7280", fontSize: 18 }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#4b5563",
                  letterSpacing: 0.2,
                }}
              >
                Graph Configuration
              </Typography>
            </Stack>
            <IconButton size="small" onClick={() => setSettingsOpen(false)}>
              <CloseIcon sx={{ color: "#6b7280", fontSize: 18 }} />
            </IconButton>
          </Stack>
          <Divider />
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ color: "text.secondary" }}
          >
            Series Colors
          </Typography>
          <Stack spacing={1.2}>
            {[
              { key: "standard", label: "Standard Price" },
              { key: "actual", label: "Actual Price" },
              { key: "quantity", label: "Quantity" },
            ].map((entry) => (
              <Box
                key={entry.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.4,
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "2px",
                      bgcolor: seriesColors[entry.key],
                      border: "1px solid rgba(15,23,42,0.15)",
                    }}
                  />
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    {entry.label}
                  </Typography>
                </Stack>
                <Box
                  role="button"
                  tabIndex={0}
                  aria-label={`Change ${entry.label} color`}
                  onClick={handleColorSwatchClick(entry.key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleColorSwatchClick(entry.key)(event);
                    }
                  }}
                  sx={{
                    width: 32,
                    height: 28,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    bgcolor: "#f8fafc",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "6px",
                      bgcolor: seriesColors[entry.key],
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Drawer>
      <Popover
        open={colorPicker.open}
        anchorEl={colorPicker.anchorEl}
        onClose={closeColorPicker}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow:
              "0px 16px 32px rgba(15,23,42,0.18), 0px 2px 8px rgba(15,23,42,0.12)",
            p: 2,
            width: 260,
          },
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}
            >
              {colorPickerLabel}
            </Typography>
            <Typography
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              {colorPopoverHex.toUpperCase()}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="stretch">
            <Box
              ref={satRef}
              onMouseDown={(event) => {
                event.preventDefault();
                beginDrag("sat");
                updateSatFromEvent(event);
              }}
              onTouchStart={(event) => {
                event.preventDefault();
                beginDrag("sat");
                updateSatFromEvent(event);
              }}
              sx={{
                width: 180,
                height: 140,
                borderRadius: "12px",
                position: "relative",
                background: `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)), linear-gradient(90deg, #ffffff, ${huePreviewHex})`,
                cursor: "crosshair",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  boxShadow: "0 0 6px rgba(15,23,42,0.4)",
                  transform: "translate(-50%, -50%)",
                  left: satPointerLeft,
                  top: satPointerTop,
                }}
              />
            </Box>
            <Box
              ref={hueRef}
              onMouseDown={(event) => {
                event.preventDefault();
                beginDrag("hue");
                updateHueFromEvent(event);
              }}
              onTouchStart={(event) => {
                event.preventDefault();
                beginDrag("hue");
                updateHueFromEvent(event);
              }}
              sx={{
                width: 22,
                height: HUE_SLIDER_HEIGHT,
                borderRadius: "10px",
                background:
                  "linear-gradient(180deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                position: "relative",
                cursor: "ns-resize",
                border: "1px solid rgba(15,23,42,0.25)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  width: 18,
                  height: 6,
                  borderRadius: 999,
                  border: "1px solid #fff",
                  boxShadow: "0 1px 3px rgba(15,23,42,0.4)",
                  transform: "translate(-50%, -50%)",
                  top: `${huePointerTopPx}px`,
                  bgcolor: hexToRgba(huePreviewHex, 0.9),
                  cursor: "ns-resize",
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  beginDrag("hue");
                  updateHueFromEvent(event);
                }}
                onTouchStart={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  beginDrag("hue");
                  updateHueFromEvent(event);
                }}
              />
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button size="small" onClick={closeColorPicker}>
              Done
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
}
