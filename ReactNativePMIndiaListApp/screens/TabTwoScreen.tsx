import * as React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PMItemType, readPmList, resetPmList, savePmList } from '../services/pmData';

const fields: Array<{ key: keyof PMItemType; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'term', label: 'Term' },
  { key: 'url', label: 'Image URL' },
];

export default function TabTwoScreen() {
  const [items, setItems] = React.useState<PMItemType[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      const data = await readPmList();
      setItems(data);
      setSelectedId(data[0]?.id ?? null);
    };
    load();
  }, []);

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  const updateField = (key: keyof PMItemType, value: string) => {
    if (!selectedId) return;
    setItems((prev) => prev.map((item) => (item.id === selectedId ? { ...item, [key]: value } : item)));
  };

  const save = async () => {
    await savePmList(items);
    Alert.alert('Saved', 'PM data updated successfully.');
  };

  const reset = async () => {
    const next = await resetPmList();
    setItems(next);
    setSelectedId(next[0]?.id ?? null);
    Alert.alert('Reset', 'Default PM list restored.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>PM manager</Text>
          <Text style={styles.title}>Edit Information</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={save}>
          <Text style={styles.primaryText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.panel}>
          <Text style={styles.label}>Prime Ministers</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedId(item.id)}
                style={[styles.row, selectedId === item.id && styles.rowSelected]}>
                <Text style={styles.rowText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.panel}>
          {selectedItem ? (
            <>
              <Text style={styles.label}>Selected record</Text>
              {fields.map(({ key, label }) => (
                <React.Fragment key={key}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TextInput
                    style={[styles.input, key !== 'name' && styles.textArea]}
                    value={String(selectedItem[key])}
                    onChangeText={(text) => updateField(key, text)}
                    multiline={key !== 'name'}
                  />
                </React.Fragment>
              ))}
            </>
          ) : (
            <Text>No PM selected.</Text>
          )}

          <Pressable style={styles.secondaryButton} onPress={reset}>
            <Text style={styles.secondaryText}>Reset to default</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef4ff',
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#4f46e5',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#111827',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  row: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowSelected: {
    backgroundColor: '#e0e7ff',
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  rowText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  secondaryButton: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  secondaryText: {
    color: '#3730a3',
    fontWeight: '700',
  },
});
