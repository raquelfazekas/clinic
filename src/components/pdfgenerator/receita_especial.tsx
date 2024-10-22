/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { Button } from "../ui/button";
import { FilePlus } from "lucide-react";

interface PrescriptionProps {
  patientName: string;
  doctorName: string;
  crm: string;
  age: string;
  gender: string;
  address: string;
  issuanceDate: string;
  validityDate: string;
  medications: Array<{
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
  }>;
}

export default function EspecialPrescription({
  patientName,
  doctorName,
  crm,
  age,
  gender,
  address,
  issuanceDate,
  validityDate,
  medications,
}: PrescriptionProps) {
  async function generateEspecialPrescription() {
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
    const logoWidth = 200;
    const logoHeight = 100;
    const xCenteredLogo = (pageWidth - logoWidth) / 2;

    page.drawImage(logoImage, {
      x: xCenteredLogo,
      y: 760,
      width: logoWidth,
      height: logoHeight,
    });

    const contentStartY = 760 - logoHeight - 10;

    // Título com linhas em volta
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
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Receita_Controlada_${patientName}`);
  }

  return (
    <>
      <Button onClick={generateEspecialPrescription}>
        <FilePlus size={28} />
        <span>Receita controlada</span>
      </Button>
    </>
  );
}
