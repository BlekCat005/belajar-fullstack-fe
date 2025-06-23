// src/hooks/use-debounce.ts
import { useState, useEffect } from "react";

// Custom hook useDebounce
function useDebounce<T>(value: T, delay: number): T {
  // State untuk menyimpan nilai yang di-debounce
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue ke value (input terbaru) setelah delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Fungsi cleanup: Batalkan timeout jika value berubah atau komponen unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya re-run effect jika value atau delay berubah

  return debouncedValue;
}

export { useDebounce };
