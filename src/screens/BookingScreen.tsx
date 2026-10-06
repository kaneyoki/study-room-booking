// ============================================================
// BookingScreen - Date + Time Slot Selection & Confirmation
// ============================================================

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Room } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, TIME_SLOTS, SHADOWS } from '../constants/theme';
import { getNext7Days, formatDate, getBuildingColor } from '../utils/helpers';
import { scheduleBookingReminder } from '../services/notificationService';
import DateSelector from '../components/DateSelector';
import TimeSlotSelector from '../components/TimeSlotSelector';
import QRCodeModal from '../components/QRCodeModal';

type RootStackParamList = {
  HomeMain: undefined;
  RoomDetail: { room: Room };
  Booking: { room: Room };
};

const BookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Booking'>>();
  const { room } = route.params;
  const { user, addBooking, isSlotBooked, getBookingsForRoom } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [purpose, setPurpose] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const dates = useMemo(() => getNext7Days(), []);

  const bookedSlots = useMemo(() => {
    const roomBookings = getBookingsForRoom(room.id, selectedDate);
    return roomBookings.map((b) => b.timeSlotId);
  }, [room.id, selectedDate, getBookingsForRoom]);

  const buildingColor = getBuildingColor(room.building);

  const selectedSlotData = useMemo(
    () => (selectedSlot !== null ? TIME_SLOTS.find((s) => s.id === selectedSlot) : null),
    [selectedSlot]
  );

  const handleConfirm = useCallback(async () => {
    if (selectedSlot === null) {
      Alert.alert('Thông báo', 'Vui lòng chọn khung giờ trước khi đặt phòng.');
      return;
    }

    if (isSlotBooked(room.id, selectedDate, selectedSlot)) {
      Alert.alert('Xung đột', 'Khung giờ này đã được đặt bởi người khác.');
      return;
    }

    const slotData = TIME_SLOTS.find((s) => s.id === selectedSlot)!;

    const newBooking = addBooking({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      userId: user?.id || 'guest',
      userName: user?.name || 'Sinh viên VKU',
      date: selectedDate,
      timeSlotId: selectedSlot,
      timeSlotLabel: slotData.label,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      purpose: purpose || undefined,
      groupSize: groupSize ? parseInt(groupSize) : undefined,
    });

    // Schedule notification
    try {
      await scheduleBookingReminder(newBooking);
    } catch (e) {
      console.log('Could not schedule notification:', e);
    }

    // Animate button
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 8 }),
    ]).start();

    setLastBooking(newBooking);
    setShowQR(true);
  }, [selectedSlot, selectedDate, room, user, purpose, groupSize, addBooking, isSlotBooked]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[buildingColor + '30', COLORS.background]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Đặt phòng</Text>
          <View style={styles.roomBadge}>
            <View style={[styles.buildingDot, { backgroundColor: buildingColor }]} />
            <Text style={styles.roomBadgeText}>{room.name}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Date Selector */}
        <DateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setSelectedSlot(null);
          }}
        />

        {/* Time Slot Selector */}
        <TimeSlotSelector
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          bookedSlots={bookedSlots}
        />

        {/* Optional Details */}
        <View style={styles.optionalSection}>
          <Text style={styles.sectionTitle}>📋 Thông tin thêm (tùy chọn)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mục đích sử dụng</Text>
            <TextInput
              style={styles.input}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="VD: Họp nhóm đồ án, Ôn thi..."
              placeholderTextColor={COLORS.textMuted}
              selectionColor={COLORS.primary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số người</Text>
            <TextInput
              style={styles.input}
              value={groupSize}
              onChangeText={(text) => setGroupSize(text.replace(/[^0-9]/g, ''))}
              placeholder={`Tối đa ${room.capacity} người`}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              selectionColor={COLORS.primary}
            />
          </View>
        </View>

        {/* Booking Summary */}
        {selectedSlot !== null && selectedSlotData && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📌 Tóm tắt đặt phòng</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="business-outline" size={16} color={COLORS.primary} />
              <Text style={styles.summaryLabel}>Phòng:</Text>
              <Text style={styles.summaryValue}>{room.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="location-outline" size={16} color={buildingColor} />
              <Text style={styles.summaryLabel}>Vị trí:</Text>
              <Text style={styles.summaryValue}>
                Tòa {room.building}, Tầng {room.floor}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.accent} />
              <Text style={styles.summaryLabel}>Ngày:</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.secondary} />
              <Text style={styles.summaryLabel}>Giờ:</Text>
              <Text style={styles.summaryValue}>{selectedSlotData.label}</Text>
            </View>
            <View style={styles.reminderNote}>
              <Ionicons name="notifications-outline" size={14} color={COLORS.primaryLight} />
              <Text style={styles.reminderText}>
                Bạn sẽ nhận thông báo trước 15 phút
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomBar}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              selectedSlot === null && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={selectedSlot === null}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                selectedSlot !== null
                  ? [COLORS.primary, COLORS.primaryDark]
                  : [COLORS.textMuted, COLORS.textMuted]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmGradient}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.white} />
              <Text style={styles.confirmText}>Xác nhận đặt phòng</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* QR Code Modal */}
      <QRCodeModal
        visible={showQR}
        booking={lastBooking}
        onClose={() => {
          setShowQR(false);
          navigation.goBack();
        }}
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
    paddingTop: SPACING.huge,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerContent: {
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.card,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buildingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roomBadgeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: SPACING.md,
  },
  optionalSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  summaryCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    gap: SPACING.md,
    ...SHADOWS.subtle,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    width: 50,
  },
  summaryValue: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  reminderNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reminderText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.elevated,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
  },
  confirmText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default BookingScreen;
