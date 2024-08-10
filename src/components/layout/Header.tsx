import Logo from "@/assets/logo.svg?react";

export const Header = () => {
  return (
    <header>
      <nav className="p-4 flex gap-4 h-[64px] max-w-7xl mx-auto">
        <Logo className="h-full w-auto" />
      </nav>
    </header>
  );
};
