// ============================================================
// RoomCard Component - Memoized for FlatList 60fps
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Room } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../constants/theme';
import { getBuildingColor, getEquipmentIcon } from '../utils/helpers';
import StatusBadge from './StatusBadge';

interface RoomCardProps {
  room: Room;
  index: number;
  availableSlots: number;
  onPress: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, index, availableSlots, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const buildingColor = getBuildingColor(room.building);
  const isAvailable = availableSlots > 0;

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(room)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageGradient}
          />
          {/* Building Badge */}
          <View style={[styles.buildingBadge, { backgroundColor: buildingColor }]}>
            <Text style={styles.buildingText}>{room.building}{room.floor}</Text>
          </View>
          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <StatusBadge available={isAvailable} />
          </View>
          {/* Capacity on image */}
          <View style={styles.capacityOnImage}>
            <Ionicons name="people" size={12} color={COLORS.white} />
            <Text style={styles.capacityImageText}>{room.capacity}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.roomName} numberOfLines={1}>
              {room.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{room.rating}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.locationText}>
              Tòa {room.building} · Tầng {room.floor}
            </Text>
          </View>

          {/* Equipment Tags */}
          <View style={styles.equipmentRow}>
            {room.equipment.map((eq) => (
              <View key={eq} style={styles.equipTag}>
                <Ionicons
                  name={getEquipmentIcon(eq) as any}
                  size={11}
                  color={COLORS.primaryLight}
                />
                <Text style={styles.equipText}>{eq}</Text>
              </View>
            ))}
          </View>

          {/* Available Slots */}
          <View style={styles.slotsRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={isAvailable ? COLORS.available : COLORS.occupied}
            />
            <Text
              style={[
                styles.slotsText,
                { color: isAvailable ? COLORS.available : COLORS.occupied },
              ]}
            >
              {isAvailable
                ? `${availableSlots} slot trống hôm nay`
                : 'Hết chỗ hôm nay'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  buildingBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  buildingText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  capacityOnImage: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  capacityImageText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    flex: 1,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: FONT_SIZE.sm,
    color: '#FFD700',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  equipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  equipText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  slotsText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});

export default React.memo(RoomCard);
