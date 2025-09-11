import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { DiaryEntry } from '../types';

// MainScreen.tsx의 getActivityColor를 기반으로 활동 목록을 정의합니다.
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
}: DiaryModalProps) => {
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  useEffect(() => {
    if (isVisible) {
      if (initialData) {
        setNotes(initialData.notes || '');
        setActivities(initialData.activities || []);
        setPhotoUri(initialData.photoUri);
      } else {
        // 새 일기를 위해 폼을 초기화합니다.
        setNotes('');
        setActivities([]);
        setPhotoUri(undefined);
      }
    }
  }, [initialData, isVisible]);

  const handleSave = () => {
    onSave({ date, notes, activities, photoUri });
    onClose();
  };

  const handleDelete = () => {
    onDelete(date);
    onClose();
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{date}</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>사진</Text>
                <TouchableOpacity
                  style={styles.photoContainer}
                  onPress={handleChoosePhoto}
                >
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>
                        + 사진 추가
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {photoUri && (
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => setPhotoUri(undefined)}
                  >
                    <Text style={styles.removePhotoText}>사진 삭제</Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.label}>활동</Text>
                <View style={styles.activityContainer}>
                  {ALL_ACTIVITIES.map(activity => (
                    <TouchableOpacity
                      key={activity}
                      style={[
                        styles.activityChip,
                        activities.includes(activity) &&
                          styles.activityChipSelected,
                      ]}
                      onPress={() => toggleActivity(activity)}
                    >
                      <Text
                        style={[
                          styles.activityText,
                          activities.includes(activity) &&
                            styles.activityTextSelected,
                        ]}
                      >
                        {activity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>식물 상태 기록</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="오늘 식물의 상태는 어떤가요?"
                  value={notes}
                  onChangeText={setNotes}
                />
              </ScrollView>

              <View style={styles.buttonRow}>
                {initialData && (
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                  >
                    <Text style={styles.buttonText}>삭제</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>닫기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 8 },
  photoContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  removePhotoButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  removePhotoText: {
    color: '#EF4444',
    fontSize: 14,
  },
  textInput: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  button: { borderRadius: 10, padding: 10, elevation: 2, marginLeft: 10 },
  saveButton: { backgroundColor: '#22C55E' },
  closeButton: { backgroundColor: '#9CA3AF' },
  deleteButton: { backgroundColor: '#EF4444', marginRight: 'auto' },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  activityContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  activityChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  activityChipSelected: { backgroundColor: '#3B82F6' },
  activityText: { color: '#4B5563', fontSize: 14 },
  activityTextSelected: { color: 'white' },
});

export default DiaryModal;
