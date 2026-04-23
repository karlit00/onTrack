import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHabits, patchHabit } from '../../api/habits';
import HabitCard from '../../components/ui/HabitCard';

interface Habit {
  _id: string;
  title: string;
  description?: string;
  streak: number;
  completed: boolean;
  targetCount: number;
  currentCount?: number;
}

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const completedToday = habits.filter((h) => h.completed).length;

  const loadHabits = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const handleToggle = async (id: string) => {
    const originalHabits = [...habits];
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id === id) {
          const isDone = h.targetCount > 1 
            ? (h.currentCount || 0) + 1 >= h.targetCount 
            : !h.completed;
          return { ...h, completed: isDone, currentCount: (h.currentCount || 0) + 1 };
        }
        return h;
      })
    );

    try {
      const updated = await patchHabit(id, { increment: true });
      setHabits((prev) => prev.map((h) => (h._id === id ? updated : h)));
    } catch (err) {
      setHabits(originalHabits);
    }
  };

  const confirmLogout = async () => {
    setLogoutVisible(false);
    await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={styles.loadingText}>SYNCING_DATA...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>YOUR BOARD</Text>
          <Text style={styles.headerTitle}>MY HABITS</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutVisible(true)}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContent}>
          <StatBox label="HABITS" value={habits.length} sub="TRACKED" bg="#FFD600" />
          <StatBox label="STREAK" value={bestStreak} sub="BEST" bg="#C62828" color="#fff" />
          <StatBox label="DONE" value={completedToday} sub="TODAY" bg="#1a1a1a" color="#FFD600" />
        </ScrollView>
      </View>

      {/* LIST */}
      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHabits(); }} />}
      >
        {habits.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>NO HABITS YET.</Text>
          </View>
        ) : (
          habits.map((habit, i) => (
            <HabitCard key={habit._id} habit={habit} index={i} onToggle={handleToggle} />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BAUHAUS LOGOUT MODAL */}
      <Modal animationType="fade" transparent visible={logoutVisible} onRequestClose={() => setLogoutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bauhausContainer}>
            <View style={styles.blueCircle} />
            <View style={styles.redSquare} />
            <Text style={styles.modalLabel}>SYSTEM_EXIT</Text>
            <Text style={styles.modalTitle}>CONFIRM{"\n"}LOGOUT?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#FFD600' }]} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.modalBtnText}>STAY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#1a1a1a' }]} onPress={confirmLogout}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>EXIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const StatBox = ({ label, value, sub, bg, color }: any) => (
  <View style={[styles.statCard, styles.statShadow, { backgroundColor: bg }]}>
    <Text style={[styles.statLabel, { color: color || '#1a1a1a' }]}>{label}</Text>
    <Text style={[styles.statValue, { color: color || '#1a1a1a' }]}>{value}</Text>
    <Text style={[styles.statSub, { color: color || '#1a1a1a' }]}>{sub}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F0E8' },
  loadingText: { marginTop: 14, fontSize: 10, fontWeight: '900', letterSpacing: 2, color: '#888' },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 3,
    borderBottomColor: '#1a1a1a',
  },
  headerLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 3, color: '#888' },
  headerTitle: { fontSize: 34, fontWeight: '900', color: '#1a1a1a', letterSpacing: -1 },
  logoutBtn: { backgroundColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  logoutText: { color: '#FFD600', fontWeight: '900', fontSize: 11 },
  statsContainer: { maxHeight: 130, borderBottomWidth: 2, borderBottomColor: '#1a1a1a' },
  statsContent: { paddingHorizontal: 20, paddingVertical: 18, gap: 12 },
  statCard: { width: 108, height: 94, borderWidth: 3, borderColor: '#1a1a1a', padding: 12, justifyContent: 'space-between' },
  statShadow: { shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  statLabel: { fontSize: 9, fontWeight: '900', opacity: 0.65 },
  statValue: { fontSize: 38, fontWeight: '900', lineHeight: 42 },
  statSub: { fontSize: 9, fontWeight: '900', opacity: 0.5 },
  listScroll: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 24 },
  emptyBox: { marginTop: 40, borderWidth: 2, borderStyle: 'dashed', padding: 48, alignItems: 'center' },
  emptyTitle: { fontSize: 14, fontWeight: '900', color: '#aaa' },
  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 26, 26, 0.9)', justifyContent: 'center', padding: 30 },
  bauhausContainer: { backgroundColor: '#F5F0E8', borderWidth: 4, borderColor: '#1a1a1a', padding: 30, overflow: 'hidden' },
  blueCircle: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: '#1565C0', opacity: 0.7 },
  redSquare: { position: 'absolute', bottom: 20, left: -20, width: 50, height: 50, backgroundColor: '#C62828', transform: [{ rotate: '15deg' }] },
  modalLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 3, color: '#888', marginBottom: 10 },
  modalTitle: { fontSize: 40, fontWeight: '900', color: '#1a1a1a', lineHeight: 38, marginBottom: 30 },
  modalActions: { flexDirection: 'row', gap: 15 },
  modalBtn: { flex: 1, paddingVertical: 15, borderWidth: 3, borderColor: '#1a1a1a', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0 },
  modalBtnText: { fontSize: 14, fontWeight: '900' },
});