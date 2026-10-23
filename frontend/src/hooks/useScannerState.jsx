import { createContext, useContext, useState } from "react";

const ScannerContext = createContext();

export function ScannerProvider({ children }) {
 const [scannerState, setScannerState] = useState("CAMERA_READY");
 const [pageNumber, setPageNumber] = useState(1);

  return (
    <ScannerContext.Provider
      value={{
  scannerState,
  setScannerState,
  pageNumber,
  setPageNumber,
}}
    >
      {children}
    </ScannerContext.Provider>
  );
}

export function useScannerState() {
  const context = useContext(ScannerContext);

  if (!context) {
    throw new Error(
      "useScannerState must be used inside ScannerProvider"
    );
  }

  return context;
}