"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PatientSelect } from "@/drizzle/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  UserRoundPen,
  UserRoundSearch,
  UserRoundX,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState, startTransition } from "react";
import { deletePatientById } from "@/server/actions/patient";
import { useRouter } from "next/navigation";

interface ActionCellProps {
  patient: PatientSelect;
}

const ActionCell: React.FC<ActionCellProps> = ({ patient }) => {
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();

  const deletePatient = async (id: string) => {
    try {
      setIsDeletePending(true);
      await deletePatientById(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete patient:", error);
    } finally {
      setIsDeletePending(false);
      setOpenAlert(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() => router.push(`/patient/${patient.id}`)}
          >
            Histórico
            <UserRoundSearch />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/patient/edit/${patient.id}`)}
            className="flex justify-between"
          >
            Editar <UserRoundPen />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setOpenAlert(true)}
            className="flex justify-between"
          >
            Deletar
            <UserRoundX />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogTrigger asChild>
          <span />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              paciente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletePending}
              variant="destructiveGhost"
              onClick={() => {
                startTransition(() => deletePatient(patient.id));
              }}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<PatientSelect>[] = [
  {
    accessorKey: "name",
    header: "Paciente",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell patient={row.original} />,
  },
];
