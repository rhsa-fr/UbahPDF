import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert Excel (.xlsx, .xls, .csv) file to PDF client-side
 * Parses sheet into HTML table, renders via html2canvas and packages with jsPDF
 */
export async function excelToPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get the first sheet
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('File Excel kosong atau tidak memiliki lembar kerja (sheet).');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const htmlTable = XLSX.utils.sheet_to_html(worksheet, { id: 'excel-table' });

  // Create temporary container element to render table nicely
  const container = document.createElement('div');
  container.style.all = 'initial';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '1120px'; // Wide view for spreadsheets
  container.style.padding = '32px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#18181b';
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  container.style.fontSize = '12px';
  container.style.colorScheme = 'light';

  // Inject styles to format the table cleanly
  const styledHtml = `
    <style>
      #excel-table {
        border-collapse: collapse;
        width: 100%;
        font-family: Inter, Arial, sans-serif;
        font-size: 11px;
      }
      #excel-table td, #excel-table th {
        border: 1px solid #e4e4e7;
        padding: 6px 10px;
        text-align: left;
        color: #18181b;
      }
      #excel-table tr:first-child td, #excel-table tr:first-child th {
        background-color: #f4f4f5;
        font-weight: 600;
      }
      #excel-table tr:nth-child(even) {
        background-color: #fafafa;
      }
    </style>
    <div style="margin-bottom: 16px;">
      <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 4px 0; color: #18181b;">${file.name.replace(/\.[^/.]+$/, '')}</h2>
      <p style="font-size: 10px; color: #71717a; margin: 0;">Sheet: ${firstSheetName} · UbahPDF</p>
    </div>
    ${htmlTable}
  `;

  container.innerHTML = styledHtml;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Choose orientation based on table aspect ratio
    const isLandscape = canvas.width > canvas.height;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const imgWidth = pageWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10; // top margin

    pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 20);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);
    }

    return new Uint8Array(pdf.output('arraybuffer'));
  } catch (err) {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw err;
  }
}
