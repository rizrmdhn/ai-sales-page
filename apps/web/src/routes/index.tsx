import { createFileRoute } from "@tanstack/react-router";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  IconBolt,
  IconDownload,
  IconGrid4x4,
  IconLayout,
  IconRefresh,
  IconSparkles,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

const features = [
  {
    icon: <IconSparkles className="size-5" />,
    title: "AI-Powered Copy",
    desc: "Gemini writes headlines, benefits, CTAs, and social proof — tailored to your product in seconds.",
  },
  {
    icon: <IconBolt className="size-5" />,
    title: "Instant Generation",
    desc: "Fill in a short form and get a complete, structured sales page ready to publish.",
  },
  {
    icon: <IconLayout className="size-5" />,
    title: "Multiple Templates",
    desc: "Pick from Modern, Bold, or Minimal layouts. Switch anytime with a click.",
  },
  {
    icon: <IconRefresh className="size-5" />,
    title: "Section Regeneration",
    desc: "Not happy with the headline? Regenerate just that section without touching the rest.",
  },
  {
    icon: <IconDownload className="size-5" />,
    title: "HTML Export",
    desc: "Export your sales page as a self-contained HTML file — host it anywhere.",
  },
  {
    icon: <IconGrid4x4 className="size-5" />,
    title: "Page Dashboard",
    desc: "Manage all your generated pages in one place. View, regenerate, or delete anytime.",
  },
];

const steps = [
  {
    n: "01",
    title: "Describe your product",
    desc: "Fill in product name, description, features, price and target audience.",
  },
  {
    n: "02",
    title: "AI writes the copy",
    desc: "Gemini generates a complete sales page with headline, benefits, and CTAs.",
  },
  {
    n: "03",
    title: "Publish or export",
    desc: "Preview live, switch templates, regenerate sections, and export as HTML.",
  },
];

function HomeComponent() {
  const navigate = Route.useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-background/85">
        <div className="max-w-275 mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight text-foreground">
            Acme
          </span>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate({
                  to: "/login",
                })
              }
            >
              Sign in
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                navigate({
                  to: "/register",
                })
              }
            >
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border py-24 px-6 text-center dot-grid">
        {/* radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in oklch, var(--primary) 15%, transparent), transparent)",
          }}
        />

        <div className="relative max-w-2xl mx-auto">
          {/* pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-7 rounded-full border border-border bg-card text-xs text-muted-foreground font-medium">
            <IconSparkles className="size-3" />
            Powered by Gemini 2.0 Flash
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold tracking-[-0.04em] leading-[1.05] mb-5 text-foreground">
            Turn product info into{" "}
            <span style={{ color: "var(--primary)" }}>sales pages</span> in
            seconds
          </h1>

          <p className="text-[17px] text-muted-foreground max-w-lg mx-auto mb-9 leading-relaxed">
            Describe your product. Acme writes the headline, benefits, features,
            and CTAs — fully structured and ready to publish.
          </p>

          <div className="flex flex-wrap gap-2.5 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate({ to: "/register" })}
            >
              <IconSparkles className="size-4" /> Start generating free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate({ to: "/login" })}
            >
              View demo
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground/70">
            No credit card required · Free with Gemini API
          </p>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="border-b border-border py-18 px-6">
        <div className="max-w-275 mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-[0.08em] uppercase mb-2.5">
              How it works
            </div>
            <h2 className="text-[2rem] font-bold tracking-tight text-foreground">
              Three steps to a live sales page
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-[2rem] font-extrabold leading-none tracking-[-0.04em] shrink-0 text-border">
                  {s.n}
                </div>
                <div>
                  <div className="font-semibold text-[15px] mb-1.5 text-foreground">
                    {s.title}
                  </div>
                  <div className="text-[13px] text-muted-foreground leading-relaxed">
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="border-b border-border py-18 px-6">
        <div className="max-w-275 mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-[0.08em] uppercase mb-2.5">
              Features
            </div>
            <h2 className="text-[2rem] font-bold tracking-tight text-foreground">
              Everything you need
            </h2>
          </div>

          {/* grid with 1px gap trick */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px rounded-[10px] overflow-hidden border border-border bg-border">
            {features.map((f, i) => (
              <div key={i} className="p-7 bg-card">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5">
                  {f.icon}
                </div>
                <div className="font-semibold text-sm mb-1.5 text-foreground">
                  {f.title}
                </div>
                <div className="text-[13px] text-muted-foreground leading-relaxed">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-[2rem] font-bold tracking-tight mb-3 text-foreground">
            Ready to build your first page?
          </h2>
          <p className="text-muted-foreground mb-7 text-[15px]">
            Join hundreds of creators and founders using Acme to ship sales
            pages faster.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate({ to: "/register" })}
          >
            <IconSparkles className="size-2.5" /> Get started for free
          </Button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-5 px-6 flex justify-between items-center  w-full">
        <div className="mx-auto  flex flex-row items-center justify-between">
          <span className="text-xs text-muted-foreground/70">
            © 2026 Acme. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
