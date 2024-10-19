import { db } from "@/drizzle";
import { calculateAge } from "@/lib/formatters";

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
    <div>
      <p>{patientInfo?.name}</p>
      <p>{patientInfo?.cpf}</p>
      <p>{calculateAge(patientInfo.dateOfBirth.toISOString())}</p>
    </div>
  );
}
