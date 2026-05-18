import { useJob } from '@/context/JobContext';
import { useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react';
import { Modal, View as RNView, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

const JobDiscription = ({ onComplete, isEdit = false }) => {
  const { jobId } = useJob();
  const { data: jobDoc } = useFrappeGetDoc('Job Order', jobId);
  const { updateDoc, loading, error, isCompleted } = useFrappeUpdateDoc();

  const [visible, setVisible]           = useState(false);
  const [additionalText, setAdditionalText] = useState('');

  const existingDesc = jobDoc?.job_description || '';

  const handleUpdate = () => {
    const combined = existingDesc
      ? `${existingDesc}\n\n${additionalText}`
      : additionalText;
    updateDoc('Job Order', jobId, { job_description: combined });
  };

  useEffect(() => {
    if (isCompleted) {
      setVisible(false);
      onComplete({ description: additionalText });
    }
  }, [isCompleted]);

  const handleSame = () => {
    setVisible(false);
    onComplete({});
  };

  return (
    <View style={styles.container}>
      <Button
        style={[styles.openBtn, isEdit && styles.openBtnEdit]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.openBtnText, isEdit && styles.openBtnEditText]}>
          Description
        </Text>
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <RNView style={styles.overlay}>
          <View style={styles.dialog}>

            <Text style={styles.dialogTitle}>Work Description</Text>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>Current Description</Text>
              <View style={styles.existingBox}>
                <Text style={styles.existingText}>
                  {existingDesc || 'No description yet.'}
                </Text>
              </View>

              <Text style={styles.sectionLabel}>Add to Description</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={additionalText}
                onChangeText={setAdditionalText}
                placeholder="Type additional notes…"
                placeholderTextColor={Colors.grey40}
                textAlignVertical="top"
              />

              {error && (
                <Text style={styles.errorText}>{error.message || 'Update failed.'}</Text>
              )}
            </ScrollView>

            <View style={styles.actions}>
              <Button style={styles.btnSame} onPress={handleSame}>
                <Text style={styles.btnSameText}>Same</Text>
              </Button>
              <Button
                style={styles.btnUpdate}
                onPress={handleUpdate}
                disabled={loading || !additionalText.trim()}
              >
                <Text style={styles.btnUpdateText}>
                  {loading ? 'Saving…' : 'Update'}
                </Text>
              </Button>
            </View>

          </View>
        </RNView>
      </Modal>
    </View>
  );
};

export default JobDiscription;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  openBtn: {
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  openBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  openBtnEdit: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.green40,
    marginTop: 8,
  },
  openBtnEditText: {
    color: Colors.green40,
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingTop: 300,
  },
  dialog: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: '75%',
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.grey10,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.grey30,
    marginBottom: 6,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  existingBox: {
    backgroundColor: Colors.grey70,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    minHeight: 60,
  },
  existingText: {
    fontSize: 14,
    color: Colors.grey20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.violet60,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.grey10,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: Colors.red30,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnSame: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.grey40,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnSameText: {
    color: Colors.grey30,
    fontWeight: '600',
    fontSize: 14,
  },
  btnUpdate: {
    flex: 1,
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnUpdateText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
