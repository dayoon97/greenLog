import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type GameLobbyScreenProps = {
  onSelectGame: (game: '2048' | 'corn') => void;
};

const GameLobbyScreen = ({ onSelectGame }: GameLobbyScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>플레이할 게임을 선택하세요!</Text>
      <View style={styles.gameList}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => onSelectGame('2048')}
        >
          <View style={[styles.gameImage, { backgroundColor: '#c8e6c9' }]}>
            <Text style={styles.gameEmoji}>🥕</Text>
          </View>
          <Text style={styles.gameTitle}>Veggie 2048</Text>
          <Text style={styles.gameDescription}>
            채소를 합쳐 2048을 만드세요!
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.gameCard}
          onPress={() => onSelectGame('corn')}
        >
          <View style={[styles.gameImage, { backgroundColor: '#fff3b0' }]}>
            <Text style={styles.gameEmoji}>🌽</Text>
          </View>
          <Text style={styles.gameTitle}>옥수수 키우기</Text>
          <Text style={styles.gameDescription}>
            나만의 옥수수를 정성껏 키워보세요!
          </Text>
        </TouchableOpacity> */}

        <View style={[styles.gameCard, styles.disabledGameCard]}>
          <View style={[styles.gameImage, { backgroundColor: '#e0e0e0' }]}>
            <Text style={styles.gameEmoji}>?</Text>
          </View>
          <Text style={styles.gameTitle}>준비 중...</Text>
          <Text style={styles.gameDescription}>새로운 게임을 준비하고 있어요!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f4',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e944f',
    marginBottom: 30,
  },
  gameList: {
    width: '100%',
    alignItems: 'center',
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledGameCard: {
    backgroundColor: '#f5f5f5',
  },
  gameImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameEmoji: {
    fontSize: 60,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default GameLobbyScreen;
