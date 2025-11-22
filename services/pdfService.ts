import { jsPDF } from "jspdf";
import { GeneratedBook } from "../types";

export const createColoringBookPDF = (book: GeneratedBook): jsPDF => {
  // A4 size: 210mm x 297mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // --- COVER PAGE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.text("My Coloring Book", pageWidth / 2, 40, { align: "center" });

  // Add Cover Image
  // Calculate aspect ratio to fit nicely
  const imgHeight = 150; // Fixed height for cover image area
  doc.addImage(book.coverImage, "PNG", margin, 60, contentWidth, imgHeight, undefined, 'CENTER');

  // Child's Name
  doc.setFont("helvetica", "normal");
  doc.setFontSize(30);
  doc.text(`For ${book.childName}`, pageWidth / 2, 240, { align: "center" });

  // Theme subtitle (optional)
  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text(`Theme: ${book.theme}`, pageWidth / 2, 260, { align: "center" });

  // --- PAGES 1-5 ---
  book.pages.forEach((pageImg, index) => {
    doc.addPage();
    
    // Add a small footer page number
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${index + 1}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Add the coloring image
    // We want it large and centered
    const maxImgHeight = pageHeight - 40; // Top/bottom margins
    doc.addImage(pageImg, "PNG", margin, 20, contentWidth, maxImgHeight, undefined, 'CENTER');
  });

  return doc;
};

export const downloadPDF = (book: GeneratedBook) => {
  const doc = createColoringBookPDF(book);
  const cleanName = book.childName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${cleanName}_coloring_book.pdf`);
};
