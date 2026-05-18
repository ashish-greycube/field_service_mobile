import { useJob } from '@/context/JobContext';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Text, Timeline, View } from 'react-native-ui-lib';
import JobDiscription from './JobWorkFlowStates/JobDiscription';
import JobImage from './JobWorkFlowStates/JobImage';

import JobFeedback from './JobWorkFlowStates/JobFeedback';
import JobSignature from './JobWorkFlowStates/JobSignature';
import JobItemTable from './JobWorkFlowStates/JobItemTable';
import JobStartStop from './JobWorkFlowStates/JobStart_Stop';
import JobTravelTime from './JobWorkFlowStates/JobTravelTime';
import { STEPS } from './steps';

const StepPlaceholder = ({ label, onComplete }) => (
  <View style={styles.stepBody}>
    <TouchableOpacity style={styles.completeBtn} onPress={() => onComplete({})}>
      <Text style={styles.completeBtnText}>{label}</Text>
    </TouchableOpacity>
  </View>
);

const STEP_COMPONENTS = {
  travel_start:     ({ onComplete }) => <JobTravelTime mode="start" onComplete={onComplete} />,
  travel_stop:      ({ onComplete }) => <JobTravelTime mode="stop"  onComplete={onComplete} />,
  work_start:       ({ onComplete }) => <JobStartStop mode="start" onComplete={onComplete} />,
  work_description: ({ onComplete, isEdit }) => <JobDiscription onComplete={onComplete} isEdit={isEdit} />,
  items:            ({ onComplete, isEdit, initialItems }) => <JobItemTable onComplete={onComplete} isEdit={isEdit} initialItems={initialItems} />,
  pictures:         ({ onComplete }) => <JobImage onComplete={onComplete} />,
  user_feedback:    ({ onComplete }) => <JobFeedback onComplete={onComplete} />,
  signature:        ({ onComplete }) => <JobSignature onComplete={onComplete} />,
  work_stop:        ({ onComplete }) => <JobStartStop mode="stop"  onComplete={onComplete} />,
};

const JobTimeline = () => {
  const { currentStep, stepData, advanceStep, editStep } = useJob();

  const pointState = (i) => {
    if (i < currentStep)   return Timeline.states.SUCCESS;
    if (i === currentStep) return Timeline.states.CURRENT;
    return Timeline.states.NEXT;
  };

  const lineState = (i) => {
    if (i < currentStep)   return Timeline.states.SUCCESS;
    if (i === currentStep) return Timeline.states.CURRENT;
    return Timeline.states.NEXT;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {STEPS.map((step, i) => {
        const isFirst   = i === 0;
        const isLast    = i === STEPS.length - 1;
        const isCurrent = i === currentStep;
        const isDone    = i < currentStep;

        const ActiveComponent = STEP_COMPONENTS[step.key];

        return (
          <Timeline
            key={step.key}
            topLine={isFirst ? undefined : {
              state: lineState(i - 1),
              type: Timeline.lineTypes.SOLID,
            }}
            bottomLine={isLast ? undefined : {
              state: lineState(i),
              type: isDone ? Timeline.lineTypes.SOLID : Timeline.lineTypes.DASHED,
            }}
            point={{
              state: pointState(i),
              type: isDone
                ? Timeline.pointTypes.BULLET
                : isCurrent
                  ? Timeline.pointTypes.OUTLINE
                  : Timeline.pointTypes.CIRCLE,
              label: isDone ? undefined : String(i + 1),
            }}
          >
            <View style={[
              styles.card,
              isCurrent && styles.cardActive,
              isDone    && styles.cardDone,
            ]}>
              <Text style={[
                styles.cardLabel,
                isCurrent && styles.cardLabelActive,
                isDone    && styles.cardLabelDone,
                !isCurrent && !isDone && styles.cardLabelFuture,
              ]}>
                {step.label}
              </Text>

              {isDone && (
                <>
                  {!step.noCompletedTag && (
                    step.completionLabel
                      ? (stepData[step.key]?.time
                          ? <Text style={styles.completedTag}>{step.completionLabel}  {stepData[step.key].time}</Text>
                          : <Text style={styles.completedTag}>Completed</Text>)
                      : <Text style={styles.completedTag}>Completed</Text>
                  )}
                  {!step.noPreview && !step.completionLabel && stepData[step.key]?.time && (
                    <Text style={styles.completedTime}>{stepData[step.key].time}</Text>
                  )}
                  {stepData[step.key]?.items?.map((item, idx) => (
                    <Text key={idx} style={styles.completedTime}>
                      {item.item_code}  ×  {item.qty}
                    </Text>
                  ))}
                  {step.editable && (
                    <ActiveComponent
                      isEdit
                      initialItems={stepData[step.key]?.items}
                      onComplete={(collected) => editStep(step.key, collected)}
                    />
                  )}
                </>
              )}

              {isCurrent && (
                <ActiveComponent
                  onComplete={(collected) => advanceStep(step.key, collected)}
                />
              )}
            </View>
          </Timeline>
        );
      })}
    </ScrollView>
  );
};

export default JobTimeline;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  card: {
    marginLeft: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.grey60,
  },
  cardActive: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.yellow30,
    shadowColor: Colors.yellow30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: {
    backgroundColor: Colors.green80,
    borderWidth: 1,
    borderColor: Colors.green60,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.grey20,
  },
  cardLabelActive: {
    color: Colors.grey10,
  },
  cardLabelDone: {
    color: Colors.green20,
    fontWeight: '600',
  },
  cardLabelFuture: {
    color: Colors.grey40,
    fontWeight: '500',
  },
  completedTag: {
    fontSize: 11,
    color: Colors.green30,
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  completedTime: {
    fontSize: 13,
    color: Colors.green20,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  stepBody: {
    marginTop: 10,
  },
  completeBtn: {
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  completeBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
