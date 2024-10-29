import { db } from "@/drizzle";
import { calculateAge, calculateAgeWithOutMonths } from "@/lib/formatters";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import SimplePrescription from "@/components/pdfgenerator/receita_simples";
import { addMonths } from "date-fns";
import ExamRequest from "@/components/pdfgenerator/solicitação_exame";
import AtestadoMedico from "@/components/pdfgenerator/atestado_medico";
import EspecialPrescription from "@/components/pdfgenerator/receita_especial";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";

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
        <SimplePrescription
          patientName={patientInfo.name}
          patientId={patientInfo.id}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          address={
            "Rua Padre Timóteo Corrêa de Toledo, 259, Vila São José, Taubaté - SP"
          }
          issuanceDate={new Date().toLocaleDateString("pt-BR")}
          validityDate={addMonths(new Date(), 1).toLocaleDateString("pt-BR")}
        />

        <EspecialPrescription
          patientName={patientInfo.name}
          patientId={patientInfo.id}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          address={patientInfo.address || ""}
          issuanceDate={new Date().toLocaleDateString("pt-BR")}
          validityDate={addMonths(new Date(), 1).toLocaleDateString("pt-BR")}
        />

        <AtestadoMedico
          patientName={patientInfo.name}
          patientId={patientInfo.id}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          issuanceDate={new Date().toLocaleDateString("pt-BR")}
        />

        <ExamRequest
          patientName={patientInfo.name}
          patientId={patientInfo.id}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          issuanceDate={new Date().toLocaleDateString("pt-BR")}
        />

        <Link href={`/patient/prescriptions/${patientInfo.id}`}>
          <Button className="w-full">
            <Archive />
            Histórico
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
