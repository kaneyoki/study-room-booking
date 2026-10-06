// ============================================================
// SearchBar Component - Animated search input
// ============================================================

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm phòng học, tòa nhà...',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(borderAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(borderAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      <Ionicons
        name="search-outline"
        size={20}
        color={isFocused ? COLORS.primary : COLORS.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCorrect={false}
        selectionColor={COLORS.primary}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            Keyboard.dismiss();
          }}
          style={styles.clearBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.lg,
    height: 50,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    paddingVertical: 0,
  },
  clearBtn: {
    marginLeft: SPACING.sm,
  },
});

export default SearchBar;
