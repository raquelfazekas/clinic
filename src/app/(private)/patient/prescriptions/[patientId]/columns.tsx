"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserRoundPen, UserRoundX } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { PrescriptionRecord } from "./page";
import { deletePrescriptionRecords } from "@/server/actions/prescription";
import generateEspecialPrescription from "@/components/pdfPreview/ReceitaEspecial"

interface ActionCellProps {
  record: PrescriptionRecord;
}

interface Medication {
  name: string;
  dosage: string;
  quantity: string;
  instructions: string;
}

const ActionCell: React.FC<ActionCellProps> = ({ record }) => {
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    startTransition(() => {
      setLoading(true);
    });

    const result = await deletePrescriptionRecords(id);

    setLoading(false);
    setOpenAlert(false);
    if (result.error) {
    } else {
      router.refresh();
    }
  };


  const handlePdfGeneration = async (record: PrescriptionRecord) => {
    const patientName = record.patient.name;
    const doctorName = "Raquel de Jesus Fazekas";
    const crm = "214876 - SP";
    const gender = record.patient.gender;
    const address = record.patient.address
    const issuanceDate = new Date(record.createdAt).toLocaleDateString("pt-BR");
    const validityDate = "12/12/2024";
  
    const pdfBytes = await generateEspecialPrescription({
      patientName,
      doctorName,
      crm,
      gender,
      address,
      issuanceDate,
      validityDate,
      medications: record.medications as Medication[],
    });
  
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    window.open(url);
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() => router.push(`/patient/records/edit/${record.id}`)}
          >
            Visualizar
            <UserRoundPen />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() => handlePdfGeneration(record)}
          >
            PDF
            <UserRoundPen />
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
              Prontuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              variant="destructiveGhost"
              onClick={() => handleDelete(record.id)}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<PrescriptionRecord>[] = [
  {
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    accessorKey: "createdAt",
    header: "Criação",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      return createdAt.toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell record={row.original} />,
  },
];
