import { useJob } from '@/context/JobContext';
import { format } from 'date-fns';
import { useFrappeUpdateDoc } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

const FIELD = {
  start: 'actual_start_time',
  stop: 'actual_end_time',
};

const JobStartStop = ({ mode = 'start', onComplete }) => {
  const { jobId } = useJob();
  const { updateDoc, loading, error, isCompleted } = useFrappeUpdateDoc();
  const [capturedTime, setCapturedTime] = useState(null);

  const isStart = mode === 'start';

  const handlePress = () => {
    const now = new Date();
    const time = format(now, 'HH:mm:ss');

    const payload = { [FIELD[mode]]: time };
    if (!isStart) payload.job_status = 'Completed';

    setCapturedTime({ time, timestamp: now.getTime() });
    updateDoc('Job Order', jobId, payload);
  };

  useEffect(() => {
    if (isCompleted && capturedTime) {
      onComplete(capturedTime);
    }
  }, [isCompleted]);

  return (
    <View style={styles.container}>
      <Button
        style={[styles.btn, isStart ? styles.btnStart : styles.btnStop]}
        onPress={handlePress}
        disabled={loading}
      >
        <Text style={[styles.btnText, isStart ? styles.btnTextStart : styles.btnTextStop]}>
          {loading ? 'Saving…' : isStart ? 'Start' : 'Stop'}
        </Text>
      </Button>

      {error && (
        <Text style={styles.errorText}>{error.message || 'Update failed. Tap to retry.'}</Text>
      )}
    </View>
  );
};

export default JobStartStop;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  btnStart: {
    backgroundColor: Colors.violet30,
  },
  btnStop: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.red30,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  btnTextStart: {
    color: Colors.white,
  },
  btnTextStop: {
    color: Colors.red30,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.red30,
    fontWeight: '500',
  },
});
