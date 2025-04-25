"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
  Wind,
  Droplets,
} from "lucide-react";

export default function PreLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 - prev) / 15;
          if (newProgress >= 97.5) {
            clearInterval(timer);
            setTimeout(() => {
              setTimeout(() => setIsLoading(false), 1000);
            }, 100);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden overflow-y-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-cyan-900/30 animate-gradient-shift"></div>
          </div>

          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>

          <motion.div
            className="relative z-10 mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Sun */}
              <motion.div
                className="absolute"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <div className="relative">
                  <Sun
                    size={120}
                    className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.7)]"
                  />
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
              </motion.div>

              {/* Cloud 1 */}
              <motion.div
                className="absolute"
                initial={{ x: -80, y: -20 }}
                animate={{
                  x: [-80, 80, -80],
                  y: [-20, -40, -20],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="relative">
                  <Cloud size={60} className="text-white/90 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20"></div>
                </div>
              </motion.div>

              {/* Cloud 2 */}
              <motion.div
                className="absolute"
                initial={{ x: 60, y: 30 }}
                animate={{
                  x: [60, -40, 60],
                  y: [30, 50, 30],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <CloudRain size={50} className="text-blue-300 drop-shadow-lg" />
              </motion.div>

              {/* Thermometer */}
              <motion.div
                className="absolute"
                initial={{ x: 0, y: 80 }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Thermometer
                  size={40}
                  className="text-red-400 drop-shadow-lg"
                />
              </motion.div>

              {/* Wind */}
              <motion.div
                className="absolute"
                initial={{ x: -60, y: 60 }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  x: [-60, -50, -60],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Wind size={40} className="text-cyan-300 drop-shadow-lg" />
              </motion.div>

              {/* Droplets */}
              <motion.div
                className="absolute"
                initial={{ x: 70, y: -50 }}
                animate={{
                  y: [-50, -40, -50],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Droplets size={35} className="text-blue-400 drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            <motion.div
              className="relative z-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Weather<span className="text-blue-300">Watch</span>
              </h1>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-64 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-2 text-center text-white/70 text-sm">
              {Math.round(progress)}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
