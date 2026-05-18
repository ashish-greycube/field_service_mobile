import { AuthContext } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Colors, Text, View } from 'react-native-ui-lib';

const windowWidth = Dimensions.get('window').width;

const UserDetails = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/Login');
  };

  const imageUri = userInfo?.picture || userInfo?.user_image || null;

  const initials = (() => {
    const fullName =  userInfo?.name || '';
    return (
      fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('') || '?'
    );
  })();

  const avatarProps = imageUri
    ? { source: { uri: imageUri } }
    : { label: initials };

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarRing}>
          <Avatar size={90} {...avatarProps} />
        </View>
        <Text style={styles.nameText}>{userInfo?.given_name || userInfo?.name || 'User'}</Text>
        <Text style={styles.emailText}>{userInfo?.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="person-outline" size={14} color={Colors.white} style={styles.infoIcon} />
            <Text style={styles.infoLabelText}>Full Name</Text>
          </View>
          <Text style={styles.infoValue} numberOfLines={1}>
            {userInfo?.name || '—'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="mail-outline" size={14} color={Colors.white} style={styles.infoIcon} />
            <Text style={styles.infoLabelText}>Email</Text>
          </View>
          <Text style={styles.infoValue} numberOfLines={1}>
            {userInfo?.email || '—'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.75}>
        <Ionicons name="log-out-outline" size={20} color={Colors.red30} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
    gap: 20,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  avatarRing: {
    borderRadius: 999,
    borderWidth: 3,
    borderColor: Colors.violet30,
    padding: 3,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.grey10,
    letterSpacing: 0.3,
  },
  emailText: {
    fontSize: 13,
    color: Colors.grey30,
  },
  infoCard: {
    backgroundColor: Colors.violet80,
    borderRadius: 20,
    width: windowWidth - 32,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.violet40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.violet20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  infoIcon: {
    marginRight: 2,
  },
  infoLabelText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: Colors.grey10,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.violet60,
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.red30,
    height: 52,
    borderRadius: 16,
    width: windowWidth - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: Colors.red30,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
