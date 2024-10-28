import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Medication {
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
  }
  
  interface GenerateEspecialPrescriptionProps {
    doctorName: string;
    crm: string;
    issuanceDate: string;
    validityDate: string; 
    patientName: string;
    address: string;
    gender: string;
    medications: Medication[];
  }

  export default async function generateEspecialPrescription({
    doctorName,
    crm,
    issuanceDate,
    validityDate,
    patientName,
    address,
    gender,
    medications,
  }: GenerateEspecialPrescriptionProps) {
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([600, 850]);

  // Logo
  const logoUrl = "/logo_pdf.png";
  const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);

  const pageWidth = 600;
  const logoWidth = 150;
  const logoHeight = 100;
  const xCenteredLogo = (pageWidth - logoWidth) / 2;

  page.drawImage(logoImage, {
    x: xCenteredLogo,
    y: 750,
    width: logoWidth,
    height: logoHeight,
  });

  const contentStartY = 760 - logoHeight - 10;

  // Title with borders around
  page.drawLine({
    start: { x: 50, y: contentStartY + 110 },
    end: { x: 550, y: contentStartY + 110 },
    thickness: 1,
  });
  page.drawLine({
    start: { x: 50, y: contentStartY + 110 },
    end: { x: 50, y: contentStartY + 80 },
    thickness: 1,
  });
  page.drawText("RECEITUÁRIO DE CONTROLE ESPECIAL", {
    x: 168,
    y: contentStartY + 90,
    size: 14,
    font: boldFont,
  });
  page.drawLine({
    start: { x: 550, y: contentStartY + 110 },
    end: { x: 550, y: contentStartY + 80 },
    thickness: 1,
  });
  page.drawLine({
    start: { x: 50, y: contentStartY + 80 },
    end: { x: 550, y: contentStartY + 80 },
    thickness: 1,
  });

  // Doctor Information Box
  const doctorBoxStartY = contentStartY + 75;
  page.drawRectangle({
    x: 50,
    y: doctorBoxStartY - 120,
    width: 350,
    height: 120,
    borderWidth: 1,
    borderColor: rgb(0, 0, 0),
  });
  page.drawText("IDENTIFICAÇÃO DO EMITENTE", {
    x: 60,
    y: doctorBoxStartY - 20,
    size: 10,
    font: boldFont,
  });
  page.drawText(`Dr(a). ${doctorName}`, {
    x: 60,
    y: doctorBoxStartY - 35,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 0),
  });

  page.drawText("CRM:", {
    x: 60,
    y: doctorBoxStartY - 53,
    size: 10,
    font: boldFont,
  });
  page.drawText(`${crm}`, {
    x: 90,
    y: doctorBoxStartY - 53,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText("Endereço:", {
    x: 60,
    y: doctorBoxStartY - 73,
    size: 8,
    font: boldFont,
  });
  page.drawText(
    "Rua Padre Timóteo Corrêa de Toledo, 259, Vila São José, Taubaté - SP",
    {
      x: 105,
      y: doctorBoxStartY - 73,
      size: 8,
      font: timesRomanFont,
    }
  );

  page.drawText("Cidade:", {
    x: 60,
    y: doctorBoxStartY - 93,
    size: 8,
    font: boldFont,
  });
  page.drawText("Taubaté", {
    x: 95,
    y: doctorBoxStartY - 93,
    size: 8,
    font: timesRomanFont,
  });

  page.drawText("UF:", {
    x: 200,
    y: doctorBoxStartY - 93,
    size: 8,
    font: boldFont,
  });
  page.drawText("SP", {
    x: 220,
    y: doctorBoxStartY - 93,
    size: 8,
    font: timesRomanFont,
  });

  // Right-side information
  page.drawText("Data de Emissão:", {
    x: 410,
    y: doctorBoxStartY - 20,
    size: 10,
    font: boldFont,
  });
  page.drawText(`${issuanceDate}`, {
    x: 500,
    y: doctorBoxStartY - 20,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText("Data de Validade:", {
    x: 410,
    y: doctorBoxStartY - 35,
    size: 10,
    font: boldFont,
  });
  page.drawText(`${validityDate}`, {
    x: 500,
    y: doctorBoxStartY - 35,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText(`1ª VIA FARMÁCIA`, {
    x: 410,
    y: doctorBoxStartY - 50,
    size: 10,
    font: boldFont,
  });
  page.drawText(`2ª VIA PACIENTE`, {
    x: 410,
    y: doctorBoxStartY - 65,
    size: 10,
    font: boldFont,
  });

  // Patient Information
  const patientInfoStartY = doctorBoxStartY - 133;
  page.drawText("Paciente:", {
    x: 50,
    y: patientInfoStartY - 5,
    size: 10,
    font: boldFont,
  });
  page.drawText(`${patientName}`, {
    x: 100,
    y: patientInfoStartY - 5,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText("Endereço:", {
    x: 50,
    y: patientInfoStartY - 20,
    size: 10,
    font: boldFont,
  });

  page.drawText(`${address}`, {
    x: 102,
    y: patientInfoStartY - 20,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText("Sexo:", {
    x: 460,
    y: patientInfoStartY - 20,
    size: 10,
    font: boldFont,
  });

  page.drawText(`${gender}`, {
    x: 490,
    y: patientInfoStartY - 20,
    size: 10,
    font: timesRomanFont,
  });

  page.drawLine({
    start: { x: 50, y: patientInfoStartY - 50 },
    end: { x: 550, y: patientInfoStartY - 50 },
    thickness: 1.1,
  });

  // Medication listing
  let yPosition = patientInfoStartY - 80;
  medications.forEach((medication: { name: string; dosage: string; quantity: string; instructions: string; }, index: number) => {
    const medicationText = `${index + 1}. ${medication.name} ${medication.dosage}`;
    const quantityText = medication.quantity;

    // Calculate dash line positions
    const dashStartX = 50 + timesRomanFont.widthOfTextAtSize(medicationText, 12) + 10;
    const dashEndX = 500 - timesRomanFont.widthOfTextAtSize(quantityText, 12);

    // Draw medication name and dosage on the left
    page.drawText(medicationText, {
      x: 50,
      y: yPosition,
      size: 10,
      font: boldFont,
    });

    // Draw dash line between medication info and quantity
    page.drawLine({
      start: { x: dashStartX, y: yPosition + 5 },
      end: { x: dashEndX, y: yPosition + 5 },
      thickness: 1,
    });

    // Draw quantity on the right
    page.drawText(quantityText, {
      x: 500,
      y: yPosition,
      size: 10,
      font: boldFont,
    });

    yPosition -= 20;
    page.drawText(medication.instructions, {
      x: 70,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    yPosition -= 30;
  });

  const bottomY = 150;
  // Bottom boxes
  page.drawRectangle({
    x: 50,
    y: bottomY,
    width: 500,
    height: 100,
    borderWidth: 1,
    borderColor: rgb(0, 0, 0),
  });

  page.drawText("Observações:", {
    x: 60,
    y: bottomY + 75,
    size: 10,
    font: boldFont,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


