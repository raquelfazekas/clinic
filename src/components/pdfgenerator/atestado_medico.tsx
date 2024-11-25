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
import { createPrescriptionRecord } from "@/server/actions/prescription";
import { Textarea } from "../ui/textarea";

interface PrescriptionProps {
  patientName: string;
  doctorName: string;
  patientId: string;
  crm: string;
  age: string;
  gender: string;
  issuanceDate: string;
}

export default function AtestadoMedico({
  patientName,
  doctorName,
  patientId,
  crm,
  age,
  gender,
  issuanceDate,
}: PrescriptionProps) {
  const [texts, setTexts] = useState<{ text: string; cid: string }[]>([]);
  const [newText, setNewText] = useState("");
  const [cid, setCid] = useState("");

  const handleAddTexts = () => {
    if (newText && cid) {
      setTexts([...texts, { text: newText, cid }]);
      setNewText("");
    }
  };

  const handleRemoveText = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  async function handlePdfGeneration() {
    generateAtestadoMedico();
    createPrescriptionRecord("ATM", texts, patientId, doctorName);
  }

  async function generateAtestadoMedico() {
    const pdfDoc = await PDFDocument.create();

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([600, 850]);

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

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Atestado_Médico_${patientName}.pdf`);

    setCid("");
    setNewText("");
    setTexts([]);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <FilePlus />
            Atestado médico
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Adicionar Motivo do Atestado
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do motivo e clique em Adicionar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cid" className="text-right">
                CID-10
              </Label>
              <Input
                id="cid"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                className="col-span-3"
                placeholder="Digite o CID-10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <Label htmlFor="reasonDescription" className="text-right">
                Descrição do Motivo
              </Label>
              <Textarea
              id="reasonDescription"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="col-span-3"
              placeholder="Digite a descrição do motivo" />
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-lg font-semibold">Motivos Adicionados:</h3>
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
                    onClick={() => handleRemoveText(index)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button onClick={handleAddTexts}>Adicionar Motivo</Button>
            <Button onClick={handlePdfGeneration}>Gerar PDF</Button>
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
