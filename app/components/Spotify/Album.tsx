import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { Album } from "./Model";
import Content from "./Content";
import Cover from "./Cover";
import Modal from "../Modal";
import ItemModal from "../ItemModal";
interface AlbumProps {
  album: Album;
}

const { Value } = Animated;

export default ({ album }: AlbumProps) => {
  const [visible, setVisible] = useState(false);  
  let a = setVisible;
    
  const y = new Value(0);
  return (
    <View style={styles.container}>
      <Cover {...{ y, album }} />
      <Content {...{ y, album, a}} />
      <Modal isVisible={visible} setIsVisible={setVisible}>
        <View>
          <Text>JOJO</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
