import React from 'react';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text
} from 'react-native';

import {
  collection, 
  query, 
  where, 
  getDocs,
  getFirestore,
  orderBy, 
  limit,
  updateDoc,
  arrayUnion,
  doc
} from "firebase/firestore";

import {
  getAuth, 
} from "firebase/auth";

import { 
  Avatar,
  ListItem
} from "react-native-elements";

import { TouchableHighlight } from "react-native";


const ListaBusca = ({route,navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {tipoescolhido}=route.params;
  const [searchText, setSearchText] = useState('');
  const [listar, setListar] = useState(0);
  const [advogados, setAdvogados] = useState();
  const [clicado, setClicado] = useState (false);
  const [q, setQ] = useState ();
  const [infoAdvogado, setInfoAdvogado] = useState({
    Id: "", 
    Nome: "",
    Imagem: "",
  })

  const addConversa = (Id) =>{
    const auth = getAuth()
    const db = getFirestore();
    const userRef = doc(db, 'info-user', auth.currentUser.uid)
    const advogadoRef = doc(db, 'info-advogado', Id)
    updateDoc(userRef,{
     Conversas: arrayUnion(Id)
    })
    updateDoc(advogadoRef,{
      Conversas: arrayUnion(auth.currentUser.uid)
     })
  }

  useEffect(async()=> {
    const db = getFirestore();
    var vquery = query(collection(db,'info-advogado'), where('Tipo','==', tipoescolhido))
    var data = []
    getDocs(vquery).then(resultados=>{
      resultados.forEach(doc=>{
        var Adv = doc.data()
        Adv.id = doc.id
        data.push(Adv) 
      })
      setAdvogados(data)
    })
  },[])


  const handleOrderClick = () => {
    let newList = [...advogados];
    const db = getFirestore();


      
    if(listar==0){
      setListar(1)
      console.log("crescente")
    }
    else{
      setListar(0)
      console.log("decrescente")
    }
    //setList(newList);

    console.log(listar)
    console.log(q)
  };


  const seila = async ()=>{
    const db = getFirestore();
    const q = query(collection(db, "info-advogado"), where("Tipo", "==", tipoescolhido));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });}
  seila()

  const nameTap = (Imagem, Nome, Id) =>{
    if(!Imagem){
      navigation.push("Chats",{
      Nome,
      Imagem: Nome.charAt(0),
      Id,
      })
    }
    else{
      navigation.push("Chats",{
      Nome,
      Imagem,
      Id,
      })
    }
  }
  return (

    <SafeAreaView style={styles.container}>
      
      <View style={styles.Titulo}>
        <Text style={styles.Texto}>{tipoescolhido}</Text>
      </View>

      {advogados && <FlatList
        data={advogados}
        style={styles.list}
        renderItem={({ item })=>
        <View key={item.id}>
        <ListItem
        Component={TouchableHighlight}
        containerStyle={{
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderTopColor:"#FFF",
        width:'100%'
        }}
        disabledStyle={{ opacity: 0.5 }}
        pad={20}
        >
        
        <Avatar
        avatarStyle={{justifyContent: 'center'}}
        containerStyle={{ backgroundColor: "#BDBDBD" }}
        size="large"
        rounded
        source={{
          uri: item.Imagem
        }}
        title={item.Nome.charAt(0)}
        />
      <ListItem.Content >

        <ListItem.Title style={styles.width}>
        <Text style={styles.nome}> {item.Nome} </Text>
        </ListItem.Title>

        <ListItem.Subtitle>
        <Text style={styles.tipo}> {item.Tipo} </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <TouchableOpacity style={styles.btnEditar} onPress={() => {
        nameTap(item.Imagem, item.Nome, item.id)
        addConversa(item.id)
        }}>
        <Text style={styles.textoLogin}>Entrar</Text>
      </TouchableOpacity>
        </ListItem>
        </View>
      }
      />}


      

    </SafeAreaView>

    
      
  );
};

const styles = StyleSheet.create({
  width:{
    width: 1000
  },
  Titulo:{
    height: 60,
    alignItems: 'center',
    backgroundColor: '#FFF',
    justifyContent: "center",
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  Texto:{
    fontSize: 22,
    fontWeight: 'bold',
    
  },
  modalText:{
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    position: 'absolute',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  btnEditConfirm:{
    backgroundColor: '#DBBA81',
    height: 30,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginTop: 10,
    marginBottom: 10
  },
  btnEditsair:{
    backgroundColor: '#543E18',
    height: 30,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginTop: 10,
    marginBottom: 10
  },
  container: {
    flex: 1,
  },
  nome:{
    fontSize: 24,
    width: "100%",
  },
  tipo:{
   fontSize: 18,
  },
  botao:{
    marginRight: 10
  },
  input: {
    borderColor: '#e6e6e6',
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    margin: 20,
    marginLeft: 15,
    marginRight: 5,
    borderRadius: 5,
    fontSize: 19,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#000',
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  orderButton: {
    width: 32,
    marginRight: 20,
  },
  list: {
    flex: 1,
  },
  btnEditar:{
    backgroundColor: '#53D489',
    height: 40,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginTop: 10,
    marginBottom: 10
    },
    textoLogin:{
      color: '#FFFFFF',
      fontSize: 17
    },
});

export default ListaBusca;