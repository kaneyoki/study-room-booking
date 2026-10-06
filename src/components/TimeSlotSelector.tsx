// ============================================================
// TimeSlotSelector Component - Interactive time slots with
// visual conflict prevention
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, TIME_SLOTS } from '../constants/theme';
import { isSlotPassed } from '../utils/helpers';

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedSlot: number | null;
  onSelectSlot: (slotId: number) => void;
  bookedSlots: number[];
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedSlot,
  onSelectSlot,
  bookedSlots,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>⏰ Chọn khung giờ</Text>
      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot) => {
          const isBooked = bookedSlots.includes(slot.id);
          const isPassed = isSlotPassed(selectedDate, slot.id);
          const isDisabled = isBooked || isPassed;
          const isSelected = selectedSlot === slot.id;

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotCard,
                isSelected && styles.slotSelected,
                isDisabled && styles.slotDisabled,
              ]}
              onPress={() => !isDisabled && onSelectSlot(slot.id)}
              activeOpacity={isDisabled ? 1 : 0.7}
              disabled={isDisabled}
            >
              {/* Status Icon */}
              <View style={styles.slotIconContainer}>
                {isBooked ? (
                  <Ionicons name="lock-closed" size={20} color={COLORS.occupied} />
                ) : isPassed ? (
                  <Ionicons name="time-outline" size={20} color={COLORS.textMuted} />
                ) : isSelected ? (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                ) : (
                  <Ionicons name="radio-button-off" size={20} color={COLORS.available} />
                )}
              </View>

              {/* Time Label */}
              <Text
                style={[
                  styles.slotTime,
                  isSelected && styles.slotTimeSelected,
                  isDisabled && styles.slotTimeDisabled,
                ]}
              >
                {slot.label}
              </Text>

              {/* Status Label */}
              <Text
                style={[
                  styles.slotStatus,
                  isBooked && styles.slotStatusBooked,
                  isPassed && styles.slotStatusPassed,
                  isSelected && styles.slotStatusSelected,
                ]}
              >
                {isBooked
                  ? '🔒 Đã đặt'
                  : isPassed
                  ? '⏳ Đã qua'
                  : isSelected
                  ? '✓ Đã chọn'
                  : '🟢 Trống'}
              </Text>

              {/* 2-hour duration indicator */}
              <Text
                style={[
                  styles.durationText,
                  isSelected && styles.durationTextSelected,
                  isDisabled && styles.durationTextDisabled,
                ]}
              >
                2 giờ
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.available }]} />
          <Text style={styles.legendText}>Trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.occupied }]} />
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.textMuted }]} />
          <Text style={styles.legendText}>Đã qua</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  slotsGrid: {
    gap: SPACING.md,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  slotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  slotDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    opacity: 0.6,
  },
  slotIconContainer: {
    width: 32,
    alignItems: 'center',
  },
  slotTime: {
    flex: 1,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  slotTimeSelected: {
    color: COLORS.white,
  },
  slotTimeDisabled: {
    color: COLORS.textMuted,
  },
  slotStatus: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.available,
    fontWeight: '600',
  },
  slotStatusBooked: {
    color: COLORS.occupied,
  },
  slotStatusPassed: {
    color: COLORS.textMuted,
  },
  slotStatusSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  durationText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  durationTextSelected: {
    color: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  durationTextDisabled: {
    color: COLORS.textMuted,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});

export default React.memo(TimeSlotSelector);
