import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Logo from "../_components/logo";

export function Header() {
  return (
    <header className="mx-auto my-5 flex max-w-5xl items-center justify-between px-5 lg:px-0">
      <Link className="flex" href="/">
        <Logo />
      </Link>
      <div>
        <Button size="sm" variant="secondary">
          Login
        </Button>
      </div>
    </header>
  );
}
