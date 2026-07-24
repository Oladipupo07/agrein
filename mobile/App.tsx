import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { MarketplaceScreen } from './src/screens/MarketplaceScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { AiDiagnoseScreen } from './src/screens/AiDiagnoseScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'market' | 'wallet' | 'ai'>('home');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AGREIN MOBILE</Text>
        <Text style={styles.headerSubtitle}>Interswitch Escrow Secured</Text>
      </View>

      {/* Screen Content */}
      <View style={styles.content}>
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'market' && <MarketplaceScreen />}
        {currentTab === 'wallet' && <WalletScreen />}
        {currentTab === 'ai' && <AiDiagnoseScreen />}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'market', label: 'Market' },
          { id: 'wallet', label: 'Wallet' },
          { id: 'ai', label: 'AI Scan' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.navItem, currentTab === tab.id && styles.navItemActive]}
            onPress={() => setCurrentTab(tab.id as any)}
          >
            <Text style={[styles.navText, currentTab === tab.id && styles.navTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f0d',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2d26',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#86efac',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1f2d26',
    backgroundColor: '#121a16',
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#22c55e',
  },
  navText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#22c55e',
  },
});
