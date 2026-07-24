import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTag}>FARM-TO-BUYER COMMERCE</Text>
        <Text style={styles.cardTitle}>Connecting Farmers to Buyers, One Harvest at a Time</Text>
        <Text style={styles.cardText}>
          Protected by Interswitch Webpay Escrow & Real-Time QR Traceability.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Live Market Price Index</Text>
      <View style={styles.priceRow}>
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>White Maize (50kg)</Text>
          <Text style={styles.priceVal}>₦48,000</Text>
          <Text style={styles.priceTrend}>+6.6% Kano</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Fresh Tomatoes (25kg)</Text>
          <Text style={styles.priceVal}>₦32,000</Text>
          <Text style={styles.priceTrend}>+14.2% Plateau</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#121a16',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2d26',
    marginBottom: 20,
  },
  cardTag: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceCard: {
    flex: 1,
    backgroundColor: '#121a16',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2d26',
  },
  priceTitle: {
    color: '#9ca3af',
    fontSize: 11,
  },
  priceVal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  priceTrend: {
    color: '#22c55e',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});
