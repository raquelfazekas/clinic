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
    address: string | null
    gender: string;
    medications: Medication[];
  }

  export default async function generateEspecialPrescription({
    doctorName,
    crm,
    issuanceDate,
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
    "Rua Dr. Souza Alves, 139 - Centro, Taubaté - SP",
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

  page.drawText(`1ª VIA FARMÁCIA`, {
    x: 410,
    y: doctorBoxStartY - 35,
    size: 10,
    font: boldFont,
  });
  page.drawText(`2ª VIA PACIENTE`, {
    x: 410,
    y: doctorBoxStartY - 50,
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

  // Footer boxes
  const bottomY = 150;
  const boxHeight = 125;

   // Box 1: Comprador
page.drawRectangle({
  x: 50,
  y: bottomY - boxHeight,
  width: 240,
  height: boxHeight,
  borderWidth: 1,
  borderColor: rgb(0, 0, 0),
});
page.drawText("IDENTIFICAÇÃO DO COMPRADOR", {
  x: 100,
  y: bottomY - 15,
  size: 8,
  font: boldFont,
});
page.drawText("Nome: ______________________________________________", {
  x: 55,
  y: bottomY - 37,
  size: 8,
  font: timesRomanFont,
});
page.drawText("Ident:__________________________ Org. Emissor:_________", {
  x: 55,
  y: bottomY - 55,
  size: 8,
  font: timesRomanFont,
});
page.drawText("End:________________________________________________", {
  x: 55,
  y: bottomY - 73,
  size: 8,
  font: timesRomanFont,
});
page.drawText("Cidade:________________________________UF:__________", {
  x: 55,
  y: bottomY - 91,
  size: 8,
  font: timesRomanFont,
});
page.drawText("tel:_________________________________________________", {
  x: 55,
  y: bottomY - 109,
  size: 8,
  font: timesRomanFont,
});

// Box 2: Fornecedor
page.drawRectangle({
  x: 310,
  y: bottomY - boxHeight,
  width: 240,
  height: boxHeight,
  borderWidth: 1,
  borderColor: rgb(0, 0, 0),
});
page.drawText("IDENTIFICAÇÃO DO FORNECEDOR", {
  x: 360,
  y: bottomY - 15,
  size: 8,
  font: boldFont,
});
page.drawText("DATA: ______/______/______", {
  x: 315,
  y: bottomY - 50,
  size: 8,
  font: timesRomanFont,
});
page.drawText("___________________________________________________", {
  x: 315,
  y: bottomY - 95,
  size: 8,
  font: timesRomanFont,
});

page.drawText("ASSINATURA DO FARMACÊUTICO", {
  x: 368,
  y: bottomY - 109,
  size: 8,
  font: timesRomanFont,
});


  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


