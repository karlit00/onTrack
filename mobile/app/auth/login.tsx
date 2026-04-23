import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../api/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({
        visible: true,
        title: 'ERROR',
        message: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });

      await AsyncStorage.setItem('@auth_token', result.token);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(result.user));

      router.replace('/tabs');
    } catch (error: unknown) {
  let message = 'Invalid credentials';

  if (error instanceof Error) {
    message = error.message;
  }

  setPopup({
    visible: true,
    title: 'LOGIN FAILED',
    message,
  });
} finally {
  setLoading(false);
}};

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroSquareYellow} />
        <View style={styles.heroCircleBlue} />
        <View style={styles.heroSquareRed} />

        <View style={styles.heroContent}>
          <Text style={styles.brandText}>on</Text>
          <View style={styles.brandRow}>
            <View style={styles.brandAccentBar} />
            <Text style={styles.brandTrack}>TRACK</Text>
          </View>
          <Text style={styles.brandTagline}>BUILD BETTER HABITS</Text>
        </View>
      </View>

      {/* FORM */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>LOGIN</Text>
            <View style={styles.sheetTitleUnderline} />
          </View>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, { backgroundColor: '#C62828' }]} />
            <View style={[styles.dot, { backgroundColor: '#FFD600' }]} />
            <View style={[styles.dot, { backgroundColor: '#1565C0' }]} />
          </View>
        </View>

        <Text style={styles.fieldLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.btnShadow}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFD600" />
            ) : (
              <Text style={styles.submitText}>LOGIN →</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>NO ACCOUNT?</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.btnShadow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.outlineBtnText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <View style={[styles.colorBlock, { backgroundColor: '#C62828', flex: 2 }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#FFD600', flex: 1 }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#1565C0', flex: 1.5 }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#1a1a1a', flex: 1 }]} />
        </View>
      </ScrollView>

      {/* 🔥 CUSTOM POPUP */}
      {popup.visible && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <View style={styles.popupBar}>
              <View style={{ flex: 2, backgroundColor: '#C62828' }} />
              <View style={{ flex: 1, backgroundColor: '#FFD600' }} />
              <View style={{ flex: 1.5, backgroundColor: '#1565C0' }} />
            </View>

            <Text style={styles.popupTitle}>{popup.title}</Text>
            <Text style={styles.popupMessage}>{popup.message}</Text>

            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => setPopup({ ...popup, visible: false })}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#eeeeee' },

  hero: {
    backgroundColor: '#1a1a1a',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 28,
    overflow: 'hidden',
    borderBottomWidth: 4,
    borderBottomColor: '#FFD600',
  },

  heroSquareYellow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    backgroundColor: '#FFD600',
    opacity: 0.15,
  },

  heroCircleBlue: {
    position: 'absolute',
    bottom: -30,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1565C0',
    opacity: 0.25,
  },

  heroSquareRed: {
    position: 'absolute',
    top: 30,
    right: 60,
    width: 50,
    height: 50,
    backgroundColor: '#C62828',
    opacity: 0.3,
  },

  heroContent: { zIndex: 1 },

  brandText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#eeeeee',
    letterSpacing: 6,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  brandAccentBar: {
    width: 6,
    height: 48,
    backgroundColor: '#C62828',
  },

  brandTrack: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFD600',
    letterSpacing: 6,
  },

  brandTagline: {
    fontSize: 10,
    fontWeight: '900',
    color: '#eeeeee',
    letterSpacing: 4,
    opacity: 0.5,
  },

  sheet: { flex: 1 },
  sheetContent: { padding: 28, paddingBottom: 48 },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  sheetTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 4,
  },

  sheetTitleUnderline: {
    width: 52,
    height: 4,
    backgroundColor: '#FFD600',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    marginTop: 6,
  },

  dotsRow: { flexDirection: 'row', gap: 6, marginTop: 10 },

  dot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },

  fieldLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 6,
  },

  input: {
    borderWidth: 3,
    borderColor: '#1a1a1a',
    backgroundColor: '#fff',
    padding: 16,
    fontWeight: '700',
    marginBottom: 20,
  },

  btnShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: '#C62828',
    borderWidth: 3,
    borderColor: '#1a1a1a',
    paddingVertical: 17,
    alignItems: 'center',
  },

  submitText: {
    color: '#eeeeee',
    fontWeight: '900',
    letterSpacing: 5,
  },

  outlineBtn: {
    borderWidth: 3,
    borderColor: '#1a1a1a',
    paddingVertical: 15,
    alignItems: 'center',
  },

  outlineBtnText: {
    fontWeight: '900',
    letterSpacing: 4,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },

  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#1a1a1a',
  },

  dividerLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },

  bottomBar: {
    flexDirection: 'row',
    height: 8,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    marginTop: 16,
  },

  colorBlock: { height: '100%' },

  /* 🔥 POPUP */
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupBox: {
    width: '85%',
    backgroundColor: '#eeeeee',
    borderWidth: 4,
    borderColor: '#1a1a1a',
    padding: 20,
  },

  popupBar: {
    flexDirection: 'row',
    height: 6,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 10,
  },

  popupMessage: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 20,
  },

  popupButton: {
    backgroundColor: '#FFD600',
    borderWidth: 3,
    borderColor: '#1a1a1a',
    paddingVertical: 12,
    alignItems: 'center',
  },

  popupButtonText: {
    fontWeight: '900',
    letterSpacing: 3,
  },
});