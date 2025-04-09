"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0c2b5b 0%, #173e7c 100%)"
            : "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={100}
            thickness={4}
            sx={{ color: "white" }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="white"
              fontSize={20}
            >
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography
          variant="h5"
          color="white"
          sx={{
            mt: 3,
            fontWeight: 600,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Weather Dashboard
        </Typography>
      </motion.div>
    </Box>
  );
}
