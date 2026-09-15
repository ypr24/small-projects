import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { PMItemType, readPmList } from '../../services/pmData';

const PMList = () => {
  const [items, setItems] = useState<PMItemType[]>([]);

  useEffect(() => {
    readPmList().then(setItems);
  }, []);

  const renderItem = ({ item }: { item: PMItemType }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.term}>{item.term}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Republic of India</Text>
          <Text style={styles.headerTitle}>PM List</Text>
          <Text style={styles.headerSubtitle}>Leaders who shaped modern India</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{items.length}</Text>
          <Text style={styles.headerBadgeLabel}>PMs</Text>
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    paddingTop: StatusBar.currentHeight || 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 14,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#102a43',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#627d98',
    fontWeight: '600',
  },
  headerBadge: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff4e6',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f7c873',
  },
  headerBadgeText: {
    color: '#b45309',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
  },
  headerBadgeLabel: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d9e2ec',
    shadowColor: '#102a43',
    shadowOpacity: 0.08,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 13,
    backgroundColor: '#d9e2ec',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102a43',
    marginBottom: 6,
  },
  term: {
    fontSize: 12.5,
    lineHeight: 17,
    color: '#627d98',
  },
});

export default PMList;
