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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Editar Prontuário</CardTitle>
      </CardHeader>
      <CardContent>
        <MedicalRecordsForm defaultValues={record} />
      </CardContent>
    </Card>
  );
}
