"use client";

import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { Button } from "../ui/button";
import { FilePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface PrescriptionProps {
  patientName: string;
  doctorName: string;
  crm: string;
  age: string;
  gender: string;
  address: string;
  issuanceDate: string;
}

export default function ExamRequest({
  patientName,
  doctorName,
  crm,
  age,
  gender,
  address,
  issuanceDate,
}: PrescriptionProps) {
  const [texts, setTexts] = useState<{ text: string }[]>([]);
  const [newText, setNewText] = useState("");

  const handleAddMedication = () => {
    if (newText) {
      setTexts([...texts, { text: newText }]);
      setNewText("");
    }
  };

  const handleRemoveMedication = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  async function generateExamRequest() {
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
    const title = "SOLICITAÇÃO DE EXAME";
    const titleWidth = boldFont.widthOfTextAtSize(title, 14);
    const titleX = (pageWidth - titleWidth) / 2; // calcular a posição X centralizada

    page.drawText(title, {
      x: titleX,
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

    // Informações médicas
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
    page.drawText(address, {
      x: 110,
      y: contentStartY - 20,
      size: 10,
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

    // Data de emissão
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

    // Informações do paciente
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

    page.drawText("Solicito:", {
      x: 50,
      y: contentStartY - 150,
      size: 12,
      font: boldFont,
    });

    // Adicionando exames na lista
    let currentYPosition = contentStartY - 180;
    texts.forEach((text, index) => {
      const examText = `${index + 1}. ${text.text}`;
      drawTextWithWrap(page, examText, 60, currentYPosition, boldFont, 10, 500);
      currentYPosition -= 20;
    });

    // Salvar e baixar o PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Solicitação_exame_${patientName}.pdf`);

    setNewText("");
    setTexts([]);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <FilePlus />
            Solicitação exame
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">Adicionar Exame</DialogTitle>
            <DialogDescription>
              Preencha as informações do exame e clique em Adicionar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <Label htmlFor="reasonDescription" className="text-right">
                Exame
              </Label>
              <Input
                id="reasonDescription"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="col-span-3"
                placeholder="Digite o nome do exame"
              />
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-lg font-semibold">Exames Adicionados:</h3>
            <ul className="list-disc pl-5">
              {texts.map((reason, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{reason.text}</span>
                  <Button
                    variant="destructive"
                    className="ml-4"
                    onClick={() => handleRemoveMedication(index)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button onClick={handleAddMedication}>Adicionar Exame</Button>
            <Button onClick={generateExamRequest}>Gerar PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function drawTextWithWrap(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  maxWidth: number
) {
  const words = text.split(" ");
  let line = "";
  const lineHeight = size * 1.2; // ajuste conforme necessário
  let yOffset = 0;

  for (const word of words) {
    const testLine = line + word + " ";
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > maxWidth) {
      page.drawText(line, {
        x,
        y: y - yOffset,
        size,
        font,
      });
      line = word + " ";
      yOffset += lineHeight; // move para a próxima linha
    } else {
      line = testLine;
    }
  }

  // Desenha a última linha
  page.drawText(line, {
    x,
    y: y - yOffset,
    size,
    font,
  });
}
