import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

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

import { auth } from "../../config/firebase";
import { onAuthStateChanged } from 'firebase/auth';

const schema = yup.object({
    images: yup.mixed().required("Por favor, forneça uma imagem."),
    nameAgente: yup.string().required("Por favor, informe o nome do atendente."),
    attendantName: yup.string().required("Por favor, informe o nome do atendente."),
    attendantPosition: yup.string().required("Por favor, informe o cargo do atendente."),
    companyName: yup.string().required("Por favor, forneça o nome da empresa."),
    companyCity: yup.string().required("Por favor, informe o nome da cidade onde a empresa está localizada."),
    companyCNPJ: yup.string().required("Por favor, informe o CNPJ da empresa")
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Por favor, informe um CNPJ válido.")
})

export default function FormModal({ handleClose }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const fileInputRef = useRef(null);

    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            images: [],
            nameAgente: '',
            attendantName: '',
            attendantPosition: '',
            companyName: '',
            companyCity: '',
            companyCNPJ: ''
        }
    })
    let changeImagens = watch('images');

    const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    async function handleSubmitMessage({ images, nameAgente, attendantName, attendantPosition, companyName, companyCity, companyCNPJ }) {
        try {
            handleClose();

            if(!currentUser) {
                alert("Atenção! Usuário não foi encontrado na sessão!");
                return;
            }

            const id = (new Date()).toISOString();
            const arrImageCloud = await Promise.all(images.map(async (image) => 
                await uploadImageCloudinary(image)
            ))

            const sent = (new Date()).toISOString();

            const content = {
                images: arrImageCloud,
                nameAgente: nameAgente,
                attendantName,
                attendantPosition,
                companyName,
                companyCity,
                companyCNPJ
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
                        name='images'
                        render={({ field: { onChange } }) => (
                            <TouchableOpacity
                                style={[
                                    styles.btnUploadImage, {
                                        borderColor: errors.images ? '#ff375b' : '#FFF',
                                        backgroundColor: errors.images ? 'rgba(248,162,177,.20)' : 'rgba(255,255,255,0.20)'
                                    }
                                ]}
                                onPress={handleImageUpload}
                                activeOpacity={0.8}
                            >
                                {(imageURL) ? (
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
                                        color={errors.images ? '#ff375b' : "#FFF"}
                                    />
                                )}
                                {(changeImagens.length >= 2) && <Text style={{
                                    position: 'absolute',
                                    color: '#FFF',
                                    fontSize: 11,
                                    zIndex: 1,
                                    bottom: 7,
                                    right: 7,
                                    padding: 2,
                                    borderRadius: 999,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    background: 'rgba(255,255,255,0.20)',
                                    borderColor: '#F0F0F0',
                                }}>
                                    <AntDesign name="plus" size={8} color="white" />
                                    {changeImagens.length-1}
                                </Text>}
                                <View>
                                    <input
                                        type="file"
                                        style={styles.fileInput}
                                        ref={fileInputRef}
                                        multiple
                                        onChange={(e) => {
                                            const fileObjects = Array.from(e.target.files);

                                            fileObjects.forEach((image) => {
                                                if (!image.type.startsWith("image/")) {
                                                    setValidationError("Por favor, selecione somente arquivos de imagem.");
                                                    return;
                                                }
                                            })

                                            const imageURL = URL.createObjectURL(fileObjects[0]);
                                            setImageURL(imageURL);
                                            onChange(fileObjects);
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <Controller
                        control={control}
                        name='nameAgente'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input, {
                                        borderWidth: errors.nameAgente && 1,
                                        borderColor: errors.nameAgente && '#FF375B'
                                    }
                                ]}
                                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                                placeholder="Nome do(a) agente"
                                autoCapitalize="words"
                                keyboardType="default"
                                textContentType="name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.nameAgente && <Text style={styles.labelError}>{`* ${errors.nameAgente?.message}`}</Text>}

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

                    <Controller
                        control={control}
                        name='companyCNPJ'
                        render={({ field: { onChange, value } }) => (
                            <TextInputMask
                                style={[
                                    styles.input, {
                                        borderWidth: errors.companyCNPJ && 1,
                                        borderColor: errors.companyCNPJ && '#FF375B'
                                    }
                                ]}
                                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                                placeholder="CNPJ (ex: xx.xxx.xxx/0001-xx)"
                                type={'cnpj'}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.companyCNPJ && <Text style={styles.labelError}>{`* ${errors.companyCNPJ?.message}`}</Text>}
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
        position: 'relative',
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