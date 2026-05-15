import { useFrappeGetDocList } from 'frappe-react-sdk';
import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import JobItem from './JobItem';

const windowWidth = Dimensions.get("window").width;



const JobList = ({ onJobPress }) => {

  const { data, isValidating ,mutate } = useFrappeGetDocList("Job Order", {
    fields : ['name', 'client' , 'assign_to', 'job_date', 'customer_address', 'job_status', 'job_description','job_start_time']

  })


  return (
    <View style={styles.container}>
      <View style={styles.headerCapsule}>
        <Text style={styles.headerText}>Jobs</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <JobItem
            {...item}
            onPress={() => onJobPress?.(item)}
          />
        )}
        contentContainerStyle={data?.length === 0 && styles.emptyContent}
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
  headerCapsule: {
    width: windowWidth - 15,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.violet40,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    shadowColor: Colors.violet40,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  headerText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
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
