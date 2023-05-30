import { StyleSheet, Text, View, Image } from "react-native";
import moment from 'moment';

import { ChatMessageBox } from '../models/ChatMessage';

export default function ChatBox({ id, user, content, sent } = new ChatMessageBox()) {

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{user?.userName}</Text>
            <Image
                source={{ uri: content?.imageSelf }}
                style={styles.image}
            />
            <View style={styles.balloonsContainer}>
                <View style={styles.balloon}>
                    <Text style={styles.balloonText}>{content?.attendantName}</Text>
                </View>
                <View style={styles.balloon}>
                    <Text style={styles.balloonText}>{content?.attendantPosition}</Text>
                </View>
                <View style={styles.balloon}>
                    <Text style={styles.balloonText}>{content?.companyName}</Text>
                </View>
            </View>
            <Text style={styles.time}>{moment(sent).format('mm:ss')}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 280,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: '#22272E',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 5,
        color: '#FFF',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 3,
    },
    balloonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        marginBottom: 10,
    },
    balloon: {
        backgroundColor: 'rgba(255, 255, 255, .10)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
    },
    balloonText: {
        color: '#FFF',
        fontSize: 12,
    },
    time: {
        color: '#FFF',
        alignSelf: 'flex-end',
        fontSize: 11,
        fontWeight: 'normal',
        marginRight: 7,
        marginBottom: 5
    },
});