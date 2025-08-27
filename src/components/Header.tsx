import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type HeaderProps = {
  viewMode: 'calendar' | 'photo';
  onToggle: (isPhoto: boolean) => void;
};

const Header = ({ viewMode, onToggle }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 캘린더</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'calendar' && styles.activeButton,
          ]}
          onPress={() => onToggle(false)}
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
          onPress={() => onToggle(true)}
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
