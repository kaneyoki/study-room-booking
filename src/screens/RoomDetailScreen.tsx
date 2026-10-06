// ============================================================
// RoomDetailScreen - Room info & booking entry point
// ============================================================

import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Room } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, TIME_SLOTS, SHADOWS } from '../constants/theme';
import { getBuildingColor, getEquipmentIcon, formatDate, getNext7Days } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  HomeMain: undefined;
  RoomDetail: { room: Room };
  Booking: { room: Room };
};

const RoomDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RoomDetail'>>();
  const { room } = route.params;
  const { bookings } = useBookingStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }),
    ]).start();
  }, []);

  const buildingColor = getBuildingColor(room.building);

  const todaySlots = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return TIME_SLOTS.map((slot) => {
      const isBooked = bookings.some(
        (b) =>
          b.roomId === room.id &&
          b.date === today &&
          b.timeSlotId === slot.id &&
          b.status === 'active'
      );
      return { ...slot, isBooked };
    });
  }, [bookings, room.id]);

  const availableCount = todaySlots.filter((s) => !s.isBooked).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(10,10,26,1)']}
            locations={[0, 0.4, 1]}
            style={styles.imageOverlay}
          />
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Title & Status */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.roomName}>{room.name}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{room.rating}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={buildingColor} />
              <Text style={[styles.locationText, { color: buildingColor }]}>
                Tòa {room.building} · Tầng {room.floor}
              </Text>
              <StatusBadge available={availableCount > 0} size="medium" />
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: buildingColor + '20' }]}>
                <Ionicons name="people" size={20} color={buildingColor} />
              </View>
              <Text style={styles.statValue}>{room.capacity}</Text>
              <Text style={styles.statLabel}>Sức chứa</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.available + '20' }]}>
                <Ionicons name="time" size={20} color={COLORS.available} />
              </View>
              <Text style={styles.statValue}>{availableCount}/{TIME_SLOTS.length}</Text>
              <Text style={styles.statLabel}>Slot trống</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="grid" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{room.equipment.length}</Text>
              <Text style={styles.statLabel}>Thiết bị</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Mô tả</Text>
            <Text style={styles.description}>{room.description}</Text>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛠 Thiết bị</Text>
            <View style={styles.equipmentGrid}>
              {room.equipment.map((eq) => (
                <View key={eq} style={styles.equipmentCard}>
                  <Ionicons
                    name={getEquipmentIcon(eq) as any}
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.equipmentName}>{eq}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Today's Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Lịch hôm nay</Text>
            <View style={styles.scheduleGrid}>
              {todaySlots.map((slot) => (
                <View
                  key={slot.id}
                  style={[
                    styles.scheduleSlot,
                    slot.isBooked && styles.scheduleSlotBooked,
                  ]}
                >
                  <Text
                    style={[
                      styles.scheduleTime,
                      slot.isBooked && styles.scheduleTimeBooked,
                    ]}
                  >
                    {slot.label}
                  </Text>
                  <View style={styles.scheduleStatus}>
                    <View
                      style={[
                        styles.scheduleDot,
                        {
                          backgroundColor: slot.isBooked
                            ? COLORS.occupied
                            : COLORS.available,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.scheduleStatusText,
                        {
                          color: slot.isBooked
                            ? COLORS.occupied
                            : COLORS.available,
                        },
                      ]}
                    >
                      {slot.isBooked ? 'Đã đặt' : 'Trống'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Miễn phí</Text>
          <Text style={styles.priceSubtext}>cho SV VKU</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            availableCount === 0 && styles.bookButtonDisabled,
          ]}
          onPress={() => navigation.navigate('Booking', { room })}
          disabled={availableCount === 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              availableCount > 0
                ? [COLORS.primary, COLORS.primaryDark]
                : [COLORS.textMuted, COLORS.textMuted]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookButtonGradient}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.white} />
            <Text style={styles.bookButtonText}>
              {availableCount > 0 ? 'Đặt phòng ngay' : 'Hết chỗ'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill as any,
  },
  backBtn: {
    position: 'absolute',
    top: SPACING.huge,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    marginTop: -SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  roomName: {
    flex: 1,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginRight: SPACING.md,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingText: {
    fontSize: FONT_SIZE.md,
    color: '#FFD700',
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  equipmentCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md * 3) / 4,
  },
  equipmentName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  scheduleGrid: {
    gap: SPACING.sm,
  },
  scheduleSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleSlotBooked: {
    opacity: 0.6,
    borderColor: COLORS.occupied + '40',
  },
  scheduleTime: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  scheduleTimeBooked: {
    color: COLORS.textSecondary,
  },
  scheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scheduleStatusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.lg,
  },
  priceInfo: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.available,
  },
  priceSubtext: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  bookButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.elevated,
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
  },
  bookButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default RoomDetailScreen;
