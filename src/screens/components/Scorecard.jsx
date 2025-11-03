import React from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

/* --- Data --- */
const suppliers = [
  {
    name: "Global Parts Inc",
    rating: "8.5 / 10",
    isRecommended: true,
    isSelected: true,
    radarImage: "https://c.animaapp.com/3wmcVOHD/img/vector-5.svg",
    borderColor: "#0288d1",
    backgroundColor: "#fff",
    icons: [
      "https://c.animaapp.com/3wmcVOHD/img/operational.svg",
      "https://c.animaapp.com/3wmcVOHD/img/finance-building.svg",
      "https://c.animaapp.com/3wmcVOHD/img/environmental-and-social.svg",
    ],
  },
  {
    name: "Bharat Supplies",
    rating: "7.6 / 10",
    isRecommended: false,
    isSelected: false,
    radarImage: "https://c.animaapp.com/3wmcVOHD/img/vector-12.svg",
    borderColor: "#90a4ae",
    backgroundColor: "#fff",
    icons: [
      "https://c.animaapp.com/3wmcVOHD/img/operational-1.svg",
      "https://c.animaapp.com/3wmcVOHD/img/finance-building-1.svg",
      "https://c.animaapp.com/3wmcVOHD/img/environmental-and-social-1.svg",
    ],
  },
  {
    name: "AutoMech Gumby",
    rating: "7.2 / 10",
    isRecommended: false,
    isSelected: false,
    radarImage: "https://c.animaapp.com/3wmcVOHD/img/group-290@2x.png",
    borderColor: "#90a4ae",
    backgroundColor: "#fff",
    icons: [
      "https://c.animaapp.com/3wmcVOHD/img/operational-2.svg",
      "https://c.animaapp.com/3wmcVOHD/img/finance-building-2.svg",
      "https://c.animaapp.com/3wmcVOHD/img/environmental-and-social-2.svg",
    ],
  },
];

/* --- Components --- */
const RecommendedSection = () => {
  const [selectedOption, setSelectedOption] = React.useState("Balanced");

  const scoreRanges = [
    { color: "#22c55e", label: "10 - 7" },
    { color: "#eab308", label: "7 - 5" },
    { color: "#ef4444", label: "Below 5" },
  ];

  return (
    <Stack direction="row" spacing={1.875} alignItems="center" sx={{ p: 0.625 }}>
      <Stack direction="row" spacing={0.625} alignItems="center" sx={{ p: 0.625 }}>
        <Box sx={{ width: 13, height: 13, bgcolor: "#60a5fa", borderRadius: "50%" }} />
        <Typography
          sx={{
            fontFamily: "Poppins, Helvetica",
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: "0.25px",
            color: "#64748b",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          Recommended
        </Typography>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: "center" }} />

      <Typography
        sx={{
          fontFamily: "Poppins, Helvetica",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.25px",
          color: "#64748b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
      >
        RC Score:
      </Typography>

      {scoreRanges.map((range, index) => (
        <Stack key={index} direction="row" spacing={0.625} alignItems="center">
          <Box sx={{ width: 13, height: 13, bgcolor: range.color, borderRadius: "50%" }} />
          <Typography
            sx={{
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: "0.25px",
              color: "#64748b",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {range.label}
          </Typography>
        </Stack>
      ))}

      <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: "center" }} />

      <Select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        sx={{
          width: 160,
          height: 38,
          bgcolor: "#ffffff",
          borderRadius: 1,
          fontFamily: "Inter, Helvetica",
          fontSize: 16,
          color: "#6b7280",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d5db",
          },
        }}
      >
        <MenuItem value="Balanced">Balanced</MenuItem>
      </Select>

      <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: "center" }} />

      <SettingsIcon sx={{ width: 20, height: 20, color: "#64748b" }} />
    </Stack>
  );
};

