import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Heart, Leaf } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const { userId } = auth();
  if (userId != null) redirect("/events");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Image src="/logo_pdf.png" alt="logo_clinic" height={254} width={254}/>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <SignInButton mode="modal">Sign In</SignInButton>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <SignUpButton mode="modal">Sign Up</SignUpButton>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center space-x-8 text-primary w-full">
            <Brain className="w-8 h-8" />
            <Heart className="w-8 h-8" />
            <Leaf className="w-8 h-8" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
