// ============================================================
// HomeScreen - Room Discovery with FlatList
// ============================================================

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBookingStore } from '../store/useBookingStore';
import { Room } from '../types';
import { COLORS, SPACING, FONT_SIZE, TIME_SLOTS } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import RoomCard from '../components/RoomCard';

type RootStackParamList = {
  HomeMain: undefined;
  RoomDetail: { room: Room };
  Booking: { room: Room };
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    getFilteredRooms,
    bookings,
  } = useBookingStore();

  const filteredRooms = useMemo(() => getFilteredRooms(), [
    searchQuery,
    filters,
    bookings,
  ]);

  const getAvailableSlots = useCallback(
    (roomId: string) => {
      const today = new Date().toISOString().split('T')[0];
      const roomBookings = bookings.filter(
        (b) => b.roomId === roomId && b.date === today && b.status === 'active'
      );
      return TIME_SLOTS.length - roomBookings.length;
    },
    [bookings]
  );

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetail', { room });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Room; index: number }) => (
      <RoomCard
        room={item}
        index={index}
        availableSlots={getAvailableSlots(item.id)}
        onPress={handleRoomPress}
      />
    ),
    [getAvailableSlots, handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View>
        {/* Hero Header */}
        <LinearGradient
          colors={[COLORS.primary + '30', COLORS.background]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>Xin chào! 👋</Text>
                <Text style={styles.title}>Đặt phòng học VKU</Text>
              </View>
              <View style={styles.logoContainer}>
                <Ionicons name="school" size={28} color={COLORS.primary} />
              </View>
            </View>
            <Text style={styles.subtitle}>
              Tìm và đặt phòng học, lab ngay hôm nay
            </Text>
          </View>
        </LinearGradient>

        {/* Search */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Filters */}
        <FilterChips
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />

        {/* Results Count */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            {filteredRooms.length} phòng
            {searchQuery ? ` cho "${searchQuery}"` : ''}
          </Text>
          <View style={styles.sortBadge}>
            <Ionicons name="options-outline" size={14} color={COLORS.textSecondary} />
          </View>
        </View>
      </View>
    ),
    [searchQuery, filters, filteredRooms.length]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>Không tìm thấy phòng</Text>
        <Text style={styles.emptySubtitle}>
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={7}
        initialNumToRender={4}
        getItemLayout={undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.huge,
  },
  headerGradient: {
    paddingTop: SPACING.huge + SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerContent: {
    paddingHorizontal: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resultsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sortBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
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
    paddingHorizontal: SPACING.xxl,
  },
});

export default HomeScreen;
