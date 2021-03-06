import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Image, NativeModules } from "react-native";
import { Header, Avatar, Button } from "react-native-elements";
import { ListItem } from "react-native-elements";
import LoadingFull from "../../components/LoadingFull";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
// import AccountOptions from "../../components/Account/AccountOptions";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { withNavigation } from "react-navigation";
import { Updates } from "expo";
import Modal from "../../components/Modal";
import { openApp } from "rn-openapp";

const { Openapp } = NativeModules;


const db = firebase.firestore(firebaseApp);

const UserLogged = (props) => {
  const { navigation } = props;
  const [ready, setReady] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const [vendedor, setVendedor] = useState({});
  const [reloadData, setReloadData] = useState(false);
  
  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser;
      setUserInfo(user);

      await db
        .collection("Vendedor")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
          setVendedor(doc.data());
        });
      setReady(true);
    })();
    setReloadData(false);
  }, [reloadData]);

  if (!ready) {
    return <LoadingFull isVisible={true} />;
  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <HeaderUp
        navigation={navigation}
        userInfo={userInfo}
        setReloadData={setReloadData}
        vendedor={vendedor}
      ></HeaderUp>
      <Options
        navigation={navigation}
        vendedor={vendedor}
      ></Options>
    </View>
  );
};
export default withNavigation(UserLogged);

const color = "rgb(78,32,29)";

const HeaderUp = (props) => {
  const [ready, setReady] = useState(false);
  const { navigation, userInfo, setReloadData, vendedor } = props;

  const cambiarAvatar = async () => {
    const resultPermision = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const resultPermisionCamera = resultPermision.permissions.cameraRoll.status;
    if (resultPermisionCamera === "denied") {
      console.log("permisos");
    } else {
      var result = await ImagePicker.launchImageLibraryAsync({
        allowEditing: true,
        aspect: [4, 3],
      });
    }
    if (result.cancelled) {
      console.log("cancelado");
    } else {
      cargarImagen(result.uri, userInfo.uid).then(() => {
        console.log("Imagen subida correctamente");
        cargarFotoUrl(userInfo.uid);
      });
    }
  };

  const cargarImagen = async (uri, id) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`avatar/${id}`);
    return ref.put(blob);
  };

  const cargarFotoUrl = async (uid) => {
    await firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (result) => {
        const update = {
          photoURL: result,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setReloadData(true);
      });
  };
  useEffect(() => {
    setReady(true);
  });

  if (!ready) {
    return (
      <LoadingFull isVisible={true} color={color} text={"cargandooooooo"} />
    );
  }

  return (
    <View>
      <View style={styles.header2}>
        <Avatar
          size="large"
          rounded
          showEditButton
          onEditPress={cambiarAvatar}
          source={{
            uri: userInfo.photoURL
              ? userInfo.photoURL
              : "https://api.adorable.io/avatars/266/abott@adorable.png",
          }}
        />

        <Text style={{ textAlign: "center", fontSize: 20, marginTop: 10 }}>
          {vendedor.nombre == undefined
            ? ""
            : vendedor.nombre + " " + vendedor.apellidos}
        </Text>

        <Text style={{ textAlign: "center", fontSize: 15, marginTop: 10 }}>
          {firebase.auth().currentUser.email}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.sigo}
          onPress={() => {
            firebase.auth().signOut();
          }}
        >
          <Text style={styles.sigt}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Options = (props) => {
  const { navigation, vendedor} = props;

  const [modal, setModal] = useState(false);

  const url = "whatsapp://app";

  const config = {
    appName: 'Paiton',
    appStoreId: 'id00112233',
    playStoreId: '',
    appStoreLocale: 'br',
  };
  
  const examplePackageId = "io.lrtbl.paiton.game";
 
  return (
      <View>
          {list.map((item, i) => (
              <TouchableOpacity
                  key={i.toString()}
                  onPress={() =>
                    item.navigate==""? setModal(true) : navigation.navigate(item.navigate, { vendedor })
                  }
              >
                  <ListItem
                      key={i.toString()}
                      title={item.title}
                      leftIcon={{ name: item.icon, type: item.type }}
                      bottomDivider
                      chevron
                  />
              </TouchableOpacity>
          ))}

          <Modal
              isVisible={modal}
              setIsVisible={setModal}
              children={
                <TouchableOpacity 
                  style={{justifyContent: 'center', overflow: 'hidden'}} 
                  onPress={()=>{
                    console.log(Openapp);
                      // openApp(examplePackageId)
                      // .then(result => cosnole.log(result))
                      // .catch(e => console.warn(e));
                    console.log("Entrando a juego");}}>
                  <Image style={{borderRadius: 18, width: '100%'}} source={require("../../../assets/banner-ad.png")} />
                </TouchableOpacity>                
              }
              back={"rgb(78,32,29)"}
          />
      </View>
  );
};

const list = [
  {
    title: "Cuenta",
    icon: "account-edit",
    type: "material-community",
    navigate: "Settings",
  },
  {
    title: "Mis Tiendas",
    icon: "store",
    type: "font-awesome-5",
    navigate: "Stores",
  },
  {
    title: "Preferencias",
    icon: "ios-settings",
    type: "ionicon",
    navigate: "AppPreferences",
  },
  {
    title: "Acerca de",
    icon: "information",
    type: "material-community",
    navigate: "About",
  },
  {
    title: "Descuentos",
    icon: "cash-usd",
    type: "material-community",
    navigate: "",
  },
];

const styles = StyleSheet.create({
  btnSignOut: {
    backgroundColor: "#190976",
  },
  containerBtnSO: {
    marginTop: 40,
  },
  header2: {
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 180,
  },
  sigo: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color,
  },
  sigt: {
    fontSize: 17,
    textAlign: "center",
    color: "#fff",
    width: "100%",
    //height: 45,
    borderRadius: 10,
  },
});
