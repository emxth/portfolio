import { useEffect, useState } from "react";
import BootLoader from "../components/BootLoader";
import Home from "./Home";

export default function HomeBoot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // prevent body scroll while loading
    if (!ready) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  if (!ready) return <BootLoader onDone={() => setReady(true)} />;
  return <Home />;
}