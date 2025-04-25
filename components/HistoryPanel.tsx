import { motion } from "framer-motion";
import React from "react";
import { Button } from "./ui/button";
import CloseIcon from "@mui/icons-material/Close";
import LocationStore from "@/stores/location-store";

export default function HistoryPanel({
  setIsSidePanelOpen,
  fetchWeatherData,
  unit,
  historyMenuRef,
}: {
  isSidePanelOpen: boolean;
  unit: string;
  historyMenuRef: React.RefObject<HTMLDivElement | null>;
  fetchWeatherData: ({
    lat,
    lon,
    unit,
  }: {
    lat: number;
    lon: number;
    unit: string;
  }) => void;
  setIsSidePanelOpen: (isSidePanelOpen: boolean) => void;
}) {
  const HistoryItem: { name: string; lat: number; lon: number }[] =
    localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history")!)
      : [];
  const updateLocation = LocationStore((state) => state.updateLocation);

  const handleClick = (item: { lat: number; lon: number; name: string }) => {
    updateLocation(item.lat, item.lon);
    fetchWeatherData({
      lat: item.lat,
      lon: item.lon,
      unit: unit,
    });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };
  return (
    <>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "linear" }}
        className="fixed w-full min-h-screen overflow-hidden z-[51] backdrop-blur-sm"
      />

      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "linear" }}
        className={`fixed right-0 top-0 w-3xs md:w-1/6 min-h-screen flex flex-col z-[54] gap-4 backdrop-blur-2xl bg-black/20 border-l border-white/20 transition-all duration-300 ease-in-out p-5`}
      >
        <div className="absolute top-3 right-3" ref={historyMenuRef}>
          <Button
            onClick={() => setIsSidePanelOpen(false)}
            variant={"default"}
            className="cursor-pointer w-10 h-8"
          >
            <CloseIcon className="text-xs" />
          </Button>
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6 tracking-widest">
            History
          </h2>
          <motion.div
            className="flex flex-col gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {HistoryItem.length > 0 ? (
              HistoryItem.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="w-full"
                  onClick={() => handleClick(item)}
                >
                  <h3 className="text-sm hover:text-white hover:bg-white/10 px-2 py-2 rounded-sm transition-all duration-300 ease-in-out cursor-pointer">
                    {item?.name}
                  </h3>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center text-white/50"
              >
                No History Found
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
