"use client";
import React from "react";

export default function LoaderBar({ rows = 6 }) {
  // simple skeleton rows for inside-grid loading
  const arr = Array.from({ length: rows });
  return (
    <div className="loaderbar-root">
      <div className="loaderbar-skeleton">
        {arr.map((_, i) => (
          <div key={i} className="loaderbar-row">
            <div className="skeleton cell col-1" />
            <div className="skeleton cell col-2" />
            <div className="skeleton cell col-3" />
            <div className="skeleton cell col-4" />
            <div className="skeleton cell col-5" />
            <div className="skeleton cell col-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
