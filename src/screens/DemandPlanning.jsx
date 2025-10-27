
import React, { useState, useEffect, useRef, useMemo, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  ListItemText,
  List,
  ListItem,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
  CircularProgress,
  Dialog,
  Slide,
  Card,
  CardContent,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  ChatBubbleOutline,
  MoreVert,
  Search as SearchIcon,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { format, addMonths, subMonths, parse } from "date-fns";
import DateFilter from "./components/DateFilter";
import ChatBot from "./components/Chatbox";

// Highcharts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Listbox = () => {
  const listItems = [{ id: 1, label: "Product Name" }];
  const [checked, setChecked] = useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);
    setChecked(newChecked);
  };
  return (
    <Box sx={{ bgcolor: "#EFF6FF", px: 0.5, py: 0.5, minWidth: 180 }}>
      <List disablePadding>
        {listItems.map((item) => (
          <ListItem
            key={item.id}
            disableGutters
            onClick={handleToggle(item.id)}
            sx={{
              px: 1.2,
              py: 0.5,
              mb: 0.5,
              borderRadius: 1,
              cursor: "pointer",
              "&:last-child": { mb: 0 },
            }}
          >
            <Checkbox
              checked={checked.indexOf(item.id) !== -1}
              tabIndex={-1}
              disableRipple
              sx={{
                p: 0,
                mr: 1.2,
                width: 22,
                height: 22,
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                  border: "2px solid #bcd0e5",
                  borderRadius: "4px",
                  color: "#fff",
                  background: "#fff",
                },
                "&.Mui-checked .MuiSvgIcon-root": {
                  color: "#0288d1",
                  background: "#fff",
                  border: "2px solid #0288d1",
                },
              }}
            />
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 17,
                fontWeight: 400,
                color: "#232b3a",
                fontFamily: "Poppins, Helvetica, Arial, sans-serif",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

function MultiSelectWithCheckboxes({
  label,
  options = [],
  optionKey,
  displayKey,
  selected,
  setSelected,
  width = 155,
  searchPlaceholder = "",
  loading = false,
  disabled = false,
  onOpen,
  single = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];

  const filteredOptions = safeOptions.filter((option) => {
    if (!search) return true;
    const searchField = displayKey ? option[displayKey] : option[optionKey];
    return (
      typeof searchField === "string" &&
      searchField.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isAllSelected =
    !single && safeOptions.length > 0 && selected.length === safeOptions.length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (onOpen) onOpen();
  };
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (anchorEl && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [anchorEl]);

  const handleSelectAll = () => {
    if (single) return;
    setSelected(isAllSelected ? [] : safeOptions.map((opt) => opt[optionKey]));
  };

  const handleToggle = (value) => {
    if (single) {
      if (selected.length === 0) setSelected([value]);
      else if (selected[0] === value) setSelected([]);
      return;
    }
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const getButtonLabel = () => {
    if (selected.length === 0) return label;
    if (single && selected.length === 1) {
      const found = safeOptions.find((opt) => opt[optionKey] === selected[0]);
      return found?.[displayKey || optionKey] || label;
    }
    if (!single && selected.length === 1) {
      const found = safeOptions.find((opt) => opt[optionKey] === selected[0]);
      return found?.[displayKey || optionKey] || label;
    }
    return `${selected.length} selected`;
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        sx={{
          minWidth: 120,
          flexShrink: 0,
          whiteSpace: "nowrap",
          bgcolor: "common.white",
          borderColor: "#bdbdbd",
          fontWeight: 400,
          textTransform: "none",
          px: 1.5,
          transition: "all 0.2s ease",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width,
          "& .MuiButton-endIcon": { m: 0 },
        }}
        disabled={disabled}
        endIcon={
          !single && selected.length > 0 ? (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Chip
                label={selected.length}
                size="small"
                color="primary"
                sx={{ height: 20 }}
              />
              <KeyboardArrowDownIcon
                sx={{ width: 16, height: 16, color: "#757575" }}
              />
            </Stack>
          ) : (
            <KeyboardArrowDownIcon
              sx={{ width: 16, height: 16, color: "#757575" }}
            />
          )
        }
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {getButtonLabel()}
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { width: 280 } }}
      >
        <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder={searchPlaceholder || `Search ${label.toLowerCase()}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
          </MenuItem>
        ) : filteredOptions.length > 0 ? (
          [
            !single && (
              <MenuItem onClick={handleSelectAll} key="all">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={selected.length > 0 && !isAllSelected}
                />
                <ListItemText primary="All" />
              </MenuItem>
            ),
            ...filteredOptions.map((option) => {
              const val = option[optionKey];
              const isSelected = selected.includes(val);
              const isInactive = single && selected.length === 1 && !isSelected;

              return (
                <MenuItem
                  key={String(val)}
                  onClick={() => handleToggle(val)}
                  dense
                  disabled={isInactive}
                  sx={{
                    opacity: isInactive ? 0.5 : 1,
                    cursor: isInactive ? "not-allowed" : "pointer",
                  }}
                >
                  <Checkbox checked={isSelected} disabled={isInactive} />
                  <ListItemText primary={option[displayKey || optionKey]} />
                </MenuItem>
              );
            }),
          ].filter(Boolean)
        ) : (
          <MenuItem disabled>
            <ListItemText primary="None" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const DataVisualizationSection = ({
  savingsCards,
  startDate,
  endDate,
  countryIds = [],
  stateIds = [],
  plantIds = [],
  skuIds = [],
  supplierIds = [],
  supplierLocations = [],
}) => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("M");

  // Base line chart
  const [lineCategories, setLineCategories] = useState([]);
  const [lineSeries, setLineSeries] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Toggles
  const [showForecast, setShowForecast] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showGlobal, setShowGlobal] = useState(false);

  // Alerts overlay (scatter dots)
  const [alertsRaw, setAlertsRaw] = useState([]);
  const [alertSeries, setAlertSeries] = useState([]);

  // Global Events overlay (vertical bars)
  const [globalRaw, setGlobalRaw] = useState([]);
  const [xPlotBands, setXPlotBands] = useState([]); // bars on xAxis
  const [eventsByX, setEventsByX] = useState({}); 

  /* Helpers */
  const firstOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const monthKey = (d) => format(d, "yyyy-MM");
  const buildMonthlyRange = (start, end) => {
    const out = [];
    const d = new Date(start.getFullYear(), start.getMonth(), 1);
    const stop = new Date(end.getFullYear(), end.getMonth(), 1);
    while (d <= stop) {
      out.push(new Date(d));
      d.setMonth(d.getMonth() + 1);
    }
    return out;
  };

  /* --------- Fetch base line chart (actual + forecast) --------- */
  useEffect(() => {
    if (!startDate || !endDate) return;

    const controller = new AbortController();
    const fetchChart = async () => {
      setChartLoading(true);
      try {
        const payload = {
          startDate,
          endDate,
          countryIds,
          stateIds,
          plantIds,
          skuIds,
          supplierIds,
          supplierLocations,
          includeForecast: true, 
        };

        const { data } = await axios.post(
          `${API_BASE_URL}/getLineChart`,
          payload,
          { signal: controller.signal }
        );

        const rows = Array.isArray(data) ? data : [];

        // Build X from the selected date range (guarantees months like 2026-04 show)
        const from = firstOfMonth(new Date(startDate));
        const to = firstOfMonth(new Date(endDate));
        const months = buildMonthlyRange(from, to);
        const categories = months.map((d) => format(d, "MMM yyyy"));
        setLineCategories(categories);

        // Build per-supplier series (actual vs forecast)
        const bySupplier = new Map();

        for (const r of rows) {
          const supplier = r.supplier_name || "Supplier";
          const m = firstOfMonth(new Date(r.forecast_month));
          const idx = months.findIndex(
            (d) => d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()
          );
          if (idx === -1) continue;

          const value = Number(r.ppv_variance_percentage);
          const type = (r.forecast_type || "actual").toLowerCase();

          if (!bySupplier.has(supplier)) {
            bySupplier.set(supplier, {
              actual: Array(months.length).fill(null),
              forecast: Array(months.length).fill(null),
            });
          }
          const bucket = bySupplier.get(supplier);

          if (type === "forecast") bucket.forecast[idx] = isFinite(value) ? value : null;
          else bucket.actual[idx] = isFinite(value) ? value : null;
        }

        // Ensure forecast starts AFTER last actual month (visually split)
        const colorBy = {
          "Global Parts Inc.": "#22c55e",
          "AutoMech Gumby": "#60a5fa",
          "AutoMech Gumbys": "#60a5fa",
          "Bharat Supplies": "#eab308",
        };

        const seriesOut = [];
        for (const [name, { actual, forecast }] of bySupplier.entries()) {
          // Find last index with an actual value
          let lastActualIdx = -1;
          for (let i = actual.length - 1; i >= 0; i--) {
            if (typeof actual[i] === "number") {
              lastActualIdx = i;
              break;
            }
          }

          // Null-out any forecast points up to and including last actual month
          const forecastTrimmed = forecast.map((v, i) =>
            i <= lastActualIdx ? null : v
          );

          // Actual series (solid)
          seriesOut.push({
            name,
            type: "line",
            data: actual,
            color: colorBy[name],
            marker: { enabled: true, radius: 3 },
            lineWidth: 2,
            tooltip: { valueSuffix: "%" },
            zIndex: 2,
          });

          // Forecast series (dotted), only if toggle is on and any values exist
          if (showForecast && forecastTrimmed.some((v) => typeof v === "number")) {
            seriesOut.push({
              name: `${name} (Forecast)`,
              type: "line",
              data: forecastTrimmed,
              color: colorBy[name],
              dashStyle: "ShortDash", 
              marker: { enabled: true, radius: 3 },
              lineWidth: 2,
              tooltip: { valueSuffix: "%" },
              zIndex: 1,
            });
          }
        }

        setLineSeries(seriesOut);
      } catch (e) {
        if (axios.isCancel?.(e)) return;
        setLineCategories([]);
        setLineSeries([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChart();
    return () => controller.abort();
    // re-run when filters/dates/toggle changes
  }, [
    startDate,
    endDate,
    countryIds,
    stateIds,
    plantIds,
    skuIds,
    supplierIds,
    supplierLocations,
    showForecast,
  ]);

  /* --------- Alerts overlay --------- */
  const fetchAlerts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getAlerts`);
      setAlertsRaw(Array.isArray(data) ? data : []);
    } catch {
      setAlertsRaw([]);
    }
  };

  useEffect(() => {
    if (!showAlerts || !lineCategories.length || !lineSeries.length) {
      setAlertSeries([]);
      return;
    }

    const emojiToColor = (emoji) => {
      switch (emoji) {
        case "🔴":
          return "#ef4444";
        case "🟠":
          return "#f59e0b";
        case "🟡":
          return "#eab308";
        case "🟢":
          return "#22c55e";
        default:
          return "#3b82f6";
      }
    };

    // Map base supplier series by normalized name (without " (Forecast)")
    const seriesBySupplier = new Map(
      lineSeries
        .filter((s) => s.type === "line")
        .map((s) => [s.name.replace(" (Forecast)", ""), s])
    );

    const points = [];
    for (const a of alertsRaw) {
      const date = new Date(a.date_value);
      const cat = format(firstOfMonth(date), "MMM yyyy");
      const xIndex = lineCategories.indexOf(cat);
      if (xIndex === -1) continue;

      const supplierSeries = seriesBySupplier.get(a.supplier_name);
      if (!supplierSeries) continue;

      const yVal = supplierSeries.data?.[xIndex];
      if (yVal == null || Number.isNaN(yVal)) continue;

      points.push({
        x: xIndex,
        y: yVal,
        name: a.alert_type,
        marker: {
          symbol: "circle",
          radius: 6,
          fillColor: emojiToColor(a.marker_color_emoji),
          lineColor: "#ffffff",
          lineWidth: 1.5,
        },
        custom: {
          tooltip: a.tooltip,
          severity: a.severity,
          supplier: a.supplier_name,
          emoji: a.marker_color_emoji,
          plant: a.plant_name,
          sku: a.sku_name,
        },
      });
    }

    setAlertSeries(
      points.length
        ? [
            {
              name: "Alerts",
              type: "scatter",
              data: points,
              zIndex: 10,
              enableMouseTracking: true,
              tooltip: { pointFormat: "" },
            },
          ]
        : []
    );
  }, [showAlerts, alertsRaw, lineCategories, lineSeries]);

  const combinedSeries = useMemo(
    () => (showAlerts ? [...lineSeries, ...alertSeries] : lineSeries),
    [lineSeries, alertSeries, showAlerts]
  );

  const handleAlertsToggle = async (e) => {
    const checked = e.target.checked;
    setShowAlerts(checked);
    if (checked && alertsRaw.length === 0) {
      await fetchAlerts();
    }
  };

  /* --------- Global Events overlay (vertical bars) --------- */
  const fetchGlobalEvents = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getGlobalEvents`);
      setGlobalRaw(Array.isArray(data) ? data : []);
    } catch {
      setGlobalRaw([]);
    }
  };

  useEffect(() => {
    if (!showGlobal || !lineCategories.length) {
      setXPlotBands([]);
      setEventsByX({});
      return;
    }

    const impactColor = (impact) => {
      switch ((impact || "").toLowerCase()) {
        case "high":
          return "rgba(244, 63, 94, 0.28)";
        case "medium":
          return "rgba(245, 158, 11, 0.22)";
        case "low":
          return "rgba(59, 130, 246, 0.18)";
        default:
          return "rgba(107,114,128,0.18)";
      }
    };

    const bands = [];
    const byX = {};

    globalRaw.forEach((ev, idx) => {
      const d = new Date(ev.date_value);
      const cat = format(firstOfMonth(d), "MMM yyyy");
      const xIdx = lineCategories.indexOf(cat);
      if (xIdx === -1) return;

      const width = 0.32; // narrow bar
      bands.push({
        id: `ge-${idx}-${xIdx}`,
        from: xIdx - width / 2,
        to: xIdx + width / 2,
        color: impactColor(ev.impact_level),
        zIndex: 3,
      });

      if (!byX[xIdx]) byX[xIdx] = [];
      (byX[xIdx] || []).push(ev);
    });

    setXPlotBands(bands);
    setEventsByX(byX);
  }, [showGlobal, globalRaw, lineCategories]);

  const handleGlobalToggle = async (e) => {
    const checked = e.target.checked;
    setShowGlobal(checked);
    if (checked && globalRaw.length === 0) {
      await fetchGlobalEvents();
    }
  };

  /* --------- Highcharts options (dynamic Y-range) --------- */
const options = useMemo(() => {
  // Collect all numeric y values (exclude scatter)
  const allY = [];
  combinedSeries.forEach((s) => {
    if (s.type === "line") {
      (s.data || []).forEach((v) => {
        if (typeof v === "number" && isFinite(v)) allY.push(v);
      });
    }
  });
  const yMin = allY.length ? Math.min(...allY) : -15;
  const yMax = allY.length ? Math.max(...allY) : 15;
  const pad = Math.max(2, (yMax - yMin) * 0.1);
  const softMin = Math.min(yMin - pad, -15);
  const softMax = Math.max(yMax + pad, 15);

  return {
    chart: {
      height: 440,
      spacing: [10, 16, 16, 16],
      backgroundColor: "transparent",
    },
    title: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    xAxis: {
      categories: lineCategories,
      tickmarkPlacement: "on",
      lineColor: "rgba(0,0,0,0.15)",
      tickColor: "rgba(0,0,0,0.2)",
      gridLineWidth: 1,
      gridLineColor: "rgba(0,0,0,0.08)",
      labels: { 
        style: { 
          color: "rgba(0,0,0,0.65)",
          fontSize: "11px",
          fontWeight: "500"
        } 
      },
      plotBands: showGlobal ? xPlotBands : [],
    },
    yAxis: {
      title: { text: null },
      min: softMin,
      max: softMax,
      gridLineColor: "rgba(0,0,0,0.1)",
      gridLineWidth: 1,
      labels: {
        formatter() {
          return `${this.value}%`;
        },
        style: { 
          color: "rgba(0,0,0,0.65)",
          fontSize: "11px",
          fontWeight: "500"
        },
      },
      // Background color zones (matching screenshot)
      plotBands: [
        { 
          from: 0, 
          to: softMax, 
          color: "rgba(255, 230, 230, 0.35)", // Light red for positive (unfavorable)
          zIndex: 0 
        },
        { 
          from: softMin, 
          to: 0, 
          color: "rgba(220, 250, 230, 0.35)", // Light green for negative (favorable)
          zIndex: 0 
        },
      ],
      plotLines: [
        { 
          value: 0, 
          color: "rgba(0,0,0,0.3)", 
          width: 2, 
          zIndex: 5,
          dashStyle: "Solid"
        }
      ],
    },
    legend: {
      align: "left",
      verticalAlign: "top",
      layout: "horizontal",
      itemStyle: { 
        color: "rgba(0,0,0,0.75)", 
        fontWeight: "500",
        fontSize: "12px"
      },
      symbolRadius: 0,
      symbolWidth: 16,
      symbolHeight: 3,
      itemMarginBottom: 8,
    },
    tooltip: {
      shared: true,
      borderColor: "rgba(0,0,0,0.15)",
      backgroundColor: "#ffffff",
      borderRadius: 8,
      shadow: {
        color: "rgba(0,0,0,0.1)",
        offsetX: 0,
        offsetY: 2,
        opacity: 0.15,
        width: 8
      },
      style: {
        fontSize: "12px",
        fontWeight: "500"
      },
      formatter() {
        const header = `<b style="font-size: 13px;">${this.x}</b>`;
        const lines = this.points.map((p) => {
          if (p.series.type === "scatter") {
            const c = p.point?.custom || {};
            return `${c.emoji || "⚠️"} <b>${c.severity || "Alert"}</b> — ${
              c.supplier || ""
            }<br/><span style="opacity:.85; font-size: 11px;">${c.tooltip || ""}</span>`;
          }
          const isForecast = p.series.name.includes("Forecast");
          const displayName = isForecast 
            ? p.series.name.replace(" (Forecast)", "") + " (Forecast)"
            : p.series.name;
          return `<span style="color:${p.color}">●</span> ${displayName}: <b>${p.y}%</b>`;
        });

        if (showGlobal && this.points?.length) {
          const xIdx =
            this.points[0]?.point?.x ?? lineCategories.indexOf(this.x);
          const evs = (eventsByX || {})[xIdx] || [];
          evs.forEach((ev) => {
            lines.push(
              `<span style="color: #1976d2;">▌</span> <b>Global:</b> ${ev.label} — <span style="opacity:.85;">${
                ev.country_name
              }</span><br/><span style="opacity:.75; font-size: 11px;">${
                ev.tooltip || ""
              }</span>`
            );
          });
        }
        return `${header}<br/>${lines.join("<br/>")}`;
      },
    },
    plotOptions: {
      series: {
        animation: false,
        connectNulls: false,
        states: { 
          hover: { 
            halo: { size: 8 },
            lineWidthPlus: 1
          }, 
          inactive: { opacity: 0.3 } 
        },
      },
      line: { 
        marker: { 
          lineWidth: 0,
          radius: 4,
          symbol: "circle"
        },
        lineWidth: 2.5
      },
      scatter: { 
        tooltip: { pointFormat: "" },
        marker: {
          radius: 7
        }
      },
    },
    series: combinedSeries,
    responsive: {
      rules: [
        {
          condition: { maxWidth: 700 },
          chartOptions: {
            legend: { layout: "horizontal", align: "center" },
            xAxis: { labels: { step: 2 } },
          },
        },
      ],
    },
  };
}, [lineCategories, combinedSeries, showGlobal, xPlotBands, eventsByX]);


  return (
    <Stack spacing="15px" sx={{ width: "100%" }}>
      <Box sx={{ bgcolor: "background.paper", border: 1, borderColor: "grey.300" }}>
        <Tabs
          value={selectedTab}
          onChange={(_, v) => {
            setSelectedTab(v);
            if (v === 2) navigate("/saq");
          }}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            minHeight: "auto",
            px: 1,
            "& .MuiTab-root": {
              minHeight: "auto",
              py: 0.75,
              px: 1.75,
              mr: 1,
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": { backgroundColor: "#EEF5FF" },
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "#DBEAFE",
              color: "#1F2937",
              fontWeight: 600,
              boxShadow: "inset 0 -2px 0 #1E88E5",
            },
          }}
        >
          <Tab label="PPV Forecast" disableRipple />
          <Tab label="Scorecard" disableRipple />
          <Tab label="SAQ" disableRipple />
        </Tabs>
      </Box>

      {/* Savings cards */}
      <Card sx={{ p: "15px", border: 1, borderColor: "grey.400" }}>
        <Stack spacing="15px">
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, fontSize: "16px", color: "text.secondary" }}
          >
            Savings by supplier in $
          </Typography>

          <Stack direction="row" spacing={2.5} flexWrap="wrap">
            {savingsCards.map((item, index) => (
              <Card
                key={index}
                sx={{ width: 262, p: 1.25, border: 1, borderColor: "grey.400" }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Stack direction="row" spacing="15px" alignItems="center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "rgba(68, 167, 247, 0.3)",
                      }}
                    >
                      <Box
                        component="img"
                        src="https://c.animaapp.com/nHl4a9qr/img/cash-coin-2.svg"
                        alt="Cash coin"
                        sx={{ width: 25, height: 25 }}
                      />
                    </Avatar>
                    <Stack spacing={0.5} flex={1}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, Helvetica",
                          fontWeight: item.isNegative ? 600 : 500,
                          fontSize: "20px",
                          lineHeight: "22px",
                          color: item.color,
                        }}
                      >
                        {item.amount}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, Helvetica",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "24px",
                          color: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {item.supplier}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* Chart */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.400",
          width: "100%",
          p: 1,
        }}
      >
        <Stack
          spacing="9px"
          sx={{ position: "absolute", top: 8, left: 8, right: 8, zIndex: 2 }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            flexWrap="wrap"
          >
            <Stack direction="row" spacing={1.25}>
              {["W", "M", "Q"].map((p) => (
                <Box
                  key={p}
                  sx={{
                    width: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 1.25,
                    py: 0,
                    borderRadius: "50px",
                    border: 1,
                    borderColor: "primary.dark",
                    cursor: "pointer",
                    bgcolor:
                      selectedPeriod === p ? "primary.main" : "transparent",
                  }}
                  onClick={() => setSelectedPeriod(p)}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "12px",
                      color:
                        selectedPeriod === p
                          ? "background.paper"
                          : "text.primary",
                    }}
                  >
                    {p}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showForecast}
                    onChange={(e) => setShowForecast(e.target.checked)}
                  />
                }
                label="6 Months Forecast"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "14px",
                    color: "text.primary",
                  },
                }}
              />
              <KeyboardArrowDownIcon sx={{ width: 16, height: 16 }} />
            </Stack>

            <FormControlLabel
              control={
                <Checkbox checked={showGlobal} onChange={handleGlobalToggle} />
              }
              label="Global Events"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                  color: "text.secondary",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox checked={showAlerts} onChange={handleAlertsToggle} />
              }
              label="Alerts"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                  color: "text.secondary",
                },
              }}
            />
          </Stack>
        </Stack>

        <Box sx={{ pt: 6 }}>
          {chartLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: 420 }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </Box>
      </Box>
    </Stack>
  );
};

const SupplierDataTableSection = ({
  startDate,
  endDate,
  countryIds = [],
  stateIds = [],
  plantIds = [],
  skuIds = [],
  supplierIds = [],
  supplierLocations = [],
}) => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]); // [{ key, date }]
  const [yearGroups, setYearGroups] = useState([]); // [{ year, months, lastIndex }]
  const [loading, setLoading] = useState(false);

  const COL_PX = 72;

  const bgFor = (v) => {
    if (v == null || Number.isNaN(v) || v === 0) return "#ffffff";
    if (v > 0) {
      if (v >= 10) return "#f44336";
      if (v >= 7) return "#e57373";
      if (v >= 4) return "#ef9a9a";
      return "#ffcdd2";
    } else {
      if (v <= -13) return "#43a047";
      if (v <= -10) return "#4caf50";
      if (v <= -7) return "#66bb6a";
      if (v <= -4) return "#a5d6a7";
      return "#c8e6c9";
    }
  };
  const textFor = (v, bg) => {
    if (Math.abs(v ?? 0) >= 7) return "#ffffff";
    if (bg === "#ef9a9a") return "#546e7a";
    return "#607d8b";
  };
  const fmtCell = (v) => {
    const n = typeof v === "string" ? parseFloat(v) : v;
    if (!Number.isFinite(n)) return "";
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const payload = {
          startDate,
          endDate,
          countryIds,
          stateIds,
          plantIds,
          skuIds,
          supplierIds,
          supplierLocations,
        };
        const { data } = await axios.post(`${API_BASE_URL}/getHeatMap`, payload);
        const arr = Array.isArray(data) ? data : [];

        const keys = new Set();
        arr.forEach((r) => {
          Object.keys(r).forEach((k) => {
            if (k !== "supplier_name") keys.add(k);
          });
        });

        const colList = Array.from(keys)
          .map((k) => {
            const d = parse(k, "MMM yyyy", new Date());
            return { key: k, date: d };
          })
          .sort((a, b) => a.date - b.date);

        setColumns(colList);

        const ymap = new Map();
        colList.forEach((c, idx) => {
          const y = format(c.date, "yyyy");
          const m = format(c.date, "MMM");
          if (!ymap.has(y))
            ymap.set(y, { year: y, months: [], lastIndex: idx });
          const g = ymap.get(y);
          g.months.push(m);
          g.lastIndex = idx;
        });
        setYearGroups(Array.from(ymap.values()));
        setRows(arr);
      } catch {
        setRows([]);
        setColumns([]);
        setYearGroups([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [startDate, endDate, countryIds, stateIds, plantIds, skuIds, supplierIds, supplierLocations]);

  const lastOfYearIdx = useMemo(
    () => new Set(yearGroups.map((g) => g.lastIndex)),
    [yearGroups]
  );

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#ffffff",
        border: "1px solid #90a4ae",
        overflowX: "auto",
        p: 1.25,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", borderTop: "1px solid #e0e0e0" }}>
        <Box
          sx={{
            width: 165,
            bgcolor: "#cfd8dc",
            borderTop: "1px solid #bdbdbd",
            borderBottom: "1px solid #bdbdbd",
            borderLeft: "1px solid #bdbdbd",
            flexShrink: 0,
          }}
        />
        {yearGroups.map((group, gi) => (
          <Box
            key={group.year}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: group.months.length * COL_PX,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 1.25,
                py: 0.375,
                bgcolor: "#e0e0e0",
                borderTop: "1px solid #bdbdbd",
                borderLeft: "1px solid #bdbdbd",
                borderRight:
                  gi === yearGroups.length - 1
                    ? "1px solid #bdbdbd"
                    : undefined,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#546e7a",
                  textAlign: "center",
                }}
              >
                {group.year}
              </Typography>
            </Box>

            <Box sx={{ display: "flex" }}>
              {group.months.map((m, mi) => {
                const colIndex =
                  yearGroups
                    .slice(0, gi)
                    .reduce((acc, g) => acc + g.months.length, 0) + mi;
                return (
                  <Box
                    key={`${group.year}-${m}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1.25,
                      py: 0.625,
                      flex: "0 0 auto",
                      width: COL_PX,
                      bgcolor: "#cfd8dc",
                      borderTop: "1px solid #bdbdbd",
                      borderBottom: "1px solid #bdbdbd",
                      borderLeft: "1px solid #bdbdbd",
                      borderRight: lastOfYearIdx.has(colIndex)
                        ? "1px solid #bdbdbd"
                        : undefined,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#546e7a",
                        textAlign: "center",
                      }}
                    >
                      {m}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Body */}
      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : rows.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No heatmap data.
          </Typography>
        </Box>
      ) : (
        rows.map((supplier) => (
          <Box
            key={supplier.supplier_name}
            sx={{
              display: "flex",
              height: 36,
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: 165,
                alignItems: "center",
                justifyContent: "center",
                px: 1.25,
                bgcolor: "#eceff1",
                borderBottom: "1px solid #bdbdbd",
                borderLeft: "1px solid #bdbdbd",
                height: "100%",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#607d8b",
                  textAlign: "center",
                }}
              >
                {supplier.supplier_name}
              </Typography>
            </Box>

            {columns.map((col, idx) => {
              const raw = supplier[col.key];
              const val =
                typeof raw === "string" ? parseFloat(raw) : Number(raw);
              const bg = bgFor(val);
              const fg = textFor(val, bg);
              return (
                <Box
                  key={`${supplier.supplier_name}-${col.key}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1.25,
                    flex: "0 0 auto",
                    width: 72,
                    bgcolor: bg,
                    borderBottom: "1px solid #bdbdbd",
                    borderLeft: "1px solid #bdbdbd",
                    borderRight: lastOfYearIdx.has(idx)
                      ? "1px solid #bdbdbd"
                      : undefined,
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 14,
                      color: fg,
                      textAlign: "right",
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtCell(val)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))
      )}

      <Box
        component="img"
        src="https://c.animaapp.com/nHl4a9qr/img/frame-6680-1.svg"
        alt="Frame"
        sx={{ width: "100%", height: 8, mt: 1.875 }}
      />
    </Box>
  );
};

export const DemandProjectMonth = () => {
  const navigate = useNavigate();

  // Horizontal drag state for the toolbar row
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    if (!scrollRef.current) return;
    scrollRef.current.classList.add("dragging");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
    if (!scrollRef.current) return;
    scrollRef.current.classList.remove("dragging");
  };
  const handleMouseUp = () => {
    isDown.current = false;
    if (!scrollRef.current) return;
    scrollRef.current.classList.remove("dragging");
  };
  const handleMouseMove = (e) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Date range for the filter
  const [dateFilterKey, setDateFilterKey] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date("2024-12-01"), 6), "yyyy-MM-dd"),
    endDate: format(addMonths(new Date("2025-12-31"), 6), "yyyy-MM-dd"),
  });

  // Filter datasets
  const [filtersData, setFiltersData] = useState({
    countries: [],
    states: [],
    plants: [],
    skus: [],
    suppliers: [],
    supplierLocations: [], // [{ supplier_location: 'USA' }]
  });

  // Selected filters
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]); // supplier_id[]
  const [selectedSupplierLocations, setSelectedSupplierLocations] = useState([]); // country strings

  // Loading flags
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingSupplierLocations, setLoadingSupplierLocations] = useState(false);

  // Savings cards data from API
  const [savingsCards, setSavingsCards] = useState([]);
  const [loadingSavings, setLoadingSavings] = useState(false);

  // “More” menu
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const handleMoreOpen = (event) => setMoreAnchorEl(event.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  // Chatbot panel
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const handleOpenChatBot = () => setIsChatBotOpen(true);
  const handleCloseChatBot = () => setIsChatBotOpen(false);

  const fetchCountries = () => {
    setLoadingCountries(true);
    axios
      .get(`${API_BASE_URL}/getAllCountries`)
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          countries: Array.isArray(res.data) ? res.data : [],
        }));
      })
      .catch(() =>
        setFiltersData((prev) => ({
          ...prev,
          countries: [],
        }))
      )
      .finally(() => setLoadingCountries(false));
  };

  // COUNTRY -> STATES
  useEffect(() => {
    if (!selectedCountry.length) {
      setFiltersData((prev) => ({
        ...prev,
        states: [],
        plants: [],
        skus: [],
        suppliers: [],
        supplierLocations: [],
      }));
      setSelectedState([]);
      setSelectedPlants([]);
      setSelectedSKUs([]);
      setSelectedSuppliers([]);
      setSelectedSupplierLocations([]);
      return;
    }
    setLoadingStates(true);
    axios
      .post(`${API_BASE_URL}/states-by-country`, {
        countryIds: selectedCountry,
      })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          states: Array.isArray(res.data) ? res.data : [],
          plants: [],
          skus: [],
          suppliers: [],
          supplierLocations: [],
        }));
        setSelectedState([]);
        setSelectedPlants([]);
        setSelectedSKUs([]);
        setSelectedSuppliers([]);
        setSelectedSupplierLocations([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          states: [],
          plants: [],
          skus: [],
          suppliers: [],
          supplierLocations: [],
        }));
        setSelectedState([]);
        setSelectedPlants([]);
        setSelectedSKUs([]);
        setSelectedSuppliers([]);
        setSelectedSupplierLocations([]);
      })
      .finally(() => setLoadingStates(false));
  }, [selectedCountry]);

  // STATE -> PLANTS
  useEffect(() => {
    if (!selectedState.length) {
      setFiltersData((prev) => ({
        ...prev,
        plants: [],
        skus: [],
        suppliers: [],
        supplierLocations: [],
      }));
      setSelectedPlants([]);
      setSelectedSKUs([]);
      setSelectedSuppliers([]);
      setSelectedSupplierLocations([]);
      return;
    }
    setLoadingPlants(true);
    axios
      .post(`${API_BASE_URL}/plants-by-states`, { stateIds: selectedState })
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          plants: Array.isArray(res.data) ? res.data : [],
          skus: [],
          suppliers: [],
          supplierLocations: [],
        }));
        setSelectedPlants([]);
        setSelectedSKUs([]);
        setSelectedSuppliers([]);
        setSelectedSupplierLocations([]);
      })
      .catch(() => {
        setFiltersData((prev) => ({
          ...prev,
          plants: [],
          skus: [],
          suppliers: [],
          supplierLocations: [],
        }));
        setSelectedPlants([]);
        setSelectedSKUs([]);
        setSelectedSuppliers([]);
        setSelectedSupplierLocations([]);
      })
      .finally(() => setLoadingPlants(false));
  }, [selectedState]);

  /* --------- PLANTS -> SKU --------- */
  const fetchSkus = () => {
    if (!selectedPlants.length) return;
    setLoadingSkus(true);
    axios
      .get(`${API_BASE_URL}/getAllSkus`)
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          skus: Array.isArray(res.data) ? res.data : [],
        }));
      })
      .catch(() =>
        setFiltersData((prev) => ({
          ...prev,
          skus: [],
        }))
      )
      .finally(() => setLoadingSkus(false));
  };

  useEffect(() => {
    setSelectedSKUs([]);
    setSelectedSuppliers([]);
    setSelectedSupplierLocations([]);
    setFiltersData((prev) => ({
      ...prev,
      suppliers: [],
      supplierLocations: [],
    }));
  }, [selectedPlants]);

  /* --------- SKU -> SUPPLIERS --------- */
  const fetchSuppliers = () => {
    if (!selectedSKUs.length) return;
    setLoadingSuppliers(true);
    axios
      .get(`${API_BASE_URL}/getAllSuppliers`)
      .then((res) => {
        setFiltersData((prev) => ({
          ...prev,
          suppliers: Array.isArray(res.data) ? res.data : [],
        }));
      })
      .catch(() =>
        setFiltersData((prev) => ({
          ...prev,
          suppliers: [],
        }))
      )
      .finally(() => setLoadingSuppliers(false));
  };

  useEffect(() => {
    setSelectedSuppliers([]);
    setSelectedSupplierLocations([]);
    setFiltersData((prev) => ({ ...prev, supplierLocations: [] }));
  }, [selectedSKUs]);

  /* --------- SUPPLIERS -> SUPPLIER LOCATIONS --------- */
  const fetchSupplierLocations = () => {
    if (!selectedSuppliers.length) return;
    setLoadingSupplierLocations(true);

    axios
      .get(`${API_BASE_URL}/getAllSuppliers`)
      .then((res) => {
        const allSuppliers = Array.isArray(res.data) ? res.data : [];
        const selectedIdSet = new Set(selectedSuppliers.map((id) => Number(id)));

        const matched = allSuppliers.filter((s) =>
          selectedIdSet.has(Number(s.supplier_id))
        );

        const countries = Array.from(
          new Set(
            matched
              .map((s) => String(s.supplier_country || "").trim())
              .filter(Boolean)
          )
        );

        const locationOptions = countries.map((c) => ({
          supplier_location: c,
        }));

        setFiltersData((prev) => ({
          ...prev,
          supplierLocations: locationOptions,
        }));
      })
      .catch(() =>
        setFiltersData((prev) => ({
          ...prev,
          supplierLocations: [],
        }))
      )
      .finally(() => setLoadingSupplierLocations(false));
  };

  useEffect(() => {
    setSelectedSupplierLocations([]);
  }, [selectedSuppliers]);

  /* --------- Savings cards --------- */
  useEffect(() => {
    const fmt = (num) =>
      (num < 0 ? "-$" : "$") +
      Math.abs(Number(num) || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setLoadingSavings(true);
    axios
      .get(`${API_BASE_URL}/getSupplierSavings`)
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];

        const cards = arr.map((row) => {
          const val = parseFloat(row.total_savings_dollars);
          return {
            supplier: row.supplier_name || "Supplier",
            amount: fmt(val),
            isNegative: val < 0,
            color: val < 0 ? "#ef4444" : "#16a34a",
          };
        });

        setSavingsCards(cards);
      })
      .catch(() => setSavingsCards([]))
      .finally(() => setLoadingSavings(false));
  }, []);

  const handleClearFilters = () => {
    setDateRange({
      startDate: format(subMonths(new Date("2024-12-01"), 6), "yyyy-MM-dd"),
      endDate: format(addMonths(new Date("2025-12-31"), 6), "yyyy-MM-dd"),
    });
    setSelectedCountry([]);
    setSelectedState([]);
    setSelectedPlants([]);
    setSelectedSKUs([]);
    setSelectedSuppliers([]);
    setSelectedSupplierLocations([]);

    setFiltersData({
      countries: [],
      states: [],
      plants: [],
      skus: [],
      suppliers: [],
      supplierLocations: [],
    });
    setDateFilterKey((k) => k + 1);
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#075985",
          borderBottom: 1,
          borderColor: "#78909c",
          boxShadow: 0,
          height: "56px",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton color="inherit">
              <img
                alt="List"
                src="https://c.animaapp.com/Jwk7dHU9/img/list.svg"
                style={{ width: 30, height: 30 }}
              />
            </IconButton>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 40, height: 35.69 }}>
                <img
                  alt="Logo"
                  src="https://c.animaapp.com/Jwk7dHU9/img/image-3@2x.png"
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Poppins, Helvetica",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  PPV Forecast
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: "Poppins, Helvetica", color: "#ffffff" }}
                >
                  Business Planner
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
              {["M Project 1", "Demand"].map((item, idx, arr) => (
                <React.Fragment key={item}>
                  <Typography sx={{ color: "#ffffff", fontSize: "14px" }}>
                    {item}
                  </Typography>
                  {idx < arr.length - 1 && (
                    <ChevronRightIcon
                      sx={{ color: "#ffffff", width: 16, height: 16 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton color="inherit">
              <SearchIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
            <Avatar
              src="https://c.animaapp.com/Jwk7dHU9/img/ellipse@2x.png"
              sx={{ width: 38, height: 36 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ======= Filters Row ======= */}
      <Box
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          bgcolor: "#0891B2",
          p: 1.25,
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden",
          cursor: "grab",
          userSelect: "none",
          WebkitOverflowScrolling: "touch",
          "&.dragging": { cursor: "grabbing" },
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to Dashboard"
        >
          <img
            src="https://c.animaapp.com/Jwk7dHU9/img/union.svg"
            alt="Back"
            style={{ width: 20, height: 20 }}
          />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: "grey.500" }} />

        <Box display="flex" alignItems="center" gap={2}>
          <Box
            position="relative"
            width={24}
            height={20}
            sx={{ cursor: "pointer" }}
          >
            <ChatBubbleOutline sx={{ width: 20, height: 20, color: "white" }} />
            <Box
              component="img"
              src="https://c.animaapp.com/Jwk7dHU9/img/ellipse-309--stroke-.svg"
              alt="Indicator"
              sx={{
                position: "absolute",
                width: 12,
                height: 12,
                top: 0,
                left: 12,
                pointerEvents: "none",
              }}
            />
          </Box>

          <IconButton
            size="small"
            disableRipple
            sx={{ p: 0 }}
            onClick={handleOpenChatBot}
            aria-label="Open ChatBot"
          >
            <i
              className="bi bi-robot"
              style={{
                fontSize: 20,
                color: "#ffffff",
                transition: "all 0.2s ease",
              }}
            />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "grey.500" }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <DateFilter
            key={dateFilterKey}
            onDateChange={(range) => setDateRange(range)}
          />

          <MultiSelectWithCheckboxes
            label="Country"
            options={filtersData.countries}
            optionKey="country_id"
            displayKey="country_name"
            selected={selectedCountry}
            setSelected={setSelectedCountry}
            searchPlaceholder="Search country"
            loading={loadingCountries}
            onOpen={fetchCountries}
            width={110}
            single
          />

          <MultiSelectWithCheckboxes
            label="State"
            options={filtersData.states}
            optionKey="state_id"
            displayKey="state_name"
            selected={selectedState}
            setSelected={setSelectedState}
            searchPlaceholder="Search state"
            loading={loadingStates}
            disabled={selectedCountry.length === 0}
            width={110}
          />

          <MultiSelectWithCheckboxes
            label="Plant"
            options={filtersData.plants}
            optionKey="plant_id"
            displayKey="plant_name"
            selected={selectedPlants}
            setSelected={setSelectedPlants}
            searchPlaceholder="Search plant"
            loading={loadingPlants}
            disabled={selectedState.length === 0}
            width={110}
          />

          {/* SKU (after Plant) */}
          <MultiSelectWithCheckboxes
            label="SKU"
            options={filtersData.skus}
            optionKey="sku_id"
            displayKey="sku_code"
            selected={selectedSKUs}
            setSelected={setSelectedSKUs}
            searchPlaceholder="Search SKU"
            loading={loadingSkus}
            disabled={selectedPlants.length === 0}
            onOpen={fetchSkus}
            width={130}
          />

          {/* Suppliers (after SKU) */}
          <MultiSelectWithCheckboxes
            label="Suppliers"
            options={filtersData.suppliers}
            optionKey="supplier_id"
            displayKey="supplier_name"
            selected={selectedSuppliers}
            setSelected={setSelectedSuppliers}
            searchPlaceholder="Search supplier"
            loading={loadingSuppliers}
            disabled={selectedSKUs.length === 0}
            onOpen={fetchSuppliers}
            width={150}
          />

          {/* Supplier Location (after Suppliers) */}
          <MultiSelectWithCheckboxes
            label="Supplier Location"
            options={filtersData.supplierLocations} // [{ supplier_location: 'USA' }]
            optionKey="supplier_location"
            displayKey="supplier_location"
            selected={selectedSupplierLocations} // ['USA', 'India']
            setSelected={setSelectedSupplierLocations}
            searchPlaceholder="Search location"
            loading={loadingSupplierLocations}
            disabled={selectedSuppliers.length === 0}
            onOpen={fetchSupplierLocations}
            width={170}
          />

          <Button
            variant="outlined"
            size="small"
            onClick={handleClearFilters}
            sx={{
              minWidth: 100,
              flexShrink: 0,
              whiteSpace: "nowrap",
              bgcolor: "common.white",
              borderColor: "#bdbdbd",
              color: "#1976D2",
              fontWeight: 400,
              textTransform: "none",
              px: 1.5,
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": { borderColor: "#1976d2", bgcolor: "common.white" },
              "&:disabled": {
                bgcolor: "#f5f5f5",
                borderColor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            Clear Filters
          </Button>

          <IconButton size="small" onClick={handleMoreOpen}>
            <MoreVert sx={{ width: 20, height: 20 }} />
          </IconButton>

          <Menu
            anchorEl={moreAnchorEl}
            open={Boolean(moreAnchorEl)}
            onClose={handleMoreClose}
            PaperProps={{
              style: {
                minWidth: 210,
                borderRadius: 8,
                boxShadow:
                  "0px 8px 24px rgba(29, 41, 57, 0.08), 0px 1.5px 4px rgba(0,0,0,0.04)",
                padding: 0,
              },
            }}
            MenuListProps={{ sx: { p: 0 } }}
          >
            <Listbox />
          </Menu>
        </Stack>
      </Box>

      {/* ======= NEW CONTENT: Chart + Table ======= */}
      <Box sx={{ bgcolor: "#EFF6FF", minHeight: "calc(100vh - 56px)", p: 1.25 }}>
        <DataVisualizationSection
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          countryIds={selectedCountry}
          stateIds={selectedState}
          plantIds={selectedPlants}
          skuIds={selectedSKUs}
          supplierIds={selectedSuppliers}
          supplierLocations={selectedSupplierLocations}
          savingsCards={loadingSavings ? [] : savingsCards}
        />

        <Divider sx={{ my: 1.25 }} />
        <SupplierDataTableSection
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          countryIds={selectedCountry}
          stateIds={selectedState}
          plantIds={selectedPlants}
          skuIds={selectedSKUs}
          supplierIds={selectedSuppliers}
          supplierLocations={selectedSupplierLocations}
        />
      </Box>

      {/* Chatbot Dialog */}
      <Dialog
        open={isChatBotOpen}
        onClose={handleCloseChatBot}
        TransitionComponent={SlideTransition}
        maxWidth={false}
        PaperProps={{
          sx: {
            margin: 0,
            maxWidth: "none",
            maxHeight: "none",
            borderRadius: "10px",
            overflow: "hidden",
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
          },
        }}
        sx={{ "& .MuiDialog-container": { justifyContent: "flex-end" } }}
      >
        <ChatBot onClose={handleCloseChatBot} />
      </Dialog>
    </Box>
  );
};
