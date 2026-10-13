import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TaskFilter } from '../types/task.types';
import { Colors, Spacing, Fonts, BrutalShadowSmall } from '../styles/theme';

interface StatusFilterProps {
  activeFilter: TaskFilter;
  onSelectFilter: (filter: TaskFilter) => void;
  counts: Record<TaskFilter, number>;
}

const FILTER_ITEMS: { key: TaskFilter; label: string }[] = [
  { key: 'All', label: 'ALL' },
  { key: 'To Do', label: 'PENDING' },
  { key: 'In Progress', label: 'IN_FLIGHT' },
  { key: 'Done', label: 'RESOLVED' },
];

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
        {FILTER_ITEMS.map((item) => {
          const isSelected = activeFilter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              onPress={() => onSelectFilter(item.key)}
            >
              <Text
                style={[
                  styles.chipLabel,
                  isSelected ? styles.chipLabelSelected : styles.chipLabelUnselected,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isSelected ? styles.countBadgeSelected : styles.countBadgeUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isSelected ? styles.countTextSelected : styles.countTextUnselected,
                  ]}
                >
                  {counts[item.key] || 0}
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
  chip: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 8,
    marginRight: Spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipLabel: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chipLabelSelected: {
    color: Colors.text,
  },
  chipLabelUnselected: {
    color: Colors.text,
  },
  chipSelected: {
    backgroundColor: Colors.accentElectric,
    ...BrutalShadowSmall,
  },
  chipUnselected: {
    backgroundColor: Colors.surface,
  },
  container: {
    borderBottomColor: Colors.borderMuted,
    borderBottomWidth: 1,
    paddingVertical: Spacing.sm,
  },
  countBadge: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 1.5,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  countBadgeSelected: {
    backgroundColor: Colors.text,
  },
  countBadgeUnselected: {
    backgroundColor: Colors.surfaceSecondary,
  },
  countText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  countTextSelected: {
    color: Colors.accentElectric,
  },
  countTextUnselected: {
    color: Colors.text,
  },
  scrollList: {
    paddingHorizontal: Spacing.md,
  },
});
