import { MedicalRecordsForm } from "@/components/form/MedicalRecordsForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CreateMedicalRecordsPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Novo Prontuario</CardTitle>
      </CardHeader>
      <CardContent>
        <MedicalRecordsForm defaultValues={{ patientId: params.userId }} />
      </CardContent>
    </Card>
  );
}
