"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: (theme) => theme.palette.primary.main,
            filter: "drop-shadow(0 0 8px rgba(144, 202, 249, 0.2))",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          Fetching weather data...
        </Typography>
      </Box>
    </motion.div>
  );
}
