import { DataTable } from "@/components/table/data-table-patient";
import { columns } from "./columns";
import { db } from "@/drizzle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PatientPage() {
  const data = await db.query.PatientTable.findMany();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Todos os pacientes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
