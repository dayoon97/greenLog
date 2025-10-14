
# 🍀 가드니: 개인 식물 관리 기록 앱

## 📝 1. 프로젝트 개요

**프로젝트 이름:** 가드니

**설명:** 개인적인 식물 관리 및 성장 과정을 기록하고 관리하는 모바일 앱입니다. 캘린더를 통해 식물 관리를 기록하고, 사진을 통해 성장을 한눈에 확인할 수 있습니다.

**주요 기능:**

  * 캘린더 기반 일기 작성 및 관리
  * 사진 업로드 및 갤러리 뷰
  * 채소 2048 게임 제공

-----

## 💻 2. 기술 스택

**개발 언어:** TypeScript

**프레임워크:** React Native

**상태 관리:** `useState`, `useMemo`, `useCallback`, `useSharedValue`, `useAnimatedReaction` (Reanimated v3)

**UI 라이브러리:** React Native Elements (RNE)

**데이터 저장:** AsyncStorage

**탐색:** React Navigation

**제스처 처리:** `react-native-gesture-handler`

**코드 스타일:** ESLint, Prettier

-----

## 📂 3. 폴더 구조

생략

-----

## ✨ 4. 주요 컴포넌트 및 기능 설명

  * **App.tsx**:

      * 앱의 전체적인 상태를 관리합니다. (`diaries`, `isModalVisible`, `selectedDate`, `editingEntry`)
      * `AsyncStorage`를 이용해 일기 데이터를 영구적으로 저장하고 불러옵니다.
      * `DiaryModal`을 통해 **일기 작성, 수정, 삭제** 기능을 제공합니다.
      * `MainScreen`을 렌더링하여 앱의 핵심 화면을 표시합니다.

  * **MainScreen.tsx**:

      * **캘린더**, **사진 뷰**, **게임 탭**을 관리하며 탭 간 화면 전환을 담당합니다.
      * 일기 데이터 기반으로 캘린더에 활동을 표시해줍니다.
      * 사진 데이터 목록을 갤러리 형태로 보여줍니다.
      * '게임' 탭에서 게임 로비 또는 개별 게임을 실행합니다.

  * **DiaryModal.tsx**:

      * 일기 작성 및 수정을 위한 **모달 컴포넌트**입니다.
      * 날짜, 활동 선택, 메모 작성, 사진 업로드 기능을 제공합니다.

  * **GameLobbyScreen.tsx**:

      * 사용자가 선택할 수 있는 게임 목록(채소 2048, 옥수수 키우기)을 표시합니다.
      * 게임 선택 시 해당 게임 화면으로 이동합니다.

  * **Veggie2048Screen.tsx**:

      * **채소 2048 게임의 로직 및 UI**를 구현합니다.

  * **CornFarmingGameScreen.tsx**:

      * **옥수수 키우기 게임의 로직 및 UI**를 구현합니다.

  * **Tile.tsx**:

      * 2048 게임에서 **타일 UI를 표시**하고 애니메이션을 처리합니다.

-----

## 🎨 5. 주요 스타일

  * 앱 전체적으로 **밝고 자연 친화적인 색상**을 사용합니다. (예: 연한 녹색, 베이지색)
  * 컴포넌트 간의 일관성을 유지하기 위해 React Native Elements (RNE)의 기본 스타일을 적극적으로 활용합니다.
  * `StyleSheet.create`를 사용하여 스타일을 명확하게 정의하고 관리합니다.

-----

## 6. 스크린샷
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-09-16 at 11 09 52" src="https://github.com/user-attachments/assets/10bfc448-f128-4962-ae93-81c7e8984af5" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-09-16 at 11 12 56" src="https://github.com/user-attachments/assets/5d36d066-6328-4f80-8bab-173aef78d18b" />

-----

## 7. 문의
ekdbsekdbs@gmail.com


