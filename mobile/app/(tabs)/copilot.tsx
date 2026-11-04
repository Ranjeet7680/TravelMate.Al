import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Send, Mic, Sparkles } from 'lucide-react-native';

export default function CopilotScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "Namaste Ranjeet! 👋 I'm your TravelMate AI Copilot. Where would you like to travel?",
      time: '9:40 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'Plan a 10-day trip from Dhanbad to Dubai for ₹97,000.',
      time: '9:41 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: "Great choice! 🌴 Here is your Dubai plan:\n\n✈️ Flights: via Kolkata (CCU) – ₹32,500\n🏨 Hotel: 4-Star Downtown – ₹4,500/nt\n🛂 Visa: Pre-arranged 30-day eVisa\n💰 Budget: ₹97,000\n\nReady to book or customize Day 1?",
      time: '9:41 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: '9:42 AM',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: lang === 'hi' 
            ? 'आपकी यात्रा के लिए सबसे बेहतरीन विकल्प खोजे जा रहे हैं।'
            : `Analyzing live availability for "${text}". Flight and hotel agents synchronized with Amadeus GDS.`,
          time: '9:42 AM',
        },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.botIconWrap}>
              <Bot size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Travel Copilot</Text>
              <Text style={styles.headerSubtitle}>13 Autonomous Agents Active</Text>
            </View>
          </View>

          <View style={styles.langToggle}>
            <TouchableOpacity 
              onPress={() => setLang('en')}
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
            >
              <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setLang('hi')}
              style={[styles.langBtn, lang === 'hi' && styles.langBtnActive]}
            >
              <Text style={[styles.langText, lang === 'hi' && styles.langTextActive]}>हिन्दी</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Thread */}
        <ScrollView contentContainerStyle={styles.messageList} showsVerticalScrollIndicator={false}>
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <View 
                key={msg.id} 
                style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}
              >
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                  <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
                    {msg.text}
                  </Text>
                </View>
                <Text style={styles.timeText}>{msg.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {['Plan 10 Days in Dubai', 'Dhanbad to Ranchi Cab', 'Goa Budget Stays'].map((chip, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.chip}
              onPress={() => sendMessage(chip)}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.micBtn}>
            <Mic size={20} color="#7956F5" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={lang === 'hi' ? 'यात्रा के बारे में पूछें...' : 'Ask Copilot anything...'}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botIconWrap: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#7956F5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#101B35' },
  headerSubtitle: { fontSize: 11, color: '#10B981', fontWeight: '600' },
  langToggle: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 2 },
  langBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  langBtnActive: { backgroundColor: '#7956F5' },
  langText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  langTextActive: { color: '#FFFFFF' },
  messageList: { padding: 16, gap: 14, paddingBottom: 20 },
  messageRow: { maxWidth: '85%' },
  userRow: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  aiRow: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: '#7956F5', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 13, lineHeight: 20 },
  userText: { color: '#FFFFFF', fontWeight: '500' },
  aiText: { color: '#101B35', fontWeight: '500' },
  timeText: { fontSize: 9, color: '#94A3B8', marginTop: 4, paddingHorizontal: 4 },
  chipsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  chip: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 10 },
  micBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 13, color: '#101B35', borderWidth: 1, borderColor: '#E2E8F0' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7956F5', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
});
