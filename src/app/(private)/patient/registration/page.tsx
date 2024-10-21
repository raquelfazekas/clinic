import { PatientForm } from "@/components/form/PatientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientRegistrationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Cadastro de Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientForm defaultValues={{ name: "", email: "" }} />
      </CardContent>
    </Card>
  );
}