const ComparisonSection = () => {
  return (
    <Box sx={{ position: "relative", width: "100%", pt: 4 }}>
      <Typography
        sx={{
          position: "absolute",
          top: 12,
          left: 117,
          fontSize: 16,
          fontWeight: 400,
          color: "#0277bd",
          textAlign: "center",
        }}
      >
        Recommended
      </Typography>

      <Stack direction="row" spacing={2}>
        {suppliers.map((supplier, index) => (
          <Box
            key={index}
            sx={{
              width: 442,
              height: 465,
              backgroundColor: supplier.backgroundColor,
              border: `1px solid ${supplier.borderColor}`,
              position: "relative",
            }}
          >
            {/* Header: radio + name/rating */}
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
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: supplier.isSelected ? "#0277bd" : "#fff",
                    border: supplier.isSelected ? "none" : "1px solid #90a4ae",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {supplier.isSelected && (
                    <Box sx={{ width: 6, height: 6, backgroundColor: "#fff", borderRadius: "3px" }} />
                  )}
                </Box>
              </Box>

              <Stack spacing={0.875}>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#0277bd",
                    textAlign: "center",
                  }}
                >
                  {supplier.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 19,
                    fontWeight: 600,
                    color: "#546e7a",
                    textAlign: "center",
                  }}
                >
                  {supplier.rating}
                </Typography>
              </Stack>
            </Box>

            {/* Icons (top-right) */}
            <Box
              sx={{
                position: "absolute",
                top: 1,
                right: 10,
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.25,
              }}
            >
              <Box component="img" src={supplier.icons[0]} alt="Operational" sx={{ width: 15, height: 18 }} />
              <Box component="img" src={supplier.icons[1]} alt="Finance" sx={{ width: 18, height: 19 }} />
              <Box sx={{ width: 19, height: 17, position: "relative" }}>
                <Box
                  component="img"
                  src="https://c.animaapp.com/3wmcVOHD/img/vector-6.svg"
                  alt=""
                  sx={{ position: "absolute", width: "73.76%", height: "11.72%", top: "63.08%", left: "9.78%" }}
                />
                <Box
                  component="img"
                  src="https://c.animaapp.com/3wmcVOHD/img/vector-7.svg"
                  alt=""
                  sx={{ position: "absolute", width: "23.28%", height: "51.30%", top: 0, left: "18.72%" }}
                />
                <Box
                  component="img"
                  src="https://c.animaapp.com/3wmcVOHD/img/vector-8.svg"
                  alt=""
                  sx={{ position: "absolute", width: "84.74%", height: "8.96%", top: "82.75%", left: "3.67%" }}
                />
                <Box
                  component="img"
                  src="https://c.animaapp.com/3wmcVOHD/img/vector-9.svg"
                  alt=""
                  sx={{ position: "absolute", width: "47.85%", height: "30.71%", top: "31.20%", left: "46.68%" }}
                />
                <Box
                  component="img"
                  src="https://c.animaapp.com/3wmcVOHD/img/vector-10.svg"
                  alt=""
                  sx={{ position: "absolute", width: "20.73%", height: "11.03%", top: "37.06%", left: "21.32%" }}
                />
                <Box
                  component="img"
                  src="https://c.animaapp.com/3wmcVOHD/img/vector-11.svg"
                  alt=""
                  sx={{ position: "absolute", width: "20.73%", height: "11.03%", top: "6.73%", left: "33.51%" }}
                />
              </Box>
              <Box component="img" src={supplier.icons[2]} alt="Environmental" sx={{ width: 21, height: 18 }} />
            </Box>

            {/* Radar */}
            <Box sx={{ position: "absolute", top: "18%", left: "19%", width: "60%", height: "54%" }}>
              <Box
                component="img"
                src="https://c.animaapp.com/3wmcVOHD/img/group-291@2x.png"
                alt="Radar background"
                sx={{ position: "absolute", width: "100%", height: "100%" }}
              />
              <Box
                component="img"
                src={supplier.radarImage}
                alt="Radar chart"
                sx={{ position: "absolute", width: "100%", height: "100%" }}
              />

              <Typography sx={{ position: "absolute", top: "-5%", left: "48%", fontSize: 12, fontWeight: 500, fontFamily: "Inter" }}>
                Quality
              </Typography>
              <Typography sx={{ position: "absolute", top: "32%", right: "-12%", fontSize: 12, fontWeight: 500, fontFamily: "Inter" }}>
                Cost
              </Typography>
              <Typography sx={{ position: "absolute", bottom: "-8%", right: "8%", fontSize: 12, fontWeight: 500, fontFamily: "Inter" }}>
                Delivery
              </Typography>
              <Typography sx={{ position: "absolute", bottom: "-8%", left: "8%", fontSize: 12, fontWeight: 500, fontFamily: "Inter" }}>
                Risk
              </Typography>
              <Typography sx={{ position: "absolute", top: "34%", left: "-18%", fontSize: 12, fontWeight: 500, fontFamily: "Inter" }}>
                Compliance
              </Typography>
            </Box>

            {/* Footer buttons */}
            <Stack direction="row" sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}>
              <Button
                sx={{
                  flex: 1,
                  backgroundColor: supplier.isSelected ? "#0288d1" : "#e3f2fd",
                  color: supplier.isSelected ? "#fff" : "#546e7a",
                  borderBottom: "1px solid #90a4ae",
                  borderRadius: 0,
                  py: 1.25,
                  px: 2,
                  fontSize: 14,
                  fontWeight: 400,
                  textTransform: "none",
                  "&:hover": { backgroundColor: supplier.isSelected ? "#0277bd" : "#bbdefb" },
                }}
              >
                Factors
              </Button>
              <Button
                sx={{
                  flex: 1,
                  backgroundColor: "#e3f2fd",
                  color: "#546e7a",
                  borderBottom: "1px solid #90a4ae",
                  borderRadius: 0,
                  py: 1.25,
                  px: 2,
                  fontSize: 14,
                  fontWeight: 400,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#bbdefb" },
                }}
              >
                Explainability
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

/* --- Screen (default export) --- */
const Scorecard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ECEFF1",
        width: "100%",
      }}
      data-model-id="24176:419"
    >
      <RecommendedSection />
      <ComparisonSection />
    </Box>
  );
};

export default Scorecard;
