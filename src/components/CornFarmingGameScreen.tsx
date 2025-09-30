import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GROWTH_STAGES = ['🌱', '🌿', '🌾', '🌽'];
const HARVESTED_STAGE = '🌟';
const SICK_STAGE = '🥀';
const MAX_GROWTH = GROWTH_STAGES.length - 1;

type CornFarmingGameScreenProps = {
  onBack: () => void;
};

const STORAGE_KEY = '@corn_game_state';
const TICK_RATE = 3000; // 3 seconds

type GameState = {
  growth: number;
  score: number;
  waterLevel: number;
  fertilizerLevel: number;
  isHarvested: boolean;
  isSick: boolean;
  lastUpdated: number;
};
const CornFarmingGameScreen = ({ onBack }: CornFarmingGameScreenProps) => {
  const [growth, setGrowth] = useState(0); // 0 to MAX_GROWTH
  const [score, setScore] = useState(0); // Total score
  const [waterLevel, setWaterLevel] = useState(5); // 0 to 10
  const [fertilizerLevel, setFertilizerLevel] = useState(3); // 0 to 5
  const [isHarvested, setIsHarvested] = useState(false); // Is the game in harvested state
  const [isSick, setIsSick] = useState(false); // Is the plant sick
  const [message, setMessage] = useState('씨앗을 심었어요!');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load game state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedStateJSON = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedStateJSON) {
          const savedState: GameState = JSON.parse(savedStateJSON);
          const now = Date.now();
          const elapsed = now - savedState.lastUpdated;
          const ticksPassed = Math.floor(elapsed / TICK_RATE);

          // Apply changes for the time passed
          const newWaterLevel = Math.max(
            0,
            savedState.waterLevel - ticksPassed,
          );

          setGrowth(savedState.growth);
          setScore(savedState.score);
          setWaterLevel(newWaterLevel);
          setFertilizerLevel(savedState.fertilizerLevel);
          setIsHarvested(savedState.isHarvested);

          if (newWaterLevel === 0 && !savedState.isHarvested) {
            setIsSick(true);
            setMessage('오랫동안 돌보지 않아 식물이 시들었어요...');
          } else {
            setIsSick(savedState.isSick);
          }
        }
      } catch (e) {
        console.error('Failed to load game state.', e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadState();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    const saveState = async () => {
      const state: GameState = {
        growth,
        score,
        waterLevel,
        fertilizerLevel,
        isHarvested,
        isSick,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };
    saveState();
  }, [
    growth,
    score,
    waterLevel,
    fertilizerLevel,
    isHarvested,
    isSick,
    isLoaded,
  ]);

  // Game loop
  useEffect(() => {
    if (!isLoaded || isHarvested || isSick) return;

    const gameTick = setInterval(() => {
      // Water level decreases over time
      setWaterLevel(prev => Math.max(0, prev - 1));

      // Growth condition
      if (waterLevel > 2 && fertilizerLevel > 0) {
        if (growth < MAX_GROWTH) {
          setGrowth(prev => prev + 1);
          setFertilizerLevel(prev => Math.max(0, prev - 1)); // Consume fertilizer
          setMessage('쑥쑥 자라는 중!');
        } else {
          setMessage('수확할 시간이에요!');
        }
      } else if (waterLevel <= 2) {
        setMessage('목이 말라요! 💧');
      } else if (fertilizerLevel <= 0) {
        setMessage('영양분이 필요해요! 栄養');
      }

      // Check for sickness
      if (waterLevel === 0) {
        setIsSick(true);
        setMessage('식물이 시들었어요...');
      }
    }, TICK_RATE);

    return () => clearInterval(gameTick);
  }, [growth, waterLevel, fertilizerLevel, isHarvested, isSick, isLoaded]);

  const handleWatering = () => {
    if (!isHarvested && !isSick) {
      setWaterLevel(10);
      setMessage('물을 듬뿍 줬어요!');
    }
  };

  const handleFertilizing = () => {
    if (!isHarvested && !isSick) {
      setFertilizerLevel(5);
      setMessage('비료를 뿌려줬어요!');
    }
  };

  const handleHarvest = () => {
    if (growth === MAX_GROWTH && !isHarvested) {
      setScore(prev => prev + 100);
      setIsHarvested(true);
      setMessage('수확 성공! 🎉');
    }
  };

  const handleNewGame = () => {
    setIsLoaded(false); // Prevent saving old state during reset
    setGrowth(0);
    setWaterLevel(5);
    setFertilizerLevel(3);
    setIsHarvested(false);
    setIsSick(false);
    setMessage('새로운 씨앗을 심었어요!');
    setIsLoaded(true); // Re-enable saving
  };

  const getPlantEmoji = () => {
    if (isHarvested) return HARVESTED_STAGE;
    if (isSick) return SICK_STAGE;
    return GROWTH_STAGES[growth];
  };

  const renderButtons = () => {
    if (isHarvested || isSick) {
      return (
        <TouchableOpacity style={styles.button} onPress={handleNewGame}>
          <Text style={styles.buttonText}>새로 심기</Text>
        </TouchableOpacity>
      );
    }

    if (growth === MAX_GROWTH) {
      return (
        <TouchableOpacity style={styles.button} onPress={handleHarvest}>
          <Text style={styles.buttonText}>🎉 수확하기</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleWatering}>
          <Text style={styles.buttonText}>💧 물주기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFertilizing}
        >
          <Text style={styles.buttonText}>비료주기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    // Show a loading view until the state is loaded
    !isLoaded ? (
      <View style={styles.container}>
        <Text>로딩중...</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 로비로</Text>
          </TouchableOpacity>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>점수: {score}</Text>
          </View>
        </View>

        <Text style={styles.title}>옥수수 키우기</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            수분: {'💧'.repeat(waterLevel)}
            {'·'.repeat(10 - waterLevel)}
          </Text>
          <Text style={styles.statusText}>
            영양: {'⭐'.repeat(fertilizerLevel)}
            {'·'.repeat(5 - fertilizerLevel)}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.plant}>{getPlantEmoji()}</Text>
        </View>

        <Text style={styles.messageText}>{message}</Text>

        <View style={styles.controls}>{renderButtons()}</View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fefae0',
    padding: 20,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#dda15e',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: '#dda15e',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#bc6c25',
    marginTop: 80,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#606c38',
    fontWeight: '500',
  },
  field: {
    width: 200,
    height: 200,
    backgroundColor: '#606c28',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#283618',
  },
  plant: {
    fontSize: 100,
  },
  controls: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#b5838d',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#bc6c25',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 18,
    color: '#283618',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default CornFarmingGameScreen;
