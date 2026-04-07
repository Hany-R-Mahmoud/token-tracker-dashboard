import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface BrandMarkProps {
  size?: number;
}

export function BrandMark({ size = 28 }: BrandMarkProps) {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={{ width: size, height: size, borderRadius: size * 0.22 }}
      resizeMode="contain"
    />
  );
}

interface BrandLockupProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLockup({ size = 'md' }: BrandLockupProps) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 40 : 28;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  const subSize = size === 'sm' ? 8 : size === 'lg' ? 10 : 9;

  return (
    <View style={styles.lockup}>
      <BrandMark size={markSize} />
      <View style={styles.wordmark}>
        <Text style={[styles.name, { fontSize }]}>Token Tracker</Text>
        <Text style={[styles.sub, { fontSize: subSize }]}>SURFACE TRUTH ENGINE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    flexDirection: 'column',
  },
  name: {
    color: colors.textPrimary,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: -0.3,
  },
  sub: {
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.8,
    marginTop: 1,
  },
});
