// import { Box, Paper, Typography } from "@mui/material";
// import React from "react";

// const chartData = {
//   yAxisLabels: [3000, 2000],
//   xAxisLabels: ["2023", "2024", "2025"],
//   gridLines: {
//     horizontal: 4,
//     vertical: 4,
//   },
// };

// export default function Frame() {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         border: "1px solid",
//         borderColor: "grey.300",
//         borderRadius: "5px",
//         padding: "10px",
//         display: "inline-block",
//         backgroundColor: "#ffffff",
//       }}
//     >
//       <Typography
//         variant="body2"
//         sx={{
//           fontWeight: 600,
//           fontSize: "14px",
//           color: "text.secondary",
//           marginBottom: "10px",
//         }}
//       >
//         Quantity
//       </Typography>

//       <Box
//         sx={{
//           position: "relative",
//           width: "361px",
//           height: "183px",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "11px",
//             left: "34px",
//             width: "319px",
//             height: "129px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           }}
//         >
//           {[...Array(4)].map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: "100%",
//                 height: "1px",
//                 backgroundColor: "grey.300",
//               }}
//             />
//           ))}
//         </Box>

//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: "37px",
//             width: "318px",
//             height: "168px",
//             display: "flex",
//             alignItems: "center",
//             gap: "96px",
//           }}
//         >
//           {[...Array(4)].map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: "1px",
//                 height: "168px",
//                 backgroundColor: "grey.300",
//               }}
//             />
//           ))}
//         </Box>

//         <Box
//           sx={{
//             position: "absolute",
//             top: "165px",
//             left: "34px",
//             width: "319px",
//             height: "1px",
//             backgroundColor: "grey.300",
//           }}
//         />

//         <Box
//           sx={{
//             position: "absolute",
//             top: "1px",
//             left: 0,
//             width: "35px",
//             height: "141px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           }}
//         >
//           {chartData.yAxisLabels.map((label, index) => (
//             <Typography
//               key={index}
//               variant="caption"
//               sx={{
//                 fontSize: "12px",
//                 color: "text.secondary",
//                 textAlign: "center",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {label}
//             </Typography>
//           ))}
//         </Box>

//         <Box
//           sx={{
//             position: "absolute",
//             top: "19px",
//             left: "37px",
//             width: "315px",
//             height: "147px",
//           }}
//         >
//           <svg
//             width="315"
//             height="147"
//             viewBox="0 0 315 147"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             style={{ position: "absolute", top: 0, left: 0 }}
//           >
//             <defs>
//               <linearGradient
//                 id="chartGradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="0%"
//                 y2="100%"
//               >
//                 <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
//                 <stop offset="100%" stopColor="#4ade80" stopOpacity="0.1" />
//               </linearGradient>
//             </defs>
//             <path
//               d="M0,108 L10,98 L20,88 L30,78 L40,85 L50,75 L60,68 L70,58 L80,65 L90,55 L100,48 L110,45 L120,38 L130,35 L140,42 L150,32 L160,38 L170,28 L180,35 L190,25 L200,18 L210,22 L220,15 L230,8 L240,12 L250,5 L259,0 L259,128 L0,128 Z"
//               fill="url(#chartGradient)"
//             />
//             <path
//               d="M0,108 L10,98 L20,88 L30,78 L40,85 L50,75 L60,68 L70,58 L80,65 L90,55 L100,48 L110,45 L120,38 L130,35 L140,42 L150,32 L160,38 L170,28 L180,35 L190,25 L200,18 L210,22 L220,15 L230,8 L240,12 L250,5 L259,0"
//               stroke="#22c55e"
//               strokeWidth="2"
//               fill="none"
//             />
//             <path
//               d="M259,0 L270,10 L280,5 L290,15 L300,8 L315,12"
//               stroke="#22c55e"
//               strokeWidth="2"
//               strokeDasharray="5,5"
//               fill="none"
//             />
//             <path
//               d="M259,0 L270,10 L280,5 L290,15 L300,8 L315,12 L315,147 L259,128 Z"
//               fill="url(#chartGradient)"
//             />
//           </svg>
//         </Box>

//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 0,
//             left: "34px",
//             right: 0,
//             display: "flex",
//             justifyContent: "space-between",
//             paddingLeft: "36px",
//             paddingRight: "39px",
//           }}
//         >
//           {chartData.xAxisLabels.map((label, index) => (
//             <Typography
//               key={index}
//               variant="caption"
//               sx={{
//                 fontSize: "12px",
//                 color: "text.secondary",
//                 textAlign: "center",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {label}
//             </Typography>
//           ))}
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// import { Box as MuiBox, Stack, Typography } from "@mui/material";
// import React from "react";

