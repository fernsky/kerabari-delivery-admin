import { ReactNode } from "react";

interface DigitalProfileLayoutProps {
  children: ReactNode;
}

export default function DigitalProfileLayout({
  children,
}: DigitalProfileLayoutProps) {
  return <div className="h-full">{children}</div>;
}
