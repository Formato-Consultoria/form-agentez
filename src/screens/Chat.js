import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react';

import { View, TouchableOpacity, Text, FlatList, Modal, Dimensions } from 'react-native';

import ChatBox from '../components/ChatBox';
import FormModal from '../components/FormModal';

import { ref, onValue } from 'firebase/database';
import { realtimeDatabase } from '../../config/firebase';

import colors from '../../colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

export default function Chat() {
  const [messagesData, setMessagesData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const flatListRef = useRef(null);

  useLayoutEffect(() => {
    const messagesRef = ref(realtimeDatabase, '/messages');

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messageList = Object.values(data);
        
        setMessagesData(messageList.map((msg) => {
          return {
            id: msg._id,
            sent: msg.sent,
            content: msg.content, 
            user: msg.user
          }
        }));
      }

      !verifyMessages(messages) && setShouldAutoScroll(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);

  useEffect(() => {
    if (shouldAutoScroll && flatListRef.current && verifyMessages(messages)) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, shouldAutoScroll]);

  const handleScroll = (event) => {
    if(verifyMessages(messages)) {
      const windowHeight = Dimensions.get('window').height;
      const scrollPosition = event.nativeEvent.contentOffset.y;
      const maxScroll = event.nativeEvent.contentSize.height - windowHeight;
    
      if (scrollPosition <= maxScroll * 0.70) {
        setShouldAutoScroll(false);
      } else {
        setShouldAutoScroll(true);
      }
    }
  };

  function verifyMessages(arrayMessage) {
    return (arrayMessage !== [] || arrayMessage !== null || arrayMessage !== undefined);
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingBottom: 10, backgroundColor: colors.backgroundChat }}>
      {verifyMessages(messages) ?
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        style={{ paddingVertical: 7 }}
        data={messages}
        renderItem={({ item }) => (
          <ChatBox
            key={item.id}
            id={item.id}
            user={item.user}
            content={item.content}
            sent={item.sent}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text
          style={{
            alignSelf: 'center',
            width: 200,
            backgroundColor: 'rgba(255, 255, 255, .15)',
            color: '#FFF',
            marginTop: 20,
            paddingVertical: 8,
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 'bold'
          }}>Nenhuma mensagem ainda!</Text>
        }
      />
    :
    <Text
      style={{
        alignSelf: 'center',
        width: 200,
        backgroundColor: 'rgba(255, 255, 255, .15)',
        color: '#FFF',
        marginTop: 20,
        paddingVertical: 8,
        borderRadius: 20,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold'
    }}>Nenhuma mensagem ainda!</Text>}

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 25,
          right: 25,
        }}
        onPress={() => setVisibleModal(true)}
        activeOpacity={0.85}
      >
        <BlurView
          intensity={100}
          style={{
            paddingLeft: 3,
            borderRadius: 999,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#FFF',
          }}
        >
          <Ionicons
            name="add-circle"
            size={48}
            color="#FFF"
          />
        </BlurView>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={visibleModal}
        transparent={true}
        onRequestClose={() => setVisibleModal(false)}
      >
        <FormModal
          handleClose={() => setVisibleModal(false)}
          // hasGalleryPermission={hasGalleryPermission}
        />
      </Modal>
    </View>
  );
}