// export const Box = () => {
//   const horizontalLines = [
//     "https://c.animaapp.com/uPjeCfEM/img/line-301.svg",
//     "https://c.animaapp.com/uPjeCfEM/img/line-301.svg",
//     "https://c.animaapp.com/uPjeCfEM/img/line-301.svg",
//     "https://c.animaapp.com/uPjeCfEM/img/line-301.svg",
//   ];

//   const verticalLines = [
//     "https://c.animaapp.com/uPjeCfEM/img/line-302-1.svg",
//     "https://c.animaapp.com/uPjeCfEM/img/line-306.svg",
//     "https://c.animaapp.com/uPjeCfEM/img/line-306.svg",
//     "https://c.animaapp.com/uPjeCfEM/img/line-306.svg",
//   ];

//   const years = [
//     { label: "2023", left: "71px" },
//     { label: "2024", left: "166px" },
//     { label: "2025", left: "263px" },
//   ];

//   return (
//     <MuiBox
//       sx={{
//         position: "relative",
//         width: "370px",
//         height: "234px",
//       }}
//       data-model-id="24178:7112-frame"
//     >
//       <MuiBox
//         sx={{
//           position: "fixed",
//           top: 0,
//           left: "384px",
//           width: "370px",
//           height: "234px",
//         }}
//       >
//         <Stack
//           spacing={1.25}
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "370px",
//             padding: "10px",
//             backgroundColor: "white",
//             borderRadius: "5px",
//             border: "1px solid",
//             borderColor: "rgb(203, 213, 225)",
//           }}
//         >
//           <Typography
//             sx={{
//               fontFamily: "Poppins, Helvetica",
//               fontWeight: 500,
//               color: "rgb(71, 85, 105)",
//               fontSize: "14px",
//               textAlign: "center",
//               letterSpacing: "0.10px",
//             }}
//           >
//             Raw Material - Rubber / Polymer Cost in ($)
//           </Typography>

//           <MuiBox
//             sx={{
//               position: "relative",
//               width: "360.67px",
//               height: "183px",
//               marginRight: "-10.67px",
//             }}
//           >
//             <Stack
//               spacing={0}
//               sx={{
//                 position: "absolute",
//                 width: "319px",
//                 height: "97px",
//                 top: "69px",
//                 left: "34px",
//                 justifyContent: "space-between",
//               }}
//             >
//               {horizontalLines.map((line, index) => (
//                 <img
//                   key={index}
//                   style={{
//                     width: "100%",
//                     height: "1px",
//                     objectFit: "cover",
//                   }}
//                   alt="Line"
//                   src={line}
//                 />
//               ))}
//             </Stack>

//             <Stack
//               direction="row"
//               spacing={12}
//               sx={{
//                 position: "absolute",
//                 width: "318px",
//                 height: "168px",
//                 top: 0,
//                 left: "36px",
//                 alignItems: "center",
//               }}
//             >
//               {verticalLines.map((line, index) => (
//                 <img
//                   key={index}
//                   style={{
//                     width: "1px",
//                     height: "168px",
//                     objectFit: "cover",
//                     marginLeft: index === 0 ? "-1px" : "0",
//                   }}
//                   alt="Line"
//                   src={line}
//                 />
//               ))}
//             </Stack>

//             <img
//               style={{
//                 position: "absolute",
//                 top: "165px",
//                 left: "34px",
//                 width: "319px",
//                 height: "1px",
//                 objectFit: "cover",
//               }}
//               alt="Line"
//               src="https://c.animaapp.com/uPjeCfEM/img/line-303-1.svg"
//             />

//             <Stack
//               spacing="91.4px"
//               sx={{
//                 position: "absolute",
//                 top: "56px",
//                 left: 0,
//                 width: "35px",
//                 height: "117px",
//               }}
//             >
//               <Typography
//                 sx={{
//                   width: "31px",
//                   height: "12.62px",
//                   fontFamily: "Poppins, Helvetica",
//                   fontWeight: 400,
//                   color: "rgb(71, 85, 105)",
//                   fontSize: "12px",
//                   textAlign: "center",
//                   letterSpacing: "0.40px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 100
//               </Typography>

