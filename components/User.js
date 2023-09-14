import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { Image } from "react-native";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.1.3:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          currentUserId,
          selectedUserId,
        }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          source={{ uri: item.image }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ color: "gray", marginTop: 5 }}>{item.email}</Text>
      </View>

      <Pressable
        onPress={() => sendFriendRequest(userId, item._id)}
        style={{
          backgroundColor: "#03203C",
          padding: 10,
          borderRadius: 6,
          width: 100,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>
          Add Friend
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
