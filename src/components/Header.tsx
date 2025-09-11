import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ViewMode = 'calendar' | 'photo' | 'game';

type HeaderProps = {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
};

const Header = ({ viewMode, onToggle }: HeaderProps) => {
  const titles: Record<ViewMode, string> = {
    calendar: '🌱 캘린더',
    photo: '📸 사진',
    game: '🎮 게임',
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titles[viewMode]}</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'calendar' && styles.activeButton,
          ]}
          onPress={() => onToggle('calendar')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'calendar' && styles.activeText,
            ]}
          >
            🗓️ 캘린더
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'photo' && styles.activeButton,
          ]}
          onPress={() => onToggle('photo')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'photo' && styles.activeText,
            ]}
          >
            📸 사진
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'game' && styles.activeButton,
          ]}
          onPress={() => onToggle('game')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'game' && styles.activeText,
            ]}
          >
            🎮 게임
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeButton: { backgroundColor: 'white' },
  toggleText: { fontSize: 12, color: '#888' }, // 비활성
  activeText: { fontWeight: 'bold', color: '#000' }, // 활성
});

export default Header;
