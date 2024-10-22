"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";

export function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
  const path = usePathname();
  const isActive = path === props.href;

  return (
    <Link
      {...props}
      className={cn(
        "transition-colors",
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-primary",
        className
      )}
    />
  );
}

export function NavLinks() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <Button variant="outline" className="sm:hidden">
            <Menu />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-visible">
        <div className="flex justify-center mt-4">
          <Image src="/Logo.png" alt="logo_clinic" width={128} height={128} />
        </div>
        <nav className="flex flex-col gap-4 text-center mt-10">
          <NavLink href="/events" onClick={handleLinkClick}>
            Eventos
          </NavLink>
          <NavLink href="/schedule" onClick={handleLinkClick}>
            Horários
          </NavLink>
          <NavLink href="/appointment" onClick={handleLinkClick}>
            Agendamentos
          </NavLink>
          <NavLink href="/patient" onClick={handleLinkClick}>
            Pacientes
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
