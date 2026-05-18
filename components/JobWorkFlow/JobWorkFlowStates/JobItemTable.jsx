import { useJob } from '@/context/JobContext';
import { useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  View as RNView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, Picker, Text, View } from 'react-native-ui-lib';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const EMPTY_ROW     = () => ({ item_code: '', qty: '' });

// ── Row ───────────────────────────────────────────────────────────────────────

const ItemRow = ({ row, index, onChange, onRemove, showRemove, pickerItems }) => (
  <View style={rowStyles.container}>

    <View style={rowStyles.pickerWrap}>
      <Picker
        value={row.item_code || null}
        onChange={(val) => onChange(index, 'item_code', val)}
        placeholder="Select Item"
        items={pickerItems}
        style={rowStyles.picker}
        fieldType={Picker.fieldTypes.filter}
        enableModalBlur={false}
        useSafeArea
      />
    </View>

    <TextInput
      style={rowStyles.qtyInput}
      value={row.qty}
      onChangeText={(v) => onChange(index, 'qty', v)}
      placeholder="Qty"
      placeholderTextColor={Colors.grey40}
      keyboardType="numeric"
    />

    {showRemove && (
      <TouchableOpacity style={rowStyles.removeBtn} onPress={() => onRemove(index)}>
        <Text style={rowStyles.removeBtnText}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
);

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pickerWrap: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.violet60,
    borderRadius: 8,
    backgroundColor: Colors.grey80,
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: 44,
  },
  picker: {
    fontSize: 14,
    color: Colors.grey10,
  },
  qtyInput: {
    width: 72,
    height: 44,
    borderWidth: 1.5,
    borderColor: Colors.violet60,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: Colors.grey10,
    backgroundColor: Colors.grey80,
    textAlign: 'center',
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.red70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: Colors.red30,
    fontWeight: '700',
    fontSize: 13,
  },
});

// ── Main ──────────────────────────────────────────────────────────────────────

const JobItemTable = ({ onComplete, isEdit = false, initialItems }) => {
  const { jobId } = useJob();
  const { updateDoc, loading, error, isCompleted } = useFrappeUpdateDoc();
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);
  const [rows, setRows]       = useState(
    initialItems?.length
      ? initialItems.map(i => ({ item_code: i.item_code, qty: String(i.qty) }))
      : [EMPTY_ROW()]
  );

  const { data: itemList = [] } = useFrappeGetDocList('Item', {
    fields: ['item_code', 'item_name'],
    limit: 200,
  });

  const pickerItems = itemList.map(item => ({
    value: item.item_code,
    label: item.item_name ? `${item.item_name} (${item.item_code})` : item.item_code,
  }));

  const updateRow = (index, field, value) =>
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));

  const removeRow = (index) =>
    setRows(prev => prev.filter((_, i) => i !== index));

  const validRows = rows.filter(r => r.item_code && r.qty);

  const handleSubmit = () => {
    if (validRows.length === 0) {
      setVisible(false);
      onComplete({ items: [] });
      return;
    }
    updateDoc('Job Order', jobId, {
      consumed_items: validRows.map(r => ({
        item_code: r.item_code,
        qty: parseFloat(r.qty),
      })),
    });
  };

  useEffect(() => {
    if (isCompleted) {
      setVisible(false);
      onComplete({ items: validRows.map(r => ({ item_code: r.item_code, qty: r.qty })) });
    }
  }, [isCompleted]);

  return (
    <View style={styles.container}>
      <Button
        style={[styles.openBtn, isEdit && styles.openBtnEdit]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.openBtnText, isEdit && styles.openBtnEditText]}>{isEdit ? 'Edit Items' : 'Add Items'}</Text>
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <RNView style={styles.overlay}>
          <View style={[styles.sheet, { height: SCREEN_HEIGHT * 0.58, paddingBottom: insets.bottom + 16 }]}>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Consumed Items</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => setRows([EMPTY_ROW()])}
                >
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Column labels */}
            <View style={styles.colHeader}>
              <Text style={[styles.colLabel, { flex: 1 }]}>Item</Text>
              <Text style={[styles.colLabel, { width: 72 }]}>Qty</Text>
              <View style={{ width: 34 }} />
            </View>

            {/* Rows */}
            <ScrollView
              style={styles.rowList}
              contentContainerStyle={{ paddingBottom: 8 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {rows.map((row, index) => (
                <ItemRow
                  key={index}
                  row={row}
                  index={index}
                  onChange={updateRow}
                  onRemove={removeRow}
                  showRemove={rows.length > 1}
                  pickerItems={pickerItems}
                />
              ))}
            </ScrollView>

            {/* Add row */}
            <TouchableOpacity
              style={styles.addRowBtn}
              onPress={() => setRows(prev => [...prev, EMPTY_ROW()])}
            >
              <Text style={styles.addRowText}>+ Add Row</Text>
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorText}>{error.message || 'Update failed.'}</Text>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button style={styles.btnCancel} onPress={() => setVisible(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </Button>
              <Button
                style={styles.btnSubmit}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.btnSubmitText}>
                  {loading ? 'Saving…' : validRows.length === 0 ? 'Skip' : `Submit  (${validRows.length})`}
                </Text>
              </Button>
            </View>

          </View>
        </RNView>
      </Modal>
    </View>
  );
};

export default JobItemTable;

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
  openBtnEdit: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.green40,
    marginTop: 8,
  },
  openBtnEditText: {
    color: Colors.green40,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.grey10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.red40,
  },
  resetBtnText: {
    color: Colors.red30,
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 18,
    color: Colors.grey30,
    fontWeight: '600',
    padding: 4,
  },
  colHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.grey30,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowList: {
    flex: 1,
  },
  addRowBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.violet50,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: 4,
    marginBottom: 14,
  },
  addRowText: {
    color: Colors.violet30,
    fontWeight: '600',
    fontSize: 13,
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
  btnCancel: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.grey40,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnCancelText: {
    color: Colors.grey30,
    fontWeight: '600',
    fontSize: 14,
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnSubmitText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
