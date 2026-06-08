import { ReactNode } from "react";

function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const narrowScreen = window.innerWidth < 768;
  return mobileUA || narrowScreen;
}

function MobileBlockScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 text-white"
      style={{
        background: "linear-gradient(155deg, #000D2E 0%, #001A6E 50%, #0A1A4A 100%)",
      }}
    >
      <div className="max-w-sm w-full flex flex-col gap-10 text-center">

        <div className="flex flex-col gap-3">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: "#0052FF" }}
          >
            LocalOS
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Desktop only
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            LocalOS runs AI models directly in your browser using WebGPU, which is only
            available on desktop browsers. Open this page on a desktop or laptop computer
            to continue.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Mobile apps
          </p>

          <div
            className="rounded-2xl p-5 flex flex-col gap-1.5 text-left"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-sm font-semibold text-white">Android APK</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Native Android app with on-device model support. Coming soon.
            </div>
            <div
              className="text-xs font-semibold mt-1 inline-block"
              style={{ color: "#0052FF" }}
            >
              Coming soon
            </div>
          </div>

          <div
            className="rounded-2xl p-5 flex flex-col gap-1.5 text-left"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-sm font-semibold text-white">iOS App</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Native iPhone and iPad app with on-device model support. Coming soon.
            </div>
            <div
              className="text-xs font-semibold mt-1 inline-block"
              style={{ color: "#0052FF" }}
            >
              Coming soon
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function MobileGate({ children }: { children: ReactNode }) {
  if (isMobileDevice()) {
    return <MobileBlockScreen />;
  }
  return <>{children}</>;
}
