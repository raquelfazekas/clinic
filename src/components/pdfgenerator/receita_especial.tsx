/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { Button } from "../ui/button";
import { FilePlus, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { createPrescriptionRecord } from "@/server/actions/prescription";

interface PrescriptionProps {
  patientName: string;
  doctorName: string;
  patientId: string;
  crm: string;
  age: string;
  gender: string;
  address: string;
  issuanceDate: string;
  validityDate: string;
}

export default function EspecialPrescription({
  patientName,
  doctorName,
  patientId,
  crm,
  age,
  gender,
  address,
  issuanceDate,
}: PrescriptionProps) {
  const [medications, setMedications] = useState<
    { name: string; dosage: string; quantity: string; instructions: string }[]
  >([]);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    quantity: "",
    instructions: "",
  });

  const handleAddMedication = () => {
    setMedications([...medications, newMedication]);
    setNewMedication({ name: "", dosage: "", quantity: "", instructions: "" });
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  async function handlePdfGeneration() {
    generateEspecialPrescription();
    createPrescriptionRecord("RE", medications, patientId, doctorName);
  }

  async function generateEspecialPrescription() {
    const pdfDoc = await PDFDocument.create();
  
    // Embed fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    // Function to create a prescription page
    const createPrescriptionPage = async(page: PDFPage) => {
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
      medications.forEach((medication, index) => {
        const medicationText = `${index + 1}. ${medication.name} ${medication.dosage}`;
        const quantityText = medication.quantity;
  
        const dashStartX =
          50 + timesRomanFont.widthOfTextAtSize(medicationText, 10) + 10;
        const dashEndX = 500 - timesRomanFont.widthOfTextAtSize(quantityText, 10);
  
        page.drawText(medicationText, {
          x: 50,
          y: yPosition,
          size: 10,
          font: boldFont,
        });
  
        page.drawLine({
          start: { x: dashStartX, y: yPosition + 5 },
          end: { x: dashEndX, y: yPosition + 5 },
          thickness: 1,
        });
  
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

  };
  
    // Create first page
    const firstPage = pdfDoc.addPage([600, 850]);
    await createPrescriptionPage(firstPage);
  
    // Create second page
    const secondPage = pdfDoc.addPage([600, 850]);
    await createPrescriptionPage(secondPage);
  
    // Save and download PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Receita_Controlada_${patientName}`);
  
    // Reset medications list
    setMedications([]);
    setNewMedication({ name: "", dosage: "", quantity: "", instructions: "" });
  }
  

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <FilePlus />
            Receita controlada
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Adicionar Medicação
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da medicação e clique em Adicionar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medication-name" className="text-right">
                Nome
              </Label>
              <Input
                id="medication-name"
                value={newMedication.name}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosagem
              </Label>
              <Input
                id="dosage"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantity"
                value={newMedication.quantity}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    quantity: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">
                Instruções
              </Label>
              <Input
                id="instructions"
                value={newMedication.instructions}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    instructions: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-lg font-semibold">Medicações Adicionadas:</h3>
            <ul className="list-disc pl-5">
              {medications.map((medication, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {medication.name} - {medication.dosage} (x
                    {medication.quantity})
                  </span>
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
            <Button onClick={handleAddMedication}>Adicionar</Button>
            <Button onClick={handlePdfGeneration}>Gerar PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
