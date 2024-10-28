import { MedicalReportsForm } from "@/components/form/MedicalReportsForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CreateMedicalReportsPage({
  params,
}: {
  params: { pacientId: string };
}) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Novo Relatório Médico</CardTitle>
      </CardHeader>
      <CardContent>
        <MedicalReportsForm defaultValues={{ patientId: params.pacientId }} />
      </CardContent>
    </Card>
  );
}