//               <Typography
//                 sx={{
//                   marginLeft: "0.3px",
//                   width: "31px",
//                   height: "12.62px",
//                   fontFamily: "Poppins, Helvetica",
//                   fontWeight: 400,
//                   color: "rgb(71, 85, 105)",
//                   fontSize: "12px",
//                   textAlign: "center",
//                   letterSpacing: "0.40px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 0
//               </Typography>
//             </Stack>

//             {years.map((year, index) => (
//               <Typography
//                 key={index}
//                 sx={{
//                   position: "absolute",
//                   top: "170px",
//                   left: year.left,
//                   width: index === 0 ? "30px" : "31px",
//                   fontFamily: "Poppins, Helvetica",
//                   fontWeight: 400,
//                   color: "rgb(71, 85, 105)",
//                   fontSize: "12px",
//                   textAlign: "center",
//                   letterSpacing: "0.40px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {year.label}
//               </Typography>
//             ))}
//           </MuiBox>
//         </Stack>

//         <img
//           style={{
//             position: "absolute",
//             top: "85px",
//             left: "46px",
//             width: "317px",
//             height: "122px",
//           }}
//           alt="Group"
//           src="https://c.animaapp.com/uPjeCfEM/img/group-268@2x.png"
//         />
//       </MuiBox>
//     </MuiBox>
//   );
// };
import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

/* ---------- Quantity (left card) ---------- */
const chartData = {
  yAxisLabels: [3000, 2000],
  xAxisLabels: ["2023", "2024", "2025"],
};

