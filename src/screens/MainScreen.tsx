import React, { useCallback, useMemo, useState, JSX, useEffect } from 'react';
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
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DiaryEntry } from '../types';
import Header from '../components/Header';
import GameLobbyScreen from '../components/GameLobbyScreen';
import Veggie2048Screen from '../components/Veggie2048Screen';
import CornFarmingGameScreen from '../components/CornFarmingGameScreen';

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

interface CustomMarkingProps extends MarkingProps {
  activities?: string[];
}

const CustomDay = React.memo(
  ({
    date,
    state,
    marking,
    onPress,
  }: {
    date?: DateData;
    state?: string;
    marking?: CustomMarkingProps;
    onPress?: (date: DateData) => void;
  }) => {
    const isToday = state === 'today';
    const hasEntry =
      marking && marking.activities && marking.activities.length > 0;

    return (
      <Pressable
        onPress={() => onPress && date && onPress(date)}
        style={({ pressed }) => [
          styles.dayContainer,
          isToday && styles.todayContainer,
          hasEntry && styles.entryContainer,
          pressed && styles.pressedContainer,
        ]}
      >
        <Text
          style={[styles.dayText, state === 'disabled' && styles.disabledText]}
        >
          {date?.day}
        </Text>

        {hasEntry && (
          <View style={styles.tagContainer}>
            {/* 처음 2개의 활동 태그 */}
            {marking.activities?.slice(0, 2).map(activity => (
              <View
                key={activity}
                style={[
                  styles.tag,
                  {
                    backgroundColor: getActivityColor(activity) + '30',
                  },
                ]}
              >
                <Text style={styles.tagText}>{activity}</Text>
              </View>
            ))}

            {/* 2개가 넘을 경우 +N 태그 표시 */}
            {marking.activities.length > 2 && (
              <View
                key="more"
                style={[styles.tag, { backgroundColor: '#E5E7EB' }]}
              >
                <Text style={styles.tagText}>
                  +{marking.activities.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  },
);

type MainScreenProps = {
  diaries: DiaryEntry[];
  onDayPress: (date: string) => void;
};

const MainScreen = ({ diaries, onDayPress }: MainScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<'calendar' | 'photo' | 'game'>(
    'calendar',
  );
  const [activeGame, setActiveGame] = useState<'lobby' | '2048' | 'corn'>(
    'lobby',
  );

  const markedDates = useMemo(() => {
    return diaries.reduce((acc, entry) => {
      if (entry.date) {
        acc[entry.date] = { activities: entry.activities };
      }
      return acc;
    }, {} as { [key: string]: CustomMarkingProps });
  }, [diaries]);

  const dayComponent = useCallback((props: any) => {
    return <CustomDay {...props} />;
  }, []);

  const photoDiaries = useMemo(
    () => diaries.filter(d => d.photoUri),
    [diaries],
  );

  // 게임 탭을 벗어나면 로비로 리셋
  useEffect(() => {
    if (viewMode !== 'game') {
      setActiveGame('lobby');
    }
  }, [viewMode]);

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header viewMode={viewMode} onToggle={setViewMode} />
      <View style={styles.contentContainer}>
        <View
          style={{
            flex: 1,
            display: viewMode === 'calendar' ? 'flex' : 'none',
          }}
        >
          <Calendar
            dayComponent={dayComponent}
            markedDates={markedDates}
            onDayPress={day => onDayPress(day.dateString)}
            theme={{
              arrowColor: 'black',
              monthTextColor: 'black',
              textMonthFontSize: 20,
              textMonthFontWeight: 'bold',
              dayHeaderFontSize: 12,
              dayHeaderFontWeight: '500',
              todayTextColor: '#22C55E',
            }}
            monthFormat={'yyyy년 M월'}
            firstDay={0}
          />
        </View>
        <View
          style={{
            flex: 1,
            display: viewMode === 'photo' ? 'flex' : 'none',
            backgroundColor: 'white',
          }}
        >
          {photoDiaries.length > 0 ? (
            <FlatList
              data={photoDiaries}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.diaryCard}
                  onPress={() => onDayPress(item.date)}
                >
                  <Image
                    source={{ uri: item.photoUri }}
                    style={styles.diaryImage}
                  />
                  <View style={styles.diaryInfo}>
                    <Text style={styles.diaryDate}>{item.date}</Text>
                    <View style={styles.diaryTags}>
                      {item.activities.map(activity => (
                        <View
                          key={activity}
                          style={[
                            styles.tag,
                            {
                              backgroundColor:
                                getActivityColor(activity) + '30',
                            },
                          ]}
                        >
                          <Text style={styles.tagText}>{activity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
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
        <View
          style={{
            flex: 1,
            display: viewMode === 'game' ? 'flex' : 'none',
          }}
        >
          {activeGame === 'lobby' && (
            <GameLobbyScreen onSelectGame={setActiveGame} />
          )}
          {activeGame === '2048' && (
            <Veggie2048Screen onBack={() => setActiveGame('lobby')} />
          )}
          {activeGame === 'corn' && (
            <CornFarmingGameScreen onBack={() => setActiveGame('lobby')} />
          )}
        </View>
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
  pressedContainer: {
    backgroundColor: '#E5E7EB',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  disabledText: { color: '#ccc' },
  tagContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, margin: 2 },
  tagText: { fontSize: 10, color: 'black', fontWeight: 'bold' },
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
  diaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  diaryImage: {
    width: '100%',
    aspectRatio: 1,
  },
  diaryInfo: {
    padding: 12,
  },
  diaryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  diaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default MainScreen;
