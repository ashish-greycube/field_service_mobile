import JobList from '@/components/JobListView/JobList'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Colors, View } from 'react-native-ui-lib'

const MainScreen = () => {
    return (
        <View style={styles.container}>
            <JobList/>
        </View>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey70,
    },
})