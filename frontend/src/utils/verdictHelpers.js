import React from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

// Centralized verdict color definitions
export const getVerdictColor = (verdict) => {
  if (verdict === "Accepted") return "bg-green-100 text-green-700";
  if (verdict === "Wrong Answer") return "bg-red-100 text-red-700";
  if (verdict === "Time Limit Exceeded") return "bg-yellow-100 text-yellow-700";
  if (verdict === "Pending") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

// Centralized verdict icon component
export const getVerdictIcon = (verdict) => {
  const iconProps = { className: "w-5 h-5" };
  if (verdict === "Accepted") return React.createElement(CheckCircle, { ...iconProps, className: "text-green-600" });
  if (verdict === "Wrong Answer") return React.createElement(XCircle, { ...iconProps, className: "text-red-600" });
  if (verdict === "Time Limit Exceeded") return React.createElement(Clock, { ...iconProps, className: "text-yellow-600" });
  if (verdict === "Pending") return React.createElement(Clock, { ...iconProps, className: "text-yellow-600" });
  return React.createElement(AlertTriangle, { ...iconProps, className: "text-orange-600" });
};