import { Water } from './Water';

export default function WritingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[linear-gradient(180deg,#dbe7f1_0%,#eef4f8_45%,#f9fbfc_100%)] bg-fixed text-[#141414]">
      <Water />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
