import React, { JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, Switch } from '@rneui/themed';

type HeaderProps = {
  viewMode: 'calendar' | 'photo';
  onToggle: (value: boolean) => void;
};

const Header = ({ viewMode, onToggle }: HeaderProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>🌱 캘린더</Text>
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>🗓️ 캘린더</Text>
        <Switch
          value={viewMode === 'photo'}
          onValueChange={onToggle}
          color="green"
        />
        <Text style={styles.switchLabel}>📸 사진</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginHorizontal: 8,
    fontSize: 14,
  },
});

export default Header;
