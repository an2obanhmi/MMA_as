import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ChatMessage } from '../types/models.types';
import { getTeamMessagesRealtime, sendChatMessage } from '../services/teamService';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, Fonts, BrutalShadowSmall, ColorTheme } from '../styles/theme';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;
  const { user, userProfile } = useAuth();
  const { isDark, colors } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  useEffect(() => {
    const unsub = getTeamMessagesRealtime(
      teamId,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (err) => {
        console.error('Chat messages stream error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [teamId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;
    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendChatMessage(
        teamId,
        user.uid,
        userProfile?.name || user.email || 'Operator',
        textToSend
      );
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  // Helper to format timestamp
  const formatTime = (ts: unknown) => {
    if (!ts) return 'NOW';
    try {
      if (typeof ts === 'object' && ts !== null && 'toDate' in ts && typeof (ts as { toDate: () => Date }).toDate === 'function') {
        return (ts as { toDate: () => Date }).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      const date = new Date(ts as string | number | Date);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerMeta}>{'// REAL-TIME WAR ROOM'}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {teamName}
          </Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>SYNC_ON</Text>
        </View>
      </View>

      {/* Messages Stream */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.text} />
          <Text style={styles.loadingText}>{'// SUBSCRIBING TO FIRESTORE STREAM...'}</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id || Math.random().toString()}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={Platform.OS !== 'web'}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.uid;
            return (
              <View
                style={[
                  styles.messageWrapper,
                  isMe ? styles.messageWrapperMe : styles.messageWrapperOther,
                ]}
              >
                {!isMe ? (
                  <Text style={styles.senderName}>{item.senderName}</Text>
                ) : null}

                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.bubbleMe : styles.bubbleOther,
                  ]}
                >
                  <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.timeText, isMe && styles.timeTextMe]}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>NO_DISPATCHES_YET</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to transmit a message into this team war room channel.
              </Text>
            </View>
          }
        />
      )}

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="TRANSMIT MESSAGE..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          disabled={sending || !inputText.trim()}
          activeOpacity={0.8}
        >
          {sending ? (
            <ActivityIndicator color="#121212" size="small" />
          ) : (
            <Ionicons name="arrow-up" size={22} color="#121212" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ColorTheme, isDark: boolean) =>
  StyleSheet.create({
    backBtn: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      padding: 8,
    },
    bubbleMe: {
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 2,
      ...BrutalShadowSmall,
    },
    bubbleOther: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      ...BrutalShadowSmall,
    },
    centerBox: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: Spacing.xl,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    emptyContainer: {
      alignItems: 'center',
      borderColor: colors.borderMuted,
      borderStyle: 'dashed',
      borderWidth: 2,
      marginTop: Spacing.xl,
      padding: Spacing.xl,
    },
    emptySubtitle: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 11,
      marginTop: 6,
      textAlign: 'center',
    },
    emptyTitle: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 14,
      fontWeight: '900',
    },
    header: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 2,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
    },
    headerInfo: {
      flex: 1,
    },
    headerMeta: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    headerTitle: {
      color: colors.text,
      fontFamily: Fonts.display,
      fontSize: 20,
      fontWeight: '900',
      letterSpacing: -0.5,
    },
    inputContainer: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 2,
      flexDirection: 'row',
      gap: 10,
      padding: Spacing.sm,
    },
    listContent: {
      padding: Spacing.md,
      paddingBottom: Spacing.lg,
    },
    liveDot: {
      backgroundColor: colors.accentGreen,
      borderRadius: 4,
      height: 8,
      width: 8,
    },
    liveIndicator: {
      alignItems: 'center',
      backgroundColor: isDark ? '#0F3628' : '#E6FBF2',
      borderColor: colors.accentGreen,
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    liveText: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '800',
    },
    loadingText: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 12,
      marginTop: Spacing.sm,
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    messageText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    messageTextMe: {
      color: '#121212',
      fontWeight: '700',
    },
    messageWrapper: {
      marginBottom: Spacing.sm,
    },
    messageWrapperMe: {
      alignItems: 'flex-end',
    },
    messageWrapperOther: {
      alignItems: 'flex-start',
    },
    sendBtn: {
      alignItems: 'center',
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 2,
      height: 48,
      justifyContent: 'center',
      width: 48,
      ...BrutalShadowSmall,
    },
    senderName: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '700',
      marginBottom: 4,
    },
    textInput: {
      backgroundColor: isDark ? colors.background : colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      color: colors.text,
      flex: 1,
      fontFamily: Fonts.mono,
      fontSize: 13,
      maxHeight: 100,
      paddingHorizontal: Spacing.md,
      paddingVertical: 10,
    },
    timeText: {
      color: colors.textMuted,
      fontFamily: Fonts.mono,
      fontSize: 9,
      marginTop: 4,
      textAlign: 'right',
    },
    timeTextMe: {
      color: '#262626',
    },
  });
