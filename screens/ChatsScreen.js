import { StyleSheet, Text, View , ScrollView} from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {
    const [acceptedFriends, setacceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() => {
      const acceptedFriendsList = async () => {
        try {
            const response = await fetch(`https://rn-chatapp.onrender.com/accepted-friends/${userId}`);
            const data = await response.json();

            if(response.ok){
                setacceptedFriends(data);
            }
        } catch (error) {
            console.log("Error showing the accepted friends",error);

        }
      };

      acceptedFriendsList();
    }, [])

    console.log("Friends", acceptedFriends)
    

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item, index) => (
            <UserChat key={index} item={item}/>
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({})