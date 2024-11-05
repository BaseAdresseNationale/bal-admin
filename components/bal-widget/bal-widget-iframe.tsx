import { useState, useEffect, useRef } from "react";
import { BalWidget } from "../../server/lib/bal-widget/entity";
import styled from "styled-components";

const BAL_WIDGET_URL = process.env.NEXT_PUBLIC_BAL_WIDGET_URL;

interface BALWidgetIFrameProps {
  config: BalWidget;
}

const StyledIFrame = styled.iframe<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  ${({ $isOpen }) =>
    $isOpen ? "height: 600px; width: 450px;" : "height: 60px; width: 60px;"}

  @media screen and (max-width: 450px) {
    bottom: 10px;
    right: 10px;
    ${({ $isOpen }) => $isOpen && "width: calc(100% - 20px);"}
  }
`;

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
    <StyledIFrame
      ref={balWidgetRef}
      src={BAL_WIDGET_URL}
      $isOpen={isBalWidgetOpen}
    />
  );
}

export default BALWidgetIFrame;
