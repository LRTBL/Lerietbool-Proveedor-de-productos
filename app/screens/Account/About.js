import React from "react";
import { View, Text } from "react-native";

const About = (props) =>{
  const {navigation} = props
  return (
    <View>
      <Back navigation={navigation}></Back>
      <Text>Estas en la pantalla de Preferencias</Text>
    </View>
  );
}
export default About







