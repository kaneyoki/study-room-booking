// ============================================================
// FilterChips Component - Building, Capacity & Equipment Filters
// ============================================================

import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, BUILDINGS, EQUIPMENT_OPTIONS } from '../constants/theme';
import { Building, Equipment, Filters } from '../types';
import { getBuildingColor } from '../utils/helpers';

interface FilterChipsProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = 
    filters.buildings.length > 0 || 
    filters.equipment.length > 0 ||
    filters.minCapacity > 2 ||
    filters.maxCapacity < 20;

  const toggleBuilding = useCallback((building: Building) => {
    const current = filters.buildings;
    const updated = current.includes(building)
      ? current.filter(b => b !== building)
      : [...current, building];
    onFilterChange({ buildings: updated });
  }, [filters.buildings, onFilterChange]);

  const toggleEquipment = useCallback((equip: Equipment) => {
    const current = filters.equipment;
    const updated = current.includes(equip)
      ? current.filter(e => e !== equip)
      : [...current, equip];
    onFilterChange({ equipment: updated });
  }, [filters.equipment, onFilterChange]);

  const capacityRanges = [
    { label: '2-4', min: 2, max: 4 },
    { label: '5-10', min: 5, max: 10 },
    { label: '11-20', min: 11, max: 20 },
  ];

  const isCapacityActive = (min: number, max: number) =>
    filters.minCapacity === min && filters.maxCapacity === max;

  const toggleCapacity = useCallback((min: number, max: number) => {
    if (isCapacityActive(min, max)) {
      onFilterChange({ minCapacity: 2, maxCapacity: 20 });
    } else {
      onFilterChange({ minCapacity: min, maxCapacity: max });
    }
  }, [filters.minCapacity, filters.maxCapacity, onFilterChange]);

  return (
    <View style={styles.container}>
      {/* Building Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Reset Button */}
        {hasActiveFilters && (
          <TouchableOpacity style={styles.resetChip} onPress={onReset} activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={14} color={COLORS.secondary} />
            <Text style={styles.resetText}>Đặt lại</Text>
          </TouchableOpacity>
        )}

        {/* Building Chips */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionLabel}>Tòa</Text>
        </View>
        {BUILDINGS.map((building) => {
          const isActive = filters.buildings.includes(building.id as Building);
          const color = getBuildingColor(building.id);
          return (
            <TouchableOpacity
              key={building.id}
              style={[
                styles.chip,
                isActive && { backgroundColor: color + '30', borderColor: color },
              ]}
              onPress={() => toggleBuilding(building.id as Building)}
              activeOpacity={0.7}
            >
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={[styles.chipText, isActive && { color }]}>
                {building.id}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Capacity Chips */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionLabel}>Sức chứa</Text>
        </View>
        {capacityRanges.map((range) => {
          const isActive = isCapacityActive(range.min, range.max);
          return (
            <TouchableOpacity
              key={range.label}
              style={[
                styles.chip,
                isActive && styles.chipActive,
              ]}
              onPress={() => toggleCapacity(range.min, range.max)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="people-outline"
                size={14}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Equipment Chips */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionLabel}>Thiết bị</Text>
        </View>
        {EQUIPMENT_OPTIONS.map((equip) => {
          const isActive = filters.equipment.includes(equip.id as Equipment);
          return (
            <TouchableOpacity
              key={equip.id}
              style={[
                styles.chip,
                isActive && styles.chipActive,
              ]}
              onPress={() => toggleEquipment(equip.id as Equipment)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  equip.id === 'Projector' ? 'tv-outline' :
                  equip.id === 'Whiteboard' ? 'easel-outline' :
                  equip.id === 'High-spec PC' ? 'desktop-outline' :
                  'snow-outline'
                }
                size={14}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {equip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  sectionDivider: {
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  resetText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});

export default React.memo(FilterChips);
