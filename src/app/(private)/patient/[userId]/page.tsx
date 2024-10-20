import { db } from "@/drizzle";
import { calculateAge } from "@/lib/formatters";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, FileSearch } from "lucide-react";

export default async function PatientPage({
  params,
}: {
  params: { userId: string };
}) {
  const patientInfo = await db.query.PatientTable.findFirst({
    where: ({ id }, { eq }) => eq(id, params.userId),
  });

  if (!patientInfo) return <div>Paciente não encontrado</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paciente : {patientInfo.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>CPF: {patientInfo.cpf}</div>
        <div>
          Data de Nascimento:{" "}
          {new Date(patientInfo.dateOfBirth).toLocaleDateString()}
        </div>
        <div>Idade: {calculateAge(patientInfo.dateOfBirth.toISOString())}</div>
        <div>Endereço: {patientInfo.address}</div>
        <div>Email: {patientInfo.email}</div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
        <Button>
          <FilePlus size={28} />
          <span>Relatório médico</span>
        </Button>
        <Button>
          <FilePlus size={28} />
          <span>Receita simples</span>
        </Button>
        <Button>
          <FilePlus size={28} />
          <span>Receita controlada</span>
        </Button>
        <Button>
          <FilePlus size={28} />
          <span>Atestado médico</span>
        </Button>
        <Button>
          <FilePlus size={28} />
          <span>Pedido de exame</span>
        </Button>
        <Button>
          <FileSearch size={28} />
          <span>Histórico</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
