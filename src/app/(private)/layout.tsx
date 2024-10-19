import { NavLink, NavLinks } from "@/components/NavLink"; // Updated import
import { UserButton } from "@clerk/nextjs";
import { BrainIcon } from "lucide-react";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex py-2 border-b bg-card">
        <nav className="font-medium flex items-center text-sm gap-6 container">
          <div className="flex items-center gap-2 font-semibold mr-auto">
            <BrainIcon className="size-6" />
            <span className="sr-only sm:not-sr-only">Raízes do Cérebro</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <NavLink href="/events">Evento</NavLink>
            <NavLink href="/schedule">Horários</NavLink>
            <NavLink href="/appointment">Agendamentos</NavLink>
          </div>
          <NavLinks />
          <div className="hidden md:flex ml-auto size-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
            />
          </div>
        </nav>
      </header>
      <main className="container my-6 mx-auto">{children}</main>
    </>
  );
}
