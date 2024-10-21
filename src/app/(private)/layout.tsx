import { NavLink, NavLinks } from "@/components/NavLink";
import { UserButton } from "@clerk/nextjs";
//import { BrainIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex py-2 border-b bg-card">
        <nav className="font-medium flex items-center text-sm gap-6 container">
          <div className="flex items-center gap-2 font-semibold mr-auto">
            <Image src="/Logo.png" alt="logo_clinic" width={52} height={52} />
            <span className="relative text-3xl font-bold text-primary tracking-wider">
              <span className="text-primary">Clinic</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-20 blur-md" />
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <NavLink href="/events">Evento</NavLink>
            <NavLink href="/schedule">Horários</NavLink>
            <NavLink href="/appointment">Agendamentos</NavLink>
            <NavLink href="/patient">Pacientes</NavLink>
          </div>
          <div className="ml-auto size-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
            />
          </div>
          <NavLinks />
        </nav>
      </header>
      <main className="container my-6 mx-auto">{children}</main>
    </>
  );
}
