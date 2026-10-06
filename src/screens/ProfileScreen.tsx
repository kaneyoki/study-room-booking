// ============================================================
// ProfileScreen - User Settings & App Info
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants/theme';

const ProfileScreen: React.FC = () => {
  const { user } = useBookingStore();

  const menuItems = [
    { icon: 'person-outline', title: 'Thông tin cá nhân', subtitle: 'Cập nhật thông tin sinh viên' },
    { icon: 'notifications-outline', title: 'Cài đặt thông báo', subtitle: 'Quản lý nhắc nhở lịch đặt' },
    { icon: 'help-circle-outline', title: 'Hỗ trợ', subtitle: 'Câu hỏi thường gặp & Trợ giúp' },
    { icon: 'document-text-outline', title: 'Quy định sử dụng', subtitle: 'Quy định mượn phòng VKU' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary + '30', COLORS.background]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=Sinh+Vien+VKU&background=6C63FF&color=fff' }}
              style={styles.avatar}
            />
            <View style={styles.badge}>
              <Ionicons name="school" size={12} color={COLORS.white} />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Sinh viên VKU'}</Text>
            <Text style={styles.userStudentId}>{user?.studentId || '21IT000'}</Text>
            <View style={styles.emailBadge}>
              <Text style={styles.emailText}>{user?.email || 'sinhvien@vku.udn.vn'}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt & Hỗ trợ</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={22} color={COLORS.primaryLight} />
                </View>
                <View style={styles.menuTextContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.versionText}>VKU Study Room v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 Vietnam-Korea University</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.secondary} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.lg,
    marginTop: -SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  userStudentId: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  emailBadge: {
    backgroundColor: COLORS.chipBg,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 4,
  },
  emailText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryLight,
  },
  section: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  menuContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContent: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    gap: 4,
  },
  versionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  logoutText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.secondary,
  },
});

export default ProfileScreen;
