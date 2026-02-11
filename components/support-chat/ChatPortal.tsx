import { createPortal } from "react-dom";
import { useEffect, useState, ReactNode } from "react";

interface ChatPortalProps {
  children: ReactNode;
}

const ChatPortal = ({ children }: ChatPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
};

export default ChatPortal;
