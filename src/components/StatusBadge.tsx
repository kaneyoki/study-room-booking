// ============================================================
// StatusBadge Component - Room availability indicator
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants/theme';

interface StatusBadgeProps {
  available: boolean;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ available, size = 'small' }) => {
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        { backgroundColor: available ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 107, 107, 0.15)' },
        { borderColor: available ? COLORS.available : COLORS.occupied },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: available ? COLORS.available : COLORS.occupied },
        ]}
      />
      <Text
        style={[
          styles.text,
          isSmall ? styles.textSmall : styles.textMedium,
          { color: available ? COLORS.available : COLORS.occupied },
        ]}
      >
        {available ? 'Còn trống' : 'Đã đặt'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  badgeSmall: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  badgeMedium: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: FONT_SIZE.xs,
  },
  textMedium: {
    fontSize: FONT_SIZE.sm,
  },
});

export default React.memo(StatusBadge);
