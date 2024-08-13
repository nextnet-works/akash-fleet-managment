import Logo from "@/assets/logos/logo.svg?react";

export const Header = () => {
  return (
    <header className="w-[100dvw]">
      <nav className="p-4 flex gap-4 h-[64px] max-w-7xl mx-auto">
        <Logo className="h-full w-auto max-w-[50%]" />
      </nav>
    </header>
  );
};
