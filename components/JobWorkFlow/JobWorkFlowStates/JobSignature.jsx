import { useJob } from '@/context/JobContext';
import { FrappeContext } from 'frappe-react-sdk';
import React, { useContext, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

const webStyle = `
  .m-signature-pad { box-shadow: none; border: none; margin: 0; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { display: none; }
  body, html { width: 100%; height: 100%; margin: 0; padding: 0; background: transparent; }
  canvas { border-radius: 10px; }
`;

const JobSignature = ({ onComplete }) => {
  const { jobId } = useJob();
  const { db } = useContext(FrappeContext);
  const sigRef = useRef();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleConfirm = () => {
    sigRef.current?.readSignature();
  };

  const handleSignature = async (signature) => {
    setLoading(true);
    setError(null);
    try {
      await db.updateDoc('Job Order', jobId, { client_signature: signature });
      setVisible(false);
      onComplete({ signature });
    } catch (e) {
      setError(e?.message || 'Save failed.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    sigRef.current?.clearSignature();
    setIsEmpty(true);
  };

  const handleClose = () => {
    setVisible(false);
    setIsEmpty(true);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Button style={styles.openBtn} onPress={() => setVisible(true)}>
        <Text style={styles.openBtnText}>Add Signature</Text>
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
            <View style={styles.header}>
              <Text style={styles.title}>Client Signature</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Hint */}
            <Text style={styles.hint}>Ask client to sign in the box below</Text>

            {/* Signature pad */}
            <View style={styles.padContainer}>
              <SignatureCanvas
                ref={sigRef}
                onOK={handleSignature}
                onEmpty={() => {}}
                onBegin={() => setIsEmpty(false)}
                webStyle={webStyle}
                autoClear={false}
                descriptionText=""
                backgroundColor="rgb(246,246,249)"
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button style={styles.btnClear} onPress={handleClear}>
                <Text style={styles.btnClearText}>Clear</Text>
              </Button>
              <Button
                style={styles.btnConfirm}
                onPress={handleConfirm}
                disabled={loading || isEmpty}
              >
                <Text style={styles.btnConfirmText}>
                  {loading ? 'Saving…' : 'Confirm'}
                </Text>
              </Button>
            </View>

          </View>
        </RNView>
      </Modal>
    </View>
  );
};

export default JobSignature;

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 20,
  },
  dialog: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
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
  hint: {
    fontSize: 12,
    color: Colors.grey40,
    marginBottom: 12,
  },
  padContainer: {
    height: 220,
    borderWidth: 1.5,
    borderColor: Colors.violet60,
    borderRadius: 12,
    overflow: 'hidden',
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
  btnClear: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.grey40,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnClearText: {
    color: Colors.grey30,
    fontWeight: '600',
    fontSize: 14,
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
