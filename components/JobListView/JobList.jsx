import { AuthContext } from '@/context/AuthContext';
import { format, parse, parseISO } from 'date-fns';
import { useFocusEffect, useRouter } from 'expo-router';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import React, { useCallback, useContext } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Badge, Card, Colors, Text, View } from 'react-native-ui-lib';
import JobItem from './JobItem';

const fmtDate = (d) => d ? format(parseISO(d), 'dd-MM') : ''
const fmtTime = (t) => t ? format(parse(t, 'HH:mm:ss', new Date()), 'HH:mm') : ''

const JobList = ({ onJobPress }) => {
  const router = useRouter();
  const { userInfo } = useContext(AuthContext)

  const { data, isValidating, mutate } = useFrappeGetDocList("Job Order", {
    fields: ['name', 'client', 'assign_to', 'job_date', 'customer_address', 'job_status', 'job_description', 'job_start_time', 'job_end_time'],
    
  })

  useFocusEffect(useCallback(() => { mutate(); }, []));

  const activeJob = data?.find(job => job.job_status === 'In Progress')
  const pendingData = data?.filter(job => job.job_status !== 'Completed') ?? []
  const completedData = data?.filter(job => job.job_status === 'Completed') ?? []
  const listData = [
    ...pendingData,
    ...(completedData.length > 0 ? [{ _section: 'completed', name: '__completed_header__' }] : []),
    ...completedData,
  ]

  return (
    <View style={styles.container}>
      {activeJob ? (
        <Card
          style={styles.activeJobCard}
          onPress={() => router.push(`/(screens)/${activeJob.name}`)}
          activeOpacity={0.85}
        >
          <View style={styles.activeJobHeader}>
            <Text style={styles.activeJobTitle} numberOfLines={1}>{activeJob.name}</Text>
            <Badge
              label="In Progress"
              backgroundColor={Colors.orange30}
              labelStyle={styles.badgeLabel}
            />
          </View>
          <Text style={styles.activeJobMeta}>{fmtDate(activeJob.job_date)}{activeJob.job_start_time ? `  ·  ${fmtTime(activeJob.job_start_time)}` : ''} To {activeJob.job_end_time ? `${fmtTime(activeJob.job_end_time)}` : ''}</Text>

          <Text style={styles.activeJobClient} numberOfLines={1}>{activeJob.client}</Text>
          {activeJob.customer_address ? (
            <Text style={styles.activeJobAddress} numberOfLines={1}>{activeJob.customer_address.replace(/<[^>]*>?/gm, '')}</Text>
          ) : null}
          {activeJob.job_description ? (
            <Text style={styles.activeJobDesc} numberOfLines={2}>{activeJob.job_description}</Text>
          ) : null}
        </Card>
      ) : (
        <View style={styles.noActiveJob}>
          <Text style={styles.noActiveJobText}>No active job</Text>
        </View>
      )}
      <FlatList
        data={listData}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          if (item._section === 'completed') {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Completed Jobs</Text>
              </View>
            );
          }
          return (
            <JobItem
              {...item}
              onPress={() => {
                if (item.job_status !== 'Completed' && activeJob && activeJob.name !== item.name) {
                  Alert.alert(
                    'Job In Progress',
                    `You have an active job (${activeJob.name}) in progress. Please complete it before starting another.`,
                    [{ text: 'OK' }]
                  );
                  return;
                }
                router.push(`/(screens)/${item.name}`);
              }}
            />
          );
        }}
        contentContainerStyle={listData.length === 0 && styles.emptyContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No jobs found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshing={isValidating}
        onRefresh={mutate}
      />
    </View>
  )
}

export default JobList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey70,
  },
  activeJobCard: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.orange30,
    shadowColor: Colors.orange30,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  activeJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  activeJobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.grey10,
    flex: 1,
    marginRight: 8,
  },
  badgeLabel: {
    fontSize: 11,
  },
  activeJobMeta: {
    fontSize: 12,
    color: Colors.grey40,
    marginBottom: 4,
  },
  activeJobClient: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grey20,
    marginBottom: 2,
  },
  activeJobAddress: {
    fontSize: 13,
    color: Colors.grey40,
    marginBottom: 2,
  },
  activeJobDesc: {
    fontSize: 12,
    color: Colors.grey40,
    marginTop: 2,
  },
  noActiveJob: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.grey50,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noActiveJobText: {
    fontSize: 14,
    color: Colors.grey40,
  },
  sectionHeader: {
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.green40,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green30,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  emptyContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.grey40,
  },
})
