import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const JobScreen = () => {

  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>JobScreen</Text>
    </View>
  )
}

export default JobScreen

const styles = StyleSheet.create({})