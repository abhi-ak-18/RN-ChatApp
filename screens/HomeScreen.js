import { StyleSheet, Text, View } from "react-native";
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
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbubbles-outline" size={24} color="black" />
          <Ionicons
          onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
            style={{ marginLeft: 15 }}
          />
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

      axios
        .get(`http://192.168.1.3:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("Error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);
  console.log("Users:", users)

  return (
    <View>
        <View style={{padding:10}}>
            {users.map((item, index) => (
                <User key={index} item={item}/>
            ))}
        </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
