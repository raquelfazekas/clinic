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
    gender: string;
    age: string
    medications: Medication[];
  }


  export default async function generateSimplePrescription({
    doctorName,
    crm,
    issuanceDate,
    patientName,
    age,
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
    const logoImageBytes = await fetch(logoUrl).then((res) =>
      res.arrayBuffer()
    );
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

    const contentStartY = 770 - logoHeight - 20;

    // Título com linhas em volta
    page.drawLine({
      start: { x: 50, y: 750 },
      end: { x: 550, y: 750 },
      thickness: 1,
    });
    page.drawLine({
      start: { x: 50, y: 750 },
      end: { x: 50, y: 720 },
      thickness: 1,
    });
    page.drawText("RECEITA SIMPLES", {
      x: 250,
      y: 730,
      size: 14,
      font: boldFont,
    });
    page.drawLine({
      start: { x: 550, y: 750 },
      end: { x: 550, y: 720 },
      thickness: 1,
    });
    page.drawLine({
      start: { x: 50, y: 720 },
      end: { x: 550, y: 720 },
      thickness: 1,
    });

    // Medical information
    page.drawText("RJF - Medicina e Saúde Mental", {
      x: 50,
      y: contentStartY,
      size: 12,
      font: boldFont,
    });

    page.drawText("Endereço:", {
      x: 50,
      y: contentStartY - 20,
      size: 10,
      font: boldFont,
    });
    page.drawText("Rua Dr. Souza Alves, 139 - Centro, Taubaté - SP", {
      x: 110,
      y: contentStartY - 20,
      size: 8,
      font: timesRomanFont,
    });

    page.drawText(`Dr(a). ${doctorName}`, {
      x: 50,
      y: contentStartY - 55,
      size: 12,
      font: boldFont,
      color: rgb(0.012, 0.412, 0.627),
    });
    page.drawText(`CRM: ${crm}`, {
      x: 450,
      y: contentStartY - 55,
      size: 10,
      font: boldFont,
    });

    // Issuance and validity dates

    page.drawText("Data de emissão:", {
      x: 400,
      y: contentStartY,
      size: 10,
      font: boldFont,
    });
    page.drawText(issuanceDate, {
      x: 500,
      y: contentStartY,
      size: 10,
      font: timesRomanFont,
    });

    // Patient information
    page.drawLine({
      start: { x: 50, y: contentStartY - 80 },
      end: { x: 550, y: contentStartY - 80 },
      thickness: 1,
    });
    page.drawText("Paciente:", {
      x: 50,
      y: contentStartY - 100,
      size: 10,
      font: boldFont,
    });
    page.drawText(patientName, {
      x: 110,
      y: contentStartY - 100,
      size: 10,
      font: timesRomanFont,
    });

    page.drawText("Sexo:", {
      x: 380,
      y: contentStartY - 100,
      size: 10,
      font: boldFont,
    });

    page.drawText(gender, {
      x: 415,
      y: contentStartY - 100,
      size: 10,
      font: timesRomanFont,
    });

    page.drawText("Idade:", {
      x: 485,
      y: contentStartY - 100,
      size: 10,
      font: boldFont,
    });

    page.drawText(age, {
      x: 525,
      y: contentStartY - 100,
      size: 10,
      font: timesRomanFont,
    });

    page.drawLine({
      start: { x: 50, y: contentStartY - 120 },
      end: { x: 550, y: contentStartY - 120 },
      thickness: 1,
    });

    // Medication listing
    let yPosition = contentStartY - 180;
    medications.forEach((medication, index) => {
      const medicationText = `${index + 1}. ${medication.name} ${
        medication.dosage
      }`;
      const quantityText = medication.quantity;

      // Calculate dash line positions
      const dashStartX =
        50 + timesRomanFont.widthOfTextAtSize(medicationText, 12) + 10;
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

    // Save and download PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }