// ============================================================
// Utility Helpers
// ============================================================

import { TIME_SLOTS } from '../constants/theme';

/**
 * Generate a unique ID for bookings
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `BK-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Generate a unique QR code string for booking pass
 */
export const generateQRCode = (bookingId: string, roomId: string, date: string): string => {
  return `VKU-BOOKING:${bookingId}|${roomId}|${date}|${Date.now()}`;
};

/**
 * Format date to Vietnamese locale display
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const months = ['Th01', 'Th02', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

/**
 * Format date to short form (DD/MM)
 */
export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

/**
 * Get day name in Vietnamese
 */
export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[date.getDay()];
};

/**
 * Get next 7 days starting from today
 */
export const getNext7Days = (): string[] => {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

/**
 * Check if a date is today
 */
export const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

/**
 * Check if a time slot has already passed for today
 */
export const isSlotPassed = (dateStr: string, slotId: number): boolean => {
  if (!isToday(dateStr)) return false;
  const slot = TIME_SLOTS.find(s => s.id === slotId);
  if (!slot) return false;

  const now = new Date();
  const [hours, minutes] = slot.startTime.split(':').map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);

  return now > slotTime;
};

/**
 * Get relative time description
 */
export const getRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 0) return 'Đã qua';
  if (diffMins < 60) return `${diffMins} phút nữa`;
  if (diffHours < 24) return `${diffHours} giờ nữa`;
  if (diffDays === 1) return 'Ngày mai';
  return `${diffDays} ngày nữa`;
};

/**
 * Get equipment icon name (Ionicons)
 */
export const getEquipmentIcon = (equipment: string): string => {
  switch (equipment) {
    case 'Projector': return 'tv-outline';
    case 'Whiteboard': return 'easel-outline';
    case 'High-spec PC': return 'desktop-outline';
    case 'AC': return 'snow-outline';
    default: return 'cube-outline';
  }
};

/**
 * Get building color
 */
export const getBuildingColor = (building: string): string => {
  switch (building) {
    case 'A': return '#6C63FF';
    case 'B': return '#00D4AA';
    case 'C': return '#FF6B6B';
    case 'V': return '#FFB74D';
    default: return '#8892B0';
  }
};

/**
 * Calculate notification trigger time (15 min before slot)
 */
export const getNotificationTriggerDate = (date: string, startTime: string): Date => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const triggerDate = new Date(date);
  triggerDate.setHours(hours, minutes - 15, 0, 0);
  return triggerDate;
};
