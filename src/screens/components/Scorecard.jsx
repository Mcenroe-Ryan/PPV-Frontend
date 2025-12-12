import React, { useState, useId, useEffect } from "react";
import axios from "axios";
import Radio from "@mui/material/Radio";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Select,
  MenuItem,
  Paper,
  Slider,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

/* -------------------------------------------------
   Colors
-------------------------------------------------- */
const COLORS = {
  blue50: "#E3F2FD",
  blue600: "#0277BD",
  blue700: "#01579B",
  gray50: "#F8FAFC",
  gray200: "#E2E8F0",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  white: "#FFFFFF",
  green600: "#22C55E",
  orange: "#FB923C",
  purple: "#A855F7",
  red500: "#EF4444",
  yellow500: "#EAB308",
};

/* -------------------------------------------------
   API Base URL (from Vite env)
-------------------------------------------------- */
const API_BASE_URL = import.meta.env.VITE_API_URL;

const IconOperational = ({ color = COLORS.green600, size = 22 }) => (
  <Box
    component="svg"
    viewBox="0 0 15 18"
    fill="none"
    sx={{ width: size, height: size }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.08333 9C1.80556 9 1.25 8.91 1.25 8.55C1.25 8.19 1.25 7.5 1.25 7.2C1.25 6.9 1.41667 6.3 2.08333 6.3C2.75 6.3 2.91667 6.3 2.91667 6.3L3.33333 4.95L2.91667 4.5C2.77777 4.35 2.58333 3.96 2.91667 3.6C3.25 3.24 3.61111 2.85 3.75 2.7C3.88889 2.55 4.25 2.34 4.58333 2.7C4.91667 3.06 5 3.15002 5 3.15002L6.25 2.7V1.80002C6.25 1.50003 6.33333 0.900024 6.66667 0.900024C7 0.900024 7.91667 0.900024 8.33333 0.900024C8.47225 0.900024 8.75 1.08002 8.75 1.80002C8.75 2.52002 8.75 2.70002 8.75 2.70002L10 3.15002L10.4167 2.70002C10.5556 2.55002 10.9167 2.34002 11.25 2.70002C11.5833 3.06002 11.9444 3.45002 12.0833 3.60002C12.2222 3.75003 12.4167 4.14002 12.0833 4.50002C11.75 4.86002 11.6667 4.95002 11.6667 4.95002L12.0833 6.30002H13.3333C13.4722 6.30002 13.75 6.39002 13.75 6.75002C13.75 7.11002 13.75 8.10002 13.75 8.55002C13.75 8.70003 13.6667 9.00002 13.3333 9.00002"
      stroke={color}
      strokeWidth={0.6}
      strokeLinejoin="round"
    />
    <path
      d="M4.5835 7.65C4.5835 6.75 5.00016 4.5 7.50016 4.5C8.3335 4.5 10.0835 5.13 10.4168 7.65"
      stroke={color}
      strokeWidth={0.6}
      strokeLinejoin="round"
    />
    <path
      d="M3.75 10.9799C4.30228 10.9799 4.75 10.4964 4.75 9.89995C4.75 9.30348 4.30228 8.81995 3.75 8.81995C3.19772 8.81995 2.75 9.30348 2.75 9.89995C2.75 10.4964 3.19772 10.9799 3.75 10.9799Z"
      stroke={color}
      strokeWidth={0.6}
    />
    <path
      d="M7.0835 9.18002C7.63578 9.18002 8.0835 8.69649 8.0835 8.10002C8.0835 7.50355 7.63578 7.02002 7.0835 7.02002C6.53121 7.02002 6.0835 7.50355 6.0835 8.10002C6.0835 8.69649 6.53121 9.18002 7.0835 9.18002Z"
      stroke={color}
      strokeWidth={0.6}
    />
    <path
      d="M11.25 10.9799C11.8023 10.9799 12.25 10.4964 12.25 9.89995C12.25 9.30348 11.8023 8.81995 11.25 8.81995C10.6977 8.81995 10.25 9.30348 10.25 9.89995C10.25 10.4964 10.6977 10.9799 11.25 10.9799Z"
      stroke={color}
      strokeWidth={0.6}
    />
    <path
      d="M6.25016 13.05V17.1H5.41683C5.13905 17.1 4.5835 16.83 4.5835 15.75C4.5835 14.67 4.5835 13.5 4.5835 13.05C4.5835 12.45 4.91683 11.25 6.25016 11.25C7.5835 11.25 8.47241 11.25 8.75016 11.25C9.30575 11.25 10.4168 11.61 10.4168 13.05C10.4168 14.49 10.4168 15.45 10.4168 15.75C10.4168 16.05 10.1668 16.65 9.16683 16.65C8.16683 16.65 8.47241 16.65 8.75016 16.65V13.05"
      stroke={color}
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 16.65H8.33333"
      stroke={color}
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4165 12.15H12.4998C13.0554 12.15 14.1665 12.51 14.1665 13.95C14.1665 15.39 14.1665 15.75 14.1665 15.75C14.1665 16.05 13.9165 16.65 12.9165 16.65C11.9165 16.65 10.8332 16.65 10.4165 16.65"
      stroke={color}
      strokeWidth={0.6}
      strokeLinejoin="round"
    />
    <path
      d="M12.9165 13.95V16.65"
      stroke={color}
      strokeWidth={0.6}
      strokeLinejoin="round"
    />
    <path
      d="M4.16683 16.65H2.0835C1.80572 16.65 0.833496 16.65 0.833496 15.3V13.95C0.833496 13.35 1.16683 12.15 2.50016 12.15H4.5835"
      stroke={color}
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.3335 13.9501C2.3335 13.8009 2.22157 13.6801 2.0835 13.6801C1.94542 13.6801 1.8335 13.8009 1.8335 13.9501H2.3335ZM2.0835 13.9501H1.8335V16.6501H2.0835H2.3335V13.9501H2.0835Z"
      fill={color}
    />
  </Box>
);

const IconEnvironmental = ({ color = COLORS.green600, size = 22 }) => (
  <Box
    component="svg"
    viewBox="0 0 21 18"
    fill="none"
    sx={{ width: size, height: size }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {[
      "M0.617676 15.2307H20.3824",
      "M0.617676 16.6154H20.3824",
      "M4.94141 15.2307V7.61536H11.1179V15.2307",
      "M6.17627 7.61541V1.38464H12.9704V15.2308",
    ].map((d) => (
      <path
        key={d}
        d={d}
        stroke={color}
        strokeWidth={0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
    {[
      "M6.79395 2.76929H7.41159",
      "M6.79395 4.15381H7.41159",
      "M6.79395 5.53845H7.41159",
      "M5.55859 9.69226H6.17624",
      "M5.55859 11.0769H6.17624",
      "M5.55859 12.4615H6.17624",
      "M8.0293 2.76929H8.64694",
      "M8.0293 4.15381H8.64694",
      "M8.0293 5.53845H8.64694",
      "M8.0293 9.69226H8.64694",
      "M6.79395 9.69226H7.41159",
      "M8.0293 11.0769H8.64694",
      "M6.79395 11.0769H7.41159",
      "M8.0293 12.4615H8.64694",
      "M6.79395 12.4615H7.41159",
      "M9.26465 2.76929H9.8823",
      "M9.26465 4.15381H9.8823",
      "M9.26465 5.53845H9.8823",
      "M9.26465 9.69226H9.8823",
      "M9.26465 11.0769H9.8823",
      "M9.26465 12.4615H9.8823",
      "M10.5 2.76929H11.1176",
      "M10.5 4.15381H11.1176",
      "M10.5 5.53845H11.1176",
      "M11.7354 2.76929H12.353",
      "M11.7354 4.15381H12.353",
      "M11.7354 5.53845H12.353",
    ].map((d) => (
      <path
        key={d}
        d={d}
        stroke={color}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
    ))}
    {[
      "M16.0586 15.2308V4.84619",
      "M17.9115 6.23073H16.0586C16.0586 5.53842 16.3057 4.15381 17.2939 4.15381H19.1468C19.1468 5.2615 18.3233 5.99996 17.9115 6.23073Z",
      "M18.5292 10.3847H16.6763C16.6763 9.69235 16.9233 8.30774 17.9116 8.30774H19.7645C19.7645 9.41543 18.9409 10.1539 18.5292 10.3847Z",
      "M14.206 8.30764H16.0589C16.0589 7.61533 15.4413 6.23071 14.8236 6.23071H12.9707C12.9707 7.89225 13.7943 8.30764 14.206 8.30764Z",
      "M14.206 4.84621H16.0589C15.5648 3.18467 14.6177 2.76929 14.206 2.76929H12.9707C12.9707 4.43083 13.7943 4.84621 14.206 4.84621Z",
    ].map((d) => (
      <path
        key={d}
        d={d}
        stroke={color}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
    ))}
    <path
      d="M3.08831 6.50765C3.90699 6.50765 4.57066 5.76375 4.57066 4.84611C4.57066 3.92847 3.90699 3.18457 3.08831 3.18457C2.26963 3.18457 1.60596 3.92847 1.60596 4.84611C1.60596 5.76375 2.26963 6.50765 3.08831 6.50765Z"
      stroke={color}
      strokeWidth={0.6}
    />
    <path
      d="M3.9118 13.8462H1.85297C1.57846 13.8462 0.617676 13.8462 0.617676 12.1847V10.5231C0.617676 9.78467 0.947088 8.30774 2.26473 8.30774H4.32356"
      stroke={color}
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.84127 9.69236C2.84127 9.46295 2.67536 9.27698 2.47069 9.27698C2.26601 9.27698 2.1001 9.46295 2.1001 9.69236H2.84127ZM2.47069 9.69236H2.1001V13.8462H2.47069H2.84127V9.69236H2.47069Z"
      fill={color}
    />
  </Box>
);

const IconFinance = ({ color = COLORS.green600, size = 22 }) => {
  const clipId = useId();
  return (
    <Box
      component="svg"
      viewBox="0 0 18 19"
      fill="none"
      sx={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="18" height="19" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M5 8.5L2 11V17L0.5 18C1.33333 17.1667 4.4 15.5 10 15.5"
          stroke={color}
          strokeWidth={0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.0002 3.99995V3.69995C4.83451 3.69995 4.7002 3.83426 4.7002 3.99995H5.0002ZM9.5002 3.99995H9.8002C9.8002 3.83426 9.66589 3.69995 9.5002 3.69995V3.99995ZM9.2002 7.49995C9.2002 7.66564 9.33451 7.79995 9.5002 7.79995C9.66589 7.79995 9.8002 7.66564 9.8002 7.49995H9.2002ZM5.0002 16H5.3002V3.99995H5.0002H4.7002V16H5.0002ZM5.0002 3.99995V4.29995H9.5002V3.99995V3.69995H5.0002V3.99995ZM9.5002 3.99995H9.2002V7.49995H9.5002H9.8002V3.99995H9.5002Z"
          fill={color}
        />
        {[
          "M9.5 5.5L13.5 7.5V13.5",
          "M6 5.5H6.5",
          "M6 6.5H6.5",
          "M6 7.5H6.5",
          "M3 12.5H3.5",
          "M3 13.5H3.5",
          "M4 13.5H4.5",
          "M4 12.5H4.5",
          "M7 5.5H7.5",
          "M7 6.5H7.5",
          "M7 7.5H7.5",
          "M3 11.5H3.5",
          "M8 5.5H8.5",
          "M8 6.5H8.5",
          "M8 7.5H8.5",
          "M4 11.5H4.5",
          "M13.5 9H16V17",
          "M15 16.5L17 17.5",
          "M6 4V2.5H8.5V4",
        ].map((d) => (
          <path
            key={d}
            d={d}
            stroke={color}
            strokeWidth={0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        <path
          d="M7.8002 0.999951C7.8002 0.834266 7.66589 0.699951 7.5002 0.699951C7.33451 0.699951 7.2002 0.834266 7.2002 0.999951H7.8002ZM7.5002 0.999951H7.2002V2.49995H7.5002H7.8002V0.999951H7.5002Z"
          fill={color}
        />
        {[
          "M8.9998 14.2C10.491 14.2 11.6998 12.9912 11.6998 11.5C11.6998 10.0089 10.491 8.80005 8.9998 8.80005C7.50864 8.80005 6.2998 10.0089 6.2998 11.5C6.2998 12.9912 7.50864 14.2 8.9998 14.2Z",
          "M10.5 13.5L11.5 14.5",
          "M14 16.5L13 17.5L11 15L12 14L14 16.5Z",
          "M14 10.5H14.5",
          "M14 11.5H14.5",
          "M14 12.5H14.5",
          "M15 10.5H15.5",
          "M15 11.5H15.5",
          "M15 12.5H15.5",
          "M10 10.5C10 10.3333 9.9 10 9.5 10C9.1 10 8.66667 10 8.5 10C8.33333 10 8 10.1 8 10.5C8 10.9 8.33333 11 8.5 11H9.5C9.66667 11 10 11.1 10 11.5C10 11.9 9.66667 12 9.5 12H8.5C8.33333 12 8 11.9 8 11.5",
          "M9 12V12.5",
          "M9 10V9.5",
        ].map((d) => (
          <path
            key={d}
            d={d}
            stroke={color}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </Box>
  );
};

const IconLegal = ({ color = COLORS.green600, size = 22 }) => {
  const clipId = useId();
  return (
    <Box
      component="svg"
      viewBox="0 0 19 17"
      fill="none"
      sx={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="19" height="17" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M4.24363 11.0742H14.207C15.3074 11.0742 16.2022 11.9609 16.2329 13.0664H2.21777C2.24845 11.9609 3.14328 11.0742 4.24363 11.0742Z"
          stroke={color}
          strokeWidth={0.7}
        />
        <path
          d="M10.0977 1.44325L8.07547 0.530885C7.52034 0.280428 6.86959 0.532598 6.62198 1.09412L4.00028 7.03966C3.75267 7.60119 4.00197 8.25943 4.55711 8.50988L6.57936 9.42225C7.13449 9.67271 7.78524 9.42054 8.03284 8.85901L10.6545 2.91348C10.9022 2.35195 10.6529 1.69371 10.0977 1.44325Z"
          stroke={color}
          strokeWidth={0.7}
        />
        <path
          d="M2.62224 14.418H15.5978C16.4422 14.418 17.13 15.0948 17.1605 15.9414H1.05957C1.09005 15.0948 1.77785 14.418 2.62224 14.418Z"
          stroke={color}
          strokeWidth={0.7}
        />
        <path
          d="M17.5034 8.4491C18.1725 8.70107 18.4886 9.46816 18.2071 10.1215L18.1781 10.1845C17.8668 10.8116 17.1068 11.0577 16.4934 10.7299L9.60956 7.05182C9.26849 6.86957 9.12536 6.45112 9.28223 6.09466C9.43965 5.73691 9.84493 5.56467 10.2077 5.70131L17.5034 8.4491Z"
          stroke={color}
          strokeWidth={0.7}
        />
        <path
          d="M4.20117 6.61584L8.1402 8.49085"
          stroke={color}
          strokeWidth={0.7}
        />
        <path
          d="M6.51758 1.45959L10.4566 3.33459"
          stroke={color}
          strokeWidth={0.7}
        />
      </g>
    </Box>
  );
};

const ICON_DEFINITIONS = [
  { key: "ops", Component: IconOperational },
  { key: "fin", Component: IconFinance },
  { key: "legal", Component: IconLegal },
  { key: "env", Component: IconEnvironmental },
];

// Radar axes and helpers for custom-drawn grid/lines
const RADAR_AXES = [
  { key: "quality", label: "Quality" },
  { key: "cost", label: "Cost" },
  { key: "delivery", label: "Delivery" },
  { key: "risk", label: "Risk" },
  { key: "compliance", label: "Compliance" },
];

const RADAR_CENTER = { x: 50, y: 54 };

const polarToPoint = (angleDeg, value) => {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: RADAR_CENTER.x + value * Math.cos(angle),
    y: RADAR_CENTER.y + value * Math.sin(angle),
  };
};

/* -------------------------------------------------
   Header bar (Recommended + RC Score + dropdown + ⚙)
-------------------------------------------------- */
const LegendHeader = ({ onOpenConfig, selectedMetric, onSelectMetric }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        background: COLORS.gray50,
        border: `1px solid ${COLORS.gray200}`,
        borderRadius: 1,
        p: 1.5,
        mb: 2,
      }}
    >
      {/* Recommended pill */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 13,
            height: 13,
            bgcolor: "#60a5fa",
            borderRadius: "50%",
          }}
        />
        <Typography sx={{ fontSize: 13, color: COLORS.gray600 }}>
          Recommended
        </Typography>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ height: 28 }} />

      {/* Score legend */}
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.gray600 }}>
        Score:
      </Typography>

      {[
        {
          color: COLORS.green600,
          text: "10 - 7",
          iconColor: COLORS.green600,
        },
        {
          color: COLORS.orange,
          text: "7 - 5",
          iconColor: COLORS.orange,
        },
        {
          color: COLORS.red500,
          text: "Below 5",
          iconColor: COLORS.red500,
        },
      ].map((item) => (
        <Tooltip
          key={item.text}
          arrow
          placement="bottom"
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "transparent",
                boxShadow: "none",
                p: 0,
              },
            },
            arrow: {
              sx: { color: "transparent" },
            },
          }}
          title={
            <Box
              sx={{
                border: `1px solid ${COLORS.blue600}`,
                borderRadius: 1,
                px: 1,
                py: 0.5,
                bgcolor: COLORS.white,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {ICON_DEFINITIONS.map(({ key, Component }) => (
                  <Component key={key} color={item.iconColor} size={28} />
                ))}
              </Stack>
            </Box>
          }
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 13,
                height: 13,
                bgcolor: item.color,
                borderRadius: "50%",
              }}
            />
            <Typography sx={{ fontSize: 13, color: COLORS.gray600 }}>
              {item.text}
            </Typography>
          </Stack>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ height: 28 }} />

      {/* Dropdown – Balanced / Quality / Cost / Delivery / Risk / Compliance */}
      <Select
        value={selectedMetric}
        onChange={(e) => onSelectMetric(e.target.value)}
        size="small"
        sx={{
          width: 140,
          height: 32,
          fontSize: 13,
          color: "#0F172A",
          bgcolor: "#FFFFFF",
          borderRadius: "6px",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBD5E1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563EB",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.5,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
              "& .MuiMenuItem-root": {
                fontSize: 13,
                color: "#0F172A",
                padding: "6px 12px",
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: "#EFF6FF",
              },
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "#F8FAFC",
              },
            },
          },
        }}
      >
        {["Balanced", "Quality", "Cost", "Delivery", "Risk", "Compliance"].map(
          (option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )
        )}
      </Select>

      <Divider orientation="vertical" flexItem sx={{ height: 28 }} />

      {/* Settings icon – opens Score Configuration */}
      <SettingsIcon
        sx={{ color: COLORS.gray500, cursor: "pointer" }}
        onClick={onOpenConfig}
      />
    </Stack>
  );
};

/* -------------------------------------------------
   Suppliers (Radar Cards)
-------------------------------------------------- */
const SUPPLIERS = [
  {
    id: "gpi",
    name: "Global Parts Inc",
    rating: "8.5 / 10",
    overallScore: 8.5,
    isSelected: true,
    borderColor: COLORS.blue600,
    scores: {
      quality: 80,
      cost: 85,
      delivery: 80,
      risk: 78,
      compliance: 82,
    },
    icons: [
      { key: "ops", Component: IconOperational, color: COLORS.green600 },
      { key: "fin", Component: IconFinance, color: COLORS.green600 },
      { key: "legal", Component: IconLegal, color: COLORS.green600 },
      { key: "env", Component: IconEnvironmental, color: COLORS.green600 },
    ],
  },
  {
    id: "bharat",
    name: "Bharat Supplies",
    rating: "7.6 / 10",
    overallScore: 7.6,
    isSelected: false,
    borderColor: COLORS.gray200,
    scores: {
      quality: 60,
      cost: 78,
      delivery: 70,
      risk: 65,
      compliance: 80,
    },
    icons: [
      { key: "ops", Component: IconOperational, color: COLORS.green600 },
      { key: "fin", Component: IconFinance, color: COLORS.green600 },
      { key: "legal", Component: IconLegal, color: COLORS.green600 },
      { key: "env", Component: IconEnvironmental, color: COLORS.orange },
    ],
  },
  {
    id: "gumby",
    name: "AutoMech Gumby",
    rating: "6.9 / 10",
    overallScore: 6.9,
    isSelected: false,
    borderColor: COLORS.gray200,
    scores: {
      quality: 55,
      cost: 75,
      delivery: 60,
      risk: 72,
      compliance: 78,
    },
    icons: [
      { key: "ops", Component: IconOperational, color: COLORS.green600 },
      { key: "fin", Component: IconFinance, color: COLORS.green600 },
      { key: "legal", Component: IconLegal, color: COLORS.orange },
      { key: "env", Component: IconEnvironmental, color: COLORS.orange },
    ],
  },
];

// map UI supplier -> backend supplier_id
const SUPPLIER_ID_MAP = {
  gpi: 7,
  bharat: 8,
  gumby: 9,
};

const EXPLAINABILITY_SECTION_COLORS = {
  "Quantity": "#22C55E",
  "Raw Material - Rubber / Polymer Cost in ($)": "#FB923C",
  "Fuel Cost (WTI) in $": "#60A5FA",
  "Fuel Cost (Brent) in $": "#818CF8",
  "Exchange Rate Dollar/Euro": "#C084FC",
  "Exchange Rate Dollar/Yuan": "#C084FC",
  "Exchange Rate Dollar/Rupee": "#C084FC",
};

/* -------------------------------------------------
   Explainability bar cards (bottom row when tab = Explainability)
-------------------------------------------------- */
const ExplainabilityCard = ({ title, color, factors }) => {
  const backgroundMap = {
    "#22C55E": "#D9FBE4", // green
    "#FB923C": "#FFE9D6", // orange
    "#60A5FA": "#DBEAFE", // blue
    "#818CF8": "#E0E7FF", // indigo
    "#C084FC": "#F3E8FF", // purple
  };
  const bgColor = backgroundMap[color] || `${color}1A`;
  const numericValues =
    Array.isArray(factors) && factors.length
      ? factors.map((f) => Number(f.value) || 0)
      : [0];
  const maxValue = Math.max(...numericValues);
  const scaleMax = maxValue > 100 ? 200 : 100;
  const axisLabels = [0, scaleMax / 2, scaleMax];
  const getWidthPercent = (val) => {
    const num = Number(val) || 0;
    const pct = (num / scaleMax) * 100;
    return `${Math.min(Math.max(pct, 0), 100)}%`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: COLORS.white,
        border: `1px solid ${COLORS.gray200}`,
        borderRadius: "8px",
        p: 2,
        flex: 1,
        height: 230,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Title */}
      <Typography
        noWrap
        sx={{
          fontWeight: 600,
          fontSize: 15,
          color: COLORS.gray700,
          mb: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>

      {/* Horizontal bars with faint grid lines */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Vertical grid lines (0 / 100) */}
        {[0, 100].map((v) => (
          <Box
            key={v}
            sx={{
              position: "absolute",
              left: `${v}%`,
              top: 0,
              bottom: 24,
              width: "1px",
              transform: "translateX(-0.5px)",
              borderLeft: "1px dashed #CBD5E1",
            }}
          />
        ))}

        {/* Bars */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.6,
            zIndex: 1,
          }}
        >
          {factors.map((f, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Label */}
              <Typography
                sx={{
                  width: 105,
                  fontSize: 13,
                  fontWeight: 500,
                  color: COLORS.gray700,
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </Typography>

              {/* Track */}
              <Box
                sx={{
                  flex: 1,
                  height: 14,
                  backgroundColor: bgColor,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Filled portion */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: getWidthPercent(f.value),
                    backgroundColor: color,
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>

              {/* Numeric value */}
              <Typography
                sx={{
                  width: 30,
                  fontSize: 12,
                  color: COLORS.gray600,
                  textAlign: "right",
                }}
              >
                {f.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* X-axis labels: 0 / 50 / 100 */}
      <Box
        sx={{
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pl: "100px",
          pr: "30px",
          color: "#94A3B8",
        }}
      >
        {axisLabels.map((v) => (
          <Typography key={v} sx={{ fontSize: 11 }}>
            {v}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

/* -------------------------------------------------
   Factors line/area chart cards (bottom row when tab = Factors)
   NOW: Quantity card can use API data, others stay as before.
-------------------------------------------------- */
const FactorCard = ({ title, color, gradient, yLabels, data }) => {
  // If no dynamic data provided, fall back to your original static look
  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          background: COLORS.white,
          border: `1px solid ${COLORS.gray200}`,
          borderRadius: "8px",
          p: 1.5,
          flex: 1,
          height: 240,
          position: "relative",
        }}
      >
        {/* Card title */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 15,
            color: COLORS.gray700,
            mb: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        {/* Simple static SVG chart – matches your Figma style */}
        <Box sx={{ display: "flex", height: 180 }}>
          {/* Y-axis labels */}
          <Box
            sx={{
              width: 35,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              mr: 1,
            }}
          >
            {yLabels.map((v) => (
              <Typography key={v} sx={{ fontSize: 11, color: "#94A3B8" }}>
                {v}
              </Typography>
            ))}
          </Box>

          {/* Chart area */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <svg width="100%" height="150" viewBox="0 0 350 150">
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 37, 74, 111, 148, 185, 222, 259, 296, 333].map((x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="150"
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
              ))}
              {[0, 30, 60, 90, 120, 150].map((y, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2="350"
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
              ))}

              {/* Future forecast highlight */}
              <rect
                x="280"
                y="0"
                width="70"
                height="150"
                fill={color}
                opacity="0.08"
              />

              {/* Solid line (history) */}
              <path
                d="M0,110 L50,90 L100,100 L150,80 L200,105 L250,85 L280,95"
                fill="none"
                stroke={color}
                strokeWidth="2"
              />

              {/* Dashed line (forecast) */}
              <path
                d="M280,95 L310,100 L350,80"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Area under curve */}
              <path
                d="M0,110 L50,90 L100,100 L150,80 L200,105 L250,85 L280,95 L350,80 L350,150 L0,150 Z"
                fill={`url(#${gradient})`}
              />
            </svg>

            {/* X-axis years */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 20,
                right: 15,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {["2023", "2024", "2025"].map((year) => (
                <Typography key={year} sx={{ fontSize: 11, color: "#94A3B8" }}>
                  {year}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Dynamic version using API data, but keeping the same visual style
  const width = 350;
  const height = 150;

  const numericValues = data.map((d) => Number(d.y_value ?? 0));
  const minVal = Math.min(...numericValues);
  const maxVal = Math.max(...numericValues);
  const range = maxVal - minVal || 1;

  const verticalPadding = 15;
  const chartBottom = height - verticalPadding;

  const points = data.map((d, index) => {
    const t = data.length === 1 ? 0 : index / (data.length - 1);
    const x = t * width;
    const norm = (Number(d.y_value ?? 0) - minVal) / range;
    const y = chartBottom - norm * (height - 2 * verticalPadding);
    return { x, y, is_forecast: d.is_forecast };
  });

  const firstForecastIndex = data.findIndex((d) => d.is_forecast);
  const hasForecast = firstForecastIndex !== -1;
  const lastIndex = data.length - 1;

  const makePath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");

  const allPath = makePath(points);
  const pastPoints = hasForecast
    ? points.slice(0, firstForecastIndex + 1)
    : points;
  const forecastPoints = hasForecast ? points.slice(firstForecastIndex) : [];

  const pastPath = makePath(pastPoints);
  const forecastPath = hasForecast ? makePath(forecastPoints) : "";

  const areaPath =
    allPath +
    ` L ${points[lastIndex].x},${chartBottom} L ${points[0].x},${chartBottom} Z`;

  let futureRect = null;
  if (hasForecast) {
    const xStart = points[firstForecastIndex].x;
    const xEnd = points[lastIndex].x;
    const w = Math.max(0, xEnd - xStart);
    futureRect = { xStart, w };
  }

  const labels =
    yLabels && yLabels.length
      ? yLabels
      : [
          maxVal.toFixed(1),
          ((maxVal + minVal) / 2).toFixed(1),
          minVal.toFixed(1),
        ];

  return (
    <Paper
      elevation={0}
      sx={{
        background: COLORS.white,
        border: `1px solid ${COLORS.gray200}`,
        borderRadius: "8px",
        p: 1.5,
        flex: 1,
        height: 240,
        position: "relative",
      }}
    >
      {/* Card title */}
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 15,
          color: COLORS.gray700,
          mb: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: "flex", height: 180 }}>
        {/* Y-axis labels */}
        <Box
          sx={{
            width: 35,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            mr: 1,
          }}
        >
          {labels.map((v) => (
            <Typography key={v} sx={{ fontSize: 11, color: "#94A3B8" }}>
              {v}
            </Typography>
          ))}
        </Box>

        {/* Chart area */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <svg width="100%" height="150" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 37, 74, 111, 148, 185, 222, 259, 296, 333].map((x, i) => (
              <line
                key={`v-${i}`}
                x1={x}
                y1="0"
                x2={x}
                y2={height}
                stroke="#E2E8F0"
                strokeWidth="0.5"
              />
            ))}
            {[0, 30, 60, 90, 120, 150].map((y, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="0.5"
              />
            ))}

            {/* Future forecast highlight */}
            {futureRect && (
              <rect
                x={futureRect.xStart}
                y="0"
                width={futureRect.w}
                height={height}
                fill={color}
                opacity="0.08"
              />
            )}

            {/* Area under curve */}
            <path d={areaPath} fill={`url(#${gradient})`} />

            {/* Solid line (history) */}
            <path d={pastPath} fill="none" stroke={color} strokeWidth="2" />

            {/* Dashed line (forecast) */}
            {hasForecast && (
              <path
                d={forecastPath}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* X-axis years – keep same visual */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 20,
              right: 15,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {["2023", "2024", "2025"].map((year) => (
              <Typography key={year} sx={{ fontSize: 11, color: "#94A3B8" }}>
                {year}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

/* -------------------------------------------------
   Radar chart (custom pentagon)
-------------------------------------------------- */
const RadarChart = ({ scores }) => {
  const axisAngles = RADAR_AXES.map((_, i) => -90 + i * 72);
  const levels = [20, 40, 60, 80, 100];

  const points = axisAngles.map((angle, i) =>
    polarToPoint(angle, (scores[RADAR_AXES[i].key] ?? 0) * 0.5)
  );

  const polygonPath =
    points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") +
    " Z";

  const gridPolygons = levels.map((lvl) => {
    const ringPoints = axisAngles.map((angle) =>
      polarToPoint(angle, lvl * 0.5)
    );
    const path =
      ringPoints
        .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x},${p.y}`)
        .join(" ") + " Z";
    return path;
  });

  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      sx={{ width: "100%", height: "100%" }}
    >
      {/* Grid rings */}
      {gridPolygons.map((path, idx) => (
        <path
          key={idx}
          d={path}
          fill={idx === gridPolygons.length - 1 ? "#E6F5EC" : "none"}
          stroke="#D4DEE7"
          strokeWidth={0.6}
          opacity={idx === gridPolygons.length - 1 ? 0.35 : 1}
        />
      ))}
      {/* Spokes */}
      {axisAngles.map((angle, idx) => {
        const p = polarToPoint(angle, 50);
        return (
          <line
            key={idx}
            x1={RADAR_CENTER.x}
            y1={RADAR_CENTER.y}
            x2={p.x}
            y2={p.y}
            stroke="#D4DEE7"
            strokeWidth={0.6}
          />
        );
      })}
      {/* Data polygon */}
      <path
        d={polygonPath}
        fill="#0EA5E9"
        fillOpacity={0.06}
        stroke="#1095DB"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* Vertex markers */}
      {points.map((p, idx) => (
        <circle
          key={`marker-${idx}`}
          cx={p.x}
          cy={p.y}
          r={2.2}
          fill="#0EA5E9"
          stroke="#FFFFFF"
          strokeWidth={0.6}
        />
      ))}
    </Box>
  );
};

/* -------------------------------------------------
   Supplier Card (includes icons + radar)
-------------------------------------------------- */
const SupplierCard = ({
  supplier,
  isActive,
  activeTab,
  onChange,
  selectedMetric,
}) => {
  const isFactors = isActive && activeTab === "factors";
  const isExplain = isActive && activeTab === "explain";
  const metricKey = selectedMetric?.toLowerCase();
  const shouldShowMetric =
    metricKey &&
    metricKey !== "balanced" &&
    supplier.scores?.[metricKey] != null;
  const displayScore = shouldShowMetric
    ? `${(supplier.scores[metricKey] / 10).toFixed(1)} / 10`
    : supplier.rating;

  return (
    <Box
      sx={{
        width: 442,
        height: 465,
        backgroundColor: COLORS.white,
        border: `1px solid ${supplier.borderColor}`,
        position: "relative",
      }}
    >
      {/* Header: radio + name + rating */}
      <Box
        sx={{
          position: "absolute",
          top: 9,
          left: 10,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Radio
          checked={isActive}
          onChange={() => onChange("factors")}
          size="small"
          sx={{
            color: COLORS.gray500,
            "&.Mui-checked": { color: COLORS.blue600 },
            padding: 0,
            mr: 1,
          }}
        />

        <Box>
          <Typography sx={{ fontSize: 16, color: COLORS.blue700 }}>
            {supplier.name}
          </Typography>
          <Typography
            sx={{ fontSize: 19, fontWeight: 600, color: COLORS.gray600 }}
          >
            {displayScore}
          </Typography>
        </Box>
      </Box>

      {/* Icons row (top-right) */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 1,
        }}
      >
        {(
          supplier.icons ||
          ICON_DEFINITIONS.map(({ key, Component }) => ({
            key,
            Component,
            color: COLORS.green600,
          }))
        ).map(({ key, Component, color }) => (
          <Component key={key} color={color || COLORS.green600} size={22} />
        ))}
      </Box>

      {/* Radar + labels – tuned so blue line sits inside grid */}
      <Box
        sx={{
          position: "absolute",
          top: "24%",
          left: "24%",
          width: "52%",
          height: "52%",
        }}
      >
        <RadarChart scores={supplier.scores} />

        {/* Pentagon labels – match Figma wording/positions */}
        <Typography
          sx={{
            position: "absolute",
            top: "-12%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.gray700,
          }}
        >
          Quality
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            top: "40%",
            left: "-40%",
            transform: "translateY(-50%)",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.gray700,
            width: 80,
            textAlign: "right",
            lineHeight: 1.2,
          }}
        >
          Compliance
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "-8%",
            left: "0%",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.gray700,
            width: 100,
          }}
        >
          Risk
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: "-8%",
            right: "0%",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.gray700,
            width: 90,
            textAlign: "right",
          }}
        >
          Delivery
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            top: "40%",
            right: "-35%",
            transform: "translateY(-50%)",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.gray700,
            width: 80,
          }}
        >
          Cost
        </Typography>
      </Box>

      {/* Factors / Explainability tabs */}
      <Stack
        direction="row"
        sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}
      >
        <Button
          onClick={() => onChange("factors")}
          sx={{
            flex: 1,
            borderRadius: 0,
            textTransform: "none",
            backgroundColor: isFactors ? COLORS.blue600 : COLORS.blue50,
            color: isFactors ? COLORS.white : COLORS.gray600,
          }}
        >
          Factors
        </Button>
        <Button
          onClick={() => onChange("explain")}
          sx={{
            flex: 1,
            borderRadius: 0,
            textTransform: "none",
            backgroundColor: isExplain ? COLORS.blue600 : COLORS.blue50,
            color: isExplain ? COLORS.white : COLORS.gray600,
          }}
        >
          Explainability
        </Button>
      </Stack>
    </Box>
  );
};

/* -------------------------------------------------
   Score Configuration Sidebar
-------------------------------------------------- */
const ScoreConfigSidebar = ({ open, values, onChange, onClose }) => {
  if (!open) return null;

  const handleSliderChange = (key) => (_, newValue) => {
    const numeric = Array.isArray(newValue) ? newValue[0] : newValue;
    const clamped = Math.max(0, Math.min(100, numeric));
    onChange({ ...values, [key]: clamped });
  };

  const handleInputChange = (key) => (e) => {
    const val = Number(e.target.value);
    if (!Number.isNaN(val)) {
      const clamped = Math.max(0, Math.min(100, val));
      onChange({ ...values, [key]: clamped });
    }
  };

  const fields = [
    { key: "quality", label: "Quality" },
    { key: "cost", label: "Cost" },
    { key: "delivery", label: "Delivery" },
    { key: "risk", label: "Risk" },
    { key: "compliance", label: "Compliance" },
  ];

  return (
    <>
      {/* Dark overlay */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(15,23,42,0.45)",
          zIndex: 1300,
        }}
      />

      {/* Right panel */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 380,
          height: "100vh",
          bgcolor: COLORS.white,
          boxShadow: "-4px 0 24px rgba(15,23,42,0.15)",
          zIndex: 1301,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${COLORS.gray200}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SettingsIcon sx={{ fontSize: 18, color: COLORS.gray600 }} />
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: COLORS.gray700 }}
            >
              Weighted Score Configuration
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: COLORS.gray500 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Sliders */}
        <Box sx={{ flex: 1, px: 3, pt: 3 }}>
          <Stack spacing={3}>
            {fields.map((f) => (
              <Box key={f.key}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.gray700,
                    mb: 0.5,
                  }}
                >
                  {f.label}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    value={values[f.key]}
                    onChange={handleInputChange(f.key)}
                    size="small"
                    sx={{
                      width: 61,
                      "& .MuiInputBase-input": {
                        fontSize: 13,
                        padding: "4px 8px",
                      },
                    }}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      min: 0,
                      max: 100,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            m: 0,
                            ml: 0.25,
                            ".MuiTypography-root": {
                              fontSize: 12,
                              lineHeight: 1,
                            },
                          }}
                        >
                          %
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Slider
                    value={values[f.key]}
                    onChange={handleSliderChange(f.key)}
                    min={0}
                    max={100}
                    step={1}
                    sx={{
                      flex: 1,
                      color: "#60A5FA",
                      "& .MuiSlider-track": { border: "none" },
                      "& .MuiSlider-thumb": {
                        width: 14,
                        height: 14,
                        boxShadow: "0 0 0 4px rgba(129,140,248,0.16)",
                      },
                    }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Submit button */}
        <Box
          sx={{
            borderTop: `1px solid ${COLORS.gray200}`,
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: 13,
              px: 3,
              bgcolor: "#2563EB",
              "&:hover": { bgcolor: "#1D4ED8" },
            }}
            onClick={onClose}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

/* -------------------------------------------------
   Main Screen
-------------------------------------------------- */
export default function Scorecard() {
  const [activeSupplier, setActiveSupplier] = useState("gpi");
  const [activeTab, setActiveTab] = useState("factors");
  const [scoreView, setScoreView] = useState("Balanced");

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [scoreConfig, setScoreConfig] = useState({
    quality: 25,
    cost: 25,
    delivery: 25,
    risk: 25,
    compliance: 100,
  });

  // Dynamic data for the Factors charts, grouped by metric_name
  const [factorData, setFactorData] = useState({
    quantity: [],
    rubberCost: [],
    fuelWti: [],
    fuelBrent: [],
    fxRate: [],
  });
  const [explainabilityData, setExplainabilityData] = useState([]);
  const [explainabilityLoading, setExplainabilityLoading] = useState(false);

  const handleTabChange = (supplierId, tab) => {
    setActiveSupplier(supplierId);
    setActiveTab(tab);
  };

  // Fetch all metric series for a supplier, then split by metric_name
  useEffect(() => {
    if (activeTab !== "factors") return;

    const backendSupplierId = SUPPLIER_ID_MAP[activeSupplier];
    if (!backendSupplierId) return;

    const controller = new AbortController();

    axios
      .get(
        `${API_BASE_URL}/suppliers/${backendSupplierId}/market-metric-trends`,
        { signal: controller.signal }
      )
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];

        const grouped = {
          quantity: [],
          rubberCost: [],
          fuelWti: [],
          fuelBrent: [],
          fxRate: [],
        };

        // 1) First group non–raw-material metrics normally
        rows.forEach((row) => {
          const metric = row.metric_name || "";
          switch (metric) {
            case "Quantity":
              grouped.quantity.push(row);
              break;

            case "Fuel Cost (WTI)":
            case "Fuel Cost (WTI) in $":
              grouped.fuelWti.push(row);
              break;

            case "Fuel Cost (Brent)":
            case "Fuel Cost (Brent) in $":
              grouped.fuelBrent.push(row);
              break;

            case "Exchange Rate Dollar/Euro":
              grouped.fxRate.push(row);
              break;

            default:
              // raw materials and other metrics handled below
              break;
          }
        });

        // 2) Combine ALL raw-material metrics (3 types) into one series
        //    Any metric_name that starts with "Raw Material -" will be included
        const rawMaterialMap = new Map();

        rows.forEach((row) => {
          if (!row.metric_name?.startsWith("Raw Material -")) return;

          const key = row.date_value; // group by date
          const y = Number(row.y_value ?? 0);

          if (!rawMaterialMap.has(key)) {
            rawMaterialMap.set(key, {
              date_value: row.date_value,
              y_value: y,
              is_forecast: !!row.is_forecast,
              metric_name: "Raw Material - Combined",
            });
          } else {
            const existing = rawMaterialMap.get(key);
            existing.y_value += y;
            // mark as forecast if any of the components is forecast
            existing.is_forecast = existing.is_forecast || !!row.is_forecast;
          }
        });

        grouped.rubberCost = Array.from(rawMaterialMap.values());

        // 3) Sort each series by date
        Object.keys(grouped).forEach((key) => {
          grouped[key].sort(
            (a, b) => new Date(a.date_value) - new Date(b.date_value)
          );
        });

        setFactorData(grouped);
      })
      .catch((err) => {
        console.error("Error fetching factor trends", err);
        setFactorData({
          quantity: [],
          rubberCost: [],
          fuelWti: [],
          fuelBrent: [],
          fxRate: [],
        });
      });

    return () => controller.abort();
  }, [activeSupplier, activeTab]);

  useEffect(() => {
    if (activeTab !== "explain") return;
    const backendSupplierId = SUPPLIER_ID_MAP[activeSupplier];
    if (!backendSupplierId) return;

    const controller = new AbortController();
    setExplainabilityLoading(true);
    axios
      .get(
        `${API_BASE_URL}/forecast-explainability/${backendSupplierId}`,
        { signal: controller.signal }
      )
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const grouped = rows.reduce((acc, row) => {
          const section =
            row.chart_section ||
            row.category ||
            "Quantity";
          if (!acc[section]) acc[section] = [];
          acc[section].push({
            label: row.factor_name,
            value: Number(row.factor_value ?? 0),
          });
          return acc;
        }, {});

        const preferredOrder = [
          "Quantity",
          "Raw Material - Rubber / Polymer Cost in ($)",
          "Fuel Cost (WTI) in $",
          "Fuel Cost (Brent) in $",
          "Exchange Rate Dollar/Euro",
          "Exchange Rate Dollar/Yuan",
          "Exchange Rate Dollar/Rupee",
        ];

        const orderedSections = [
          ...preferredOrder.filter((s) => grouped[s]),
          ...Object.keys(grouped).filter(
            (section) => !preferredOrder.includes(section)
          ),
        ];

        const cards = orderedSections.map((section) => ({
          title: section,
          color: EXPLAINABILITY_SECTION_COLORS[section] || COLORS.blue600,
          factors: grouped[section]
            .sort((a, b) => b.value - a.value)
            .slice(0, 4),
        }));

        setExplainabilityData(cards);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Error fetching explainability data", err);
          setExplainabilityData([]);
        }
      })
      .finally(() => setExplainabilityLoading(false));

    return () => controller.abort();
  }, [activeTab, activeSupplier]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: COLORS.gray50,
        width: "100%",
        pt: 0.5,
        px: 2,
        pb: 2,
      }}
    >
      {/* Header strip */}
      <LegendHeader
        onOpenConfig={() => setIsConfigOpen(true)}
        selectedMetric={scoreView}
        onSelectMetric={setScoreView}
      />

      {/* "Recommended" label under header */}
      <Typography sx={{ ml: 19, mb: 1, fontSize: 16, color: COLORS.blue700 }}>
        Recommended
      </Typography>

      {/* Radar cards row */}
      <Stack direction="row" spacing={2}>
        {SUPPLIERS.map((s) => (
          <SupplierCard
            key={s.id}
            supplier={s}
            isActive={activeSupplier === s.id}
            activeTab={activeTab}
            onChange={(tab) => handleTabChange(s.id, tab)}
            selectedMetric={scoreView}
          />
        ))}
      </Stack>

      {/* Factors or Explainability row (bottom) */}
      <Box sx={{ mt: 3 }}>
        {activeTab === "factors" ? (
          <Stack direction="row" spacing={1.5}>
            {/* Quantity */}
            <FactorCard
              title="Quantity"
              color="#22C55E"
              gradient="g1"
              yLabels={[3200, 1600, 0]}
              data={factorData.quantity}
            />
            {/* Raw Material - Rubber / Polymer Cost */}
            <FactorCard
              title="Raw Material - Rubber / Polymer Cost in ($)"
              color="#FB923C"
              gradient="g2"
              yLabels={[100, 50, 0]}
              data={factorData.rubberCost}
            />
            {/* Fuel Cost (WTI) */}
            <FactorCard
              title="Fuel Cost (WTI) in $"
              color="#60A5FA"
              gradient="g3"
              yLabels={[100, 50, 0]}
              data={factorData.fuelWti}
            />
            {/* Fuel Cost (Brent) */}
            <FactorCard
              title="Fuel Cost (Brent) in $"
              color="#818CF8"
              gradient="g4"
              yLabels={[100, 50, 0]}
              data={factorData.fuelBrent}
            />
            {/* Exchange Rate */}
            <FactorCard
              title="Exchange Rate Dollar/Euro"
              color="#C084FC"
              gradient="g5"
              yLabels={[1.3, 1.1, 0]}
              data={factorData.fxRate}
            />
          </Stack>
        ) : (
          <Stack direction="row" spacing={1.5}>
            {explainabilityLoading ? (
              <Typography sx={{ color: COLORS.gray600 }}>
                Loading explainability...
              </Typography>
            ) : explainabilityData.length ? (
              explainabilityData.map((e, i) => (
                <ExplainabilityCard
                  key={`${e.title}-${i}`}
                  title={e.title}
                  color={e.color}
                  factors={e.factors}
                />
              ))
            ) : (
              <Typography sx={{ color: COLORS.gray600 }}>
                No explainability data.
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      {/* Score Configuration sidebar + overlay */}
      <ScoreConfigSidebar
        open={isConfigOpen}
        values={scoreConfig}
        onChange={setScoreConfig}
        onClose={() => setIsConfigOpen(false)}
      />
    </Box>
  );
}
