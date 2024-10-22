import { PatientForm } from "@/components/form/PatientForm";
import { db } from "@/drizzle";
import { PatientInsert } from "@/drizzle/schema";

export default async function EditPatientPage({
  params,
}: {
  params: { patientId: string };
}) {

  const patientInfo: PatientInsert | undefined = await db.query.PatientTable.findFirst({
    where: (patient, { eq }) => eq(patient.id, params.patientId),
  });

  if (!patientInfo) {
    return <div>Patient not found</div>;
  }

  const defaultValues = {
    id: patientInfo.id,
    name: patientInfo.name,
    email: patientInfo.email,
    socialName: patientInfo.socialName,
    dateOfBirth: patientInfo.dateOfBirth,
    gender: patientInfo.gender,
    cpf: patientInfo.cpf,
    estado_civil: patientInfo.estado_civil,
    children: patientInfo.children ?? 0,
    work: patientInfo.work || '',
    education: patientInfo.education,
    origin: patientInfo.origin,
    religion: patientInfo.religion,
    phone: patientInfo.phone || undefined,
    address: patientInfo.address || undefined,
  };


  return (
    <div>
      <PatientForm defaultValues={defaultValues} />
    </div>
  );
}
