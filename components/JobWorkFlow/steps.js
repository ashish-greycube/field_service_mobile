export const STEPS = [
    { key: 'travel_start',     label: 'Start Travel Timer', completionField: 'travel_start_time', completionLabel: 'Started at' },
    { key: 'travel_stop',      label: 'Stop Travel Timer',  completionField: 'travel_end_time',   completionLabel: 'End on' },
    { key: 'work_start',       label: 'Start Work Timer',   completionField: 'actual_start_time', completionLabel: 'Started at' },
    { key: 'work_description', label: 'Work Description',   completionField: 'job_description',   editable: true, noCompletedTag: true },
    { key: 'items',            label: 'Items',              completionField: 'consumed_items',    editable: true },
    { key: 'pictures',         label: 'Pictures',           completionField: 'proof_photo' },
    { key: 'user_feedback',    label: 'User Feedback',      completionField: 'client_remarks' },
    { key: 'signature',        label: 'Signature',          completionField: 'client_signature',  noPreview: true },
    { key: 'work_stop',        label: 'Stop Work Timer',    completionField: 'actual_end_time',   completionLabel: 'End on' },
  ];