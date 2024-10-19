"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <Button variant="outline" className="sm:hidden">
            <Menu />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <div className="mt-4 text-center">
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
          />
        </div>
        <nav className="flex flex-col gap-4 text-center mt-10">
          <NavLink href="/events">Evento</NavLink>
          <NavLink href="/schedule">Horários</NavLink>
          <NavLink href="/appointment">Agendamentos</NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
