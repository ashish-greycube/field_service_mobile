import { useJob } from '@/context/JobContext';
import { useFrappeUpdateDoc } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View as RNView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

const JobFeedback = ({ onComplete }) => {
  const { jobId } = useJob();
  const { updateDoc, loading, error, isCompleted } = useFrappeUpdateDoc();

  const [visible, setVisible] = useState(false);
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    if (!remarks.trim()) return;
    updateDoc('Job Order', jobId, { client_remarks: remarks.trim() });
  };

  useEffect(() => {
    if (isCompleted) {
      setVisible(false);
      onComplete({ remarks });
    }
  }, [isCompleted]);

  const handleClose = () => {
    setVisible(false);
    setRemarks('');
  };

  return (
    <View style={styles.container}>
      <Button style={styles.openBtn} onPress={() => setVisible(true)}>
        <Text style={styles.openBtnText}>Add Feedback</Text>
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <RNView style={styles.overlay}>
          <View style={styles.dialog}>

            {/* Header */}
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Client Remarks</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Input */}
            <TextInput
              style={styles.textarea}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Enter client feedback or remarks…"
              placeholderTextColor={Colors.grey40}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCounter}>{remarks.length} / 500</Text>

            {error && (
              <Text style={styles.errorText}>{error.message || 'Save failed.'}</Text>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button style={styles.btnCancel} onPress={handleClose}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </Button>
              <Button
                style={styles.btnSubmit}
                onPress={handleSubmit}
                disabled={loading || !remarks.trim()}
              >
                <Text style={styles.btnSubmitText}>
                  {loading ? 'Saving…' : 'Submit'}
                </Text>
              </Button>
            </View>

          </View>
        </RNView>
      </Modal>
    </View>
  );
};

export default JobFeedback;

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
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.grey10,
  },
  closeBtn: {
    fontSize: 18,
    color: Colors.grey30,
    fontWeight: '600',
    padding: 4,
  },
  textarea: {
    minHeight: 130,
    borderWidth: 1.5,
    borderColor: Colors.violet60,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.grey10,
    backgroundColor: Colors.grey80,
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 11,
    color: Colors.grey40,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 12,
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
  btnCancel: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.grey40,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnCancelText: {
    color: Colors.grey30,
    fontWeight: '600',
    fontSize: 14,
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnSubmitText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
