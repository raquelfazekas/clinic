"use client";

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Copy, CopyCheck, CopyX } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

export function CopyEventsPage({
  clerkUserId,
  ...buttonProps
}: Omit<ButtonProps, "children" | "onClick"> & {
  clerkUserId: string;
}) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const CopyIcon = getCopyIcon(copyState);
  return (
    <Button
      {...buttonProps}
      variant="outline"
      className="text-md"
      size="default"
      onClick={() => {
        navigator.clipboard
          .writeText(`${location.origin}/book/${clerkUserId}`)
          .then(() => {
            setCopyState("copied");
            setTimeout(() => setCopyState("idle"), 2000);
          })
          .catch(() => {
            setCopyState("error");
            setTimeout(() => setCopyState("idle"), 2000);
          });
      }}
    >
      <CopyIcon className="size-4 mr-2" />
      {getChildren(copyState)}
    </Button>
  );
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return Copy;
    case "copied":
      return CopyCheck;
    case "error":
      return CopyX;
  }
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copiar link geral";
    case "copied":
      return "Copiado";
    case "error":
      return "Error";
  }
}