function QuantityCard() {
  // chart inner box (the drawable area)
  const CHART_W = 315;
  const CHART_H = 147;
  const LEFT_PAD = 37; // matches label + y-axis offset
  const TOP_PAD = 19;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: "8px",
        p: "10px",
        bgcolor: "#ffffff",
        width: 361,
        height: 234,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, fontSize: 14, color: "text.secondary", mb: 1 }}
      >
        Quantity
      </Typography>

      <Box sx={{ position: "relative", width: 361, height: 183 }}>
        {/* Y-axis labels */}
        <Box
          sx={{
            position: "absolute",
            top: 2,
            left: 0,
            width: 35,
            height: 141,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {chartData.yAxisLabels.map((label) => (
            <Typography
              key={label}
              variant="caption"
              sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        {/* Single SVG: grid + area + line + forecast veil */}
        <svg
          width={CHART_W}
          height={CHART_H + 18} // a touch of headroom for stroke caps
          viewBox={`0 0 ${CHART_W} ${CHART_H + 18}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: TOP_PAD, left: LEFT_PAD }}
        >
          <defs>
            <linearGradient id="qtyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* --- GRID --- */}
          {/* verticals: left axis + 2023/24/25 splits */}
          {[0, CHART_W / 3, (2 * CHART_W) / 3, CHART_W].map((x, i) => (
            <line
              key={`v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={CHART_H}
              stroke="#e2e8f0"
              strokeWidth={i === 0 || i === 3 ? 1 : 1}
              shapeRendering="crispEdges"
            />
          ))}
          {/* horizontals: 4 interior + bottom axis */}
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={CHART_H * p}
              x2={CHART_W}
              y2={CHART_H * p}
              stroke="#e2e8f0"
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
          ))}
          <line
            x1={0}
            y1={CHART_H}
            x2={CHART_W}
            y2={CHART_H}
            stroke="#e2e8f0"
            strokeWidth={1}
            shapeRendering="crispEdges"
          />

          {/* --- FORECAST VEIL (rightmost ~18%) --- */}
          <rect
            x={CHART_W * 0.82}
            y={0}
            width={CHART_W * 0.18}
            height={CHART_H}
            fill="#22c55e"
            opacity="0.12"
          />

          {/* --- HISTORY FILL + LINE --- */}
          <path
            d="M0,108 L10,98 L20,88 L30,78 L40,85 L50,75 L60,68 L70,58 L80,65 L90,55 L100,48 L110,45 L120,38 L130,35 L140,42 L150,32 L160,38 L170,28 L180,35 L190,25 L200,18 L210,22 L220,15 L230,8 L240,12 L250,5 L259,0 L259,128 L0,128 Z"
            fill="url(#qtyFill)"
          />
          <path
            d="M0,108 L10,98 L20,88 L30,78 L40,85 L50,75 L60,68 L70,58 L80,65 L90,55 L100,48 L110,45 L120,38 L130,35 L140,42 L150,32 L160,38 L170,28 L180,35 L190,25 L200,18 L210,22 L220,15 L230,8 L240,12 L250,5 L259,0"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
          />

          {/* --- FORECAST LINE + FILL --- */}
          <path
            d="M259,0 L270,10 L280,5 L290,15 L300,8 L315,12"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
          />
          <path
            d="M259,0 L270,10 L280,5 L290,15 L300,8 L315,12 L315,147 L259,128 Z"
            fill="url(#qtyFill)"
            opacity="0.9"
          />
        </svg>

        {/* X labels */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: LEFT_PAD - 3,
            width: CHART_W + 6,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {chartData.xAxisLabels.map((label) => (
            <Typography
              key={label}
              variant="caption"
              sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}
            >
              {label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

/* ---------- Raw Material Cost (right card) ---------- */
function RawMaterialCard() {
  const horizontalLines = new Array(4).fill(
    "https://c.animaapp.com/uPjeCfEM/img/line-301.svg"
  );
  const verticalLines = [
    "https://c.animaapp.com/uPjeCfEM/img/line-302-1.svg",
    "https://c.animaapp.com/uPjeCfEM/img/line-306.svg",
    "https://c.animaapp.com/uPjeCfEM/img/line-306.svg",
    "https://c.animaapp.com/uPjeCfEM/img/line-306.svg",
  ];
  const years = [
    { label: "2023", left: "71px" },
    { label: "2024", left: "166px" },
    { label: "2025", left: "263px" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "rgb(203, 213, 225)",
        borderRadius: "8px",
        p: "10px",
        bgcolor: "white",
        width: 370,
        height: 234,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontWeight: 500,
          color: "rgb(71, 85, 105)",
          fontSize: 14,
          textAlign: "left",
          letterSpacing: "0.10px",
          mb: 1.25,
        }}
      >
        Raw Material - Rubber / Polymer Cost in ($)
      </Typography>

      <Box sx={{ position: "relative", width: 361, height: 183 }}>
        {/* horizontal grid lines */}
        <Stack
          spacing={0}
          sx={{
            position: "absolute",
            width: "319px",
            height: "97px",
            top: "69px",
            left: "34px",
            justifyContent: "space-between",
          }}
        >
          {horizontalLines.map((src, i) => (
            <img
              key={i}
              style={{ width: "100%", height: 1, objectFit: "cover" }}
              alt="Line"
              src={src}
            />
          ))}
        </Stack>

        {/* vertical grid lines */}
        <Stack
          direction="row"
          spacing={12}
          sx={{
            position: "absolute",
            width: "318px",
            height: "168px",
            top: 0,
            left: "36px",
            alignItems: "center",
          }}
        >
          {verticalLines.map((src, i) => (
            <img
              key={i}
              style={{
                width: 1,
                height: "168px",
                objectFit: "cover",
                marginLeft: i === 0 ? "-1px" : 0,
              }}
              alt="Line"
              src={src}
            />
          ))}
        </Stack>

        {/* bottom axis line */}
        <img
          style={{
            position: "absolute",
            top: "165px",
            left: "34px",
            width: "319px",
            height: 1,
            objectFit: "cover",
          }}
          alt="Line"
          src="https://c.animaapp.com/uPjeCfEM/img/line-303-1.svg"
        />

        {/* Y labels */}
        <Stack
          spacing="91.4px"
          sx={{
            position: "absolute",
            top: "56px",
            left: 0,
            width: "35px",
            height: "117px",
          }}
        >
          <Typography sx={{ width: "31px", color: "rgb(71, 85, 105)", fontSize: 12, textAlign: "center" }}>
            100
          </Typography>
          <Typography sx={{ width: "31px", color: "rgb(71, 85, 105)", fontSize: 12, textAlign: "center" }}>
            0
          </Typography>
        </Stack>

        {/* X labels */}
        {years.map((year, i) => (
          <Typography
            key={i}
            sx={{
              position: "absolute",
              top: "170px",
              left: year.left,
              width: i === 0 ? "30px" : "31px",
              color: "rgb(71, 85, 105)",
              fontSize: 12,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {year.label}
          </Typography>
        ))}
      </Box>

      {/* Area image (orange chart) */}
      <img
        style={{
          position: "absolute",
          top: "85px",
          left: "46px",
          width: "317px",
          height: "122px",
        }}
        alt="Area Series"
        src="https://c.animaapp.com/uPjeCfEM/img/group-268@2x.png"
      />
    </Paper>
  );
}

/* ---------- Parent wrapper exporting both cards ---------- */
export default function ChartsRow() {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <QuantityCard />
      <RawMaterialCard />
    </Stack>
  );
}
