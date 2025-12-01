import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, IconButton, Paper, InputAdornment } from "@mui/material";
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
  VolumeUp as VolumeUpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import chatbot from "../assets/chatbot1.png";
import robotLogo from "../assets/robot.svg";

const ChatBot = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [scriptStep, setScriptStep] = useState(0);
  const messagesEndRef = useRef(null);

  const openingMessage = {
    id: 1,
    text: "Hi! Let's evaluate suppliers for SKU54321 using Purchase Price Variance (PPV). Shall we proceed?",
    isBot: true,
    timestamp: new Date(),
  };

  const [visibleMessages, setVisibleMessages] = useState([openingMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const cannedResponses = [
    "I'm analyzing the data to provide you with accurate demand forecasting insights...",
    "Based on historical trends and market analysis, I can provide you with detailed projections...",
    "Let me process your request and generate relevant business insights for you...",
    "I'm accessing the latest market data to give you precise forecasting information...",
  ];

  const scriptedFirstReply = "Yes, show me the details for SKU54321.";
  const scriptedSecondReply = "Show me the PPV trend for the last 3 months.";
  const scriptedThirdReply = "Yes, show Bharat Supplies' delivery metrics.";
  const scriptedFourthReply = "Looks good. Select Bharat Supplies for SKU54321.";
  const tablePayload = {
    columns: [
      { key: "supplier", label: "Supplier" },
      { key: "price", label: "Actual Price" },
      { key: "ppv", label: "PPV (%)" },
    ],
    rows: [
      { supplier: "GlobalParts Inc.", price: "$102", ppv: "+7.37%" },
      { supplier: "AutoMech GmbH", price: "$97", ppv: "+2.11%" },
      { supplier: "Bharat Supplies", price: "$94", ppv: "-1.05%" },
    ],
    prompt: "Would you like to see price trends or check other performance metrics?",
  };
  const ppvTrendPayload = {
    columns: [
      { key: "supplier", label: "Supplier" },
      { key: "jan", label: "Jan" },
      { key: "feb", label: "Feb" },
      { key: "mar", label: "Mar" },
    ],
    rows: [
      { supplier: "GlobalParts Inc.", jan: "+5.26%", feb: "+7.37%", mar: "+7.37%" },
      { supplier: "AutoMech GmbH", jan: "+1.05%", feb: "+3.16%", mar: "+2.11%" },
      { supplier: "Bharat Supplies", jan: "-2.11%", feb: "0.00%", mar: "-1.05%" },
    ],
    prompt:
      "Bharat Supplies consistently offers better-than-target pricing. Would you like to consider delivery performance as well?",
  };

  const scriptedSteps = [
    { step: 0, reply: scriptedFirstReply, next: 1 },
    { step: 2, reply: scriptedSecondReply, next: 3 },
    { step: 4, reply: scriptedThirdReply, next: 5 },
    { step: 6, reply: scriptedFourthReply, next: 7 },
  ];

  const scriptedResponses = {
    1: { type: "table", payload: tablePayload, nextStep: 2 },
    3: { type: "table", payload: ppvTrendPayload, nextStep: 4 },
    5: {
      type: "text",
      payload: "Bharat Supplies averages 4.2 days for delivery with a 95% on-time rate over the last quarter.",
      nextStep: 6,
    },
    7: {
      type: "text",
      payload: "Got it. Bharat Supplies has been selected for SKU54321.",
      nextStep: 8,
    },
  };

  const handleSendMessage = () => {
    if (botIsTyping) return;
    let trimmed = message.trim();

    const scriptedMatch = scriptedSteps.find((s) => s.step === scriptStep && !trimmed);
    if (scriptedMatch) {
      setMessage(scriptedMatch.reply);
      setScriptStep(scriptedMatch.next);
      return;
    }

    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      text: trimmed,
      isBot: false,
      timestamp: new Date(),
    };
    setVisibleMessages((prev) => [...prev, userMessage]);
    setMessage("");

    if (scriptedResponses[scriptStep]) {
      const response = scriptedResponses[scriptStep];
      setScriptStep(response.nextStep);
      setBotIsTyping(true);
      setTimeout(() => {
        const botResponse = response.type === "table"
          ? {
            id: Date.now() + 1,
            isBot: true,
            type: "table",
            table: response.payload,
          }
          : {
            id: Date.now() + 1,
            isBot: true,
            text: response.payload,
            timestamp: new Date(),
          };
        setVisibleMessages((prev) => [...prev, botResponse]);
        setBotIsTyping(false);
      }, 600);
      return;
    }

    setBotIsTyping(true);
    setTimeout(() => {
      const randomResponse =
        cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
      const botResponse = {
        id: Date.now() + 1,
        text: randomResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setVisibleMessages((prev) => [...prev, botResponse]);
      setBotIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendClick = () => {
    handleSendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: 680,
          height: 1080,
          bgcolor: "#075985",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={chatbot}
          alt="Planner Assistant"
          sx={{
            width: 262,
            height: 262,
            objectFit: "cover",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.7, transform: "scale(1)" },
              "50%": { opacity: 1, transform: "scale(1.05)" },
              "100%": { opacity: 0.7, transform: "scale(1)" },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 680,
        height: 1080,
        bgcolor: "#f8f9fa",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          color: "#333",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <IconButton size="small" sx={{ color: BOT_COLOR }}>
            <ArrowBackIcon />
          </IconButton>
          <BotBadge size={32} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: BOT_COLOR,
              fontSize: 18,
              letterSpacing: 0.2,
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
          >
            Planner Assistant
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" sx={{ color: BOT_COLOR }}>
            <VolumeUpIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: BOT_COLOR }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {visibleMessages.map((msg) => {
          const isTable = msg.type === "table";
          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.isBot ? "flex-start" : "flex-end",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              {msg.isBot && <BotBadge size={32} />}
              {isTable ? (
                <Box
                  sx={{
                    bgcolor: "#F7F7F7",
                    borderRadius: "20px",
                    border: "1px solid #E2E2E2",
                    p: 2.5,
                    maxWidth: "80%",
                    boxShadow: "0 5px 18px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 14,
                      color: "#475569",
                    }}
                  >
                    <Box component="thead" sx={{ bgcolor: "#ECECEC" }}>
                      <Box component="tr">
                        {msg.table.columns.map((col) => (
                          <Box
                            key={col.key}
                            component="th"
                            sx={{
                              textAlign: "left",
                              padding: "10px 18px",
                              fontWeight: 600,
                              color: "#475569",
                              borderRight: "1px solid #D7D7D7",
                              "&:last-of-type": { borderRight: "none" },
                            }}
                          >
                            {col.label}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {msg.table.rows.map((row, idx) => (
                        <Box
                          component="tr"
                          key={`${row.supplier}-${idx}`}
                          sx={{ bgcolor: idx % 2 ? "#FDFDFD" : "#FFFFFF" }}
                        >
                          {msg.table.columns.map((col, colIdx) => (
                            <Box
                              key={`${row.supplier}-${col.key}`}
                              component="td"
                              sx={{
                                padding: "10px 18px",
                                borderTop: "1px solid #E3E3E3",
                                borderRight:
                                  colIdx === msg.table.columns.length - 1
                                    ? "none"
                                    : "1px solid #E3E3E3",
                                fontWeight: colIdx === 0 ? 500 : 400,
                                color: "#4B5563",
                              }}
                            >
                              {row[col.key]}
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1.5,
                      fontSize: 14,
                      color: "#5C6B7A",
                      textAlign: "left",
                      fontWeight: 500,
                    }}
                  >
                    {msg.table.prompt}
                  </Typography>
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.4,
                    maxWidth: "70%",
                    bgcolor: msg.isBot ? "#F1F3F4" : "#1F6CAB",
                    color: msg.isBot ? "#1F2933" : "white",
                    borderRadius: msg.isBot
                      ? "16px 16px 16px 4px"
                      : "16px 16px 4px 16px",
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: msg.isBot
                      ? "inset 0 1px 0 rgba(255,255,255,0.4)"
                      : "0 6px 16px rgba(31,108,171,0.28)",
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 14 }}>
                    {msg.text}
                  </Typography>
                </Paper>
              )}
            </Box>
          );
        })}
        <Box ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Ask your question here..!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" sx={{ color: "#8C9BA8" }}>
                  <AttachFileIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "#8C9BA8" }}>
                  <MicIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleSendClick}
                  sx={{
                    bgcolor: "#1F6CAB",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#18537F",
                    },
                    width: 38,
                    height: 38,
                    ml: 1,
                  }}
                >
                  <SendIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "25px",
              bgcolor: "#f8f9fa",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4285f4",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4285f4",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatBot;
const BOT_COLOR = "#0B5B85";

const BotBadge = ({ size = 36 }) => (
  <Box
    component="img"
    src={robotLogo}
    alt="Planner Assistant"
    sx={{
      width: size,
      height: size,
      flexShrink: 0,
      objectFit: "cover",
      filter: "none",
    }}
  />
);
