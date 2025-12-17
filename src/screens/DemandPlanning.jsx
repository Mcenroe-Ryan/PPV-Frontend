import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useLayoutEffect,
} from "react";
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
  FormControlLabel,
  Tabs,
  Tab,
  Drawer,
  Switch,
  FormGroup,
  Popover,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  ChatBubbleOutline,
  MoreVert,
  Search as SearchIcon,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import BharatLogo from "./assets/BharatSupplies.png";
import ApolloLogo from "./assets/ApolloTyres.png";
import AutoMechLogo from "./assets/AutoMech.png";
import ShenZhenLogo from "./assets/ShenZhen.png";
import ShanghaiLogo from "./assets/Shanghai.png";
import GlobalPartsLogo from "./assets/GlobalParts.png";
import {
  format,
  addMonths,
  subMonths,
  parse,
  addWeeks,
  startOfWeek,
  isValid,
} from "date-fns";
import DateFilter from "./components/DateFilter";
import ChatBot from "./components/Chatbox";
import SAQ from "./components/SAQ";
import Chart from "./components/Messaging";

// Highcharts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Scorecard from "./components/Scorecard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

const DEFAULT_SERIES_COLORS = {
  "Apollo Tyres": "#9333ea",
  "Global Parts Inc.": "#22c55e",
  "AutoMech Gumby": "#60a5fa",
  "Bharat Supplies": "#eab308",
  "Shanghai Xiongda": "#ef4444",
  "ShenZhen Nova": "#ff7ab8",
};
const SERIES_ORDER = Object.keys(DEFAULT_SERIES_COLORS);
const DEFAULT_OVERLAY_COLORS = {
  globalEvents: "#E0670C",
  alerts: "#ef4444",
};
const OVERLAY_COLOR_ORDER = ["globalEvents", "alerts"];
const OVERLAY_LABELS = {
  globalEvents: "Global Events",
  alerts: "Alerts",
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

const FALLBACK_COLORS = [
  "#0ea5e9",
  "#ec4899",
  "#7c3aed",
  "#10b981",
  "#f97316",
  "#14b8a6",
];
/* ===================== Simple listbox for More menu ===================== */

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

/* ===================== Savings by supplier (dummy UI) ===================== */

const SAVINGS_SUPPLIER_DATA = [
  {
    country: "India",
    flagUrl: "https://flagcdn.com/w40/in.png",
    suppliers: [
      {
        id: 1,
        name: "Bharat Supplier",
        logoUrl: BharatLogo,
        savings: "$1763.99",
        isPositive: true,
        highlight: true,
      },
      {
        id: 2,
        name: "Apollo Tyres",
        logoUrl: ApolloLogo,
        savings: "$1263",
        isPositive: true,
        highlight: false,
      },
    ],
  },
  {
    country: "China",
    flagUrl: "https://flagcdn.com/w40/cn.png",
    suppliers: [
      {
        id: 3,
        name: "AutoMech Gumby",
        logoUrl: AutoMechLogo,
        savings: "-$9.02",
        isPositive: false,
        highlight: true,
      },
      {
        id: 4,
        name: "ShenZhen Nova",
        logoUrl: ShenZhenLogo,
        savings: "-$20.75",
        isPositive: false,
        isChecked: false,
      },
      {
        id: 5,
        name: "Shanghai Xiongda",
        logoUrl: ShanghaiLogo,
        savings: "-$18.46",
        isPositive: false,
        isChecked: false,
      },
    ],
  },
  {
    country: "USA",
    flagUrl: "https://flagcdn.com/w40/us.png",
    suppliers: [
      {
        id: 6,
        name: "Global Parts Inc.",
        logoUrl: GlobalPartsLogo,
        savings: "$3216.34",
        isPositive: true,
        highlight: true,
      },
    ],
  },
];

// helper to extract numeric value from "$3216.34" / "-$18.46"
const numericSavings = (val) => {
  if (typeof val === "number") return val;
  const num = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
};

// sort suppliers inside each country:
// - green (positive) -> highest number on top
// - red (negative)   -> highest (least negative) number on top
// - positives above negatives when mixed
const sortSuppliersBySavings = (data) =>
  data.map((c) => ({
    ...c,
    suppliers: [...c.suppliers].sort((a, b) => {
      const av = numericSavings(a.savings);
      const bv = numericSavings(b.savings);

      const aPositive = av >= 0;
      const bPositive = bv >= 0;

      // both green (positive) → highest first
      if (aPositive && bPositive) {
        return bv - av; // desc
      }

      // both red (negative) → highest (least negative) first
      if (!aPositive && !bPositive) {
        return bv - av; // desc
      }

      // mixed: keep green above red
      return aPositive ? -1 : 1;
    }),
  }));

function SavingsBySupplier({
  hasFilters = true,
  selectedLocations = [],
  allowedSupplierNames = [],
}) {
  const [suppliers, setSuppliers] = useState(() =>
    sortSuppliersBySavings(SAVINGS_SUPPLIER_DATA)
  );

  useEffect(() => {
    const normalizeText = (val) => String(val || "").trim().toLowerCase();
    const normalizeName = (val) =>
      normalizeText(val)
        .replace(/\bsupplies\b/g, "supplier")
        .replace(/\bsuppliers\b/g, "supplier");
    const normalizeLocation = (val) => {
      const base = normalizeText(val);
      if (
        base === "us" ||
        base === "u.s" ||
        base === "u.s." ||
        base === "usa" ||
        base === "united states" ||
        base === "united states of america"
      ) {
        return "usa";
      }
      return base;
    };

    const locationSet = new Set(
      (selectedLocations || []).map(normalizeLocation).filter(Boolean)
    );
    const allowedNameSet = new Set(
      (allowedSupplierNames || []).map(normalizeName).filter(Boolean)
    );

    if (!locationSet.size && !allowedNameSet.size) {
      setSuppliers(sortSuppliersBySavings(SAVINGS_SUPPLIER_DATA));
      return;
    }

    const filtered = SAVINGS_SUPPLIER_DATA.map((country) => {
      const matchesLocation =
        !locationSet.size ||
        locationSet.has(normalizeLocation(country.country));
      if (!matchesLocation) return null;

      const suppliersForCountry = (country.suppliers || []).filter(
        (s) =>
          !allowedNameSet.size || allowedNameSet.has(normalizeName(s.name))
      );

      if (!suppliersForCountry.length) return null;

      return { ...country, suppliers: suppliersForCountry };
    }).filter(Boolean);

    setSuppliers(sortSuppliersBySavings(filtered));
  }, [selectedLocations, allowedSupplierNames]);

  const handleCheckboxChange = () => {};

  return (
    <Box
      sx={{
        p: "15px",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "grey.400",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: "text.secondary",
          mb: "15px",
        }}
      >
        Savings by supplier in $
      </Typography>

      {!hasFilters || suppliers.length === 0 ? (
        <Box sx={{ px: 1, py: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            No supplier data.
          </Typography>
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={2.5}
          divider={<Divider orientation="vertical" flexItem />}
        >
          {suppliers.map((countryData, countryIndex) => (
            <Stack
              key={countryData.country}
              spacing="15px"
              sx={{ minWidth: "286px" }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  component="img"
                  src={countryData.flagUrl}
                  alt={countryData.country}
                  sx={{ width: 24, height: 16, objectFit: "cover" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                  }}
                >
                  {countryData.country}
                </Typography>
              </Stack>

              <Divider />

              {countryData.suppliers.map((supplier, supplierIndex) => (
                <Box
                  key={supplier.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {supplier.highlight ? (
                        <Typography
                          sx={{
                            color: "#facc15",
                            fontSize: 16,
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          ★
                        </Typography>
                      ) : (
                        <Box sx={{ width: 12, height: 12 }} />
                      )}
                    </Box>
                    <Avatar
                      src={supplier.logoUrl}
                      alt={supplier.name}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Poppins, Helvetica",
                        fontWeight: 500,
                        color: "rgba(0, 0, 0, 0.5)",
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                    >
                      {supplier.name}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Poppins, Helvetica",
                      fontWeight: 500,
                      color: supplier.isPositive ? "#16A34A" : "#EF4444",
                      fontSize: "16px",
                      lineHeight: "22px",
                    }}
                  >
                    {supplier.savings}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}

/* ===================== Transition for Chatbot dialog ===================== */

const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

/* ===================== Multi-select pill (AUTO-SIZE) ===================== */

function MultiSelectWithCheckboxes({
  label,
  options = [],
  optionKey,
  displayKey,
  selected,
  setSelected,
  width,
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
      setTimeout(() => searchInputRef.current?.focus(), 100);
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

  const buttonLabel = getButtonLabel();

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        disabled={disabled}
        sx={{
          flexShrink: 0,
          width: "auto",
          minWidth: width || 120,
          maxWidth: 260,
          px: 1.5,
          bgcolor: "common.white",
          borderColor: "#bdbdbd",
          fontWeight: 400,
          textTransform: "none",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {buttonLabel}
          </Typography>
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
              const optionLabel = option[displayKey || optionKey];
              const starSuppliers = [
                "global parts inc.",
                "automech gumby",
                "bharat supplies",
              ];
              const showStar =
                label === "Supplier Name" &&
                typeof optionLabel === "string" &&
                starSuppliers.includes(optionLabel.toLowerCase());

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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: 1,
                    }}
                  >
                    <ListItemText primary={optionLabel} />
                    {showStar && (
                      <Typography
                        sx={{
                          color: "#facc15",
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        ★
                      </Typography>
                    )}
                  </Box>
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

/* ===================== DataVisualizationSection ===================== */

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
  allowedSupplierNames = [],
  clearSignal = 0, // ✅ ADDED
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("M");

  const [lineCategories, setLineCategories] = useState([]);
  const [lineSeries, setLineSeries] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const [showForecast, setShowForecast] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showGlobal, setShowGlobal] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [seriesColors, setSeriesColors] = useState(DEFAULT_SERIES_COLORS);
  const [overlayColors, setOverlayColors] = useState(DEFAULT_OVERLAY_COLORS);
  const [downloadingForecastChart, setDownloadingForecastChart] =
    useState(false);
  const [exportingCapture, setExportingCapture] = useState(false);
  const HUE_SLIDER_HEIGHT = 140;
  const [colorPicker, setColorPicker] = useState({
    open: false,
    type: "series",
    key: "",
    anchorEl: null,
    hsv: { h: 0, s: 0, v: 1 },
  });
  const hasSupplierFilters =
    (Array.isArray(countryIds) && countryIds.length > 0) ||
    (Array.isArray(stateIds) && stateIds.length > 0) ||
    (Array.isArray(plantIds) && plantIds.length > 0) ||
    (Array.isArray(skuIds) && skuIds.length > 0) ||
    (Array.isArray(supplierIds) && supplierIds.length > 0) ||
    (Array.isArray(supplierLocations) && supplierLocations.length > 0);
  const hasSaqFilters = hasSupplierFilters;
  const satRef = useRef(null);
  const hueRef = useRef(null);
  const dragState = useRef({ mode: null });
  const applyPickedColor = (nextHsv, target = colorPicker) => {
    const hex = hsvToHex(nextHsv);
    if (target.type === "overlay") {
      setOverlayColors((prev) => ({ ...prev, [target.key]: hex }));
    } else {
      setSeriesColors((prev) => ({ ...prev, [target.key]: hex }));
    }
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
    if (!colorPicker.open) {
      stopDrag();
    }
  }, [colorPicker.open]);

  const [alertsRaw, setAlertsRaw] = useState([]);
  const [alertSeries, setAlertSeries] = useState([]);

  const [globalRaw, setGlobalRaw] = useState([]);
  const [xPlotBands, setXPlotBands] = useState([]);
  const [eventsByX, setEventsByX] = useState({});

  const chartRef = useRef(null);
  const forecastChartCaptureRef = useRef(null);
  const seriesColorEntries = useMemo(() => {
    const extras = Object.keys(seriesColors).filter(
      (name) => !SERIES_ORDER.includes(name)
    );
    return [...SERIES_ORDER, ...extras].filter((name, idx, arr) => {
      return idx === arr.indexOf(name) && seriesColors[name];
    });
  }, [seriesColors]);
  const overlayColorEntries = OVERLAY_COLOR_ORDER.filter(
    (key) => overlayColors[key]
  );
  const colorPickerLabel = useMemo(() => {
    if (colorPicker.type === "overlay") {
      return OVERLAY_LABELS[colorPicker.key] || colorPicker.key || "Overlay";
    }
    return colorPicker.key || "Series";
  }, [colorPicker.key, colorPicker.type]);
  const colorPopoverHex = useMemo(
    () => hsvToHex(colorPicker.hsv),
    [colorPicker.hsv]
  );
  const huePreviewHex = useMemo(
    () => hsvToHex({ h: colorPicker.hsv.h, s: 1, v: 1 }),
    [colorPicker.hsv.h]
  );
  const satPointerLeft = `${
    Math.min(Math.max(colorPicker.hsv.s, 0), 1) * 100
  }%`;
  const satPointerTop = `${
    (1 - Math.min(Math.max(colorPicker.hsv.v, 0), 1)) * 100
  }%`;
  const normalizedHue = ((colorPicker.hsv.h % 360) + 360) % 360 || 0;
  const huePointerTopPx = useMemo(() => {
    const ratio = Math.max(0, Math.min(1, normalizedHue / 360));
    return ratio * HUE_SLIDER_HEIGHT;
  }, [normalizedHue]);
  const handleColorSwatchClick = (type, key) => (event) => {
    const current = type === "overlay" ? overlayColors[key] : seriesColors[key];
    setColorPicker({
      open: true,
      type,
      key,
      anchorEl: event.currentTarget,
      hsv: hexToHsv(current),
    });
  };
  const closeColorPicker = () =>
    setColorPicker((prev) => ({ ...prev, open: false, anchorEl: null }));

  const firstOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
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

  const firstOfWeek = (d) => {
    const date = new Date(d);
    const normalized = startOfWeek(date, { weekStartsOn: 1 });
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const buildWeeklyRange = (start, end) => {
    const out = [];
    let cursor = firstOfWeek(start);
    const stop = firstOfWeek(end);
    while (cursor <= stop) {
      out.push(new Date(cursor));
      cursor = addWeeks(cursor, 1);
    }
    return out;
  };

  const PERIOD_CONFIG = {
    M: {
      endpoint: "/getLineChart",
      rowDateKey: "forecast_month",
      bucketFn: firstOfMonth,
      rangeBuilder: buildMonthlyRange,
      formatLabel: (date) => format(date, "MMM yyyy"),
    },
    W: {
      endpoint: "/getWeeklyLineChart",
      rowDateKey: "forecast_week",
      bucketFn: firstOfWeek,
      rangeBuilder: buildWeeklyRange,
      formatLabel: (date) => format(date, "yyyy-'W'II"),
    },
  };

  const getPeriodConfig = (period) => PERIOD_CONFIG[period] || PERIOD_CONFIG.M;

  const formatCategoryLabelForPeriod = (period, value) => {
    const config = getPeriodConfig(period);
    const normalized = config.bucketFn(new Date(value));
    return config.formatLabel(normalized);
  };

  // ✅ ADDED: clear chart + overlays when Clear Filters is clicked
  useEffect(() => {
    setLineCategories([]);
    setLineSeries([]);
    setAlertSeries([]);
    setAlertsRaw([]);
    setXPlotBands([]);
    setEventsByX({});
    setGlobalRaw([]);
    setShowAlerts(false);
    setShowGlobal(false);
    // setShowForecast(false);
  }, [clearSignal]);

  /* -------- Base line chart: actual before today, dotted after -------- */

  useEffect(() => {
    if (!startDate || !endDate) return;

    // ✅ ADDED: if filters are cleared (no Plant/SKU), do not fetch; clear visuals
    const hasEnoughFilters =
      (Array.isArray(skuIds) && skuIds.length > 0) ||
      (Array.isArray(plantIds) && plantIds.length > 0);

    if (!hasEnoughFilters) {
      setLineCategories([]);
      setLineSeries([]);
      return;
    }

    const controller = new AbortController();
    const config = getPeriodConfig(selectedPeriod);
    const FORECAST_WINDOW = selectedPeriod === "W" ? 26 : 6; // 6 months = 26 weeks for weekly view
    const advanceBucket = (date, steps = 1) =>
      selectedPeriod === "W" ? addWeeks(date, steps) : addMonths(date, steps);

    const normalizeDate = (value) => {
      if (!value) return null;
      let d = null;

      if (typeof value === "string") {
        const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) {
          const [_, y, mo, da] = m;
          const local = new Date(
            Number(y),
            Number(mo) - 1,
            Number(da),
            0,
            0,
            0,
            0
          );
          if (!Number.isNaN(local.getTime())) d = local;
        }
        if (!d) {
          const parsed = parse(value, "yyyy-MM-dd", new Date());
          if (isValid(parsed)) d = parsed;
        }
      }

      if (!d) {
        d = value instanceof Date ? new Date(value) : new Date(value);
      }

      if (Number.isNaN(d.getTime())) return null;
      const normalized = config.bucketFn(d);
      return Number.isNaN(normalized.getTime()) ? null : normalized;
    };

    const pivotBucket = config.bucketFn(new Date());

    let effectiveStart = startDate;
    let effectiveEnd = endDate;

    // Respect selected endDate; only extend when there is no end date chosen
    if (showForecast) {
      const horizonEnd = advanceBucket(pivotBucket, FORECAST_WINDOW - 1);
      const userEnd = normalizeDate(endDate);
      if (!userEnd) {
        effectiveEnd = format(horizonEnd, "yyyy-MM-dd");
      } else {
        const cappedEnd = horizonEnd && horizonEnd < userEnd ? horizonEnd : userEnd;
        effectiveEnd = format(cappedEnd, "yyyy-MM-dd");
      }
    }

    let normalizedStart = normalizeDate(effectiveStart);
    let normalizedEnd = normalizeDate(effectiveEnd);

    const fetchChart = async () => {
      setChartLoading(true);
      try {
        const includeForecast = showForecast;

        const payload = {
          startDate: effectiveStart,
          endDate: effectiveEnd,
          skuId: Array.isArray(skuIds) ? skuIds[0] ?? null : skuIds,
          countryIds,
          stateIds,
          plantIds,
          supplierIds,
          supplierLocations,
          includeForecast,
        };

        const { data } = await axios.post(
          `${API_BASE_URL}${config.endpoint}`,
          payload,
          { signal: controller.signal }
        );

        const rows = Array.isArray(data) ? data : [];

        // If dates missing (no filter selected), derive from data
        if (!normalizedStart || !normalizedEnd) {
          const dates = rows
            .map((r) => normalizeDate(r[config.rowDateKey]))
            .filter(Boolean)
            .sort((a, b) => a - b);
          if (!dates.length) return;
          normalizedStart = normalizedStart || dates[0];
          const last = dates[dates.length - 1];
          const extendedEnd = advanceBucket(last, FORECAST_WINDOW);
          normalizedEnd = normalizedEnd || extendedEnd;
        }

        if (!normalizedStart || !normalizedEnd) return;

        let buckets = config.rangeBuilder(normalizedStart, normalizedEnd);

        const today = normalizeDate(new Date());
        const filteredBuckets = showForecast
          ? buckets 
          : buckets.filter((d) => d.getTime() < today.getTime()); 

        const categories = filteredBuckets.map((d) => config.formatLabel(d));
        setLineCategories(categories);

        const bucketIndexMap = new Map(
          filteredBuckets.map((d, idx) => [d.getTime(), idx])
        );

        let pivotIdx = today
          ? filteredBuckets.findIndex((d) => d.getTime() >= today.getTime())
          : -1;
        if (pivotIdx === -1) pivotIdx = filteredBuckets.length;

        const bySupplier = new Map();

        for (const r of rows) {
          const supplier = r.supplier_name || "Supplier";
          const normalized = normalizeDate(r[config.rowDateKey]);
          if (!normalized) continue;
          const idx = bucketIndexMap.get(normalized.getTime());
          if (idx == null) continue;

          const value = Number(r.ppv_variance_percentage);
          if (!Number.isFinite(value)) continue;

          if (!bySupplier.has(supplier)) {
            bySupplier.set(supplier, Array(filteredBuckets.length).fill(null));
          }
          const arr = bySupplier.get(supplier);
          arr[idx] = value;
        }

        const colorMap = { ...DEFAULT_SERIES_COLORS, ...seriesColors };
        let colorChanged = false;
        const getColorFor = (name, idx) => {
          if (!colorMap[name]) {
            colorMap[name] = FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
            colorChanged = true;
          }
          return colorMap[name];
        };

        const seriesOut = [];
        const lineMarker = {
          enabled: false,
          symbol: "circle",
          states: {
            hover: {
              enabled: true,
              radius: 5,
              lineWidth: 2,
              lineColor: "#ffffff",
            },
          },
        };

        const allowedNameSet = new Set(
          (allowedSupplierNames || []).map((n) => String(n || "").trim())
        );

        let supplierIdx = 0;
        for (const [name, values] of bySupplier.entries()) {
          if (allowedNameSet.size && !allowedNameSet.has(name)) continue;
          const color = getColorFor(name, supplierIdx++);

          const forecastData = Array(filteredBuckets.length).fill(null);

          const normalizeForecastValue = (val) => {
            if (val == null) return null;
            if (Object.is(val, -0)) return null;
            return val === 0 ? null : val;
          };

          const actualData = values.map((value, idx) => {
            if (value == null || Number.isNaN(value)) return null;
            return idx <= pivotIdx ? value : null;
          });

          values.forEach((value, idx) => {
            if (value == null || Number.isNaN(value)) return;
            const isForecastBucket =
              idx >= pivotIdx && idx < pivotIdx + FORECAST_WINDOW;
            if (isForecastBucket) {
              forecastData[idx] = normalizeForecastValue(value);
            }
          });

          if (actualData.some((v) => typeof v === "number")) {
            seriesOut.push({
              name,
              type: "line",
              data: actualData,
              color,
              marker: lineMarker,
              lineWidth: 2,
              tooltip: { valueSuffix: "%" },
              zIndex: 2,
            });
          }

          if (showForecast && forecastData.some((v) => typeof v === "number")) {
            seriesOut.push({
              name: `${name} Forecast`,
              type: "line",
              data: forecastData,
              color,
              dashStyle: "ShortDash",
              marker: lineMarker,
              lineWidth: 2,
              tooltip: { valueSuffix: "%" },
              zIndex: 1,
            });
          }
        }

        setLineSeries(seriesOut);
        if (colorChanged) {
          setSeriesColors((prev) => ({ ...prev, ...colorMap }));
        }
      } catch (e) {
        if (axios.isCancel?.(e)) return;
        console.error("Error loading chart", e);
        setLineCategories([]);
        setLineSeries([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChart();
    return () => controller.abort();
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
    selectedPeriod,
    allowedSupplierNames,
  ]);

  useEffect(() => {
    setLineSeries((prev) =>
      prev.map((series) => {
        if (series.type === "scatter") return series;

        const baseName = series.name
          .replace(" Forecast", "")
          .replace(" Forecast", "");

        const color = seriesColors[baseName];
        if (!color) return series;

        return { ...series, color };
      })
    );
  }, [seriesColors]);

  /* -------- Alerts overlay -------- */

  const fetchAlerts = async (period = "M") => {
    try {
      if (period === "M") {
        const { data } = await axios.get(
          `${API_BASE_URL}/alerts/current-month-negative-ppv`
        );
        const rows = Array.isArray(data) ? data : [];
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const iso = monthStart.toISOString().slice(0, 10);

        const mapped = rows.map((r) => ({
          alert_type: r.alert_status || "Negative Variance",
          date_value: iso,
          severity: "Critical",
          tooltip: `Avg variance: ${r.avg_variance_pct}% | Total: ${r.total_variance_amt}`,
          supplier_name: r.supplier_name,
          marker_color_emoji: "🔴",
        }));
        setAlertsRaw(mapped);
      } else if (period === "W") {
        const { data } = await axios.get(
          `${API_BASE_URL}/alerts/current-week-negative-ppv`
        );
        const rows = Array.isArray(data) ? data : [];

        const mapped = rows.map((r) => ({
          alert_type: r.alert_status || "Negative Variance",
          date_value: r.week_date,
          severity: "Critical",
          tooltip: `Avg variance: ${r.avg_variance_pct}% | Total: ${r.total_variance_amt} | SKUs: ${r.affected_skus_count} | Plants: ${r.affected_plants_count}`,
          supplier_name: r.supplier_name,
          marker_color_emoji: "🔴",
        }));
        setAlertsRaw(mapped);
      } else {
        const { data } = await axios.get(`${API_BASE_URL}/getAlerts`);
        setAlertsRaw(Array.isArray(data) ? data : []);
      }
    } catch {
      setAlertsRaw([]);
    }
  };

  useEffect(() => {
    if (!showAlerts || !lineCategories.length || !lineSeries.length) {
      setAlertSeries([]);
      return;
    }

    const alertFill = hexToRgba(overlayColors.alerts, 0.85);
    const alertStroke = hexToRgba(overlayColors.alerts, 1);

    const baseSeriesMap = new Map(
      lineSeries
        .filter((s) => s.type === "line" && !s.name.endsWith(" Forecast"))
        .map((s) => [s.name, s])
    );

    const points = [];
    for (const a of alertsRaw) {
      const date = new Date(a.date_value);
      const cat = formatCategoryLabelForPeriod(selectedPeriod, date);
      const xIndex = lineCategories.indexOf(cat);
      if (xIndex === -1) continue;

      const supplierSeries = baseSeriesMap.get(a.supplier_name);
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
          fillColor: alertFill,
          lineColor: "#ffffff",
          lineWidth: 1.5,
          states: {
            hover: {
              lineColor: alertStroke,
              lineWidth: 2,
            },
          },
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
              showInLegend: false,
              enableMouseTracking: true,
              tooltip: { pointFormat: "" },
            },
          ]
        : []
    );
  }, [
    showAlerts,
    alertsRaw,
    lineCategories,
    lineSeries,
    overlayColors.alerts,
    selectedPeriod,
  ]);

  const combinedSeries = useMemo(
    () => (showAlerts ? [...lineSeries, ...alertSeries] : lineSeries),
    [lineSeries, alertSeries, showAlerts]
  );

  const handleAlertsToggle = async (e) => {
    const checked = e.target.checked;
    setShowAlerts(checked);
    if (checked && alertsRaw.length === 0) {
      await fetchAlerts(selectedPeriod);
    }
  };

  useEffect(() => {
    if (showAlerts) {
      fetchAlerts(selectedPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  /* -------- Global Events overlay -------- */

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

    const impactColor = () => hexToRgba(overlayColors.globalEvents, 0.35);

    const bands = [];
    const byX = {};

    globalRaw.forEach((ev, idx) => {
      const d = new Date(ev.date_value);
      const cat = formatCategoryLabelForPeriod(selectedPeriod, d);
      const xIdx = lineCategories.indexOf(cat);
      if (xIdx === -1) return;

      const width = 0.32;
      bands.push({
        id: `ge-${idx}-${xIdx}`,
        from: xIdx - width / 2,
        to: xIdx + width / 2,
        color: impactColor(ev.impact_level),
        zIndex: 3,
      });

      if (!byX[xIdx]) byX[xIdx] = [];
      byX[xIdx].push(ev);
    });

    setXPlotBands(bands);
    setEventsByX(byX);
  }, [
    showGlobal,
    globalRaw,
    lineCategories,
    overlayColors.globalEvents,
    selectedPeriod,
  ]);

  const handleGlobalToggle = async (e) => {
    const checked = e.target.checked;
    setShowGlobal(checked);
    if (checked && globalRaw.length === 0) {
      await fetchGlobalEvents();
    }
  };

  const handleDownloadForecastChart = async () => {
    if (!forecastChartCaptureRef.current || chartLoading) return;
    if (downloadingForecastChart) return;

    try {
      setDownloadingForecastChart(true);
      setExportingCapture(true);

      // allow legend to switch to SVG mode
      await new Promise((resolve) => setTimeout(resolve, 120));

      if (chartRef.current?.chart) {
        chartRef.current.chart.reflow();
        chartRef.current.chart.redraw();
      }

      // Wait for all rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 800));

      const element = forecastChartCaptureRef.current;

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Force all SVG elements to be visible and properly sized
          const chartContainer = clonedDoc.querySelector(
            ".highcharts-container"
          );
          if (chartContainer) {
            chartContainer.style.overflow = "visible";
          }

          const svgs = clonedDoc.querySelectorAll("svg");
          svgs.forEach((svg) => {
            svg.style.overflow = "visible";
            svg.style.display = "block";
          });

          // Ensure all paths are visible
          const paths = clonedDoc.querySelectorAll("path");
          paths.forEach((path) => {
            if (path.style.visibility === "hidden") {
              path.style.visibility = "visible";
            }
          });

          // Ensure all lines are visible
          const lines = clonedDoc.querySelectorAll("line");
          lines.forEach((line) => {
            if (line.style.visibility === "hidden") {
              line.style.visibility = "visible";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const orientation = canvas.width >= canvas.height ? "l" : "p";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("ppv-forecast-chart.pdf");
    } catch (error) {
      console.error("Failed to download PPV forecast chart", error);
      alert("Failed to download chart. Please try again.");
    } finally {
      setExportingCapture(false);
      setDownloadingForecastChart(false);
    }
  };

  /* -------- Helpers: dynamic Y bounds & height -------- */

  const computeYBounds = (seriesArr) => {
    const ys = [];
    for (const s of seriesArr || []) {
      if (s?.type !== "line" && s?.type !== "scatter") continue;
      const data = s.data || [];
      for (const v of data) {
        const y =
          typeof v === "number" ? v : v && typeof v.y === "number" ? v.y : null;
        if (Number.isFinite(y)) ys.push(y);
      }
    }
    if (!ys.length) return { min: -15, max: 15, span: 30 };

    let min = Math.min(...ys);
    let max = Math.max(...ys);

    if (min === max) {
      const bump = Math.max(1, Math.abs(min) * 0.2);
      min -= bump;
      max += bump;
    } else {
      const pad = (max - min) * 0.1;
      min -= pad;
      max += pad;
    }

    const span = Math.abs(max - min);
    const stepBase =
      span <= 2 ? 0.5 : span <= 5 ? 1 : span <= 20 ? 2 : span <= 50 ? 5 : 10;
    const roundDown = (v) => Math.floor(v / stepBase) * stepBase;
    const roundUp = (v) => Math.ceil(v / stepBase) * stepBase;

    min = roundDown(min);
    max = roundUp(max);

    const extraPad = Math.max(0.5, Math.abs(max - min) * 0.05);
    min -= extraPad;
    max += extraPad;

    return { min, max, span: max - min };
  };

  const computeChartHeight = (seriesArr) => {
    const baseNames = new Set(
      (seriesArr || [])
        .filter((s) => s.type === "line" && !s.name.endsWith(" Forecast"))
        .map((s) => s.name)
    );
    const baseCount = Math.max(1, baseNames.size);
    const { span } = computeYBounds(seriesArr);

    const base = 360;
    const perSeries = 28;
    const spanFactor = Math.min(1.6, Math.max(0, span / 20)) * 80;
    const height = base + Math.max(0, baseCount - 2) * perSeries + spanFactor;

    return Math.max(320, Math.min(760, Math.round(height)));
  };

  /* -------- Highcharts options -------- */

  const options = useMemo(() => {
    const { min, max, span } = computeYBounds(combinedSeries);
    const dynamicHeight = computeChartHeight(combinedSeries);
    const tickAmount = span <= 8 ? 5 : span <= 20 ? 7 : span <= 40 ? 9 : 11;
    const intMin = Math.floor(min);
    const intMax = Math.ceil(max);
    const intSpan = Math.max(1, intMax - intMin);
    const intStep = Math.max(
      1,
      Math.ceil(intSpan / Math.max(1, tickAmount - 1))
    );
    const tickPositions = [];
    for (let v = intMin; v <= intMax; v += intStep) {
      tickPositions.push(v);
    }
    const finalMin = tickPositions[0] ?? intMin;
    const finalMax = tickPositions[tickPositions.length - 1] ?? intMax;

    return {
      chart: {
        height: dynamicHeight,
        spacing: [10, 16, 16, 16],
        backgroundColor: "transparent",
        zoomType: "x",
        animation: false,
        resetZoomButton: {
          position: { align: "right", verticalAlign: "top", x: -10, y: 10 },
          theme: {
            fill: "#ffffff",
            stroke: "#c0c0c0",
            "stroke-width": 1,
            style: {
              color: "#2f2f2f",
              fontSize: "12px",
              fontWeight: 500,
              padding: "2px 10px",
              textShadow: "none",
            },
            r: 6,
            states: {
              hover: {
                fill: "#f9f9f9",
                style: { color: "#111" },
              },
            },
          },
        },
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      xAxis: {
        categories: lineCategories,
        tickmarkPlacement: "on",
        lineColor: "rgba(0,0,0,0.15)",
        tickColor: "rgba(0,0,0,0.2)",
        gridLineWidth: showGridLines ? 1 : 0,
        gridLineColor: "rgba(0,0,0,0.08)",
        labels: {
          style: {
            color: "rgba(0,0,0,0.65)",
            fontSize: "11px",
            fontWeight: "500",
          },
        },
        plotBands: showGlobal ? xPlotBands : [],
      },
      yAxis: {
        title: { text: null },
        min: finalMin,
        max: finalMax,
        startOnTick: true,
        endOnTick: true,
        minPadding: 0.02,
        maxPadding: 0.02,
        gridLineColor: "rgba(0,0,0,0.1)",
        gridLineWidth: showGridLines ? 1 : 0,
        tickAmount,
        tickPositions,
        labels: {
          formatter() {
            return `${Math.round(this.value)}%`;
          },
          style: {
            color: "rgba(0,0,0,0.65)",
            fontSize: "11px",
            fontWeight: "500",
          },
        },
        plotBands: [
          { from: 0, to: max, color: "rgba(255, 230, 230, 0.35)", zIndex: 0 },
          { from: min, to: 0, color: "rgba(220, 250, 230, 0.35)", zIndex: 0 },
        ],
        plotLines: [
          {
            value: 0,
            color: "rgba(0,0,0,0.3)",
            width: 2,
            zIndex: 5,
          },
        ],
      },

      legend: {
        align: "left",
        verticalAlign: "top",
        layout: "horizontal",
        floating: false,
        alignColumns: false,
        padding: 0,
        margin: 14,
        useHTML: !exportingCapture,
        symbolWidth: exportingCapture ? undefined : 0,
        symbolHeight: exportingCapture ? undefined : 0,
        itemDistance: 4,
        itemMarginTop: 2,
        itemMarginBottom: 0,
        labelFormatter: function () {
          if (exportingCapture) {
            return this.name || "";
          }
          const color = this.color || "#4b5563";
          const name = this.name || "";

          // Forecast detection: only these get the dashed line
          const isForecast =
            (this.options &&
              this.options.dashStyle &&
              this.options.dashStyle !== "Solid") ||
            name.endsWith(" Forecast") ||
            name.endsWith(" Forecast");

          const indicator = isForecast
            ? `
        <span
          style="
            display:inline-block;
            width:24px;
            height:0;
            border-top:2px dashed ${color};
            margin-right:6px;
            margin-top:2px;
            flex-shrink:0;
          "
        ></span>
      `
            : `
        <span
          style="
            width:12px;
            height:12px;
            border-radius:999px;
            background:${color};
            display:inline-block;
            flex-shrink:0;
            margin-right:6px;
          "
        ></span>
      `;

          return `
      <span
        style="
          display:inline-flex;
          align-items:center;
          padding:6px 12px;
          border-radius:4px;
          border:1px solid #d1d5db;
          background:#f9fafb;
          font-size:12px;
          font-weight:500;
          color:#374151;
          line-height:1;
          white-space:nowrap;
        "
      >
        ${indicator}
        <span>${name}</span>
      </span>
    `;
        },
        itemStyle: {
          cursor: "pointer",
        },
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
          width: 8,
        },
        style: {
          fontSize: "12px",
          fontWeight: "500",
        },
        formatter() {
          const ptsRaw =
            this.points && this.points.length
              ? this.points
              : this.point
              ? [this.point]
              : [];
          const pts = dedupeForecastPoints(ptsRaw);

          if (!pts.length) return "";

          const lines = pts.map((p) => {
            if (p.series.type === "scatter") {
              const c = p.point?.custom || {};
              return `${c.emoji || "⚠️"} <b>${c.severity || "Alert"}</b> — ${
                c.supplier || ""
              }<br/><span style="opacity:.85; font-size: 11px;">${
                c.tooltip || ""
              }</span>`;
            }

            const isForecast = p.series.name.endsWith(" Forecast");
            const baseName = isForecast
              ? p.series.name.replace(" Forecast", "")
              : p.series.name;
            const disp = isForecast ? `${baseName} Forecast` : baseName;

            return `<span style="color:${p.color}">●</span> ${disp}: <b>${p.y}%</b>`;
          });

          if (showGlobal && pts.length) {
            const firstPoint =
              pts.find((p) => p.series.type !== "scatter") || pts[0];
            const xIdx =
              (typeof firstPoint.x === "number" ? firstPoint.x : null) ??
              lineCategories.indexOf(this.x);
            if (xIdx != null && xIdx > -1) {
              const evs = (eventsByX || {})[xIdx] || [];
              evs.forEach((ev) => {
                lines.push(
                  `<span style="color: #1976d2;">▌</span> <b>Global:</b> ${
                    ev.label
                  } — <span style="opacity:.85;">${
                    ev.country_name
                  }</span><br/><span style="opacity:.75; font-size: 11px;">${
                    ev.tooltip || ""
                  }</span>`
                );
              });
            }
          }

          return lines.join("<br/>");
        },
      },
      plotOptions: {
        series: {
          animation: false,
          connectNulls: false,
          states: {
            hover: { halo: { size: 8 }, lineWidthPlus: 1 },
            inactive: { opacity: 0.3 },
          },
        },
        line: {
          marker: {
            enabled: false,
            symbol: "circle",
            states: {
              hover: {
                enabled: true,
                radius: 5,
                lineWidth: 2,
                lineColor: "#ffffff",
              },
            },
          },
          lineWidth: 2.5,
        },
        scatter: {
          tooltip: { pointFormat: "" },
          marker: { radius: 7 },
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
  }, [
    lineCategories,
    combinedSeries,
    showGlobal,
    xPlotBands,
    eventsByX,
    showGridLines,
    exportingCapture,
  ]);

  const dedupeForecastPoints = (points = []) => {
    const scatterPoints = [];
    const linePoints = [];

    points.forEach((p) => {
      if (p?.series?.type === "scatter") scatterPoints.push(p);
      else linePoints.push(p);
    });

    const keepByBase = new Map();

    linePoints.forEach((p) => {
      const name = p?.series?.name || "";
      const isForecast = name.endsWith(" Forecast");
      const baseName = isForecast ? name.replace(/ Forecast$/, "") : name;
      const existing = keepByBase.get(baseName);

      if (!existing) {
        keepByBase.set(baseName, { point: p, isForecast });
        return;
      }

      if (existing.isForecast && !isForecast) {
        keepByBase.set(baseName, { point: p, isForecast: false });
      }
    });

    const keptLines = Array.from(keepByBase.values()).map((v) => v.point);
    return [...scatterPoints, ...keptLines];
  };

  useLayoutEffect(() => {
    chartRef.current?.chart?.reflow?.();
  }, [options]);

  return (
    <>
      <style>{`
      .highcharts-legend-item-hidden span {
        filter: grayscale(1);
        cursor: pointer;
      }
    `}</style>
      <Stack spacing="15px" sx={{ width: "100%" }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            border: 1,
            borderColor: "grey.300",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, v) => setSelectedTab(v)}
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

        {selectedTab === 0 && (
          <>
            <SavingsBySupplier
              hasFilters={hasSupplierFilters}
              selectedLocations={supplierLocations}
              allowedSupplierNames={allowedSupplierNames}
            />

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
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  right: 8,
                  zIndex: 2,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Stack direction="row" spacing={1.25}>
                    {/* {["W", "M", "Q"].map((p) => ( */}
                    {["W", "M"].map((p) => (
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
                            selectedPeriod === p
                              ? "primary.main"
                              : "transparent",
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

                  {/* <Stack direction="row" spacing={1.25} alignItems="center">  ← DELETE THIS LINE */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showForecast}
                        onChange={(e) => setShowForecast(e.target.checked)}
                      />
                    }
                    label="Forecast"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                        color: "text.primary",
                      },
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showGlobal}
                        onChange={handleGlobalToggle}
                      />
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
                      <Checkbox
                        checked={showAlerts}
                        onChange={handleAlertsToggle}
                      />
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

              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.3,
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleDownloadForecastChart}
                  disabled={chartLoading || downloadingForecastChart}
                  aria-label="Download PPV forecast chart"
                >
                  <DownloadIcon
                    sx={{ width: 20, height: 20, color: "text.secondary" }}
                  />
                </IconButton>
                <IconButton size="small">
                  <ShareIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setConfigOpen(true)}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ pt: 6 }} ref={forecastChartCaptureRef}>
                {chartLoading ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: 420 }}
                  >
                    <CircularProgress />
                  </Stack>
                ) : (
                  <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
                    options={options}
                  />
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 1.25 }} />

            <SupplierDataTableSection
              clearSignal={clearSignal} // ✅ ADDED
              startDate={startDate}
              endDate={endDate}
              countryIds={countryIds}
              stateIds={stateIds}
              plantIds={plantIds}
              skuIds={skuIds}
              supplierIds={supplierIds}
              supplierLocations={supplierLocations}
              selectedPeriod={selectedPeriod}
              allowedSupplierNames={allowedSupplierNames}
            />
          </>
        )}

        {selectedTab === 1 && (
          <Box
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "grey.400",
              p: 2,
            }}
          >
            <Scorecard
              startDate={startDate}
              endDate={endDate}
              supplierIds={supplierIds}
              skuIds={skuIds}
              plantIds={plantIds}
              countryIds={countryIds}
              stateIds={stateIds}
            />
          </Box>
        )}

        {selectedTab === 2 && (
          <Box
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "grey.400",
              p: 1,
            }}
          >
            <SAQ
              startDate={startDate}
              endDate={endDate}
              supplierIds={supplierIds}
              skuIds={skuIds}
              plantIds={plantIds}
              countryIds={countryIds}
              stateIds={stateIds}
              clearSignal={clearSignal}
              hasFilters={hasSaqFilters}
            />
          </Box>
        )}
      </Stack>

      <Drawer
        anchor="right"
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        PaperProps={{ sx: { width: 320, p: 3 } }}
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
            <IconButton onClick={() => setConfigOpen(false)} size="small">
              <CloseIcon sx={{ color: "#6b7280" }} />
            </IconButton>
          </Stack>
          <Divider />

          <Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showGridLines}
                    onChange={(e) => setShowGridLines(e.target.checked)}
                  />
                }
                label="Show Grid Lines"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    color: "text.primary",
                  },
                }}
              />
            </FormGroup>
          </Box>

          <Divider />

          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ color: "text.secondary" }}
          >
            Series Colors
          </Typography>
          <Stack spacing={1.2}>
            {seriesColorEntries.map((name) => (
              <Box
                key={name}
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
                      bgcolor: seriesColors[name] || "#9ca3af",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }}
                  />
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    {name}
                  </Typography>
                </Stack>
                <Box
                  role="button"
                  tabIndex={0}
                  aria-label={`Change ${name} color`}
                  onClick={handleColorSwatchClick("series", name)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleColorSwatchClick("series", name)(event);
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
                      bgcolor: seriesColors[name] || "#9ca3af",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>

          <Divider />

          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ color: "text.secondary" }}
          >
            Overlay Colors
          </Typography>
          <Stack spacing={1.2}>
            {overlayColorEntries.map((key) => (
              <Box
                key={key}
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
                      bgcolor: overlayColors[key] || "#9ca3af",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }}
                  />
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    {OVERLAY_LABELS[key] || key}
                  </Typography>
                </Stack>
                <Box
                  role="button"
                  tabIndex={0}
                  aria-label={`Change ${OVERLAY_LABELS[key] || key} color`}
                  onClick={handleColorSwatchClick("overlay", key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleColorSwatchClick("overlay", key)(event);
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
                      bgcolor: overlayColors[key] || "#9ca3af",
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
    </>
  );
};

/* ===================== Heatmap / SupplierDataTableSection ===================== */

const SupplierDataTableSection = ({
  startDate,
  endDate,
  countryIds = [],
  stateIds = [],
  plantIds = [],
  skuIds = [],
  supplierIds = [],
  supplierLocations = [],
  selectedPeriod = "M",
  clearSignal = 0, // ✅ ADDED
  allowedSupplierNames = [],
}) => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [yearGroups, setYearGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const COL_PX = 72;

  // ✅ ADDED: Clear table immediately when Clear Filters is clicked
  useEffect(() => {
    setRows([]);
    setColumns([]);
    setYearGroups([]);
  }, [clearSignal]);

  const parseHeatmapLabelToDate = (label) => {
    if (!label) return null;
    const formats = ["MMM yyyy", "MMM dd, yyyy", "MMM d, yyyy"];
    for (const fmt of formats) {
      const parsed = parse(label, fmt, new Date());
      if (isValid(parsed)) {
        parsed.setHours(0, 0, 0, 0);
        return parsed;
      }
    }
    const fallback = new Date(label);
    if (!Number.isNaN(fallback.getTime())) {
      fallback.setHours(0, 0, 0, 0);
      return fallback;
    }
    return null;
  };

  const bgFor = (v) => {
    if (v == null || Number.isNaN(v) || v === 0) return "#ffffff";
    if (v > 0) {
      if (v >= 10) return "#f44336";
      if (v >= 7) return "#e57373";
      if (v >= 4) return "#ef9a9a";
      return "#ffcdd2";
    }
    if (v <= -13) return "#43a047";
    if (v <= -10) return "#4caf50";
    if (v <= -7) return "#66bb6a";
    if (v <= -4) return "#a5d6a7";
    return "#c8e6c9";
  };

  const textFor = (v, bg) => {
    if (Math.abs(v ?? 0) >= 7) return "#ffffff";
    if (bg === "#ef9a9a") return "#546e7a";
    return "#607d8b";
  };

  useEffect(() => {
    const load = async () => {
      // ✅ ADDED: if filters are cleared (no Plant/SKU), do not fetch; keep empty table
      const hasEnoughFilters =
        (Array.isArray(skuIds) && skuIds.length > 0) ||
        (Array.isArray(plantIds) && plantIds.length > 0);

      if (!hasEnoughFilters) {
        setRows([]);
        setColumns([]);
        setYearGroups([]);
        return;
      }

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

        const endpoint =
          selectedPeriod === "W" ? "/getWeeklyHeatMap" : "/getHeatMap";
        const { data } = await axios.post(
          `${API_BASE_URL}${endpoint}`,
          payload
        );
        let arr = Array.isArray(data) ? data : [];

        if (Array.isArray(allowedSupplierNames) && allowedSupplierNames.length) {
          const allowedSet = new Set(
            allowedSupplierNames.map((n) => String(n || "").trim())
          );
          arr = arr.filter((r) =>
            allowedSet.has(String(r.supplier_name || "").trim())
          );
        }

        const keys = new Set();
        arr.forEach((r) => {
          Object.keys(r).forEach((k) => {
            if (k !== "supplier_name") keys.add(k);
          });
        });

        const colList = Array.from(keys)
          .map((k) => {
            let parsed = parseHeatmapLabelToDate(k);
            if (!parsed) {
              parsed = new Date(k);
              if (Number.isNaN(parsed.getTime())) {
                parsed = new Date(0);
              }
            }
            return { key: k, date: parsed };
          })
          .sort((a, b) => a.date - b.date);

        setColumns(colList);

        const ymap = new Map();
        colList.forEach((c, idx) => {
          const y = format(c.date, "yyyy");
          const monthLabel =
            selectedPeriod === "W"
              ? format(c.date, "MMM d")
              : format(c.date, "MMM");
          if (!ymap.has(y))
            ymap.set(y, { year: y, months: [], lastIndex: idx });
          const g = ymap.get(y);
          g.months.push(monthLabel);
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
  }, [
    startDate,
    endDate,
    countryIds,
    stateIds,
    plantIds,
    skuIds,
    supplierIds,
    supplierLocations,
    selectedPeriod,
    allowedSupplierNames,
  ]);

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
              const num = Number.isFinite(val) ? val : null;
              const bg = bgFor(num);
              const fg = textFor(num, bg);
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
                    {Number.isFinite(val)
                      ? Number.isInteger(val)
                        ? String(val)
                        : val.toFixed(1)
                      : ""}
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

/* ===================== Main: DemandProjectMonth ===================== */

export const DemandProjectMonth = () => {
  const navigate = useNavigate();

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

  const handleChatBubbleClick = () => {
    handleOpenActivities();
  };

  const [dateFilterKey, setDateFilterKey] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date("2024-12-01"), 6), "yyyy-MM-dd"),
    endDate: format(addMonths(new Date("2025-12-31"), 6), "yyyy-MM-dd"),
  });

  const [clearSignal, setClearSignal] = useState(0);

  const [filtersData, setFiltersData] = useState({
    countries: [],
    states: [],
    plants: [],
    skus: [],
    suppliers: [],
    supplierLocations: [],
  });

  const [initializedDefaults, setInitializedDefaults] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedSupplierLocations, setSelectedSupplierLocations] = useState(
    []
  );

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingSupplierLocations, setLoadingSupplierLocations] =
    useState(false);

  const [savingsCards, setSavingsCards] = useState([]);
  const [loadingSavings, setLoadingSavings] = useState(false);

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const handleMoreOpen = (event) => setMoreAnchorEl(event.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  const [showActivities, setShowActivities] = useState(false);
  const handleOpenActivities = () => {
    setShowActivities(true);
    setIsChatBotOpen(false);
  };
  const handleCloseActivities = () => setShowActivities(false);

  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const handleOpenChatBot = () => {
    setIsChatBotOpen(true);
    setShowActivities(false);
  };
  const handleCloseChatBot = () => setIsChatBotOpen(false);

  /* -------- Fetch countries -------- */

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

  // Auto-load countries on first render (for default cascade)
  useEffect(() => {
    fetchCountries();
  }, []);

  /* -------- COUNTRY -> STATES -------- */

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

  /* -------- STATE -> PLANTS -------- */

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

  /* -------- PLANTS -> SKUs -------- */

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

    if (selectedPlants.length) {
      fetchSkus();
    }
  }, [selectedPlants]);

  /* -------- SKU -> SUPPLIERS (by sku) -------- */

  const fetchSuppliers = async () => {
    if (!selectedSKUs.length) return;
    const skuId = Array.isArray(selectedSKUs) ? selectedSKUs[0] : selectedSKUs;
    if (!skuId || !Number.isFinite(Number(skuId))) return;

    setLoadingSuppliers(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/suppliers/by-sku`, {
        skuId: Number(skuId),
      });
      setFiltersData((prev) => ({
        ...prev,
        suppliers: Array.isArray(data) ? data : [],
      }));
    } catch {
      setFiltersData((prev) => ({ ...prev, suppliers: [] }));
    } finally {
      setLoadingSuppliers(false);
    }
  };

  useEffect(() => {
    setSelectedSuppliers([]);
    setSelectedSupplierLocations([]);
    setFiltersData((prev) => ({ ...prev, supplierLocations: [] }));
  }, [selectedSKUs]);

  useEffect(() => {
    if (selectedSKUs.length && !filtersData.suppliers.length) {
      fetchSuppliers();
    }
  }, [selectedSKUs, filtersData.suppliers.length]);

  /* -------- SUPPLIER LOCATIONS (depend on SKU / suppliers list) -------- */

  const fetchSupplierLocations = () => {
    if (!selectedSKUs.length) return;

    const allSuppliers = filtersData.suppliers || [];
    if (!allSuppliers.length) return;

    const countries = Array.from(
      new Set(
        allSuppliers
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
  };

  useEffect(() => {
    if (!selectedSKUs.length) return;
    if (!filtersData.suppliers.length) return;
    if (filtersData.supplierLocations.length) return;
    if (selectedSupplierLocations.length) return;

    fetchSupplierLocations();
  }, [
    selectedSKUs,
    filtersData.suppliers,
    filtersData.supplierLocations,
    selectedSupplierLocations,
  ]);

  useEffect(() => {
    setSelectedSuppliers([]);
  }, [selectedSupplierLocations]);

  /* -------- Savings cards (optional) -------- */

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

  /* -------- Default cascade: USA -> Illinois -> Chicago plant -> SKU -------- */

  useEffect(() => {
    if (initializedDefaults) return;

    if (!selectedCountry.length && filtersData.countries.length) {
      const us = filtersData.countries.find(
        (c) =>
          c.country_name &&
          c.country_name.toLowerCase().includes("united states")
      );
      if (us) {
        setSelectedCountry([us.country_id]);
        return;
      }
    }

    if (
      selectedCountry.length &&
      !selectedState.length &&
      filtersData.states.length
    ) {
      const il = filtersData.states.find(
        (s) => s.state_name && s.state_name.toLowerCase().includes("illinois")
      );
      if (il) {
        setSelectedState([il.state_id]);
        return;
      }
    }

    if (
      selectedState.length &&
      !selectedPlants.length &&
      filtersData.plants.length
    ) {
      const plant = filtersData.plants.find(
        (p) => p.plant_name === "Chicago Tyre Plant 09"
      );
      if (plant) {
        setSelectedPlants([plant.plant_id]);
        return;
      }
    }

    if (
      selectedPlants.length &&
      !selectedSKUs.length &&
      filtersData.skus.length
    ) {
      const sku = filtersData.skus.find((s) => s.sku_code === "PCR-185/65R15");
      if (sku) {
        setSelectedSKUs([sku.sku_id]);
        return;
      }
    }

    if (
      selectedCountry.length &&
      selectedState.length &&
      selectedPlants.length &&
      selectedSKUs.length
    ) {
      setInitializedDefaults(true);
    }
  }, [
    initializedDefaults,
    filtersData.countries,
    filtersData.states,
    filtersData.plants,
    filtersData.skus,
    filtersData.suppliers,
    selectedCountry,
    selectedState,
    selectedPlants,
    selectedSKUs,
    selectedSuppliers,
  ]);

  /* -------- Clear filters -------- */

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

    // ✅ ADDED: clear chart + table immediately
    setClearSignal((s) => s + 1);

    // If you want defaults to re-apply after Clear Filters, uncomment:
    // setInitializedDefaults(false);
    // fetchCountries();
  };

  /* -------- Suppliers options filtered by Supplier Location -------- */

  const effectiveSupplierIds = useMemo(() => {
    const allSuppliers = filtersData.suppliers || [];

    if (!selectedSupplierLocations.length) {
      if (selectedSuppliers.length) return selectedSuppliers;
      return [];
    }

    const locSet = new Set(
      selectedSupplierLocations.map((loc) => String(loc).toLowerCase())
    );

    const byLocation = allSuppliers
      .filter((s) => locSet.has(String(s.supplier_country || "").toLowerCase()))
      .map((s) => s.supplier_id);

    if (selectedSuppliers.length) {
      const chosenSet = new Set(selectedSuppliers);
      return byLocation.filter((id) => chosenSet.has(id));
    }

    return byLocation;
  }, [filtersData.suppliers, selectedSupplierLocations, selectedSuppliers]);

  const supplierOptions = useMemo(() => {
    const all = filtersData.suppliers || [];
    if (!selectedSupplierLocations.length) return all;

    const locSet = new Set(
      selectedSupplierLocations.map((loc) => String(loc).toLowerCase())
    );

    return all.filter((s) =>
      locSet.has(String(s.supplier_country || "").toLowerCase())
    );
  }, [filtersData.suppliers, selectedSupplierLocations]);

  const allowedSupplierNames = useMemo(() => {
    const all = filtersData.suppliers || [];
    if (selectedSuppliers.length) {
      const idSet = new Set(selectedSuppliers);
      return all
        .filter((s) => idSet.has(s.supplier_id))
        .map((s) => s.supplier_name)
        .filter(Boolean);
    }

    if (selectedSupplierLocations.length) {
      const locSet = new Set(
        selectedSupplierLocations.map((loc) => String(loc).toLowerCase())
      );
      return all
        .filter((s) =>
          locSet.has(String(s.supplier_country || "").toLowerCase())
        )
        .map((s) => s.supplier_name)
        .filter(Boolean);
    }

    return [];
  }, [filtersData.suppliers, selectedSuppliers, selectedSupplierLocations]);

  return (
    <Box>
      {/* Top AppBar */}
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

      {/* Filters Row */}
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
            onClick={handleChatBubbleClick}
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
          />

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
            single
          />

          <MultiSelectWithCheckboxes
            label="Supplier Location"
            options={filtersData.supplierLocations}
            optionKey="supplier_location"
            displayKey="supplier_location"
            selected={selectedSupplierLocations}
            setSelected={setSelectedSupplierLocations}
            searchPlaceholder="Search location"
            loading={loadingSupplierLocations}
            disabled={selectedSKUs.length === 0}
            onOpen={fetchSupplierLocations}
          />

          <MultiSelectWithCheckboxes
            label="Supplier Name"
            options={supplierOptions}
            optionKey="supplier_id"
            displayKey="supplier_name"
            selected={selectedSuppliers}
            setSelected={setSelectedSuppliers}
            searchPlaceholder="Search supplier"
            loading={loadingSuppliers}
            disabled={selectedSupplierLocations.length === 0}
            onOpen={fetchSuppliers}
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

      {/* Content */}
      <Box
        sx={{ bgcolor: "#EFF6FF", minHeight: "calc(100vh - 56px)", p: 1.25 }}
      >
        <DataVisualizationSection
          clearSignal={clearSignal} // ✅ ADDED
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          countryIds={selectedCountry}
          stateIds={selectedState}
          plantIds={selectedPlants}
          skuIds={selectedSKUs}
          supplierIds={effectiveSupplierIds}
          supplierLocations={selectedSupplierLocations}
          allowedSupplierNames={allowedSupplierNames}
          savingsCards={loadingSavings ? [] : savingsCards}
        />
      </Box>

      {showActivities && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: 700,
            zIndex: 1400,
            bgcolor: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
          }}
          onClick={handleCloseActivities}
        >
          <Box
            sx={{
              height: "100vh",
              boxShadow: 6,
              bgcolor: "grey.400",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Chart onClose={handleCloseActivities} />
          </Box>
        </Box>
      )}

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
