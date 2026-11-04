import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Bell, 
  Sparkles, 
  MapPin, 
  Car, 
  Bike, 
  Plane, 
  Building2, 
  Heart, 
  Star,
  ChevronRight,
  Luggage,
  Navigation
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<string[]>(['1']);

  const quickServices = [
    { id: '1', title: 'Packages', icon: Luggage, color: '#7956F5', bg: '#F3E8FF' },
    { id: '2', title: 'Cabs', icon: Car, color: '#3478F6', bg: '#EFF6FF' },
    { id: '3', title: 'Self Drive', icon: Navigation, color: '#10B981', bg: '#ECFDF5' },
    { id: '4', title: 'Bikes', icon: Bike, color: '#F59E0B', bg: '#FEF3C7' },
    { id: '5', title: 'Flights', icon: Plane, color: '#0EA5E9', bg: '#F0F9FF' },
    { id: '6', title: 'Hotels', icon: Building2, color: '#F43F5E', bg: '#FFF1F2' },
  ];

  const packages = [
    {
      id: 'p1',
      title: 'Dubai Luxury Getaway',
      duration: '5D / 4N',
      price: '₹45,999',
      rating: 4.8,
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      title: 'Goa Coastal Serenity',
      duration: '4D / 3N',
      price: '₹14,999',
      rating: 4.9,
      badge: 'Weekend Special',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p3',
      title: 'Bali Island Honeymoon',
      duration: '6D / 5N',
      price: '₹58,000',
      rating: 4.9,
      badge: 'Romantic',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const toggleLike = (id: string) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hi, Ranjeet! 👋</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#F43F5E" />
                <Text style={styles.locationText}>Dhanbad, Jharkhand</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.bellButton}>
            <Bell size={20} color="#101B35" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar} 
          activeOpacity={0.8}
          onPress={() => router.push('/explore')}
        >
          <Search size={18} color="#94A3B8" />
          <Text style={styles.searchPlaceholder}>Where would you like to travel next?</Text>
        </TouchableOpacity>

        {/* AI Travel Copilot Hero Banner */}
        <TouchableOpacity 
          style={styles.copilotBanner} 
          activeOpacity={0.9}
          onPress={() => router.push('/copilot')}
        >
          <View style={styles.copilotBadge}>
            <Sparkles size={12} color="#FDE047" />
            <Text style={styles.copilotBadgeText}>AI TRAVEL COPILOT</Text>
          </View>
          <Text style={styles.copilotTitle}>Plan with Autonomous Agents</Text>
          <Text style={styles.copilotSubtitle}>Flights, stays & day-by-day plans in seconds</Text>

          <View style={styles.copilotPillRow}>
            <View style={styles.copilotPill}>
              <Text style={styles.copilotPillText}>✈️ Dubai 10 Days</Text>
            </View>
            <View style={styles.copilotPill}>
              <Text style={styles.copilotPillText}>🚕 Ranchi Cab</Text>
            </View>
            <View style={styles.copilotPill}>
              <Text style={styles.copilotPillText}>🏖️ Goa Resort</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Services Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUICK SERVICES</Text>
          <Text style={styles.teamTag}>Innovation 27X7</Text>
        </View>

        <View style={styles.servicesGrid}>
          {quickServices.map(svc => {
            const Icon = svc.icon;
            return (
              <TouchableOpacity
                key={svc.id}
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() => router.push('/packages')}
              >
                <View style={[styles.serviceIconWrap, { backgroundColor: svc.bg }]}>
                  <Icon size={22} color={svc.color} />
                </View>
                <Text style={styles.serviceTitle}>{svc.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Holiday Packages Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleDark}>Exclusive Packages</Text>
          <TouchableOpacity onPress={() => router.push('/packages')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {packages.map(pkg => (
            <TouchableOpacity 
              key={pkg.id} 
              style={styles.packageCard} 
              activeOpacity={0.9}
              onPress={() => router.push('/packages')}
            >
              <Image source={{ uri: pkg.image }} style={styles.packageImage} />
              <View style={styles.badgeOverlay}>
                <Text style={styles.badgeText}>{pkg.badge}</Text>
              </View>
              <View style={styles.packageContent}>
                <Text style={styles.packageDuration}>{pkg.duration}</Text>
                <Text style={styles.packageTitle} numberOfLines={1}>{pkg.title}</Text>
                <View style={styles.packagePriceRow}>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                  <View style={styles.ratingRow}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{pkg.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#7956F5' },
  greeting: { fontSize: 16, fontWeight: '800', color: '#101B35' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  bellButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#101B35', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  searchPlaceholder: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  copilotBanner: { backgroundColor: '#101B35', borderRadius: 24, padding: 18, marginBottom: 20, shadowColor: '#7956F5', shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  copilotBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  copilotBadgeText: { color: '#FDE047', fontSize: 10, fontWeight: '800' },
  copilotTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  copilotSubtitle: { color: '#CBD5E1', fontSize: 12, marginBottom: 12 },
  copilotPillRow: { flexDirection: 'row', gap: 8 },
  copilotPill: { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  copilotPillText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
  sectionTitleDark: { fontSize: 16, fontWeight: '800', color: '#101B35' },
  teamTag: { fontSize: 10, fontWeight: '700', color: '#7956F5' },
  seeAllText: { fontSize: 12, fontWeight: '700', color: '#7956F5' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 20 },
  serviceCard: { width: '31%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, alignItems: 'center', shadowColor: '#101B35', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  serviceIconWrap: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceTitle: { fontSize: 12, fontWeight: '700', color: '#101B35' },
  carousel: { gap: 14, paddingRight: 16 },
  packageCard: { width: 220, backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#101B35', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  packageImage: { width: '100%', height: 120 },
  badgeOverlay: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(16,27,53,0.7)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  packageContent: { padding: 12 },
  packageDuration: { fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' },
  packageTitle: { fontSize: 13, fontWeight: '800', color: '#101B35', marginVertical: 4 },
  packagePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  packagePrice: { fontSize: 14, fontWeight: '800', color: '#7956F5' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
});
