import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} DailyGreeting / Love 系列</p>
      <p>
        由 <a href="https://www.cxktech.top" target="_blank" rel="noreferrer">cxktech.top</a> 部署
      </p>
      <p className="footer-links">
        <a href="mailto:support@cxktech.top"> 联系我们</a>
      </p>
    </footer>
  );
}
