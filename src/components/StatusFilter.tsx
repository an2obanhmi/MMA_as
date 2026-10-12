import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TaskFilter } from '../types/task.types';
import { Colors, Spacing } from '../styles/theme';

interface StatusFilterProps {
  activeFilter: TaskFilter;
  onSelectFilter: (filter: TaskFilter) => void;
  counts: Record<TaskFilter, number>;
}

const FILTER_ITEMS: TaskFilter[] = ['All', 'To Do', 'In Progress', 'Done'];

export const StatusFilter: React.FC<StatusFilterProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {FILTER_ITEMS.map(filter => {
          const isSelected = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => onSelectFilter(filter)}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {filter}
              </Text>
              <View style={[styles.badge, isSelected && styles.badgeActive]}>
                <Text style={[styles.badgeText, isSelected && styles.badgeTextActive]}>
                  {counts[filter] || 0}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.border,
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeActive: {
    backgroundColor: Colors.primaryDark,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: Colors.surface,
  },
  container: {
    paddingVertical: Spacing.sm,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
  scrollList: {
    paddingHorizontal: Spacing.md,
  },
});
