import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");

  // Logout function
  const handleLogout = async () => {
    try {
      // Clear authentication token
      await AsyncStorage.removeItem("authToken");

      // Navigate back to the login screen
      navigation.replace("Login"); // You can use navigation.navigate() if you want to allow going back to the previous screen
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ marginLeft: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Whats Chat App
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20, flexDirection: "row" }}>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbubbles-outline"
            size={24}
            color="black"
          />
          <Ionicons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
            style={{ marginLeft: 15 }}
          />
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      // Fetch the username separately
      axios
        .get(`https://rn-chatapp.onrender.com/username/${userId}`)
        .then((response) => {
          const { username } = response.data;
          console.log("fetched username", username);
          if (username) {
            setUsername(username);
          }
        })
        .catch((error) => {
          console.log("Error retrieving username", error);
        });

      axios
        .get(`https://rn-chatapp.onrender.com/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("Error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);
  console.log("Users:", users);

  return (
    <View>
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom:20 }}>
        Welcome, {username}!
      </Text>
      {users.map((item, index) => (
        <User key={index} item={item} />
      ))}
    </View>
  </View>
);
};
export default HomeScreen;

const styles = StyleSheet.create({});
