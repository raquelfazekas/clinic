import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle";
import { columns } from "./columns";
import { DataTable } from "@/components/table/data-prescription-table";

export type PrescriptionRecord = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  patientId: string;
  doctorId: string;
  medications: unknown;
  patient: {
    name: string;
    cpf: string;
  };
};

export default async function MedicalRecordsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const prescriptionsRecords: PrescriptionRecord[] =
    await db.query.PrescriptionTable.findMany({
      where: ({ patientId }, { eq }) => eq(patientId, params.patientId),
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
        <CardTitle className="text-primary">Todos as Prescrições</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={prescriptionsRecords}
          userId={params.patientId}
        />
      </CardContent>
    </Card>
  );
}
