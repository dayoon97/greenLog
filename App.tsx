import React, { useState, JSX } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, StatusBar } from 'react-native';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DiaryEntry } from './src/types';
import { MOCK_DIARIES } from './src/mockData';
import DiaryModal from './src/components/DiaryModal';
import MainScreen from './src/screens/MainScreen';
// import AppNavigator from './src/navigation/AppNavigator';

// RNE UI 라이브러리 테마 (필요 시 확장)
const theme = createTheme({}); // 이 테마는 ThemeProvider에 전달되지만, 현재 비어있음

const App = (): JSX.Element => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>(MOCK_DIARIES);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>(
    undefined,
  );

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    // 기록이 없으면 editingEntry는 undefined
    setEditingEntry(diaries.find(d => d.date === date));
    setModalVisible(true);
  };

  const handleSaveDiary = (newEntryData: Omit<DiaryEntry, 'id'>) => {
    setDiaries(prev => {
      const existingIndex = prev.findIndex(d => d.date === newEntryData.date);

      if (existingIndex > -1) {
        // 기록이 있으면, map을 사용하여 해당 항목만 업데이트합니다.
        return prev.map(entry =>
          entry.date === newEntryData.date
            ? { ...entry, ...newEntryData }
            : entry,
        );
      } else {
        // 기록이 없으면, 새 기록을 배열에 추가합니다.
        const maxId = prev.reduce((max, entry) => {
          const entryId = parseInt(entry.id, 10);
          return isNaN(entryId) ? max : Math.max(max, entryId);
        }, 0);
        const newId = (maxId + 1).toString();
        return [...prev, { id: newId, ...newEntryData }];
      }
    });
  };

  const handleDeleteDiary = (dateToDelete: string) => {
    setDiaries(prev => prev.filter(d => d.date !== dateToDelete));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <View style={styles.appContainer}>
              <StatusBar barStyle="dark-content" />
              <MainScreen diaries={diaries} onDayPress={handleDayPress} />
              <DiaryModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveDiary}
                onDelete={handleDeleteDiary}
                date={selectedDate}
                initialData={editingEntry}
              />
            </View>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#fff' },
});

export default App;
