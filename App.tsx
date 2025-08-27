import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, StatusBar } from 'react-native';
import { ThemeProvider, createTheme } from '@rneui/themed'; // createTheme을 ThemeProvider 옆에서 직접 import합니다.
import { DiaryEntry } from './src/types';
import { MOCK_DIARIES } from './src/mockData';
import MainScreen from './src/screens/MainScreen';
import DiaryModal from './src/components/DiaryModal';

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
        // 기존 기록이 있을 경우
        const existingEntry = prev[existingIndex]; // 기존 Entry를 명확히 가져옴
        if (existingEntry) {
          // 혹시 모를 undefined 체크
          const updatedDiaries = [...prev];
          updatedDiaries[existingIndex] = { ...existingEntry, ...newEntryData };
          return updatedDiaries;
        }
      }
      // 새 기록이거나 기존 기록을 찾지 못했거나 기존 기록이 undefined였을 경우
      return [...prev, { id: Date.now().toString(), ...newEntryData }];
    });
  };

  const handleDeleteDiary = (dateToDelete: string) => {
    setDiaries(prev => prev.filter(d => d.date !== dateToDelete));
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#fff' },
});

export default App;
