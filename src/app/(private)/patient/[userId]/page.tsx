import { db } from "@/drizzle";
import { calculateAge, calculateAgeWithOutMonths } from "@/lib/formatters";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import SimplePrescription from "@/components/pdfgenerator/receita_simples";
import { addWeeks } from "date-fns";
import ExamRequest from "@/components/pdfgenerator/solicitação_exame";
import AtestadoMedico from "@/components/pdfgenerator/atestado_medico";
import EspecialPrescription from "@/components/pdfgenerator/receita_especial";
import Link from "next/link";

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
        <Link href={`/patient/records/create/${patientInfo.id}`}>
        <Button className="flex w-full">
          <FilePlus size={28} />
          <span>Prontuarios</span>
        </Button>
        </Link>

        <SimplePrescription
          patientName={patientInfo.name}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          address={patientInfo.address || ""}
          issuanceDate={new Date().toLocaleDateString()}
          validityDate={addWeeks(new Date(), 1).toLocaleDateString()}
          medications={[
            {
              name: "Tamiflu",
              dosage: "75mg",
              quantity: "10cp",
              instructions: "Tomar 01cp de 12/12h por 05 dias",
            },
            {
              name: "Paracetamol",
              dosage: "500mg",
              quantity: "20cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
            {
              name: "Buscopan Composto",
              dosage: "250mg",
              quantity: "10cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
            {
              name: "Neosoro",
              dosage: "1000mg",
              quantity: "15cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
            {
              name: "Salonpas ",
              dosage: "100mg",
              quantity: "16cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
          ]}
        />

        <EspecialPrescription
          patientName={patientInfo.name}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          address={patientInfo.address || ""}
          issuanceDate={new Date().toLocaleDateString()}
          validityDate={addWeeks(new Date(), 1).toLocaleDateString()}
          medications={[
            {
              name: "Tamiflu",
              dosage: "75mg",
              quantity: "10cp",
              instructions: "Tomar 01cp de 12/12h por 05 dias",
            },
            {
              name: "Paracetamol",
              dosage: "500mg",
              quantity: "20cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
            {
              name: "Buscopan Composto",
              dosage: "250mg",
              quantity: "10cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
            {
              name: "Neosoro",
              dosage: "1000mg",
              quantity: "15cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
            {
              name: "Salonpas ",
              dosage: "100mg",
              quantity: "16cp",
              instructions: "Tomar 01cp de 6/6h se necessário",
            },
          ]}
        />

        <AtestadoMedico
          patientName={patientInfo.name}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          address={patientInfo.address || ""}
          issuanceDate={new Date().toLocaleDateString()}
          cid="B34.9"
          texts={[
            {
              name: "teste de atestado médico, se o texto passar o comprimento da página ira quebrar para outra linha!! ",
            },
          ]}
        />

        <ExamRequest
          patientName={patientInfo.name}
          doctorName="Raquel de Jesus Fazekas"
          crm="214876 - SP"
          age={calculateAgeWithOutMonths(patientInfo.dateOfBirth.toISOString())}
          gender={patientInfo.gender}
          address={patientInfo.address || ""}
          issuanceDate={new Date().toLocaleDateString()}
          exams={[
            {
              name: "Raio-X panorâmico da coluna vertebral para escoliose, cifose e lordose com ângulo de Cobb e Ferguson.",
            },
          ]}
        />
      </CardFooter>
    </Card>
  );
}
