// src/components/Tile.tsx
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CELL_SIZE, CELL_MARGIN, TILE_STYLES } from '../constants';
import type { TileData } from '../types';

const Tile = ({ tile }: { tile: TileData }) => {
  const x = useSharedValue(tile.x);
  const y = useSharedValue(tile.y);
  const scale = useSharedValue(tile.isNew ? 0 : 1);

  useEffect(() => {
    x.value = tile.x;
    y.value = tile.y;
    scale.value = tile.isNew
      ? withSpring(1, { damping: 15, stiffness: 100 })
      : 1;
  }, [tile, x, y, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    const tileStyle = TILE_STYLES[tile.value] || {
      color: '#cdc1b4',
      emoji: '',
    };
    return {
      transform: [
        {
          translateX: withTiming(
            x.value * (CELL_SIZE + CELL_MARGIN) + CELL_MARGIN,
            { duration: 150 },
          ),
        },
        {
          translateY: withTiming(
            y.value * (CELL_SIZE + CELL_MARGIN) + CELL_MARGIN,
            { duration: 150 },
          ),
        },
        { scale: scale.value },
      ],
      backgroundColor: tileStyle.color,
    };
  });

  const emoji = TILE_STYLES[tile.value]?.emoji || '';

  return (
    <Animated.View style={[styles.tile, animatedStyle]}>
      <Text style={styles.tileText}>{emoji}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 32,
  },
});

export default Tile;
