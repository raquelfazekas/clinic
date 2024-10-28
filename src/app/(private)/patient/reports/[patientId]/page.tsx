import { DataTable } from "@/components/table/data-report-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle";
import { columns } from "./columns";

export default async function MedicalRecordsPage({
  params,
}: {
  params: { patientId: string };
}) {
  
  const medicalRecords = await db.query.HealthRecordTable.findMany({
    where: ({ patientId, type }, { eq }) => 
      eq(patientId, params.patientId) && eq(type, "RLM"),
    with: {
      patient: {
        columns: {
          name: true,
          cpf: true,
        },
      },
    },
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });




  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Todos os Relatórios Médicos</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={medicalRecords} userId={params.patientId} />
      </CardContent>
    </Card>
  );
}
