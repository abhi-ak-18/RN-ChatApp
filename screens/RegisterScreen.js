import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native";
import { Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const defaultUserImage =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1695743723~exp=1695744323~hmac=4d6be87de3922dfabc655661c703e64977a02e24c03ae41905cd99a8d9114c0f";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();
  const handleRegister = () => {
    if (!image) {
      // Set image to the default URL if it's empty
      setImage(defaultUserImage);
    }

    console.log("image->",image)
  
    const user = {
      name: name,
      email: email,
      password: password,
      image: image || defaultUserImage,
    };

    //Send a POST req to backend APi to register the user
    axios.post("http://192.168.1.3:8000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "Your account has been created successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage(defaultUserImage);
      })
      .catch((err) => {
        Alert.alert("Registration Error", "Please try again");
        console.log("Registation error", err);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: "10",
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "blue", fontSize: 17, fontWeight: "600" }}>
            Register
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Register for your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "gray" }}>
                Name
              </Text>
              <TextInput
                style={{
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                  height: 30,
                  fontSize: 12,
                }}
                placeholderTextColor={"black"}
                placeholder="enter your name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                height: 30,
                fontSize: 12,
              }}
              placeholderTextColor={"black"}
              placeholder="enter your email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "gray" }}>
              Password
            </Text>
            <TextInput
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                height: 30,
                fontSize: 12,
              }}
              placeholderTextColor={"black"}
              placeholder="enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "gray" }}>
              Image
            </Text>
            <TextInput
              style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
                height: 30,
                fontSize: 12,
              }}
              placeholderTextColor={"black"}
              placeholder="enter your image"
              value={image}
              onChangeText={(text) => setImage(text)}
            />
          </View>
          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#12B0E8",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </Pressable>
          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
