import uuid
from typing import Dict, Any, List
from datetime import datetime

class BookingAgent:
    """Specialized Reservations & Voucher Issuance Agent with atomic confirmation."""

    def __init__(self):
        self.name = "Autonomous Booking Agent"
        self.role = "Reservation Execution & Voucher Dispatch"

    def issue_booking(self, package_id: str, traveler_name: str, total_inr: float, payment_method: str) -> Dict[str, Any]:
        pnr = f"TM-{uuid.uuid4().hex[:6].upper()}"
        ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        
        return {
            "booking_id": str(uuid.uuid4()),
            "pnr": pnr,
            "ticket_number": ticket_id,
            "traveler_name": traveler_name,
            "package_id": package_id,
            "status": "CONFIRMED",
            "payment_status": "PAID",
            "payment_method": payment_method,
            "amount_paid_inr": total_inr,
            "issued_at": datetime.now().isoformat(),
            "qr_data": f"TRAVELMATE-AI-PASS|PNR:{pnr}|NAME:{traveler_name}|AMT:{total_inr}",
            "digital_passes": [
                {"type": "Flight Boarding Pass", "flight_number": "EK 571", "seat": "14A", "gate": "B22"},
                {"type": "Hotel Voucher", "property": "Rove Downtown", "check_in": "15 Nov 2026", "nights": 9},
                {"type": "Desert Safari Pass", "activity": "VIP Red Dune 4x4 & BBQ", "time": "15:00 18 Nov"},
                {"type": "Burj Khalifa At The Top", "time": "10:30 AM 17 Nov", "level": "Level 124+125"}
            ]
        }
