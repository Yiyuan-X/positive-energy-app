import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} DailyGreeting / Love 系列</p>
      <p>
        由 <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a> 部署，
        数据支持自 <a href="https://supabase.com" target="_blank" rel="noreferrer">Supabase</a>
      </p>
      <p className="footer-links">
        <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a> ·
        <a href="mailto:admin@example.com"> 联系我们</a>
      </p>
    </footer>
  );
}
