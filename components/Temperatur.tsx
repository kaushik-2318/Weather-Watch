"use client";

import type React from "react";

import { ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";

interface TemperatureUnitToggleProps {
  unit: "C" | "F";
  onUnitChange: (unit: "C" | "F") => void;
}

export default function TemperatureUnitToggle({
  unit,
  onUnitChange,
}: TemperatureUnitToggleProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnit: "C" | "F" | null
  ) => {
    if (newUnit !== null) {
      onUnitChange(newUnit);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Tooltip title="Change temperature unit">
        <ToggleButtonGroup
          value={unit}
          exclusive
          onChange={handleChange}
          aria-label="temperature unit"
          size="small"
          sx={{
            height: 32,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.2)"
                : "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.1)",
            "& .MuiToggleButtonGroup-grouped": {
              border: 0,
              borderRadius: "inherit",
              "&.Mui-selected": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(144, 202, 249, 0.2)"
                    : "rgba(25, 118, 210, 0.1)",
                color: (theme) => theme.palette.primary.main,
                fontWeight: 600,
              },
            },
          }}
        >
          <ToggleButton value="C" aria-label="celsius">
            °C
          </ToggleButton>
          <ToggleButton value="F" aria-label="fahrenheit">
            °F
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>
    </motion.div>
  );
}
