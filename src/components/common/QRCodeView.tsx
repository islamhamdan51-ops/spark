"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeViewProps {
  text: string;
  size?: number;
}

export function QRCodeView({ text, size = 180 }: QRCodeViewProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: "#070A12",
        light: "#FFFFFF",
      },
    })
      .then((url) => setDataUrl(url))
      .catch(() => {});
  }, [text, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-white rounded-xl flex items-center justify-center text-spark-950 font-bold text-xs"
      >
        جاري إنشاء الكود...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code للانضمام السريع"
      width={size}
      height={size}
      className="rounded-xl shadow-md border-2 border-white"
    />
  );
}
