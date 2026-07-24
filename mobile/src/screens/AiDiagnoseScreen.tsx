import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export const AiDiagnoseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Crop Disease Scanner</Text>
      <Text style={styles.desc}>Snap a photo of your leaf to diagnose pests or diseases instantly.</Text>
      <TouchableOpacity style={styles.scanBtn}>
        <Text style={styles.scanBtnText}>Open Camera Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  desc: { color: '#9ca3af', fontSize: 12, textAlign: 'center', marginBottom: 24 },
  scanBtn: { backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  scanBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
