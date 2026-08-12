import Link from "next/link";

const NAV_LINKS = [
  { label: "Dashboard", href: "#" },
  { label: "Recordings", href: "#" },
  { label: "Settings", href: "#" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Room",
    description: "Generate a unique, secure studio link instantly.",
    active: false,
  },
  {
    step: "02",
    title: "Invite Guests",
    description: "Guests join from any browser, no installation required.",
    active: false,
  },
  {
    step: "03",
    title: "Record",
    description: "Capture local uncompressed 4K video and WAV audio.",
    active: true,
  },
  {
    step: "04",
    title: "Download Tracks",
    description: "Export synced individual tracks ready for your editor.",
    active: false,
  },
];

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.75 7.5 5.25 2.625L17.25 7.5m-10.5 3 5.25 2.625L17.25 10.5m-10.5 3 5.25 2.625 5.25-2.625"
      />
    </svg>
  );
}

function ArrowForwardIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

export function LandingPage() {
  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-surface/80 px-6 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <span className="text-headline-lg font-bold text-primary">
            MountainSide
          </span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-medium text-on-surface-variant transition-colors duration-150 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface transition-colors duration-150 hover:text-primary">
            <NotificationIcon />
          </button>
          <button className="text-on-surface transition-colors duration-150 hover:text-primary">
            <HelpIcon />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest text-label-sm font-semibold text-primary">
            MS
          </div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-32 px-6 pb-24 pt-[120px]">
        <section className="relative flex flex-col items-center gap-16 lg:flex-row">
          <div className="z-10 flex flex-1 flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/5 bg-surface-container px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-label-sm uppercase tracking-widest text-primary">
                v2.0 Beta Live
              </span>
            </div>
            <h1 className="glow-text text-display-lg text-on-surface">
              Studio-quality recording,
              <br />
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                right in your browser.
              </span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-on-surface-variant">
              Capture 4K video and separate high-quality audio tracks for every
              guest, no matter where they are. Built for professional creators.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button className="rounded-lg bg-primary px-8 py-4 font-bold text-on-primary-fixed shadow-[0_0_20px_rgba(173,198,255,0.2)] transition-colors hover:bg-primary/90">
                Start a Meeting
              </button>
              <button className="rounded-lg border border-outline-variant bg-transparent py-4 pl-8 pr-8 font-semibold text-on-surface transition-all hover:border-white/20 hover:bg-white/5">
                Sign In
              </button>
            </div>
          </div>

          <div className="glass-panel relative z-10 w-full max-w-md overflow-hidden rounded-xl p-8 shadow-2xl">
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <h3 className="relative mb-6 text-headline-lg text-on-surface">
              Join Studio
            </h3>
            <div className="relative flex flex-col gap-4">
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant bg-surface py-3 font-medium text-on-surface transition-colors hover:bg-surface-bright">
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="my-2 flex items-center gap-4">
                <div className="h-px flex-1 bg-outline-variant" />
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  or
                </span>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-on-surface-variant">
                  Email Address
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-highest px-4 py-3 text-on-surface outline-none transition-all placeholder-outline focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="name@company.com"
                  type="email"
                />
              </div>
              <button className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-highest py-3 font-bold text-on-surface transition-colors hover:border-primary hover:text-primary">
                Send OTP Code
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-12">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
            <h2 className="text-headline-lg text-on-surface">
              Engineered for perfection
            </h2>
            <p className="text-on-surface-variant">
              We separate the complexity of remote recording from the simplicity
              of a web call.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="glass-panel group flex flex-col gap-4 rounded-xl p-8 transition-colors hover:bg-surface-container-highest">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <DownloadIcon />
              </div>
              <h3 className="text-headline-lg-mobile text-on-surface">
                Local Recording
              </h3>
              <p className="text-on-surface-variant">
                No internet-lag in recordings. We capture uncompressed video and
                audio directly on the device before uploading.
              </p>
            </div>

            <div className="glass-panel group relative flex flex-col gap-4 overflow-hidden rounded-xl p-8 transition-colors hover:bg-surface-container-highest md:col-span-2">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(173,198,255,0.25),transparent_60%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div>
                  <div className="mb-6 inline-flex items-center justify-center rounded-full border border-outline-variant bg-surface px-3 py-1 text-xs text-primary">
                    4K UHD
                  </div>
                  <h3 className="text-headline-lg-mobile text-on-surface">
                    Studio Quality 4K
                  </h3>
                  <p className="max-w-md text-on-surface-variant">
                    Crystal clear video output, uncompressed and pristine. Your
                    guests look as good as they sound.
                  </p>
                </div>
                <div className="relative mt-4 flex h-32 w-full gap-3 overflow-hidden rounded-lg border border-white/5 bg-surface-container-low p-3">
                  <div className="flex flex-1 flex-col justify-between rounded-md border border-white/5 bg-surface-container-highest/60 p-3">
                    <span className="h-1.5 w-3/4 rounded-full bg-primary/50" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-primary/70">
                      Guest 01
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between rounded-md border border-white/5 bg-surface-container-highest/60 p-3">
                    <span className="h-1.5 w-3/4 rounded-full bg-secondary/50" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-secondary/70">
                      Guest 02
                    </span>
                  </div>
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium text-on-surface-variant">
                    <span className="h-1.5 w-1.5 rounded-full bg-error" />
                    REC
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel flex flex-col gap-4 rounded-xl border-l-4 border-l-secondary p-8 transition-colors group hover:bg-surface-container-highest md:col-span-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-headline-lg-mobile text-on-surface">
                    <span className="text-secondary">
                      <LayersIcon />
                    </span>
                    Separate Tracks
                  </h3>
                  <p className="mt-2 max-w-xl text-on-surface-variant">
                    Every guest gets their own isolated audio and video track.
                    Giving you total control in post-production without bleed or
                    sync issues.
                  </p>
                </div>
                <div className="hidden flex-col gap-2 opacity-50 md:flex">
                  <div className="flex h-2 w-32 items-center overflow-hidden rounded-full bg-secondary/40">
                    <div className="h-full w-2/3 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-secondary" />
                  </div>
                  <div className="flex h-2 w-48 items-center overflow-hidden rounded-full bg-primary/40">
                    <div className="h-full w-4/5 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-16 border-t border-white/5 py-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 className="text-headline-lg text-on-surface">
              From browser to broadcast
            </h2>
            <button className="flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-fixed">
              View full documentation
              <ArrowForwardIcon />
            </button>
          </div>
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="absolute left-12 right-12 top-6 z-0 hidden h-px bg-outline-variant/30 md:block" />
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col gap-4">
                <div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full border text-label-sm shadow-lg ${
                    item.active
                      ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(173,198,255,0.2)]"
                      : "border-outline-variant bg-surface-container-highest text-on-surface"
                  }`}
                >
                  {item.step}
                </div>
                <h4
                  className={`text-lg font-semibold ${
                    item.active ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-sm text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-white/5 bg-surface-container-lowest py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-6 md:flex-row">
          <div className="mb-4 text-label-sm font-bold text-primary md:mb-0">
            MountainSide
          </div>
          <div className="order-3 mt-4 text-label-sm text-on-surface-variant md:order-2 md:mt-0">
            © 2024 MountainSide Labs. All rights reserved.
          </div>
          <div className="order-2 flex gap-6 md:order-3">
            {["Privacy Policy", "Terms of Service", "Contact"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-label-sm text-on-surface-variant transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
