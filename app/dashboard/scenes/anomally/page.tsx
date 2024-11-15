"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewInvestment } from "../../hooks/use_new_investements";
import { useNewAnomallyDetection } from "../../hooks/use_new_anomally";

const NewAnomallyDetection = () => {
  const { isAnomallyDetectionOpen, onAnomallyDetectionClose } =
    useNewAnomallyDetection();

  return (
    <Sheet open={isAnomallyDetectionOpen} onOpenChange={onAnomallyDetectionClose}>
      <SheetContent className="space-y-6 p-6 rounded-lg bg-white shadow-lg border border-gray-200">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold text-gray-800">
            Anomaly Detection
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Anomaly detection module
          </SheetDescription>
        </SheetHeader>

        {/* Placeholder message when no anomalies are detected */}
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No anomalies detected</p>
          <p className="text-gray-500 mt-2">
            The system has not detected any irregularities at this time.
          </p>
        </div>

        {/* Add additional content here if needed */}
      </SheetContent>
    </Sheet>
  );
};

export default NewAnomallyDetection;
