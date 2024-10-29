import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";

interface Texts {
  text: string;
  cid: string;
}

interface GenerateEspecialPrescriptionProps {
  doctorName: string;
  crm: string;
  issuanceDate: string;
  patientName: string;
  gender: string;
  age: string;
  texts: Texts[];
}

export default async function generateAtestadoMedico({
  doctorName,
  crm,
  issuanceDate,
  patientName,
  age,
  gender,
  texts,
}: GenerateEspecialPrescriptionProps) {
  const pdfDoc = await PDFDocument.create();

  const cid = texts[0].cid;

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([600, 850]);

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

  const contentStartY = 770 - logoHeight - 20;

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
  page.drawText("ATESTADO MÉDICO", {
    x: 230,
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
  page.drawText(
    "Rua Padre Timóteo Corrêa de Toledo, 259, Vila São José, Taubaté - SP",
    {
      x: 110,
      y: contentStartY - 20,
      size: 8,
      font: timesRomanFont,
    }
  );

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

  let yPosition = contentStartY - 180;
  let totalLines = 0;

  texts.forEach((text) => {
    const examText = `• ${text.text}`;
    const lines = drawTextWithWrap(
      page,
      examText,
      50,
      yPosition,
      timesRomanFont,
      10,
      500
    );
    yPosition -= lines * (10 * 1.2);
    totalLines += lines;
  });

  const cidYPosition = contentStartY - 215 - totalLines * (10 * 1.2);
  page.drawText(`CID-10: ${cid}`, {
    x: 50,
    y: cidYPosition,
    size: 10,
    font: courierFont,
  });

  // Salvar e baixar o PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function drawTextWithWrap(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  maxWidth: number
): number {
  const words = text.split(" ");
  let line = "";
  let lineNumber = 0;

  words.forEach((word) => {
    const testLine = `${line}${word} `;
    const textWidth = font.widthOfTextAtSize(testLine, size);
    if (textWidth > maxWidth) {
      page.drawText(line, { x, y, size, font });
      line = `${word} `;
      y -= size * 1.2;
      lineNumber++;
    } else {
      line = testLine;
    }
  });

  page.drawText(line.trim(), { x, y, size, font });
  return lineNumber + 1;
}
