import { db } from "@/drizzle";

export default async function MedicalRecordsPage({
  params,
}: {
  params: { userId: string };
}) {
  const medicalRecords = await db.query.HealthRecordTable.findFirst({
    where: ({ patientId }, { eq }) => eq(patientId, params.userId),
  });

  console.log(medicalRecords);

  return <div>
    {params.userId}
  </div>;
}
