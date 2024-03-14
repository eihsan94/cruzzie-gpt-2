import React, { type ReactNode } from "react";
import Nav from "../Nav/Nav";

interface Props {
  children: ReactNode;
}
export function Layout({ children }: Props) {
  return (
    <div
      style={{
        overflow: "auto",
        height: "100vh",
      }}>
      <Nav />
      {children}
    </div>
  );
}
