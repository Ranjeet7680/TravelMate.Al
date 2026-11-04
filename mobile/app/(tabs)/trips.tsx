import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plane, QrCode, Clock, MapPin, X } from 'lucide-react-native';

export default function TripsScreen() {
  const [showPass, setShowPass] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>
          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingText}>1 UPCOMING</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          {/* Active Trip Card */}
          <View style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>Confirmed Itinerary</Text>
              </View>
              <Text style={styles.countdown}>11 Days Away</Text>
            </View>

            <Text style={styles.tripTitle}>Dubai Adventure</Text>
            <Text style={styles.tripDates}>15 Nov 2026 – 24 Nov 2026 (10 Days)</Text>

            <View style={styles.routeRow}>
              <View>
                <Text style={styles.cityCode}>CCU</Text>
                <Text style={styles.cityName}>Kolkata (via Dhanbad)</Text>
              </View>
              <Plane size={18} color="#38BDF8" style={{ transform: [{ rotate: '45deg' }] }} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cityCode}>DXB</Text>
                <Text style={styles.cityName}>Dubai International</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>PNR</Text>
                <Text style={styles.metaValue}>EK-948123</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Total Budget</Text>
                <Text style={styles.metaValue}>₹97,000</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.passBtn}
              onPress={() => setShowPass(true)}
            >
              <QrCode size={16} color="#7956F5" />
              <Text style={styles.passBtnText}>View Digital Boarding Pass</Text>
            </TouchableOpacity>
          </View>

          {/* Budget Meter */}
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>Trip Budget Status</Text>
              <Text style={styles.budgetProgress}>₹97,000 / ₹1,20,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.budgetNote}>Amadeus GDS price freeze locked for 48 hours</Text>
          </View>

          {/* Completed Trips */}
          <Text style={styles.pastHeading}>COMPLETED TRIPS</Text>
          <View style={styles.pastCard}>
            <View>
              <Text style={styles.pastTitle}>Goa Beach Getaway</Text>
              <Text style={styles.pastDates}>12 Feb – 16 Feb 2026</Text>
            </View>
            <Text style={styles.pastAmount}>₹22,400</Text>
          </View>

        </ScrollView>

        {/* Boarding Pass Modal */}
        <Modal visible={showPass} transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPass(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
              
              <Text style={styles.modalHeading}>Boarding Pass</Text>
              <Text style={styles.modalAirline}>Emirates EK 571 • CCU ➔ DXB</Text>

              <View style={styles.qrPlaceholder}>
                <QrCode size={120} color="#101B35" />
                <Text style={styles.qrCodeText}>EK948123-CCU-DXB-2026</Text>
              </View>

              <TouchableOpacity style={styles.closePassBtn} onPress={() => setShowPass(false)}>
                <Text style={styles.closePassBtnText}>Close Pass</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#101B35' },
  upcomingBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  upcomingText: { fontSize: 10, fontWeight: '800', color: '#10B981' },
  scroll: { gap: 16, paddingBottom: 100 },
  tripCard: { backgroundColor: '#101B35', borderRadius: 24, padding: 18, shadowColor: '#101B35', shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusPill: { backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#FDE047', fontSize: 10, fontWeight: '800' },
  countdown: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  tripTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  tripDates: { fontSize: 12, color: '#94A3B8', marginTop: 2, marginBottom: 16 },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cityCode: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  cityName: { fontSize: 10, color: '#94A3B8' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14 },
  metaLabel: { fontSize: 10, color: '#94A3B8' },
  metaValue: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  passBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 16 },
  passBtnText: { color: '#101B35', fontSize: 12, fontWeight: '800' },
  budgetCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#101B35', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetTitle: { fontSize: 13, fontWeight: '800', color: '#101B35' },
  budgetProgress: { fontSize: 12, fontWeight: '800', color: '#7956F5' },
  progressBar: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { width: '80%', height: '100%', backgroundColor: '#7956F5', borderRadius: 3 },
  budgetNote: { fontSize: 10, color: '#94A3B8', marginTop: 8 },
  pastHeading: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginTop: 4 },
  pastCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  pastTitle: { fontSize: 13, fontWeight: '800', color: '#101B35' },
  pastDates: { fontSize: 11, color: '#94A3B8' },
  pastAmount: { fontSize: 13, fontWeight: '800', color: '#101B35' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  modalHeading: { fontSize: 18, fontWeight: '800', color: '#101B35', marginTop: -10 },
  modalAirline: { fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 20 },
  qrPlaceholder: { padding: 20, backgroundColor: '#F8FAFC', borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  qrCodeText: { fontSize: 10, color: '#94A3B8', fontFamily: 'monospace', marginTop: 8 },
  closePassBtn: { backgroundColor: '#101B35', width: '100%', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  closePassBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
