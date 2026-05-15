import React from 'react'
import { StyleSheet } from 'react-native'
import { Badge, Card, Colors, Text, View } from 'react-native-ui-lib'

const STATUS_COLORS = {
  'Open': Colors.blue30,
  'In Progress': Colors.orange30,
  'Completed': Colors.green30,
  'Cancelled': Colors.red30,
}

const getStatusColor = (status) => STATUS_COLORS[status] ?? Colors.grey30

const JobItem = ({
  name,
  client,
  job_start_time,
  job_date,
  customer_address,
  job_status,
  job_description,
}) => {
  return (
    <Card
      style={styles.card}
      onPress={() => router.push(`/(screens)/(AR)/${name}`)}
      activeOpacity={0.85}
    >
      {/* Left time column */}
      <View style={styles.timeColumn}>
        <Text style={styles.jobDate}>{job_date}</Text>
        <Text style={styles.scheduledTime}>{job_start_time}</Text>
      </View>

      {/* Vertical divider bar */}
      <View style={styles.divider} />

      {/* Middle content column */}
      <View style={styles.contentColumn}>
        <Text style={styles.jobId} numberOfLines={1}>{name}</Text>
        <Text style={styles.customerName} numberOfLines={1}>{client}</Text>
        <Text style={styles.address} numberOfLines={1}>{customer_address}</Text>
        <Text style={styles.description} numberOfLines={2}>{job_description}</Text>
      </View>

      {/* Right badge column */}
      <View style={styles.badgeColumn}>
        <Badge
          label={job_status}
          backgroundColor={getStatusColor(job_status)}
          labelStyle={styles.badgeLabel}
        />
      </View>
    </Card>
  )
}

export default JobItem

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 16,
  },
  timeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  jobDate: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.grey10,
  },
  scheduledTime: {
    fontSize: 12,
    color: Colors.grey40,
    marginTop: 2,
  },
  divider: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: Colors.blue30,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  contentColumn: {
    flex: 1,
    paddingRight: 8,
  },
  jobId: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.grey10,
  },
  customerName: {
    fontSize: 12,
    color: Colors.grey30,
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    color: Colors.grey30,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: Colors.grey40,
    marginTop: 2,
  },
  badgeColumn: {
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: 11,
  },
})
