import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HabitCardProps {
  habit: any;
  index: number;
  onToggle: (id: string) => void;
}

const CARD_THEMES = [
  { bg: '#FFD600', text: '#1a1a1a', bar: '#1a1a1a' },
  { bg: '#1565C0', text: '#fff', bar: '#FFD600' },
  { bg: '#C62828', text: '#fff', bar: '#fff' },
  { bg: '#1a1a1a', text: '#fff', bar: '#FFD600' },
];

const TILTS = [-1.2, 1.2, -0.8, 0.8];

export default function HabitCard({ habit, index, onToggle }: HabitCardProps) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const tilt = TILTS[index % TILTS.length];
  const progressPct = Math.min(((habit.currentCount || 0) / habit.targetCount) * 100, 100);

  return (
    <View style={[styles.outer, { transform: [{ rotate: `${tilt}deg` }] }]}>
      <View style={[styles.card, { backgroundColor: theme.bg }, habit.completed && styles.completed]}>
        <Text style={[styles.index, { color: theme.text }]}>TASK_{String(index + 1).padStart(2, '0')}</Text>
        
        <Text numberOfLines={1} style={[styles.title, { color: theme.text }, habit.completed && styles.strike]}>
          {habit.title.toUpperCase()}
        </Text>
        
        {habit.description && (
          <Text numberOfLines={1} style={[styles.desc, { color: theme.text }]}>{habit.description}</Text>
        )}

        <View style={styles.statsRow}>
          <Text style={[styles.statText, { color: theme.text }]}>STREAK: {habit.streak} 🔥</Text>
          <Text style={[styles.statText, { color: theme.text }]}>
            {habit.targetCount > 1 ? `${habit.currentCount}/${habit.targetCount}` : `${Math.round(progressPct)}%`}
          </Text>
        </View>

        <View style={[styles.track, { borderColor: theme.text }]}>
          <View style={[styles.fill, { width: `${progressPct}%`, backgroundColor: theme.bar }]} />
        </View>

        <TouchableOpacity 
          onPress={() => onToggle(habit._id)}
          disabled={habit.completed}
          style={[styles.btn, { borderColor: theme.text, backgroundColor: habit.completed ? '#4CAF50' : 'transparent' }]}
        >
          <Text style={[styles.btnText, { color: habit.completed ? '#1a1a1a' : theme.text }]}>
            {habit.completed ? 'COMPLETED' : 'MARK DONE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { marginBottom: 28 },
  card: { borderWidth: 3, borderColor: '#1a1a1a', padding: 16, shadowColor: '#000', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8 },
  completed: { opacity: 0.85 },
  index: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: '900', marginTop: 4 },
  strike: { textDecorationLine: 'line-through', opacity: 0.5 },
  desc: { fontSize: 12, fontWeight: '600', opacity: 0.7, marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  statText: { fontSize: 11, fontWeight: '900' },
  track: { height: 12, borderWidth: 2, marginTop: 6, backgroundColor: 'rgba(0,0,0,0.1)' },
  fill: { height: '100%' },
  btn: { marginTop: 18, borderWidth: 2, paddingVertical: 12, alignItems: 'center' },
  btnText: { fontWeight: '900', fontSize: 12, letterSpacing: 1 },
});