import { useEffect } from "react";
import { motion } from "framer-motion";
import SiteNavbar from "@/components/SiteNavbar";

function SecondaryFooter() {
  const year = new Date().getFullYear();
  const cols = [
    { heading: "Product", links: [{ label: "Features", href: "/features" }, { label: "Models", href: "/models" }, { label: "Knowledge Base", href: "/knowledge-base" }] },
    { heading: "Resources", links: [{ label: "Documentation", href: "https://localos.xyz/docs" }, { label: "Community", href: "/community" }, { label: "GitHub", href: "https://github.com/localos-dev" }] },
    { heading: "Company", links: [{ label: "About", href: "/about" }, { label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Use", href: "/terms" }, { label: "Contact", href: "/contact" }] },
  ];
  return (
    <footer style={{ background: "#04080F", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LocalOS" className="w-7 h-7 object-contain" />
            <span className="font-semibold text-white text-sm">LocalOS</span>
          </a>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            A self-hosted AI operating system. Runs entirely on your machine.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Copyright {year} LocalOS
          </p>
        </div>
        {cols.map(({ heading, links }) => (
          <div key={heading}>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
              {heading.toUpperCase()}
            </div>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "white")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: "#070D1F", minHeight: "100vh" }}
    >
      <SiteNavbar />
      <div style={{ paddingTop: "64px" }}>
        {children}
      </div>
      <SecondaryFooter />
    </motion.div>
  );
}
