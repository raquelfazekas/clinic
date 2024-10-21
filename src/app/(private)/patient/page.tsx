import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { db } from "@/drizzle";

export default async function PatientPage() {

  const data = await db.query.PatientTable.findMany()


  return (
    <section className="py-10">
      <div className="container">
        <h1 className="text-3xl font-bold text-primary mb-4">Todos os pacientes</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
