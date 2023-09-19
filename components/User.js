import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-native";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendsRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.3:8000/friend-requests/sent/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("Error", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.3:8000/friends/${userId}`
        );

        const data = await response.json();
        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("Error retrieving user friends", response.status);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchUserFriends();
  }, []);

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

  console.log("Friend requests sent:", friendsRequests);
  console.log("User Friends:", userFriends);

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
      {userFriends.includes(item._id) ? (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#02B290",
            padding: 10,
            borderRadius: 6,
            width: 100,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>
            Friends
          </Text>
        </Pressable>
      ) : requestSent ||
        friendsRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#758283",
            padding: 10,
            borderRadius: 6,
            width: 100,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
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
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
