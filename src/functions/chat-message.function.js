import { ChatMessageBox } from '../models/ChatMessage';

import { ref, set, get, child } from 'firebase/database';
import { realtimeDatabase } from '../../config/firebase';

import moment from 'moment';

// salva a mensagem no banco em tempo real
export async function saveMessageInRealtimeDatabase(
    { id, sent, content, user } = new ChatMessageBox()
) {
    try {
        set(ref(realtimeDatabase, '/messages/message ' + moment(id).format("DD-MM-YYYY HH:mm:ss")), {
            _id: id,
            sent: sent,
            content: content,
            user: user
        })    
    } catch (error) {
        alert("Error no envio da mensagem!");
    }
}

// Faz o upload da imagem no Storage do Firebase
export async function uploadImageCloudinary(file) {
    const formData = new FormData();

    const cloud_name = 'dyxtcsnna';
    const file_name = `${(new Date()).toISOString()}.${file.name.split('.').pop()}`;

    formData.append('file', file, file_name)
    formData.append('upload_preset', 'ybxjhthx');
    formData.append('cloud_name', cloud_name);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
            method: 'POST',
            body: formData,
          });

        const responseData = await response.json();
        return responseData.secure_url;
    } catch(error) {
        alert("Erro ao enviar imagem!");
        console.error('erro ao fazer upload da imagem:', error);
    }
}

// Busca as informações da sessão
export async function getUserInfoFromRealtimeDatabase(userId) {
    try {
        const snapshot = await get(child(ref(realtimeDatabase), '/sessions/'+userId));
        if(snapshot.exists()) {
            const userDatas = snapshot.val();
            return userDatas;
        } else return null;
    } catch (error) {
        console.log(error);
    }
}

// Busca uma unica mensagem por meio do id da mensagem
// export function readMessageFromRealtimeDatabase(messageId) {
//     const messageRef = ref(realtimeDatabase, '/messages/message ' + messageId);

//     get(messageRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const messageData = snapshot.val();
//                 return messageData;
//             } else {
//                 console.log("A mensagem não existe.");
//             }
//         })
//         .catch((error) => {
//             console.log("Erro ao ler a mensagem:", error);
//         });
// }