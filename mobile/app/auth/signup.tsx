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
import { registerUser } from '../../api/auth';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    visible: false,
    title: '',
    message: '',
    onClose: null as null | (() => void),
  });

  const showPopup = (
    title: string,
    message: string,
    onClose: null | (() => void) = null
  ) => {
    setPopup({ visible: true, title, message, onClose });
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return showPopup('ERROR', 'Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return showPopup('ERROR', 'Passwords do not match');
    }

    if (password.length < 6) {
      return showPopup('ERROR', 'Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await registerUser({ username, email, password });

      showPopup(
        'SUCCESS!',
        'Account created! Please login.',
        () => router.replace('/auth/login')
      );
    } catch (error: unknown) {
      let message = 'Could not create account';

      if (error instanceof Error) {
        message = error.message;
      }

      showPopup('SIGNUP FAILED', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFD600" />

      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroBgCircle} />
        <View style={styles.heroBgSquare} />

        <View style={styles.heroContent}>
          <Text style={styles.brandText}>on</Text>
          <View style={styles.brandRow}>
            <View style={styles.brandAccentBar} />
            <Text style={styles.brandTrack}>TRACK</Text>
          </View>
          <View style={styles.newBadgeShadow}>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW ACCOUNT</Text>
            </View>
          </View>
        </View>
      </View>

      {/* FORM SHEET */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>SIGN UP</Text>
            <View style={styles.sheetTitleUnderline} />
          </View>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, { backgroundColor: '#FFD600' }]} />
            <View style={[styles.dot, { backgroundColor: '#1565C0' }]} />
            <View style={[styles.dot, { backgroundColor: '#C62828' }]} />
          </View>
        </View>

        <Text style={styles.fieldLabel}>USERNAME</Text>
        <TextInput
          style={styles.input}
          placeholder="yourname"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

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

        <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.btnShadow}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#FFD600" />
              : <Text style={styles.submitText}>CREATE ACCOUNT →</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>HAVE AN ACCOUNT?</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.btnShadow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.outlineBtnText}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <View style={[styles.colorBlock, { backgroundColor: '#FFD600', flex: 2 }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#1565C0', flex: 1 }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#C62828', flex: 1.5 }]} />
          <View style={[styles.colorBlock, { backgroundColor: '#1a1a1a', flex: 1 }]} />
        </View>
      </ScrollView>

      {/* POPUP */}
      {popup.visible && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <View style={styles.popupBar}>
              <View style={{ flex: 2, backgroundColor: '#FFD600' }} />
              <View style={{ flex: 1, backgroundColor: '#1565C0' }} />
              <View style={{ flex: 1.5, backgroundColor: '#C62828' }} />
            </View>

            <Text style={styles.popupTitle}>{popup.title}</Text>
            <Text style={styles.popupMessage}>{popup.message}</Text>

            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => {
                setPopup({ ...popup, visible: false });
                popup.onClose && popup.onClose();
              }}
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
    backgroundColor: '#FFD600',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 28,
    overflow: 'hidden',
    borderBottomWidth: 4,
    borderBottomColor: '#1a1a1a',
  },

  heroBgCircle: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1a1a1a',
    opacity: 0.1,
  },

  heroBgSquare: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#C62828',
    opacity: 0.2,
  },

  heroContent: { zIndex: 1 },

  brandText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 6,
    lineHeight: 56,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  brandAccentBar: {
    width: 6,
    height: 48,
    backgroundColor: '#1a1a1a',
  },

  brandTrack: {
    fontSize: 56,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 6,
    lineHeight: 56,
  },

  newBadgeShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignSelf: 'flex-start',
  },

  newBadge: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  newBadgeText: {
    color: '#FFD600',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
  },

  sheet: { flex: 1 },
  sheetContent: { padding: 28, paddingBottom: 48 },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    marginTop: 4,
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
    backgroundColor: '#1a1a1a',
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
    color: '#1a1a1a',
    marginBottom: 6,
  },

  input: {
    borderWidth: 3,
    borderColor: '#1a1a1a',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '700',
    marginBottom: 18,
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
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: '#1a1a1a',
    paddingVertical: 17,
    alignItems: 'center',
  },

  submitText: {
    color: '#FFD600',
    fontSize: 13,
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
    color: '#1a1a1a',
  },

  outlineBtn: {
    backgroundColor: '#eeeeee',
    borderWidth: 3,
    borderColor: '#1a1a1a',
    paddingVertical: 15,
    alignItems: 'center',
  },

  outlineBtnText: {
    color: '#1a1a1a',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 6,
  },

  bottomBar: {
    flexDirection: 'row',
    height: 8,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    overflow: 'hidden',
    marginTop: 16,
  },

  colorBlock: { height: '100%' },

  /* POPUP */
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