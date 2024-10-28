import { MedicalReportsForm } from "@/components/form/MedicalReportsForm";
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

  if (!record) {
    return <div>Registro não encontrado.</div>;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Editar Relatório Médico</CardTitle>
      </CardHeader>
      <CardContent>
        <MedicalReportsForm
          defaultValues={record}
        />
      </CardContent>
    </Card>
  );
}
