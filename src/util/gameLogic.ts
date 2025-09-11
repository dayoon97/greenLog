// src/util/gameLogic.ts
import { BOARD_SIZE } from '../constants';
import type { Board } from '../types';

/**
 * 빈 4x4 보드를 생성합니다. (모든 값이 0)
 */
export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE)
    .fill(0)
    .map(() => Array(BOARD_SIZE).fill(0));
};

/**
 * 보드를 시계 방향으로 90도 회전합니다.
 */
export const rotateBoard = (board: Board): Board => {
  const newBoard: Board = createEmptyBoard();
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      newBoard[x][BOARD_SIZE - 1 - y] = board[y][x];
    }
  }
  return newBoard;
};

/**
 * 주어진 보드에서 더 이상 움직일 수 있는지 (병합 또는 이동) 확인합니다.
 */
export const checkIfGameCanMove = (board: Board): boolean => {
  // 빈 칸이 있는지 확인
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === 0) return true;
    }
  }

  // 인접한 타일이 같은 값을 가지는지 확인 (수평)
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE - 1; x++) {
      if (board[y][x] !== 0 && board[y][x] === board[y][x + 1]) return true;
    }
  }

  // 인접한 타일이 같은 값을 가지는지 확인 (수직)
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE - 1; y++) {
      if (board[y][x] !== 0 && board[y][x] === board[y + 1][x]) return true;
    }
  }

  return false;
};
