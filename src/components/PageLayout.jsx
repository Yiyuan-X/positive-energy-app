// src/components/PageLayout.jsx
import React from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import "./PageLayout.css";

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <SiteHeader />
      <div className="page-content">{children}</div>
      <Footer />
    </div>
  );
}
