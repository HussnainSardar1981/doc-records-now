import jsPDF from 'jspdf';
import { LOGO_BASE64 } from './logoBase64';

interface CallRecord {
  dialed_number?: string;
  call_count?: number;
  site?: string | null;
  phone_number?: string;
  duration?: string;
  start_time?: string;
  call_status?: string;
  facility?: string;
}

interface ApprovedVisitor {
  name?: string;
  relationship?: string;
  status?: string;
}

interface Visit {
  visitor_name?: string;
  date?: string;
  visit_type?: string;
  relationship?: string;
  visitor_age?: string;
}

const addLogoAndHeader = (doc: jsPDF, pageWidth: number): number => {
  let yPos = 15;

  // Add logo centered
  const logoWidth = 50;
  const logoHeight = 14;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.addImage(LOGO_BASE64, 'PNG', logoX, yPos, logoWidth, logoHeight);
  yPos += logoHeight + 8;

  return yPos;
};

const addFooter = (doc: jsPDF, pageWidth: number) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add logo in footer too (smaller)
    const footerLogoWidth = 30;
    const footerLogoHeight = 8.5;
    const footerLogoX = (pageWidth - footerLogoWidth) / 2;
    doc.addImage(LOGO_BASE64, 'PNG', footerLogoX, 278, footerLogoWidth, footerLogoHeight);

    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    doc.text('Inmate Insights - Confidential', pageWidth / 2, 294, { align: 'center' });
  }
};

export const generatePhoneRecordsPDF = (
  docNumber: string,
  totalCalls: number,
  totalApprovedNumbers: number,
  callHistory: CallRecord[],
  lastUpdated?: string,
  inmateName?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = addLogoAndHeader(doc, pageWidth);

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Phone Records Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Inmate name
  if (inmateName) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(inmateName, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }

  // DOC number
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`DOC #${docNumber}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  if (lastUpdated) {
    doc.setFontSize(10);
    doc.text(`Last Updated: ${new Date(lastUpdated).toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }

  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Approved Numbers: ${totalApprovedNumbers}`, 20, yPos);
  yPos += 15;

  // Call History
  if (callHistory.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Call History', 20, yPos);
    yPos += 10;

    const isSummary = Object.prototype.hasOwnProperty.call(callHistory[0], 'call_count');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    for (const call of callHistory) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      if (isSummary) {
        doc.text(`Number: ${call.dialed_number || 'N/A'}  |  Calls: ${call.call_count ?? 0}${call.site ? `  |  Site: ${call.site}` : ''}`, 20, yPos);
      } else {
        doc.text(`Phone: ${call.phone_number || 'N/A'}  |  Duration: ${call.duration || 'N/A'}${call.facility ? `  |  Facility: ${call.facility}` : ''}`, 20, yPos);
      }
      yPos += 6;
    }
  }

  addFooter(doc, pageWidth);
  doc.save(`phone_records_${docNumber}.pdf`);
};

export const generateVisitorRecordsPDF = (
  docNumber: string,
  totalApprovedVisitors: number,
  totalVisits: number,
  approvedVisitors: ApprovedVisitor[],
  visitHistory: Visit[],
  lastUpdated?: string,
  inmateName?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = addLogoAndHeader(doc, pageWidth);

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Visitor Records Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Inmate name
  if (inmateName) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(inmateName, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }

  // DOC number
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`DOC #${docNumber}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  if (lastUpdated) {
    doc.setFontSize(10);
    doc.text(`Last Updated: ${new Date(lastUpdated).toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  }

  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Approved Visitors: ${totalApprovedVisitors}`, 20, yPos);
  yPos += 15;

  // Approved Visitors
  if (approvedVisitors.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Approved Visitors', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    for (const visitor of approvedVisitors) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(`Name: ${visitor.name || 'N/A'}  |  Relationship: ${visitor.relationship || 'N/A'}${visitor.status ? `  |  Status: ${visitor.status}` : ''}`, 20, yPos);
      yPos += 6;
    }
    yPos += 10;
  }

  // Visit History
  if (visitHistory.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Visit History', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    for (const visit of visitHistory) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const visitDate = visit.date ? new Date(visit.date).toLocaleDateString() : 'N/A';
      doc.text(`Visitor: ${visit.visitor_name || 'N/A'}  |  Date: ${visitDate}  |  Type: ${visit.visit_type || 'N/A'}  |  Relationship: ${visit.relationship || 'N/A'}`, 20, yPos);
      yPos += 6;
    }
  }

  addFooter(doc, pageWidth);
  doc.save(`visitor_records_${docNumber}.pdf`);
};
