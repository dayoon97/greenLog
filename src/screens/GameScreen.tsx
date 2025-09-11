import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import {
  GestureDetector,
  Gesture,
  Directions,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import Tile from '../components/Tile';
import {
  BOARD_SIZE,
  BOARD_DIMENSION,
  CELL_SIZE,
  CELL_MARGIN,
} from '../constants';
import type { Direction, TileData } from '../types';
import {
  createEmptyBoard,
  rotateBoard,
  checkIfGameCanMove,
} from '../util/gameLogic';

let tileIdCounter = 1;

const addRandomTile = (currentTiles: TileData[]): TileData[] => {
  const emptyCells: { x: number; y: number }[] = [];
  const board = createEmptyBoard();

  currentTiles.forEach(tile => {
    board[tile.y][tile.x] = tile.value;
  });

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === 0) emptyCells.push({ x, y });
    }
  }

  if (emptyCells.length > 0) {
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newTile: TileData = {
      id: tileIdCounter++,
      value: Math.random() < 0.9 ? 2 : 4,
      x,
      y,
      isNew: true,
    };
    return [...currentTiles, newTile];
  }
  return currentTiles;
};

const GameScreen = () => {
  const tiles = useSharedValue<TileData[]>([]);
  const [renderTiles, setRenderTiles] = useState<TileData[]>([]);
  const [score, setScore] = useState<number>(0);
  const isGameOver = useSharedValue<boolean>(false);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useAnimatedReaction(
    () => tiles.value,
    value => {
      runOnJS(setRenderTiles)(value.map(t => ({ ...t, isNew: false })));
    },
    [],
  );

  useAnimatedReaction(
    () => isGameOver.value,
    value => {
      if (value) {
        runOnJS(stopTimer)();
      }
    },
    [],
  );

  const initGame = useCallback(
    (mode: 'classic' | 'timeAttack') => {
      tileIdCounter = 1;
      const initialTiles = addRandomTile(addRandomTile([]));
      tiles.value = initialTiles;
      setScore(0);
      isGameOver.value = false;
      stopTimer();

      if (mode === 'timeAttack') {
        setIsTimeAttack(true);
        setTimeLeft(180);
        timerRef.current = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              stopTimer();
              isGameOver.value = true;
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        setIsTimeAttack(false);
      }
    },
    [isGameOver, tiles, stopTimer],
  );

  useEffect(() => {
    initGame('classic');
    return () => stopTimer();
  }, [initGame, stopTimer]);

  // useEffect(() => {
  //   if (isGameOver.value) {
  //     Alert.alert(
  //       isTimeAttack ? '시간 초과!' : '게임 오버!',
  //       `점수: ${score}`,
  //       [{ text: '다시 시작', onPress: () => initGame('classic') }],
  //     );
  //   }
  // }, [isGameOver.value, score, initGame, isTimeAttack]);
  useAnimatedReaction(
    () => isGameOver.value,
    isOver => {
      if (isOver) {
        // runOnJS로 Alert 함수 호출을 감싸줍니다.
        runOnJS(Alert.alert)('게임 오버!', `점수: ${score}`, [
          { text: '다시 시작', onPress: () => initGame('classic') },
        ]);
      }
    },
  );

  const checkAndHandleGameOver = useCallback(
    (currentTiles: TileData[], scoreForAlert: number): void => {
      const board = createEmptyBoard();
      currentTiles.forEach(tile => {
        board[tile.y][tile.x] = tile.value;
      });

      const canMove = checkIfGameCanMove(board);
      const has2048Tile = currentTiles.some(tile => tile.value === 2048);

      if (has2048Tile) {
        isGameOver.value = true;
        Alert.alert('🎉 승리!', `점수: ${scoreForAlert}`, [
          { text: '다시 시작', onPress: () => initGame('classic') },
        ]);
        return;
      }

      if (!canMove) {
        isGameOver.value = true;
      }
    },
    [isGameOver, initGame],
  );

  const move = useCallback(
    (direction: Direction): void => {
      if (isGameOver.value) return;

      let board = createEmptyBoard();
      tiles.value.forEach(t => {
        board[t.y][t.x] = t.value;
      });
      const originalBoard = JSON.stringify(board);

      let rotations = 0;
      if (direction === 'UP') rotations = 3;
      if (direction === 'RIGHT') rotations = 2;
      if (direction === 'DOWN') rotations = 1;
      for (let i = 0; i < rotations; i++) board = rotateBoard(board);

      let scoreToAdd = 0;
      for (let y = 0; y < BOARD_SIZE; y++) {
        const row = board[y].filter(val => val !== 0);
        const newRow: number[] = [];
        for (let i = 0; i < row.length; i++) {
          if (i + 1 < row.length && row[i] === row[i + 1]) {
            const mergedValue = row[i] * 2;
            scoreToAdd += mergedValue;
            newRow.push(mergedValue);
            i++;
          } else {
            newRow.push(row[i]);
          }
        }
        const paddedRow = [
          ...newRow,
          ...Array(BOARD_SIZE - newRow.length).fill(0),
        ];
        board[y] = paddedRow;
      }

      for (let i = 0; i < (4 - rotations) % 4; i++) board = rotateBoard(board);

      let moved = JSON.stringify(board) !== originalBoard;
      let finalTiles = tiles.value;
      let finalScore = score;

      if (moved) {
        const newTiles: TileData[] = [];
        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            if (board[y][x] !== 0) {
              newTiles.push({ id: tileIdCounter++, value: board[y][x], x, y });
            }
          }
        }
        finalScore = score + scoreToAdd;
        setScore(finalScore);
        finalTiles = addRandomTile(newTiles);
        tiles.value = finalTiles;
      }

      checkAndHandleGameOver(finalTiles, finalScore);
    },
    [tiles, isGameOver, checkAndHandleGameOver, score],
  );

  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => runOnJS(move)('LEFT'))
    .enabled(isGameOver.value === false); // Shared Value 직접 사용

  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => runOnJS(move)('RIGHT'))
    .enabled(isGameOver.value === false); // Shared Value 직접 사용

  const upGesture = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => runOnJS(move)('UP'))
    .enabled(isGameOver.value === false); // Shared Value 직접 사용

  const downGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => runOnJS(move)('DOWN'))
    .enabled(isGameOver.value === false); // Shared Value 직접 사용

  const gesture = Gesture.Race(
    leftGesture,
    rightGesture,
    upGesture,
    downGesture,
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Veggie2048</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>🌽 점수</Text>
            <Text style={styles.score}>{score}</Text>
          </View>
          {isTimeAttack && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreTitle}>⏰ 시간</Text>
              <Text style={styles.score}>{formatTime(timeLeft)}</Text>
            </View>
          )}
        </View>

        <View style={styles.board}>
          {Array(BOARD_SIZE * BOARD_SIZE)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                style={[
                  styles.cell,
                  {
                    left:
                      (i % BOARD_SIZE) * (CELL_SIZE + CELL_MARGIN) +
                      CELL_MARGIN,
                    top:
                      Math.floor(i / BOARD_SIZE) * (CELL_SIZE + CELL_MARGIN) +
                      CELL_MARGIN,
                  },
                ]}
              />
            ))}
          {renderTiles.map(tile => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => initGame('classic')}
          >
            <Text style={styles.resetButtonText}>클래식 모드</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => initGame('timeAttack')}
          >
            <Text style={styles.resetButtonText}>타임 어택</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: BOARD_DIMENSION,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4e944f',
  },
  scoreContainer: {
    backgroundColor: '#a5d6a7',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  scoreTitle: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  board: {
    width: BOARD_DIMENSION,
    height: BOARD_DIMENSION,
    backgroundColor: '#c8e6c9',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  cell: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'rgba(200, 230, 200, 0.4)',
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: '#a5d6a7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  resetButton: {
    marginHorizontal: 10,
    backgroundColor: '#81c784',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen;
