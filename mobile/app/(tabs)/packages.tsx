import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, ShieldCheck, Check } from 'lucide-react-native';

export default function PackagesScreen() {
  const [tab, setTab] = useState<'packages' | 'cabs' | 'cars' | 'bikes'>('packages');

  const packages = [
    { id: '1', title: 'Golden Triangle Heritage', days: '6D / 5N', price: '₹28,500', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80' },
    { id: '2', title: 'Kerala Backwaters & Hills', days: '5D / 4N', price: '₹22,999', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
    { id: '3', title: 'Kashmir Valley Paradise', days: '7D / 6N', price: '₹34,500', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80' },
  ];

  const mobility = [
    { id: 'm1', name: 'Dzire / Etios AC Sedan', cat: 'cabs', price: '₹12/km', subtitle: 'Airport & Outstation from Dhanbad', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
    { id: 'm2', name: 'Ertiga 6-Seater SUV', cat: 'cabs', price: '₹16/km', subtitle: 'Family Travel with Luggage Carrier', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' },
    { id: 'm3', name: 'Royal Enfield Himalayan', cat: 'bikes', price: '₹1,400/day', subtitle: 'Manali, Leh & Goa adventure', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80' },
    { id: 'm4', name: 'Honda Activa 6G', cat: 'bikes', price: '₹450/day', subtitle: 'Goa & Local sightseeing scooter', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Packages & Rentals</Text>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.verifiedText}>Verified Partners</Text>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsRow}>
          {(['packages', 'cabs', 'cars', 'bikes'] as const).map(t => (
            <TouchableOpacity 
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'packages' ? 'Holiday' : t === 'cabs' ? 'Cabs' : t === 'cars' ? 'Cars' : 'Bikes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {tab === 'packages' ? (
            packages.map(p => (
              <View key={p.id} style={styles.card}>
                <Image source={{ uri: p.image }} style={styles.cardImage} />
                <View style={styles.cardBody}>
                  <Text style={styles.days}>{p.days}</Text>
                  <Text style={styles.cardTitle}>{p.title}</Text>
                  <View style={styles.bottomRow}>
                    <Text style={styles.price}>{p.price}</Text>
                    <TouchableOpacity style={styles.bookBtn}>
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            mobility.filter(m => m.cat === tab || (tab === 'cars' && m.cat === 'cabs')).map(m => (
              <View key={m.id} style={styles.mobilityCard}>
                <Image source={{ uri: m.image }} style={styles.mobilityImage} />
                <View style={styles.mobilityBody}>
                  <Text style={styles.mobilityTitle}>{m.name}</Text>
                  <Text style={styles.mobilitySub}>{m.subtitle}</Text>
                  <View style={styles.bottomRow}>
                    <Text style={styles.mobilityPrice}>{m.price}</Text>
                    <TouchableOpacity style={styles.selectBtn}>
                      <Text style={styles.selectBtnText}>Reserve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#101B35' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { fontSize: 10, fontWeight: '700', color: '#10B981' },
  tabsRow: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 16, padding: 3, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12 },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#101B35', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  tabText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#101B35', fontWeight: '800' },
  list: { gap: 14, paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#101B35', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardImage: { width: '100%', height: 130 },
  cardBody: { padding: 14 },
  days: { fontSize: 10, fontWeight: '700', color: '#7956F5', textTransform: 'uppercase' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#101B35', marginVertical: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 16, fontWeight: '800', color: '#101B35' },
  bookBtn: { backgroundColor: '#7956F5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  bookBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  mobilityCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, gap: 12, alignItems: 'center', shadowColor: '#101B35', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  mobilityImage: { width: 75, height: 75, borderRadius: 16 },
  mobilityBody: { flex: 1 },
  mobilityTitle: { fontSize: 13, fontWeight: '800', color: '#101B35' },
  mobilitySub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  mobilityPrice: { fontSize: 13, fontWeight: '800', color: '#10B981' },
  selectBtn: { backgroundColor: '#F3E8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  selectBtnText: { color: '#7956F5', fontSize: 10, fontWeight: '700' },
});
