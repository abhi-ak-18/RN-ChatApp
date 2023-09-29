import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useContext } from "react";
import { Image } from "react-native";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({item, friendRequests, setFriendRequests}) => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    const acceptRequest = async (friendRequestId) => {

        try {
            const response = await fetch("https://rn-chatapp.onrender.com/accept-friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId:friendRequestId,
                    recipientId:userId
                })
            })

            if(response.ok){
                setFriendRequests(friendRequests.filter((request) => request._id !== friendRequestId))
                navigation.navigate("Chats")
            }
        } catch (error) {
            console.log("Error accepting the friend request", error)
        }
    }
  return (
    <Pressable style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:10}}>
      <Image
        source={{ uri: item.image }}
        style={{ height: 40, width: 40, borderRadius: 20 }}
      />

      <Text style={{fontSize:12}}>{item.name} sent you a friend request</Text>
      <Pressable style={{backgroundColor:'#1FAA59', padding:10, borderRadius:6}} onPress={() => acceptRequest(item._id)}>
        <Text style={{textAlign:'center', color:'white'}}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
