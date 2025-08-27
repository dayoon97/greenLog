import React, { useState, useEffect, JSX } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Overlay, Input, Button, Chip } from '@rneui/themed';
import { launchImageLibrary } from 'react-native-image-picker';
import { DiaryEntry } from '../types';

const ALL_ACTIVITIES = [
  '물주기',
  '잎정리',
  '분갈이',
  '비료주기',
  '가지치기',
  '해충방제',
  '수확',
  '기타',
];

type DiaryModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (entry: Omit<DiaryEntry, 'id'>) => void;
  onDelete: (date: string) => void;
  date: string;
  initialData?: DiaryEntry;
};

const DiaryModal = ({
  isVisible,
  onClose,
  onSave,
  onDelete,
  date,
  initialData,
}: DiaryModalProps): JSX.Element => {
  const [activities, setActivities] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>('');

  useEffect(() => {
    if (initialData) {
      setActivities(initialData.activities || []);
      setMemo(initialData.memo || '');
      setPhotoUri(initialData.photoUri || '');
    } else {
      setActivities([]);
      setMemo('');
      setPhotoUri('');
    }
  }, [initialData, isVisible]);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        setPhotoUri(response.assets[0].uri);
      }
    });
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity],
    );
  };

  const handleSave = () => {
    try {
      onSave({
        date,
        activities: activities || [],
        memo: memo || '',
        photoUri: photoUri || '',
      });
    } catch (error) {
      console.error('Diary save error:', error);
    } finally {
      onClose();
    }
  };

  const handleDelete = () => {
    try {
      onDelete(date);
    } catch (error) {
      console.error('Diary delete error:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={styles.overlay}
    >
      <View>
        <Text style={styles.modalTitle}>{date.replace(/-/g, '.')} 기록</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>X</Text>
        </TouchableOpacity>

        <Text style={styles.label}>활동 선택</Text>
        <View style={styles.chipContainer}>
          {ALL_ACTIVITIES.map(act => (
            <Chip
              key={act}
              title={act}
              type={activities.includes(act) ? 'solid' : 'outline'}
              onPress={() => toggleActivity(act)}
              containerStyle={styles.chip}
              buttonStyle={
                activities.includes(act)
                  ? { backgroundColor: 'black' }
                  : { borderColor: '#ccc' }
              }
              titleStyle={{
                color: activities.includes(act) ? 'white' : 'black',
                fontWeight: 'bold',
              }}
            />
          ))}
        </View>

        <Text style={styles.label}>사진</Text>
        {photoUri ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity
              style={styles.photoRemoveButton}
              onPress={() => setPhotoUri('')}
            >
              <Text style={styles.photoRemoveButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.photoInput}
            onPress={handleChoosePhoto}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 6 }}>
              +
            </Text>
            <Text style={styles.photoInputText}>사진 추가</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>메모</Text>
        <Input
          placeholder="오늘의 식물 상태는 어떤가요?"
          value={memo}
          onChangeText={setMemo}
          multiline
          inputContainerStyle={styles.memoInput}
          containerStyle={{ paddingHorizontal: 0 }}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="삭제"
            type="clear"
            onPress={handleDelete}
            titleStyle={{ color: 'red' }}
          />
          <Button
            title="취소"
            type="solid"
            onPress={onClose}
            containerStyle={{ flex: 1, marginRight: 8 }}
            buttonStyle={{ backgroundColor: '#eee' }}
            titleStyle={{ color: '#555', fontWeight: 'bold' }}
          />
          <Button
            title="저장"
            onPress={handleSave}
            containerStyle={{ flex: 1, marginLeft: 8 }}
            buttonStyle={{ backgroundColor: 'black' }}
            titleStyle={{ fontWeight: 'bold' }}
          />
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: { borderRadius: 24, padding: 24, width: '90%' },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
    zIndex: 1,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#555' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { margin: 4 },
  photoContainer: {
    marginBottom: 16,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  photoRemoveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoRemoveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  photoInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  photoInputText: { marginLeft: 8, color: '#888', fontWeight: 'bold' },
  memoInput: {
    borderWidth: 0,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
});

export default DiaryModal;