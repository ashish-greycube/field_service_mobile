import { BASE_URL } from '@/constants/constants';
import { useAuth } from '@/context/AuthContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Buffer } from 'buffer';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Colors, Text, TextField, View } from 'react-native-ui-lib';
export default function Login() {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [showpassword, setShowpassword] = useState(false);
    const { loginSuccess, isLoading } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState(null);

    const getErrorMessage = (error) => {
        try {
            if (error._server_messages) {
                // Parse the outer array string
                const messages = JSON.parse(error._server_messages);
                const detail = JSON.parse(messages[0]);
                return detail.message;
            } else if (error) {
                const messages = JSON.parse(error);
                const detail = JSON.parse(messages[0]);
                return detail.message;
            }
        } catch (e) {
            return error.message || "An unexpected error occurred";
        }
        return "Unknown Error";
    };

    const loginPressed = async () => {
        if (!username || !password) {
            setError("Please enter username and password.");
            return;
        }
        setError(null);
        setIsLoggingIn(true);
        try {
            const formData = new URLSearchParams();
            formData.append("usr", username);
            formData.append("pwd", password);

            const res = await fetch(
                `${BASE_URL}api/method/field_service.api.mobile_login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData.toString(),
                },
            );
            const data = await res.json();
            console.log(data)

            if (data.message?.success_key !== 1) {
                setError("Invalid credentials. Please try again.");
                return;
            }

            const rawKey = data.message.api_key.replace(/^b'|'$/g, '');
            const rawSecret = data.message.api_secret.replace(/^b'|'$/g, '');
            const apiKey = Buffer.from(rawKey, 'base64').toString('utf-8');
            const apiSecret = Buffer.from(rawSecret, 'base64').toString('utf-8');

            await loginSuccess(
                `${apiKey}:${apiSecret}`,
                {
                    name: data.full_name ?? null,
                    email: data?.message?.email ?? null,
                    user : data?.message?.username ?? null
                }
            );
        } catch (e) {
            const cleanMessage = getErrorMessage(e);
            Alert.alert("Login Error", cleanMessage, [{ text: "OK" }]);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.violet1} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header / Logo area */}
                <View style={styles.headerArea}>
                    <Image
                        source={require('@/assets/images/logo-rldsupport.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.appName}>RLD Support</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                {/* Form card */}
                <View style={styles.card}>
                    {/* username field */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Username</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="mail-outline" size={18} color={Colors.green1} style={styles.fieldIcon} />
                            <TextField
                                containerStyle={styles.textFieldContainer}
                                style={styles.textInput}
                                placeholder="you@example.com"
                                placeholderTextColor={Colors.green1}
                                value={username}
                                onChangeText={setusername}
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColor="transparent"
                                floatingPlaceholder={false}
                                hideUnderline
                            />
                        </View>
                        <View style={styles.underline} />
                    </View>

                    {/* password field */}
                    <View style={[styles.fieldWrapper, styles.fieldWrapperSpaced]}>
                        <Text style={styles.fieldLabel}>password</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="lock-closed-outline" size={18} color={Colors.green1} style={styles.fieldIcon} />
                            <TextField
                                containerStyle={styles.textFieldContainer}
                                style={styles.textInput}
                                placeholder="Enter your password"
                                placeholderTextColor={Colors.green1}
                                value={password}
                                onChangeText={setpassword}
                                secureTextEntry={!showpassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColor="transparent"
                                floatingPlaceholder={false}
                                hideUnderline
                                trailingAccessory={
                                    <TouchableOpacity
                                        onPress={() => setShowpassword(prev => !prev)}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        style={styles.eyeButton}
                                    >
                                        <Ionicons
                                            name={showpassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color={showpassword ? Colors.violet20 : Colors.green1}
                                        />
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                        <View style={styles.underline} />
                    </View>

                    {/* Sign In button */}
                    <Button
                        onPress={loginPressed}
                        style={styles.signInButton}
                        borderRadius={10}
                        size={Button.sizes.large}
                    >
                        {isLoggingIn ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                            <>
                                <AntDesign
                                    name="login"
                                    size={16}
                                    color={Colors.white}
                                    style={styles.loginIcon}
                                />
                                <Text style={styles.loginBtnText}>Sign In</Text>
                            </>
                        )}
                    </Button>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
    },
    loginBtnText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: "700",
        includeFontPadding: false,
        alignSelf: "center",
        paddingLeft: 10
    },
    errorText: {
        color: Colors.red1,
        fontSize: 15,
        textAlign: "center",
        marginTop : 10
    },

    // Header
    headerArea: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    appName: {
        fontSize: 30,
        fontWeight: '700',
        color: Colors.violet20,
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.green1,
        fontWeight: '400',
    },

    // Card
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 32,
        paddingHorizontal: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },

    // Fields
    fieldWrapper: {
        marginBottom: 4,
        width : "100%",

    },
    fieldWrapperSpaced: {
        marginTop: 20,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.violet20,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 6,
    },
    fieldIcon: {
        marginRight: 10,
        marginBottom: 2,
    },
    textFieldContainer: {
        flex: 1,
    },
    textInput: {
        fontSize: 15,
        color: '#212121',
        paddingVertical: 0,
        paddingHorizontal: 0,
        minHeight: 36,
    },
    eyeButton: {
        marginLeft: 8,
        padding: 2,
    },
    underline: {
        height: 1.5,
        backgroundColor: Colors.violet60,
        borderRadius: 1,
        marginTop: 2,
    },

    // Button
    signInButton: {
        backgroundColor: Colors.violet20,
        marginTop: 32,
        height: 52,
        shadowColor: Colors.violet20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signInButtonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
});
