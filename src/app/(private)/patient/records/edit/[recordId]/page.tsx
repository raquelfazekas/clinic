import { MedicalRecordsForm } from "@/components/form/MedicalRecordsForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle";

export default async function editMedicalRecordPage({
  params,
}: {
  params: { recordId: string };
}) {
  const record = await db.query.HealthRecordTable.findFirst({
    where: ({ id }, { eq }) => eq(id, params.recordId),
  });

  // Ensure the record is found and include the recordId in defaultValues
  if (!record) {
    return <div>Registro não encontrado.</div>; // Handle case where the record does not exist
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Editar Prontuário</CardTitle>
      </CardHeader>
      <CardContent>
        <MedicalRecordsForm
          defaultValues={{
            ...record,
            id: params.recordId,
          }}
        />
      </CardContent>
    </Card>
  );
}
