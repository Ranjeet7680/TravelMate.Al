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
import { Search, Heart, Star, MapPin } from 'lucide-react-native';

export default function ExploreScreen() {
  const [region, setRegion] = useState<'all' | 'india' | 'world'>('all');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<string[]>([]);

  const destinations = [
    { id: '1', name: 'Dubai', country: 'United Arab Emirates', price: '₹9,700/day', rating: 4.8, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', isIndia: false },
    { id: '2', name: 'Goa', country: 'India', price: '₹3,500/day', rating: 4.8, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', isIndia: true },
    { id: '3', name: 'Netarhat', country: 'Jharkhand, India', price: '₹2,200/day', rating: 4.6, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', isIndia: true },
    { id: '4', name: 'Bali', country: 'Indonesia', price: '₹5,800/day', rating: 4.7, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', isIndia: false },
    { id: '5', name: 'Manali', country: 'Himachal, India', price: '₹3,800/day', rating: 4.7, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', isIndia: true },
    { id: '6', name: 'Paris', country: 'France', price: '₹14,500/day', rating: 4.9, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', isIndia: false },
  ];

  const filtered = destinations.filter(d => {
    const matchReg = region === 'all' ? true : region === 'india' ? d.isIndia : !d.isIndia;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    return matchReg && matchSearch;
  });

  const toggleLike = (id: string) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Explore Destinations</Text>
          <Text style={styles.count}>{filtered.length} Places</Text>
        </View>

        {/* Region Tabs */}
        <View style={styles.regionTabs}>
          {(['all', 'india', 'world'] as const).map(r => (
            <TouchableOpacity 
              key={r}
              onPress={() => setRegion(r)}
              style={[styles.regionTab, region === r && styles.regionTabActive]}
            >
              <Text style={[styles.regionText, region === r && styles.regionTextActive]}>
                {r === 'all' ? 'All' : r === 'india' ? '🇮🇳 India' : '🌍 World'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by city, state, or country..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Grid */}
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {filtered.map(dest => {
            const isLiked = liked.includes(dest.id);
            return (
              <View key={dest.id} style={styles.card}>
                <Image source={{ uri: dest.image }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.heartBtn} 
                  onPress={() => toggleLike(dest.id)}
                >
                  <Heart size={16} color={isLiked ? '#EF4444' : '#FFFFFF'} fill={isLiked ? '#EF4444' : 'transparent'} />
                </TouchableOpacity>

                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.destName} numberOfLines={1}>{dest.name}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{dest.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.countryText} numberOfLines={1}>{dest.country}</Text>
                  <Text style={styles.priceText}>{dest.price}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { flex: 1, padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#101B35' },
  count: { fontSize: 12, fontWeight: '700', color: '#7956F5' },
  regionTabs: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 16, padding: 3, marginBottom: 12 },
  regionTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12 },
  regionTabActive: { backgroundColor: '#FFFFFF', shadowColor: '#101B35', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  regionText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  regionTextActive: { color: '#101B35', fontWeight: '800' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  input: { flex: 1, fontSize: 13, color: '#101B35' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, paddingBottom: 100 },
  card: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#101B35', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  image: { width: '100%', height: 110 },
  heartBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.4)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  destName: { fontSize: 13, fontWeight: '800', color: '#101B35', flex: 1 },
  countryText: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  priceText: { fontSize: 12, fontWeight: '800', color: '#10B981', marginTop: 6 },
});
