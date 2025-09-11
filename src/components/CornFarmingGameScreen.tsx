import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const GROWTH_STAGES = ['🌱', '🌿', '🌾', '🌽', '🌟'];
const MAX_GROWTH = GROWTH_STAGES.length - 2; // Last stage is for harvested

type CornFarmingGameScreenProps = {
  onBack: () => void;
};

const CornFarmingGameScreen = ({ onBack }: CornFarmingGameScreenProps) => {
  const [growth, setGrowth] = useState(0);
  const [score, setScore] = useState(0);
  const [isHarvested, setIsHarvested] = useState(false);

  const handleWatering = () => {
    if (growth < MAX_GROWTH) {
      setGrowth(prev => prev + 1);
    } else if (growth === MAX_GROWTH && !isHarvested) {
      Alert.alert('수확 가능!', '옥수수가 다 자랐어요. 수확해주세요!');
    }
  };

  const handleHarvest = () => {
    if (growth === MAX_GROWTH) {
      setGrowth(prev => prev + 1); // Move to harvested emoji
      setScore(prev => prev + 100);
      setIsHarvested(true);
    }
  };

  const handleNewGame = () => {
    setGrowth(0);
    setIsHarvested(false);
  };

  const getButton = () => {
    if (isHarvested) {
      return (
        <TouchableOpacity style={styles.button} onPress={handleNewGame}>
          <Text style={styles.buttonText}>새로 심기</Text>
        </TouchableOpacity>
      );
    }
    if (growth < MAX_GROWTH) {
      return (
        <TouchableOpacity style={styles.button} onPress={handleWatering}>
          <Text style={styles.buttonText}>💧 물주기</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.button} onPress={handleHarvest}>
        <Text style={styles.buttonText}>🎉 수확하기</Text>
      </TouchableOpacity>
    );
  };

  return (
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

      <View style={styles.field}>
        <Text style={styles.plant}>{GROWTH_STAGES[growth]}</Text>
      </View>

      <View style={styles.controls}>{getButton()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff3b0',
    padding: 20,
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#e5989b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: '#e5989b',
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
    color: '#b5838d',
    marginTop: 60,
  },
  field: {
    width: 200,
    height: 200,
    backgroundColor: '#6d6875',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CornFarmingGameScreen;
