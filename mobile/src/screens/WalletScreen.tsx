import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export const WalletScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.walletCard}>
        <Text style={styles.walletTag}>AGREIN DIGITAL WALLET</Text>
        <Text style={styles.balance}>₦450,000.00</Text>
        <Text style={styles.escrowNote}>₦120,000 Held in Interswitch Escrow</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  walletCard: { backgroundColor: '#121a16', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#22c55e' },
  walletTag: { color: '#22c55e', fontSize: 10, fontWeight: '800' },
  balance: { color: '#ffffff', fontSize: 32, fontWeight: '800', marginTop: 8 },
  escrowNote: { color: '#f59e0b', fontSize: 12, marginTop: 4 },
});
