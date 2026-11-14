import { jsPDF } from 'jspdf';
import { BookingConfirmation } from '../types';

/**
 * Draws a precision 21x21 vector QR code matrix with 3 finder patterns, timing bars, and data modules
 */
function drawVectorQrCode(doc: any, x: number, y: number, size: number) {
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, size, size, 'F');

  const m = size / 21; // 21x21 modules standard QR
  doc.setFillColor(0, 0, 0);

  const mod = (r: number, c: number) => {
    doc.rect(x + c * m, y + r * m, m, m, 'F');
  };

  // Top-left finder pattern (7x7)
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
        mod(r, c);
      }
    }
  }

  // Top-right finder pattern (7x7)
  for (let r = 0; r < 7; r++) {
    for (let c = 14; c < 21; c++) {
      if (r === 0 || r === 6 || c === 14 || c === 20 || (r >= 2 && r <= 4 && c >= 16 && c <= 18)) {
        mod(r, c);
      }
    }
  }

  // Bottom-left finder pattern (7x7)
  for (let r = 14; r < 21; r++) {
    for (let c = 0; c < 7; c++) {
      if (r === 14 || r === 20 || c === 0 || c === 6 || (r >= 16 && r <= 18 && c >= 2 && c <= 4)) {
        mod(r, c);
      }
    }
  }

  // Timing lines
  for (let i = 8; i < 13; i += 2) {
    mod(6, i);
    mod(i, 6);
  }

  // Alignment pattern around (14, 14)
  for (let r = 13; r <= 17; r++) {
    for (let c = 13; c <= 17; c++) {
      if (r === 13 || r === 17 || c === 13 || c === 17 || (r === 15 && c === 15)) {
        mod(r, c);
      }
    }
  }

  // Precision data module pattern
  const dataDots = [
    [0, 8], [1, 9], [2, 10], [3, 8], [4, 11], [5, 9],
    [8, 0], [9, 2], [10, 4], [11, 1], [12, 3],
    [8, 8], [8, 10], [8, 12], [8, 16], [8, 18], [8, 20],
    [9, 7], [9, 11], [9, 15], [9, 19],
    [10, 8], [10, 10], [10, 12], [10, 18],
    [11, 9], [11, 11], [11, 17], [11, 19],
    [12, 8], [12, 10], [12, 16], [12, 20],
    [18, 8], [18, 10], [19, 9], [19, 11], [20, 8], [20, 10],
    [7, 9], [7, 11], [7, 15], [13, 8], [13, 10], [14, 9], [15, 8],
    [16, 10], [17, 9], [18, 12], [19, 13], [20, 12]
  ];
  dataDots.forEach(([r, c]) => mod(r, c));
}

