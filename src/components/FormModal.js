import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from "react-hook-form";

import colors from '../../colors';

import { ChatMessageBox } from '../models/ChatMessage';
import {
    saveMessageInRealtimeDatabase,
    uploadImageCloudinary,
    getUserInfoFromRealtimeDatabase
} from '../functions/chat-message.function';
import { Alert } from 'react-native';

import { auth } from "../../config/firebase";
import { onAuthStateChanged } from 'firebase/auth';

const schema = yup.object({
    imageSelf: yup.mixed().required("Por favor, forneça uma imagem."),
    attendantName: yup.string().required("Por favor, informe o nome do atendente."),
    attendantPosition: yup.string().required("Por favor, informe o cargo do atendente."),
    companyName: yup.string().required("Por favor, forneça o nome da empresa."),
    companyCity: yup.string().required("Por favor, informe o nome da cidade onde a empresa está localizada."),
})

export default function FormModal({ handleClose }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const fileInputRef = useRef(null);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

    const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    async function handleSubmitMessage({ imageSelf, attendantName, attendantPosition, companyName, companyCity }) {
        try {
            handleClose();

            if(!currentUser) {
                alert("Atenção! Usuário não foi encontrado na sessão!");
                return;
            }

            const id = (new Date()).toISOString();
            const imageCloud = await uploadImageCloudinary(imageSelf);
            const sent = (new Date()).toISOString();

            const content = {
                imageSelf: imageCloud,
                attendantName,
                attendantPosition,
                companyName,
                companyCity
            };

            const user = {
                userName: currentUser?.name,
                userEmail: currentUser?.email,
            };

            await saveMessageInRealtimeDatabase(
                new ChatMessageBox(id, sent, content, user)
            );
        } catch(error) {
            console.error(error);
            alert("Error ao enviar a mensagem!");
        }
    }

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(
            auth,
            async (authenticatedUser) => {
                if(authenticatedUser) {
                    const uid = authenticatedUser?.uid;
                    const user = await getUserInfoFromRealtimeDatabase(uid);
                    user && setCurrentUser({
                        name: user.name,
                        email: user.email
                    })
                }
            });

        unsubscribeAuth;
    }, []);

    return (
        <View  style={styles.container}>
            <TouchableOpacity style={{ flex: 1, zIndex: 9 }} onPress={handleClose}></TouchableOpacity>

            <View style={styles.contentForm}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 2,
                    marginBottom: 15
                }}>
                    <TouchableOpacity
                        style={styles.btnClose}
                        onPress={handleClose}
                        activeOpacity={0.8}
                    >
                        <AntDesign name="closecircleo" size={27} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnToSend}
                        onPress={handleSubmit(handleSubmitMessage)}
                        activeOpacity={0.8}
                    >
                        <Feather name="send" size={27} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Formulário */}
                <SafeAreaView>
                    <Controller
                        control={control}
                        name='imageSelf'
                        render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                                style={[
                                    styles.btnUploadImage, {
                                        borderColor: errors.imageSelf ? '#ff375b' : '#FFF',
                                        backgroundColor: errors.imageSelf ? 'rgba(248,162,177,.20)' : 'rgba(255,255,255,0.20)'
                                    }
                                ]}
                                onPress={handleImageUpload}
                                activeOpacity={0.8}
                            >
                                {imageURL ? (
                                    <Image
                                        source={{
                                            uri: imageURL
                                        }}
                                        style={[
                                            styles.imageUpload,
                                        ]}
                                    />
                                ) : (
                                    <Ionicons
                                        style={{ alignSelf: 'center' }}
                                        name="image"
                                        size={130}
                                        color={errors.imageSelf ? '#ff375b' : "#FFF"}
                                    />
                                )}
                                <View>
                                    <input
                                        type="file"
                                        style={styles.fileInput}
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            const fileObject = e.target.files[0];
                                            if (!fileObject.type.startsWith("image/")) {
                                                setValidationError("Por favor, selecione um arquivo de imagem.");
                                                return;
                                            }

                                            const imageURL = URL.createObjectURL(fileObject);

                                            setImageURL(imageURL);
                                            onChange(fileObject);
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <Controller
                        control={control}
                        name='attendantName'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input, {
                                        borderWidth: errors.attendantName && 1,
                                        borderColor: errors.attendantName && '#FF375B'
                                    }
                                ]}
                                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                                placeholder="Nome do(a) atendente"
                                autoCapitalize="words"
                                keyboardType="default"
                                textContentType="name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.attendantName && <Text style={styles.labelError}>{`* ${errors.attendantName?.message}`}</Text>}

                    <Controller
                        control={control}
                        name='attendantPosition'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input, {
                                        borderWidth: errors.attendantPosition && 1,
                                        borderColor: errors.attendantPosition && '#FF375B'
                                    }
                                ]}
                                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                                placeholder="Cargo do(a) atendente"
                                autoCapitalize="words"
                                keyboardType="default"
                                textContentType="name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.attendantPosition && <Text style={styles.labelError}>{`* ${errors.attendantPosition?.message}`}</Text>}

                    <Controller
                        control={control}
                        name='companyName'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input, {
                                        borderWidth: errors.companyName && 1,
                                        borderColor: errors.companyName && '#FF375B'
                                    }
                                ]}
                                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                                placeholder="Nome da empresa"
                                autoCapitalize="words"
                                keyboardType="default"
                                textContentType="name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.companyName && <Text style={styles.labelError}>{`* ${errors.companyName?.message}`}</Text>}

                    <Controller
                        control={control}
                        name='companyCity'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input, {
                                        borderWidth: errors.companyCity && 1,
                                        borderColor: errors.companyCity && '#FF375B'
                                    }
                                ]}
                                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                                placeholder="Cidade"
                                autoCapitalize="words"
                                keyboardType="default"
                                textContentType="addressCity"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.companyCity && <Text style={styles.labelError}>{`* ${errors.companyCity?.message}`}</Text>}
                </SafeAreaView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: 300,
    },
    contentForm: {
        width: '100%',
        height: '85%',
        backgroundColor: 'rgba(34,39,46,.98)',
        backdropFilter: 'blur(10px)',
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    handleClose: {
        backgroundColor: '#000'
    },
    btnUploadImage: {
        backgroundColor: 'rgba(255,255,255,0.20)',
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 6,
        marginBottom: 25,
        alignSelf: 'center',
        height: 160,
        minWidth: 220,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageUpload: {
        height: 159,
        width: 219,
        borderRadius: 5,
    },
    input: {
        backgroundColor: colors.background,
        color: '#FFF',
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FFF',
    },
    labelError: {
        alignItems: 'flex-start',
        color: '#ff375b',
        marginBottom: 8,
        marginLeft: 5,
        fontSize: 11
    },
    fileInput: {
        display: 'none',
    },
})