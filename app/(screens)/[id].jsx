import JobTimeline from '@/components/JobWorkFlow/JobTimeline';
import { JobProvider } from '@/context/JobContext';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';

const JobScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <JobProvider jobId={id}>
      <View style={styles.container}>
        <View style={styles.jobIdRow}>
          <Text style={styles.jobIdText}>{id}</Text>
        </View>
        <JobTimeline />
      </View>
    </JobProvider>
  );
};

export default JobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey70,
  },
  jobIdRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  jobIdText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.grey10,
    letterSpacing: 0.3,
  },
});