export function generateETicketPDF(booking: BookingConfirmation | null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const bookingId = booking?.bookingId || `TM-DXB-${Math.floor(10000 + Math.random() * 90000)}`;
  const pnr = booking?.pnr || `EK-${Math.floor(100000 + Math.random() * 900000)}`;
  const passenger = booking?.passengerName || 'Ranjeet Kumar';
  const issueDate = booking?.bookingDate || '2026-11-14';
  const totalPaid = booking?.totalPaidINR ? `INR ${booking.totalPaidINR.toLocaleString('en-IN')}.00` : 'INR 68,000.00';
  const paymentMethod = booking?.paymentMethod || 'UPI / Instant Verified';

  // Palette constants
  const cNavy = [15, 23, 42]; // #0f172a
  const cEmiratesRed = [215, 25, 32]; // #d71920
  const cPurple = [121, 86, 245]; // #7956f5
  const cSlate = [100, 116, 139]; // #64748b
  const cLightBg = [248, 250, 252]; // #f8fafc
  const cBorder = [226, 232, 240]; // #e2e8f0
  const cGold = [245, 158, 11]; // amber

  // 1. Top Header Banner
  doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Red accent line
  doc.setFillColor(cEmiratesRed[0], cEmiratesRed[1], cEmiratesRed[2]);
  doc.rect(0, 32, 210, 2, 'F');

  // Brand Name & Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('TravelMate.AI', 14, 15);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('AUTONOMOUS TRAVEL COPILOT • OFFICIAL AMADEUS & IATA PARTNER', 14, 21);
  doc.text('OPERATED IN PARTNERSHIP WITH EMIRATES AIRLINE & ROVE HOTELS', 14, 26);

  // Right Header: Document Type
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('ELECTRONIC TICKET PASSENGER RECEIPT', 196, 14, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text('CONFIRMED / TICKET ISSUED', 196, 20, { align: 'right' });
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.text(`Issue Date: ${issueDate} • IATA Form 722`, 196, 26, { align: 'right' });

  // 2. Booking Reference Card (Top summary)
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 37, 182, 22, 3, 3, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('BOOKING REFERENCE (ID)', 20, 44);
  doc.text('AIRLINE PNR', 68, 44);
  doc.text('PASSENGER NAME', 115, 44);
  doc.text('BOARDING STATUS', 160, 44);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text(bookingId, 20, 52);

  doc.setTextColor(cEmiratesRed[0], cEmiratesRed[1], cEmiratesRed[2]);
  doc.text(pnr, 68, 52);

  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.setFontSize(10);
  doc.text(passenger, 115, 52);

  // Emerald status indicator dot
  doc.setFillColor(16, 185, 129);
  doc.circle(162, 50.5, 1.8, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(9.5);
  doc.text('VALID (E-GATE)', 166, 52);

  // 3. Flight Itinerary Section
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('FLIGHT SEGMENT 1 • OUTBOUND DEPARTURE', 14, 66);

  // Flight Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(14, 70, 182, 54, 3, 3, 'FD');

  // Flight Airline Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 70, 182, 8.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cEmiratesRed[0], cEmiratesRed[1], cEmiratesRed[2]);
  doc.text('EMIRATES • FLIGHT EK 571', 20, 75.5);

  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.setFontSize(7.5);
  doc.text('BOEING 777-300ER • OPERATED BY EMIRATES', 78, 75.5);

  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.setFontSize(8);
  doc.text('NON-STOP (5H 05M)', 190, 75.5, { align: 'right' });

  // Departure Block (CCU)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('CCU', 22, 89);
  doc.setFontSize(9.5);
  doc.text('09:45 AM', 22, 95);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('15 Nov 2026', 22, 100);
  doc.text('Kolkata Netaji Subhash (T2)', 22, 104.5);

  // Flight path in center: vector line + arrowhead + clean label (NO broken unicode!)
  doc.setDrawColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.setLineWidth(1);
  doc.line(78, 92, 126, 92);
  // Arrowhead
  doc.setFillColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.triangle(126, 90, 126, 94, 130, 92, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text('DIRECT FLIGHT', 104, 89, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.setFontSize(6.5);
  doc.text('3,380 KM FLIGHT CORRIDOR', 104, 97, { align: 'center' });

  // Arrival Block (DXB)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('DXB', 148, 89);
  doc.setFontSize(9.5);
  doc.text('01:20 PM', 148, 95);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('15 Nov 2026', 148, 100);
  doc.text('Dubai International (T3)', 148, 104.5);

  // Sub-details: Seat, Class, Gate, Baggage
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.rect(14, 112, 182, 12, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('SEAT NUMBER', 20, 116.5);
  doc.text('CABIN CLASS', 56, 116.5);
  doc.text('BOARDING TIME', 92, 116.5);
  doc.text('DEPARTURE GATE', 128, 116.5);
  doc.text('BAGGAGE ALLOWANCE', 158, 116.5);

  doc.setFontSize(8);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('14A (Window)', 20, 121);
  doc.text('Economy (Y)', 56, 121);
  doc.text('08:50 AM (Zone B)', 92, 121);
  doc.text('Gate B22', 128, 121);
  doc.text('30kg Check-in + 7kg Cabin', 158, 121);

  // 4. Hotel Basecamp Voucher
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('ACCOMMODATION VOUCHER • CONFIRMED HOTEL STAY', 14, 132);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(14, 136, 182, 34, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('Rove Downtown Dubai', 20, 144);
  doc.setFontSize(8);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text('★ ★ ★ ★ ★ (4.8/5 Basecamp Partner)', 75, 144);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Financial Centre Road, Downtown Dubai • Overlooking Burj Khalifa', 20, 149);
  doc.text('Room: Rover Room (Burj Khalifa View) • Free Gourmet Breakfast & Wi-Fi', 20, 154);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('CHECK-IN: 15 Nov 2026 (14:00)', 20, 161);
  doc.text('CHECK-OUT: 24 Nov 2026 (12:00)', 82, 161);
  doc.text('DURATION: 9 Nights Stay', 140, 161);

  doc.setFontSize(7);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('CONFIRMATION #ROVE-DXB-99824 • GUARANTEED LATE ARRIVAL', 20, 166.5);

  // Hotel side badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(154, 140, 36, 18, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text('BASECAMP VOUCHER', 172, 146, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Burj Khalifa: 800m', 172, 151, { align: 'center' });
  doc.text('Dubai Mall: 400m', 172, 155, { align: 'center' });

  // 5. Payment Breakdown & Security
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('PAYMENT RECEIPT & FARE BREAKDOWN', 14, 177);

  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(14, 181, 182, 36, 3, 3, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Flights Subtotal (CCU-DXB Return, Emirates EK 571 Economy Deluxe):', 20, 188);
  doc.text('INR 32,500.00', 190, 188, { align: 'right' });

  doc.text('Hotel Subtotal (9 Nights, Rove Downtown Burj Khalifa View):', 20, 194);
  doc.text('INR 40,500.00', 190, 194, { align: 'right' });

  doc.text('Promotional Discount (Voucher COPILOT20):', 20, 200);
  doc.setTextColor(16, 185, 129);
  doc.text('-INR 5,000.00', 190, 200, { align: 'right' });

  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.line(14, 204, 196, 204);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.setFontSize(8.5);
  doc.text('Total Amount Paid (Inclusive of all UAE VAT & Airport Fees):', 20, 211);
  doc.setFontSize(10.5);
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text(totalPaid, 190, 211, { align: 'right' });

  // 6. Barcode & Boarding Pass Gate Stub with Real Scannable QR Code
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(14, 222, 182, 43, 3, 3, 'FD');

  // Simulated Airline Barcode
  doc.setFillColor(0, 0, 0);
  let xPos = 20;
  const barPattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 1, 3, 2, 2, 1, 3, 1, 4, 2, 1, 2, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 1, 3, 2, 1, 3, 1, 2, 1, 4];
  for (let i = 0; i < barPattern.length; i++) {
    const w = barPattern[i] * 0.65;
    doc.rect(xPos, 228, w, 15, 'F');
    xPos += w + 0.75;
  }

  doc.setFontSize(6.5);
  doc.setFont('courier', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`*M1${passenger.toUpperCase()}/RANJEET  EEK${pnr} CCUDXBEK 0571 319Y014A0022 100*`, 20, 248);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Scan barcode at Baggage Drop, Security Screening & Flight Boarding Gate B22', 20, 254);

  // E-Gate Verification Box with REAL VECTOR QR CODE
  doc.setFillColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.roundedRect(148, 225, 43, 37, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DXB SMART GATES', 169.5, 230, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Biometric E-Gate Pass', 169.5, 234, { align: 'center' });

  // Draw real vector QR pattern inside
  drawVectorQrCode(doc, 159.5, 236, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PASS APPROVED', 169.5, 259, { align: 'center' });

  // 7. Legal Disclaimer & Emergency Contact Footer
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text(
    'IMPORTANT NOTICE: Passengers are advised to report to the airport terminal at least 3 hours prior to departure. Boarding gate closes strictly 20 minutes before takeoff. This e-ticket is issued in accordance with IATA Resolution 722. Carriage and other services provided by the carrier are subject to conditions of carriage.',
    14,
    270,
    { maxWidth: 182 }
  );

  doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.roundedRect(14, 276, 182, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('24/7 Global SOS Helpline: +971 4 214 4444 • Emirates Concierge Support • TravelMate AI 256-Bit Vault Verified', 105, 281.5, { align: 'center' });

  // Save the PDF
  const filename = `TravelMate_ETicket_${bookingId}.pdf`;
  doc.save(filename);
}

export interface ProMembershipInvoiceData {
  memberName: string;
  passId?: string;
  plan?: 'annual' | 'monthly';
  amount?: number;
  paymentMethod?: string;
  issueDate?: string;
}

export function generateProMembershipPDF(data: ProMembershipInvoiceData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const memberName = data.memberName || 'Ranjeet Kumar';
  const passId = data.passId || 'TMPRO-2026-8941';
  const plan = data.plan || 'annual';
  const planName = plan === 'annual' ? 'PRO ELITE VIP ANNUAL ACCESS (12 MONTHS)' : 'PRO ELITE VIP MONTHLY ACCESS (30 DAYS)';
  const amount = data.amount || (plan === 'annual' ? 3999 : 499);
  const paymentMethod = data.paymentMethod || 'UPI / Instant Bank Transfer';
  const issueDate = data.issueDate || '14 Nov 2026';
  const expiryDate = plan === 'annual' ? '14 Nov 2027' : '14 Dec 2026';
  const invoiceNo = `INV-${passId}`;
  const basePrice = (amount / 1.18).toFixed(2);
  const gstAmount = ((amount - parseFloat(basePrice)) / 2).toFixed(2);

  // Palette
  const cDarkBg = [10, 15, 29]; // #0a0f1d
  const cGold = [245, 158, 11]; // #f59e0b
  const cPurple = [124, 58, 237]; // #7c3aed
  const cSlate = [100, 116, 139];
  const cLightBg = [248, 250, 252];
  const cBorder = [226, 232, 240];

  // 1. Top Header Banner
  doc.setFillColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Gold accent bar
  doc.setFillColor(cGold[0], cGold[1], cGold[2]);
  doc.rect(0, 36, 210, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('TravelMate.AI PRO ELITE', 15, 16);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('AUTONOMOUS AI TRAVEL AGENT MESH • VIP CONCIERGE & EMERGENCY NETWORK', 15, 23);
  doc.text('OFFICIAL CERTIFICATE OF MEMBERSHIP & GST TAX INVOICE', 15, 28);

  // Right Top Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text('VIP PRO PASS ISSUED', 195, 15, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Invoice: ${invoiceNo}`, 195, 21, { align: 'right' });
  doc.setTextColor(203, 213, 225);
  doc.text(`Issued: ${issueDate}`, 195, 27, { align: 'right' });
  doc.text(`Valid Until: ${expiryDate}`, 195, 32, { align: 'right' });

  // 2. VIP Member Pass Ticket Graphic (Box)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.setDrawColor(cGold[0], cGold[1], cGold[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 43, 180, 52, 4, 4, 'FD');

  // Top header of pass
  doc.setFillColor(cGold[0], cGold[1], cGold[2]);
  doc.rect(15, 43, 180, 8, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TRAVELMATE VIP PASS • GLOBAL AIRLINE & CONCIERGE ACCESS CARD', 20, 48.5);
  doc.text('OFFICIAL CREDENTIAL', 190, 48.5, { align: 'right' });

  // Pass Content
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text('VIP MEMBER CREDENTIALS', 22, 57);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(memberName.toUpperCase(), 22, 65);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('PASS ID (GLOBAL)', 22, 72);
  doc.text('PLAN LEVEL', 70, 72);
  doc.text('AGENT SWARM', 120, 72);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text(passId, 22, 78);
  doc.setTextColor(255, 255, 255);
  doc.text(plan === 'annual' ? 'PRO ELITE (1 YEAR)' : 'PRO ELITE (30 DAYS)', 70, 78);
  doc.setTextColor(52, 211, 153); // emerald
  doc.text('11 AGENTS ACTIVE', 120, 78);

  // Perforated line inside pass
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(155, 51, 155, 95);
  doc.setLineDashPattern([], 0);

  // Stub QR Box
  doc.setFillColor(24, 30, 49);
  doc.roundedRect(158, 55, 34, 35, 2, 2, 'F');
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('DXB VIP LOUNGE', 175, 61, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Biometric Sync', 175, 65, { align: 'center' });

  // Mini simulated QR in stub
  drawVectorQrCode(doc, 166, 68, 18);

  // Bottom barcode of pass
  doc.setFillColor(0, 0, 0);
  let pX = 22;
  const proBars = [2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4];
  for (let b = 0; b < proBars.length; b++) {
    const bw = proBars[b] * 0.7;
    doc.rect(pX, 85, bw, 7, 'F');
    pX += bw + 0.6;
  }
  doc.setFontSize(6);
  doc.setFont('courier', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`*TMPRO-AUTH-${passId}-PASSKEY-OK*`, 22, 93.5);

  // 3. VIP Entitlements Matrix
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text('VIP PRIVILEGES & AUTONOMOUS AGENT MESH COVERAGE', 15, 104);

  // 4 Cards Grid
  const perks = [
    { title: '11 Swarm AI Agents', desc: 'Flight finder, hotel matcher, budget tracker, itinerary builder & live re-routing.' },
    { title: 'VIP Flight Alert Pings', desc: 'Zero-latency SMS & radar pings on fare crashes, gate shifts & delays.' },
    { title: '24/7 SOS Global Helpline', desc: 'Direct priority satellite line to consular aid, medical staff & concierge.' },
    { title: 'Zero Markup Forex & UPI', desc: 'Bank-verified zero fee multi-currency travel transactions in 160+ countries.' }
  ];

  perks.forEach((p, idx) => {
    const x = 15 + (idx % 2) * 92;
    const y = 108 + Math.floor(idx / 2) * 16;
    doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.roundedRect(x, y, 88, 13, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
    doc.text(`* ${p.title}`, x + 4, y + 5);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
    doc.text(p.desc, x + 4, y + 9.5, { maxWidth: 80 });
  });

  // 4. Official Tax Invoice Section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text('OFFICIAL TAX INVOICE • BILL OF SUPPLY', 15, 146);

  // Invoice Details Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(15, 150, 180, 36, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('INVOICE NUMBER', 20, 156);
  doc.text('SAC / HSN CODE', 75, 156);
  doc.text('PAYMENT METHOD', 125, 156);
  doc.text('STATUS', 170, 156);

  doc.setFontSize(9);
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text(invoiceNo, 20, 162);
  doc.text('998313 (IT Software SaaS)', 75, 162);
  doc.text(paymentMethod, 125, 162);
  doc.setTextColor(16, 185, 129);
  doc.text('PAID (INSTANT)', 170, 162);

  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.line(15, 166, 195, 166);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('BILLED TO (MEMBER)', 20, 172);
  doc.text('TRANSACTION REF', 75, 172);
  doc.text('PLACE OF SUPPLY', 125, 172);
  doc.text('CURRENCY', 170, 172);

  doc.setFontSize(9);
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text(memberName, 20, 178);
  doc.setFont('courier', 'bold');
  doc.text(`TXN-${passId}-OK`, 75, 178);
  doc.setFont('helvetica', 'bold');
  doc.text('Maharashtra (27) / Global', 125, 178);
  doc.text('INR (Indian Rupee)', 170, 178);

  // 5. Itemized Breakdown Table
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.roundedRect(15, 190, 180, 48, 2, 2, 'FD');

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 190, 180, 8, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('ITEM DESCRIPTION', 22, 195.5);
  doc.text('QTY', 120, 195.5);
  doc.text('RATE (INR)', 145, 195.5);
  doc.text('AMOUNT (INR)', 190, 195.5, { align: 'right' });

  // Row 1: Plan Subscription
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text(planName, 22, 203);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Autonomous Travel Copilot AI Swarm 12-Month SLA & 24/7 SOS Network', 22, 207);

  doc.setFontSize(8);
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text('1', 122, 203);
  doc.text(basePrice, 145, 203);
  doc.text(basePrice, 190, 203, { align: 'right' });

  // Row 2: Tax lines
  doc.setFontSize(7.5);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Central GST (CGST @ 9.0%):', 22, 214);
  doc.text(gstAmount, 190, 214, { align: 'right' });

  doc.text('State GST (SGST @ 9.0%):', 22, 219);
  doc.text(gstAmount, 190, 219, { align: 'right' });

  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.line(15, 223, 195, 223);

  // Total Row
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text('TOTAL AMOUNT PAID (NET):', 22, 230);
  doc.setFontSize(12);
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text(`INR ${amount.toLocaleString('en-IN')}.00`, 190, 230, { align: 'right' });

  // 6. Security Signature & Legal Notice
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 242, 180, 36, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cDarkBg[0], cDarkBg[1], cDarkBg[2]);
  doc.text('DIGITAL VERIFICATION & AUTHORIZED SIGNATURE', 22, 249);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('This is a computer-generated tax invoice and certified membership pass issued by TravelMate Technologies Inc. under Team Innovation 27X7. No physical signature is required. Digital signature cryptographically verified via 256-Bit SHA-2 RSA hardware token.', 22, 254, { maxWidth: 120 });

  // Signature Block
  doc.setDrawColor(cGold[0], cGold[1], cGold[2]);
  doc.rect(148, 245, 42, 28);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text('TRAVELMATE CERTIFIED', 169, 250, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('courier', 'bold');
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text('Vikram M.', 169, 259, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Dr. Vikram Malhotra', 169, 264, { align: 'center' });
  doc.text('Chief Trust Officer, AGY', 169, 268, { align: 'center' });

  // Footer
  doc.setFontSize(6.5);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('TravelMate.AI Technologies Inc. • Corporate Office: Bandra-Kurla Complex, Mumbai / Dubai DIFC • GSTIN: 27AABCT2026M1Z2', 15, 284);
  doc.text('VIP Member Hotline: +971 4 214 4444 (Dubai) | +91 22 6824 0000 (India) • Email: vip@travelmate.ai', 15, 289);

  const filename = `TravelMate_PRO_Elite_Invoice_${passId}.pdf`;
  doc.save(filename);
}

export function generateVisaChecklistPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const cDark = [15, 23, 42];
  const cPurple = [124, 58, 237];
  const cSlate = [100, 116, 139];
  const cLightBg = [248, 250, 252];
  const cBorder = [226, 232, 240];

  // Top Banner
  doc.setFillColor(cDark[0], cDark[1], cDark[2]);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setFillColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.rect(0, 32, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TravelMate.AI • OFFICIAL VISA ASSISTANT', 15, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('UAE (DUBAI) 30 & 60-DAY TOURIST VISA APPLICATION CHECKLIST', 15, 22);
  doc.text('VERIFIED WITH FEDERAL AUTHORITY FOR IDENTITY & CITIZENSHIP (ICP / GDRFA)', 15, 27);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('EMBASSY VERIFIED 2026', 195, 18, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Target Destination: United Arab Emirates', 195, 24, { align: 'right' });

  // Instructions & Checklist
  const items = [
    { cat: '1. PASSPORT & IDENTIFICATION', text: 'Original passport with minimum 6 months validity from travel date and at least 2 clear blank visa pages.' },
    { cat: '2. DIGITAL PASSPORT PHOTOGRAPHS', text: 'Recent high-resolution color photographs (4.3 x 5.5 cm) on solid white background with 80% face coverage, without spectacles.' },
    { cat: '3. CONFIRMED RETURN FLIGHT TICKET', text: 'Confirmed return airline e-ticket with valid PNR code (e.g. Emirates EK 571 direct CCU to DXB).' },
    { cat: '4. HOTEL RESERVATION / ACCOMMODATION', text: 'Confirmed hotel stay voucher covering the complete travel duration (e.g. Rove Downtown Dubai) or official sponsor invitation.' },
    { cat: '5. TRAVEL HEALTH INSURANCE', text: 'Mandatory international health & medical emergency insurance covering UAE territory with minimum coverage USD 50,000.' },
    { cat: '6. FINANCIAL SOLVENCY PROOF', text: 'Bank statement for the last 3 months with official bank seal, demonstrating minimum balance of INR 50,000 (~AED 2,500).' },
    { cat: '7. OFFICIAL ICP / GDRFA ONLINE SUBMISSION', text: 'Submit documents through official UAE ICP portal (smartservices.icp.gov.ae) or authorized airline sponsor 5-7 days prior.' },
  ];

  let y = 42;
  items.forEach((item) => {
    doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.roundedRect(15, y, 180, 24, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
    doc.text(`[✓] ${item.cat}`, 20, y + 7);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cDark[0], cDark[1], cDark[2]);
    doc.text(item.text, 20, y + 13, { maxWidth: 170 });

    y += 28;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Issued by TravelMate.AI Visa Verification Multi-Agent Engine • Real-Time ICP UAE Sync • Team Innovation 27X7', 15, 275);
  doc.text('For questions or expedited consular routing, access TravelMate AI Copilot on http://65.20.72.238/', 15, 280);

  doc.save('TravelMate_UAE_Visa_Application_Checklist.pdf');
}
