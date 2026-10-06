// ============================================================
// DateSelector Component - 7-day horizontal date picker
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants/theme';
import { getDayName, isToday, formatDateShort } from '../utils/helpers';

interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>📅 Chọn ngày</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date) => {
          const isSelected = date === selectedDate;
          const today = isToday(date);
          const dayName = getDayName(date);
          const dayNum = new Date(date).getDate();

          return (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateItem,
                isSelected && styles.dateItemSelected,
                today && !isSelected && styles.dateItemToday,
              ]}
              onPress={() => onSelectDate(date)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected && styles.dayNameSelected,
                ]}
              >
                {today ? 'Nay' : dayName}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  isSelected && styles.dayNumSelected,
                ]}
              >
                {dayNum}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  isSelected && styles.monthTextSelected,
                ]}
              >
                {formatDateShort(date).split('/')[1]}
              </Text>
              {isSelected && <View style={styles.selectedDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  dateItem: {
    width: 64,
    height: 88,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateItemToday: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  dayName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  dayNum: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.text,
    fontWeight: '700',
  },
  dayNumSelected: {
    color: COLORS.white,
  },
  monthText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  monthTextSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    marginTop: 2,
  },
});

export default React.memo(DateSelector);
