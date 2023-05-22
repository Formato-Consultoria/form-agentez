import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";

export default function ToggleNavigation({ isToggle, handleFn }) {
    return (
        <SafeAreaView style={styles.togglecontainer}>
            <TouchableOpacity
                style={styles.checkboxLabel} onPress={handleFn}
            >
                <Text
                    style={[
                        styles.loginPage,
                        { color: isToggle ? '#000' : '#FFF', backgroundColor: isToggle ? '#FFF' : '#000' },
                    ]}
                >
                    Login
                </Text>
                <Text
                    style={[
                        styles.registerPage,
                        { color: isToggle ? 'black' : 'white' },
                        { color: isToggle ? '#FFF' : '#000', backgroundColor: isToggle ? '#000' : '#FFF' },
                    ]}
                >
                    Registrar
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    togglecontainer: {
        marginVertical: 60,
        marginLeft: 20,
    },
    checkboxLabel: {
        width: 200,
        height: 30,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        borderRadius: 25
    },
    loginPage: {
        flex: 1,
        height: '100%',
        textAlign: 'center',
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        paddingVertical: 3
    },
    registerPage: {
        flex: 1,
        height: '100%',
        textAlign: 'center',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        paddingVertical: 3
    },
})