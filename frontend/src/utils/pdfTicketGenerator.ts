import { jsPDF } from 'jspdf';
import { BookingConfirmation } from '../types';

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
  const totalPaid = booking?.totalPaidINR ? `INR ${booking.totalPaidINR.toLocaleString('en-IN')}` : 'INR 68,000';
  const paymentMethod = booking?.paymentMethod || 'UPI / Instant Verified';

  // Palette constants
  const cNavy = [15, 23, 42]; // #0f172a
  const cEmiratesRed = [215, 25, 32]; // #d71920
  const cPurple = [121, 86, 245]; // #7956f5
  const cSlate = [100, 116, 139]; // #64748b
  const cLightBg = [248, 250, 252]; // #f8fafc
  const cBorder = [226, 232, 240]; // #e2e8f0

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
  doc.text('TravelMate.AI', 15, 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('AUTONOMOUS TRAVEL COPILOT • OFFICIAL AMADEUS & IATA PARTNER', 15, 21);
  doc.text('OPERATED IN PARTNERSHIP WITH EMIRATES AIRLINE & ROVE HOTELS', 15, 26);

  // Right Header: Document Type
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ELECTRONIC TICKET PASSENGER RECEIPT', 195, 14, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(245, 158, 11); // amber
  doc.text('CONFIRMED / TICKET ISSUED', 195, 20, { align: 'right' });
  doc.setTextColor(203, 213, 225);
  doc.text(`Issue Date: ${issueDate}`, 195, 26, { align: 'right' });

  // 2. Booking Reference Card (Top summary)
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(15, 38, 180, 22, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('BOOKING REFERENCE (ID)', 20, 44);
  doc.text('AIRLINE PNR', 75, 44);
  doc.text('PASSENGER NAME', 125, 44);
  doc.text('STATUS', 170, 44);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text(bookingId, 20, 52);

  doc.setTextColor(cEmiratesRed[0], cEmiratesRed[1], cEmiratesRed[2]);
  doc.text(pnr, 75, 52);

  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.setFontSize(10);
  doc.text(passenger, 125, 52);

  doc.setTextColor(16, 185, 129); // emerald
  doc.text('VALID (E-GATE)', 170, 52);

  // 3. Flight Itinerary Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('FLIGHT SEGMENT 1 • OUTBOUND DEPARTURE', 15, 68);

  // Flight Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(15, 72, 180, 54, 3, 3, 'FD');

  // Flight Airline Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 72, 180, 9, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cEmiratesRed[0], cEmiratesRed[1], cEmiratesRed[2]);
  doc.text('EMIRATES • FLIGHT EK 571', 20, 78);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('AIRCRAFT: BOEING 777-300ER • OPERATED BY EMIRATES', 100, 78);
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text('NON-STOP (5H 05M)', 190, 78, { align: 'right' });

  // Departure Block (CCU)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('CCU', 25, 92);
  doc.setFontSize(9);
  doc.text('09:45 AM', 25, 98);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('15 Nov 2026', 25, 103);
  doc.text('Kolkata Netaji Subhash (Terminal 2)', 25, 108);

  // Airplane flight route icon
  doc.setDrawColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.setLineWidth(0.8);
  doc.line(75, 95, 120, 95);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.text('➔ DIRECT ➔', 90, 93);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.setFontSize(7);
  doc.text('3,380 KM FLIGHT PATH', 85, 100);

  // Arrival Block (DXB)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('DXB', 140, 92);
  doc.setFontSize(9);
  doc.text('01:20 PM', 140, 98);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('15 Nov 2026', 140, 103);
  doc.text('Dubai International (Terminal 3)', 140, 108);

  // Sub-details: Seat, Class, Gate, Baggage
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.rect(15, 114, 180, 12, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('SEAT NUMBER', 22, 118);
  doc.text('CABIN CLASS', 60, 118);
  doc.text('BOARDING TIME', 98, 118);
  doc.text('DEPARTURE GATE', 136, 118);
  doc.text('BAGGAGE ALLOWANCE', 165, 118);

  doc.setFontSize(8);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('14A (Window)', 22, 123);
  doc.text('Economy (Y)', 60, 123);
  doc.text('08:50 AM (Zone B)', 98, 123);
  doc.text('Gate B22', 136, 123);
  doc.text('30 KG Check-in + 7 KG Cabin', 165, 123);

  // 4. Hotel Basecamp Voucher
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('ACCOMMODATION VOUCHER • CONFIRMED HOTEL STAY', 15, 136);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(15, 140, 180, 36, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('Rove Downtown Dubai', 22, 148);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Downtown Dubai, Financial Centre Road • Overlooking Burj Khalifa', 22, 153);
  doc.text('Room: Rover Room (Burj Khalifa View) • Free Gourmet Breakfast & Wi-Fi', 22, 158);

  doc.setFont('helvetica', 'bold');
  doc.text('CHECK-IN: 15 Nov 2026 (14:00)', 22, 166);
  doc.text('CHECK-OUT: 24 Nov 2026 (12:00)', 85, 166);
  doc.text('DURATION: 9 Nights Stay', 145, 166);

  doc.setFontSize(7);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('CONFIRMATION #ROVE-DXB-99824 • GUARANTEED LATE ARRIVAL', 22, 172);

  // 5. Payment Breakdown & Security
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('PAYMENT RECEIPT & FARE BREAKDOWN', 15, 186);

  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(15, 190, 180, 30, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text('Flights Subtotal (CCU-DXB Return, Emirates EK 571):', 22, 197);
  doc.text('INR 32,500.00', 188, 197, { align: 'right' });

  doc.text('Hotel Subtotal (9 Nights, Rove Downtown Burj View):', 22, 203);
  doc.text('INR 40,500.00', 188, 203, { align: 'right' });

  doc.text('Promotional Discount (COPILOT20):', 22, 209);
  doc.setTextColor(16, 185, 129);
  doc.text('-INR 5,000.00', 188, 209, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('Total Amount Paid (Inclusive of all UAE VAT & Airport Fees):', 22, 216);
  doc.setFontSize(10);
  doc.text(totalPaid, 188, 216, { align: 'right' });

  // 6. Barcode & Boarding Pass Gate Stub
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(15, 226, 180, 38, 3, 3, 'FD');

  // Simulated High-Res Barcode Lines
  doc.setFillColor(0, 0, 0);
  let xPos = 22;
  const barPattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 1, 3, 2, 2, 1, 3, 1, 4, 2, 1, 2, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 1, 3];
  for (let i = 0; i < barPattern.length; i++) {
    const w = barPattern[i] * 0.75;
    doc.rect(xPos, 232, w, 16, 'F');
    xPos += w + 0.8;
  }

  doc.setFontSize(7);
  doc.setFont('courier', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`*M1${passenger.toUpperCase()}/RANJEET  EEK${pnr} CCUDXBEK 0571 319Y014A0022 100*`, 22, 252);

  // E-Gate Verification Box
  doc.setFillColor(cPurple[0], cPurple[1], cPurple[2]);
  doc.roundedRect(145, 230, 45, 30, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DXB SMART GATES', 167, 237, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Biometric E-Gate Pass', 167, 242, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PASS APPROVED', 167, 250, { align: 'center' });
  doc.setFontSize(6);
  doc.text('Scan barcode or passport', 167, 255, { align: 'center' });

  // 7. Legal Disclaimer & Emergency Contact Footer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text(
    'IMPORTANT NOTICE: Passengers are advised to report to the airport terminal at least 3 hours prior to departure. Boarding gate closes strictly 20 minutes before takeoff. This e-ticket is issued in accordance with IATA Resolution 722. Carriage and other services provided by the carrier are subject to conditions of carriage.',
    15,
    270,
    { maxWidth: 180 }
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('24/7 Global SOS Helpline: +971 4 214 4444 • Emirates Concierge Support • TravelMate AI 256-Bit Vault Verified', 15, 282);

  // Save the PDF
  const filename = `TravelMate_ETicket_${bookingId}.pdf`;
  doc.save(filename);
}
