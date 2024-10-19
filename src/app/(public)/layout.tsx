import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <main className="container py-20">{children}</main>;
}
