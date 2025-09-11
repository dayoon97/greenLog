import React, { useState, useEffect, JSX } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, StatusBar } from 'react-native';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from './src/types';
import { MOCK_DIARIES } from './src/mockData';
import DiaryModal from './src/components/DiaryModal';
import MainScreen from './src/screens/MainScreen';
// import AppNavigator from './src/navigation/AppNavigator';

// RNE UI 라이브러리 테마 (필요 시 확장)
const theme = createTheme({}); // 이 테마는 ThemeProvider에 전달되지만, 현재 비어있음

const DIARIES_STORAGE_KEY = '@greenlog_diaries';

const App = (): JSX.Element => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>(MOCK_DIARIES);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>(
    undefined,
  );

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(DIARIES_STORAGE_KEY);
      if (jsonValue !== null) {
        setDiaries(JSON.parse(jsonValue));
      } else {
        // 저장된 데이터가 없으면 목업 데이터로 시작
        setDiaries(MOCK_DIARIES);
      }
    } catch (e) {
      console.error('Failed to load diaries from storage', e);
    }
  };

  const saveDiariesToStorage = async (newDiaries: DiaryEntry[]) => {
    try {
      const jsonValue = JSON.stringify(newDiaries);
      await AsyncStorage.setItem(DIARIES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save diaries to storage', e);
    }
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    // 기록이 없으면 editingEntry는 undefined
    setEditingEntry(diaries.find(d => d.date === date));
    setModalVisible(true);
  };

  const handleSaveDiary = (newEntryData: Omit<DiaryEntry, 'id'>) => {
    const existingIndex = diaries.findIndex(d => d.date === newEntryData.date);
    let updatedDiaries: DiaryEntry[];

    if (existingIndex > -1) {
      updatedDiaries = diaries.map(entry =>
        entry.date === newEntryData.date
          ? { ...entry, ...newEntryData }
          : entry,
      );
    } else {
      const maxId = diaries.reduce((max, entry) => {
        const entryId = parseInt(entry.id, 10);
        return isNaN(entryId) ? max : Math.max(max, entryId);
      }, 0);
      const newId = (maxId + 1).toString();
      updatedDiaries = [...diaries, { id: newId, ...newEntryData }];
    }
    setDiaries(updatedDiaries);
    saveDiariesToStorage(updatedDiaries);
  };

  const handleDeleteDiary = (dateToDelete: string) => {
    const updatedDiaries = diaries.filter(d => d.date !== dateToDelete);
    setDiaries(updatedDiaries);
    saveDiariesToStorage(updatedDiaries);
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
