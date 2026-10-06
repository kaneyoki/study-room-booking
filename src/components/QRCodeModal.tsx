// ============================================================
// QRCodeModal Component - Booking Pass with QR Code
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Booking } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants/theme';
import { formatDate, getBuildingColor } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QRCodeModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ visible, booking, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!booking) return null;

  const buildingColor = getBuildingColor(booking.building);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Ionicons name="ticket-outline" size={28} color={COLORS.white} />
              <Text style={styles.headerTitle}>Booking Pass</Text>
              <Text style={styles.headerSubtitle}>VKU Study Room</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </LinearGradient>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={booking.qrCode}
                size={SCREEN_WIDTH * 0.5}
                color={COLORS.background}
                backgroundColor={COLORS.white}
              />
            </View>
            <Text style={styles.bookingId}>{booking.id}</Text>
          </View>

          {/* Divider with circles */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerCircle, styles.dividerCircleLeft]} />
            <View style={styles.dividerLine} />
            <View style={[styles.dividerCircle, styles.dividerCircleRight]} />
          </View>

          {/* Booking Details */}
          <View style={styles.detailsSection}>
            {/* Room */}
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={18} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phòng</Text>
                <Text style={styles.detailValue}>{booking.roomName}</Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={buildingColor} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Vị trí</Text>
                <Text style={styles.detailValue}>
                  Tòa {booking.building} · Tầng {booking.floor}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ngày</Text>
                <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
              </View>
            </View>

            {/* Time */}
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.secondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Thời gian</Text>
                <Text style={styles.detailValue}>{booking.timeSlotLabel}</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="information-circle-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.footerText}>
              Quét mã QR tại phòng để check-in
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: SCREEN_WIDTH - SPACING.xxl * 2,
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  qrWrapper: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
  },
  bookingId: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -1,
  },
  dividerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.modalOverlay,
  },
  dividerCircleLeft: {
    marginLeft: -12,
  },
  dividerCircleRight: {
    marginRight: -12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailsSection: {
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});

export default QRCodeModal;
