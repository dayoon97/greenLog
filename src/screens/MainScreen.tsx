import React, { useCallback, useState, JSX } from 'react';
import { Pressable } from 'react-native';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DiaryEntry } from '../types';
import Header from '../components/Header';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'ko';

// 활동별 색상
const getActivityColor = (activity: string): string => {
  switch (activity) {
    case '물주기':
      return '#3B82F6';
    case '잎정리':
      return '#22C55E';
    case '분갈이':
      return '#F97316';
    case '비료주기':
      return '#FBBF24';
    case '가지치기':
      return '#A855F7';
    case '해충방제':
      return '#EF4444';
    case '수확':
      return '#ff87f3ff';
    default:
      return '#9CA3AF';
  }
};

const CustomDay = ({ date, state, entries, onPress }) => {
  const isToday = state === 'today';
  const hasEntry = entries && entries.length > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayContainer,
        isToday && styles.todayContainer,
        hasEntry && styles.entryContainer,
        pressed && styles.pressedContainer, // 🔥 눌릴 때만 연한 회색
      ]}
    >
      <Text
        style={[styles.dayText, state === 'disabled' && styles.disabledText]}
      >
        {date.day}
      </Text>

      {hasEntry && (
        <View style={styles.tagContainer}>
          {entries[0].activities.slice(0, 1).map((activity, idx) => (
            <View
              key={idx}
              style={[
                styles.tag,
                { backgroundColor: getActivityColor(activity) + '30' },
              ]}
            >
              <Text style={styles.tagText}>{activity}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
};

type MainScreenProps = {
  diaries: DiaryEntry[];
  onDayPress: (date: string) => void;
};

const MainScreen = ({ diaries, onDayPress }: MainScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<'calendar' | 'photo'>('calendar');

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const diariesByDate = React.useMemo(() => {
    return diaries.reduce((acc, entry) => {
      (acc[entry.date] = acc[entry.date] || []).push(entry);
      return acc;
    }, {} as { [key: string]: DiaryEntry[] });
  }, [diaries]);

  const handleDayPress = (dateStr: string) => {
    if (selectedDate === dateStr) {
      // 이미 선택된 날짜 → 모달 열기
      onDayPress(dateStr);
    } else {
      // 새로운 날짜 선택
      setSelectedDate(dateStr);
    }
  };

  const dayComponent = useCallback(
    ({ date, state }) => (
      <CustomDay
        date={date}
        state={state}
        entries={diariesByDate[date.dateString] || []}
        selected={selectedDate === date.dateString}
        onPress={() => handleDayPress(date.dateString)}
      />
    ),
    [diariesByDate, selectedDate],
  );

  const photoDiaries = React.useMemo(
    () => diaries.filter(d => d.photoUri),
    [diaries],
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header
        viewMode={viewMode}
        onToggle={isPhoto => setViewMode(isPhoto ? 'photo' : 'calendar')}
      />
      <View style={styles.contentContainer}>
        {viewMode === 'calendar' ? (
          <Calendar
            dayComponent={dayComponent}
            theme={{
              arrowColor: 'black',
              monthTextColor: 'black',
              textMonthFontSize: 20,
              textMonthFontWeight: 'bold',
              dayHeaderFontSize: 12,
              dayHeaderFontWeight: '500',
            }}
            monthFormat={'yyyy년 M월'}
            firstDay={0}
          />
        ) : photoDiaries.length > 0 ? (
          <FlatList
            data={photoDiaries}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onDayPress(item.date)}>
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.photoItem}
                />
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📸</Text>
            <Text style={styles.emptyText}>아직 등록된 사진이 없습니다</Text>
            <Text style={styles.emptySubText}>
              캘린더에서 날짜를 선택하여 식물 사진을 추가해보세요
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: 'white' },
  contentContainer: { flex: 1, backgroundColor: 'white' },

  dayContainer: {
    height: 90,
    width: Dimensions.get('window').width / 7 - 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderRadius: 12,
    borderColor: '#eee',
    backgroundColor: '#F9FAFB',
  },

  todayContainer: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#4ADE80',
    borderRadius: 12,
  },
  entryContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  selectedContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  pressedContainer: {
    backgroundColor: '#E5E7EB', // 연한 회색
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },

  disabledText: { color: '#ccc' },
  tagContainer: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontSize: 10, color: 'white', fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: { color: '#707070', fontSize: 12, lineHeight: 14 },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: { color: 'gray', textAlign: 'center' },
  photoItem: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
});

export default MainScreen;
