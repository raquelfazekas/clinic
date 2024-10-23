import { MedicalRecordsForm } from "@/components/form/MedicalRecordsForm";

export default async function CreateMedicalRecordsPage({
  params,
}: {
  params: { userId: string };
}) {

  

  return <div>
    <div>
        <h1>Novo Prontuario</h1>
    </div>
    <MedicalRecordsForm defaultValues={{ patientId: params.userId }} />
  </div>;
}
