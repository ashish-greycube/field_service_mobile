import { AuthContext } from '@/context/AuthContext';
import { Entypo } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { Avatar, Colors, Text, View } from 'react-native-ui-lib';

const windowWidth = Dimensions.get("window").width;

const BackIcon = ({ onPress }) => (
    <View style={styles.logo}>
            <Entypo onPress={onPress} name="chevron-left" size={30} color={Colors.white} />
    </View>
);

const CustomHeader = () => {
    const router = useRouter();
    const path = usePathname();
    const { userInfo } = useContext(AuthContext);
    const addAR = path === "/UserDetails";
    const knownRoutes = "/MainScreen";
    const updateAR = !knownRoutes.includes(path) && path !== "/";

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/MainScreen");
        }
    };

    const imageUri = userInfo?.picture || userInfo?.user_image || null;

    const initials = (() => {
        const fullName = userInfo?.given_name || userInfo?.name || "";
        return (
            fullName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0]?.toUpperCase() ?? "")
                .join("") || "?"
        );
    })();

    const avatarProps = imageUri
        ? { source: { uri: imageUri } }
        : { label: initials };

    return (
        <View style={styles.outerWrapper}>
            <View style={styles.pill}>
                {addAR || updateAR ? (
                    <BackIcon onPress={handleBack} />
                ) : (
                    <View style={styles.logo}>
                        <Image
                            source={require('@/assets/images/logo-rldsupport.png')}
                            style={styles.logoImg}
                            resizeMode="contain"
                        />
                    </View>
                )}

                <Text white text60 uppercase>
                    RLD Support
                </Text>

                <View style={styles.sideSlot}>
                    <View style={styles.avatarRing}>
                        <Avatar
                            size={50}
                            {...avatarProps}
                            onPress={() => {
                                router.push("/(screens)/UserDetails");
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.line} />
        </View>
    );
};


const RootLayout = () => {
    return (
            <Stack
                screenOptions={{
                    header: ({ options }) => (
                        <CustomHeader title={options.title ?? "FSM"} />
                    )
                }}
            />
    )
}

export default RootLayout

const styles = StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: "#797979",
    },
    outerWrapper: {
        backgroundColor: "transparent",
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    pill: {
        backgroundColor: Colors.violet1,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 6,
    },
    sideSlot: {
        marginLeft: "auto",
        marginRight: 10,
    },
    logo: {
        alignItems: "center",
        borderRadius: "100%",
        justifyContent: "center",
        backgroundColor: Colors.violet50,
        width: 50,
        height: 50,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    logoImg: {
        width: 38,
        height: 38,
    },
    backbutton: {
        width: 50,
        height: 50,
        marginHorizontal: 10,
        borderRadius: "100%"
    },
    avatarRing: {
        borderRadius: 999,
        borderWidth: 2.5,
        borderColor: Colors.violet40,
        padding: 2,
    },
    line: {
        marginTop: 10,
        width: windowWidth - 20,
        height: 2.5,
        borderRadius: 2,
        backgroundColor: "#cfcfcf",
    }
})