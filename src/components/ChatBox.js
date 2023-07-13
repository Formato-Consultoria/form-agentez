import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import moment from 'moment';

import { ChatMessageBox } from '../models/ChatMessage';
import { AntDesign } from '@expo/vector-icons';
import { useState } from "react";

export default function ChatBox({ id, user, content, sent } = new ChatMessageBox()) {
    const [indexImg, setIndexImg] = useState(0);

    function toggleImg() {
        const imgs = content?.images;
        if(indexImg === (imgs.length-1)) {
            setIndexImg(0)
            return
        }

        setIndexImg(indexImg + 1);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{user?.userName}</Text>
            <TouchableOpacity style={{ position: 'relative', marginBottom: 4 }} onPress={toggleImg}>
                <Image
                    source={{ uri: content?.images[indexImg] }}
                    style={styles.image}
                />
                {(content?.images.length >= 2) && <Text style={{
                    position: 'absolute',
                    color: '#FFF',
                    fontSize: 13,
                    zIndex: 1,
                    bottom: 7,
                    right: 7,
                    padding: 3,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    background: 'rgba(255,255,255,0.20)',
                    borderColor: '#F0F0F0',
                }}>
                    <AntDesign name="plus" size={9} color="white" />
                    {content?.images.length-1}
                </Text>}
            </TouchableOpacity>
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
                <View style={styles.balloon}>
                    <Text style={styles.balloonText}>{content?.companyCity}</Text>
                </View>
                <View style={styles.balloon}>
                    <Text style={styles.balloonText}>{content?.companyCNPJ}</Text>
                </View>
            </View>
            <Text style={styles.time}>{moment(sent).format('DD/MM/YYYY HH:mm:ss')}</Text>
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
        fontSize: 12,
        fontWeight: 'normal',
        marginRight: 7,
        marginBottom: 5
    },
});