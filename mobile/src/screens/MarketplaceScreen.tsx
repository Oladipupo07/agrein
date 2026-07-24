import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export const MarketplaceScreen = () => {
  const items = [
    { title: 'Grade-A White Maize', price: '₦48,000 / bag', farmer: 'GreenPastures Kano' },
    { title: 'Plum Tomatoes (25kg)', price: '₦32,000 / basket', farmer: 'SunRays Jos' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Direct Farm Catalog</Text>
      {items.map((item, idx) => (
        <View key={idx} style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemFarmer}>{item.farmer}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>Buy via Interswitch Escrow</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  itemCard: { backgroundColor: '#121a16', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2d26', marginBottom: 12 },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  itemFarmer: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  itemPrice: { color: '#22c55e', fontSize: 16, fontWeight: '800', marginTop: 8 },
  buyBtn: { backgroundColor: '#16a34a', paddingVertical: 10, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
