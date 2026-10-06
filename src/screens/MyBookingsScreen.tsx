// ============================================================
// MyBookingsScreen - Active & Past Bookings with QR viewer
// ============================================================

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../constants/theme';
import { formatDate, getBuildingColor, getRelativeTime } from '../utils/helpers';
import QRCodeModal from '../components/QRCodeModal';

type TabType = 'active' | 'past';

const MyBookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQR, setShowQR] = useState(false);
  const { getActiveBookings, getPastBookings, cancelBooking } = useBookingStore();

  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  const activeBookings = useMemo(() => getActiveBookings(), [getActiveBookings]);
  const pastBookings = useMemo(() => getPastBookings(), [getPastBookings]);
  const data = activeTab === 'active' ? activeBookings : pastBookings;

  const switchTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    Animated.spring(tabIndicatorAnim, {
      toValue: tab === 'active' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, []);

  const handleCancel = useCallback(
    (booking: Booking) => {
      Alert.alert(
        'Hủy đặt phòng',
        `Bạn có chắc muốn hủy phòng ${booking.roomName} vào ${formatDate(booking.date)}?`,
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Hủy phòng',
            style: 'destructive',
            onPress: () => cancelBooking(booking.id),
          },
        ]
      );
    },
    [cancelBooking]
  );

  const handleViewQR = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setShowQR(true);
  }, []);

  const renderBookingCard = useCallback(
    ({ item, index }: { item: Booking; index: number }) => {
      const buildingColor = getBuildingColor(item.building);
      const isActive = item.status === 'active';
      const isCancelled = item.status === 'cancelled';

      return (
        <Animated.View style={styles.cardWrapper}>
          <View
            style={[
              styles.card,
              isCancelled && styles.cardCancelled,
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.buildingIndicator, { backgroundColor: buildingColor }]} />
              <View style={styles.cardHeaderContent}>
                <Text style={styles.cardRoomName} numberOfLines={1}>
                  {item.roomName}
                </Text>
                <Text style={styles.cardLocation}>
                  Tòa {item.building} · Tầng {item.floor}
                </Text>
              </View>
              <View
                style={[
                  styles.statusChip,
                  {
                    backgroundColor:
                      isActive
                        ? COLORS.available + '20'
                        : isCancelled
                        ? COLORS.occupied + '20'
                        : COLORS.textMuted + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isActive
                        ? COLORS.available
                        : isCancelled
                        ? COLORS.occupied
                        : COLORS.textMuted,
                    },
                  ]}
                >
                  {isActive ? 'Đang hoạt động' : isCancelled ? 'Đã hủy' : 'Hoàn thành'}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.cardDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>{formatDate(item.date)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.accent} />
                <Text style={styles.detailText}>{item.timeSlotLabel}</Text>
              </View>
              {isActive && (
                <View style={styles.detailItem}>
                  <Ionicons name="alarm-outline" size={16} color={COLORS.secondary} />
                  <Text style={[styles.detailText, { color: COLORS.secondary }]}>
                    {getRelativeTime(item.date + 'T' + item.startTime)}
                  </Text>
                </View>
              )}
            </View>

            {/* Booking ID */}
            <View style={styles.bookingIdRow}>
              <Ionicons name="ticket-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.bookingIdText}>{item.id}</Text>
            </View>

            {/* Action Buttons */}
            {isActive && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => handleViewQR(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="qr-code-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.qrButtonText}>Xem QR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle-outline" size={18} color={COLORS.secondary} />
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      );
    },
    [handleCancel, handleViewQR]
  );

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name={activeTab === 'active' ? 'calendar-outline' : 'archive-outline'}
          size={64}
          color={COLORS.textMuted}
        />
        <Text style={styles.emptyTitle}>
          {activeTab === 'active' ? 'Chưa có lịch đặt' : 'Chưa có lịch sử'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {activeTab === 'active'
            ? 'Đặt phòng học ngay từ trang chủ'
            : 'Lịch sử đặt phòng sẽ hiển thị ở đây'}
        </Text>
      </View>
    ),
    [activeTab]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary + '20', COLORS.background]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Lịch đặt phòng</Text>
        <Text style={styles.headerSubtitle}>
          {activeBookings.length} phòng đang hoạt động
        </Text>
      </LinearGradient>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => switchTab('active')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="flash-outline"
            size={16}
            color={activeTab === 'active' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Đang hoạt động
          </Text>
          {activeBookings.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{activeBookings.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => switchTab('past')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="archive-outline"
            size={16}
            color={activeTab === 'past' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.tabTextActive,
            ]}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>
      </View>

      {/* Booking List */}
      <FlatList
        data={data}
        renderItem={renderBookingCard}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        visible={showQR}
        booking={selectedBooking}
        onClose={() => setShowQR(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.huge + SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  tabActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  tabBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.huge,
  },
  cardWrapper: {
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOWS.subtle,
  },
  cardCancelled: {
    opacity: 0.6,
    borderColor: COLORS.occupied + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  buildingIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardRoomName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    paddingLeft: SPACING.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  bookingIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingLeft: SPACING.lg,
  },
  bookingIdText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  qrButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  qrButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.huge * 2,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default MyBookingsScreen;
