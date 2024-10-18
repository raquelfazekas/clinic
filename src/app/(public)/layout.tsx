import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <main className="container my-6">{children}</main>;
}
