import { useState, useEffect, useRef } from "react";
import { BALWidgetConfig } from "types/bal-widget";

const BAL_WIDGET_URL = process.env.NEXT_PUBLIC_BAL_WIDGET_URL;

interface BALWidgetIFrameProps {
  config: BALWidgetConfig;
}

function BALWidgetIFrame({ config }: BALWidgetIFrameProps) {
  const balWidgetRef = useRef<HTMLIFrameElement>(null);
  const [isBalWidgetOpen, setIsBalWidgetOpen] = useState(false);
  const [isBalWidgetReady, setIsBalWidgetReady] = useState(false);

  useEffect(() => {
    if (balWidgetRef.current && isBalWidgetReady) {
      balWidgetRef.current.contentWindow.postMessage(
        {
          type: "BAL_WIDGET_CONFIG",
          content: config,
        },
        "*"
      );
    }
  }, [isBalWidgetReady, balWidgetRef, config]);

  useEffect(() => {
    function BALWidgetMessageHandler(event) {
      switch (event.data?.type) {
        case "BAL_WIDGET_OPENED":
          setIsBalWidgetOpen(true);
          break;
        case "BAL_WIDGET_CLOSED":
          // Wait for transition to end before closing the iframe
          setTimeout(() => {
            setIsBalWidgetOpen(false);
          }, 300);
          break;
        case "BAL_WIDGET_READY":
          setIsBalWidgetReady(true);
          break;
        default:
          break;
      }
    }

    window.addEventListener("message", BALWidgetMessageHandler);

    return () => {
      window.removeEventListener("message", BALWidgetMessageHandler);
    };
  }, [isBalWidgetOpen]);

  return (
    <iframe
      ref={balWidgetRef}
      src={BAL_WIDGET_URL}
      width={isBalWidgetOpen ? 450 : 60}
      height={isBalWidgetOpen ? 800 : 60}
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 999,
      }}
    />
  );
}

export default BALWidgetIFrame;
