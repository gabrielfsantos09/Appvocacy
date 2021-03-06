import React, { useEffect, useState } from 'react';

import { 
  TextInputMask 
  } from 'react-native-masked-text'

import DropDownPicker from 'react-native-dropdown-picker';

import {
View, 
StyleSheet, 
Text, 
TextInput,
TouchableOpacity,
Image,
ScrollView,
Dimensions
} from 'react-native';

import { 
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

import { 
  doc, 
  setDoc, 
  getDoc,
  getFirestore
} from "firebase/firestore";

require ("../../firebaseConfig.js")

import { Ionicons } from '@expo/vector-icons';
import logo from './../assets/logo.png';
import { setEnabled } from 'react-native/Libraries/Performance/Systrace';

const dHeight = Dimensions.get('window').height
const dWidth = Dimensions.get('window').width


export default function CadastroAdvogado({navigation}) {
    DropDownPicker.setListMode("MODAL");
    const db = getFirestore();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [vOAB, setOAB] = useState('');
    const [vNome, setNome] = useState('');
    const [vEndereco, setEndereco] = useState('');
    const [vTelefone, setTelefone] = useState('');
    const [ocultarSenha, setOcultarSenha] = useState (true);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
    {label: ' Ambiental', value: 'Ambiental'},
    {label: ' Adminstrativo', value: 'Adminstrativo'},
    {label: ' Civil', value: 'Civil'},
    {label: ' Consumidor', value: 'Consumidor'},
    {label: ' Contratual', value: 'Contratual'},
    {label: ' Criminal', value: 'Criminal'},
    {label: ' Eleitoral', value: 'Eleitoral'},
    {label: ' Empresarial', value: 'Empresarial'},
    {label: ' Estado', value: 'Estado'},
    {label: ' Penal', value: 'Penal'},
    {label: ' Previdenciário', value: 'Previdenciário'},
    {label: ' Propriedade Intelectual', value: 'Propriedade Intelectual'},
    {label: ' Tecnologia da Informação', value: 'Tecnologia da Informação'},
    {label: ' Trabalhista', value: 'Trabalhista'},
    {label: ' Tributário', value: 'Tributário'},
  ]);
    
    function cadastrarFirebase(){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, senha, vOAB, vNome, vEndereco, vTelefone, value).then(cred => {
              // Signed in
              const user = cred.user;
              // ...

              setDoc(doc(db, "info-advogado", user.uid), {
                Endereco: vEndereco,
                OAB: vOAB,
                Nome: vNome,
                Telefone: vTelefone,
                Tipo: value,
                Conversas: []
              });

              console.log("Criado com sucesso! UID: " + user.uid)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Ocorreu um erro na criação da conta", errorCode, errorMessage)
          // ..
        })
      };
  


      const VerificarA = async ()=>{
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
     if (user) {
      const docRef = doc(db, "info-advogado", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      console.log("Bem vindo: " +user.uid)
      navigation.navigate("PerfilAdvogado")
      } else {
      // doc.data() will be undefined in this case
      alert("A conta logada no momento não é uma conta de advogado");
      alert("Entre na área certa e saia da conta para poder cadastrar/logar em outra");
      navigation.navigate("Cadastro")
      }
     } else {
       console.log("Não está logado")
     }
     });
    }

    useEffect(() => {
      setTimeout(() => {
        VerificarA()
      }, 1000);
    }, []);
    
    return(

    <ScrollView style={styles.fundo}>
    <View style={styles.container}>
     <View style={styles.logo}>
       <Image style={{width:150, height:199}}
       source={logo} 
       />
     </View>

     <View style={styles.container}>

     <TextInput 
        style={styles.inputs}
        autoCorrect = {false}
        placeholder = " Email"
        onChangeText={ email => setEmail(email) }  
      />
    <View style={styles.areaInputSenha}>
    <TextInput 
        style={styles.inputsenha}
        autoCorrect = {false}
        placeholder = " Senha"
        onChangeText={ senha => setSenha(senha) }  
        secureTextEntry={ocultarSenha}
    />
    
    <TouchableOpacity style={styles.icon} onPress={ () => setOcultarSenha(!ocultarSenha)}>
        {ocultarSenha ?
          <Ionicons name="eye" color="#FFF" size={25} />
          :
          <Ionicons name="eye-off" color="#8c8c8c" size={25} />
        }
    </TouchableOpacity>
    </View>
    

    <View style={styles.areainputs}>
    <TextInput 
        style={styles.inputs}
        autoCorrect = {false}
        placeholder = " Nome"
        onChangeText={ nome => setNome(nome) }  
      />

      <TextInputMask 
       style={styles.inputs}
       type={'custom'}
       placeholder=" Numero OAB"
       options={{
         mask: ' 999999'
       }}
       value={vOAB}
       onChangeText={ oab => setOAB(oab)}
       />

    <TextInputMask 
       style={styles.inputs}
       type={'cel-phone'}
       placeholder=" Celular"
       options={{
         maskType: 'BRL',
         withDDD: true,
         dddMask: '(99)'
       }}
       value={vTelefone}
       onChangeText={ telefone => setTelefone(telefone)}
       />

    <TextInput 
        style={styles.inputs}
        autoCorrect = {false}
        placeholder = " Endereco "
        onChangeText={ endereco => setEndereco(endereco) }  
      />

    <DropDownPicker
      style={styles.inputipo}
      textStyle={{
        fontSize: 17,
        color: "#888"
      }}
      placeholder=" Selecione seu campo"
      open={open}
      value={value}
      itemSeparator={true}
      items={items}
     
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}

      listItemContainer={{
        height: 50,
        
      }}
      listItemLabelStyle={{
        height: 30,
    margin: 0,
    marginLeft: 15,
    marginRight: 5,
    borderRadius: 5,
    fontSize: 19,
    padding: 0,
    color: '#000',
      }}
      modalProps={{
        animationType: "slide"
      }}
      selectedItemContainerStyle={{
        backgroundColor: "#e6e6e6"
      }}
      selectedItemLabelStyle={{
        fontWeight: "bold",
        color: '#000'
      }}
      /*modalContainerStyle={{
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
      }}*/
      modalContentContainerStyle={{
    height: 60,
    backgroundColor: '#fff',
    margin: 20,
    marginLeft: 15,
    marginRight: 5,
    borderRadius: 5,
    fontSize: 19,
    padding: 30,
    color: '#000',
      }}
      itemSeparatorStyle={{
        backgroundColor: "#c6c6c6"
      }}
    />
     </View>
     </View>    
     
     <View>
     <TouchableOpacity style={styles.btnCadastrar} onPress={()=>cadastrarFirebase()}>
        <Text style={styles.textoCadastrar}>Cadastrar</Text>
      </TouchableOpacity>    

      <TouchableOpacity style={styles.btnLogin}>
        <Text style={styles.textoLogin} onPress={()=>{navigation.navigate('LoginAdvogado')}}>Já possuo cadastro</Text>
      </TouchableOpacity>
     </View>
    </View>
    </ScrollView>
      )
      }

    const styles = StyleSheet.create({
      
    fundo:{
        flex: 1,
        backgroundColor: '#e6e6e6'
    },
    
    container:{
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo:{
      marginBottom: 50,
      flex: 1,
      paddingTop: (dHeight-dHeight+50),
      justifyContent: 'center',
    },
    
    inputs:{
      backgroundColor: '#FFF',
      width: (dWidth - 60),
      marginBottom: 10,
      color:'#000000',
      fontSize: 17,
      borderRadius: 7,
      height: 48,
      paddingRight: 0,
      paddingLeft: 0,
      padding: 10
  },

  inputsenha:{
      backgroundColor: '#FFF',
      width: (dWidth - 100),
      marginBottom: 10,
      height: 48,
      color:'#000000',
      fontSize: 17,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRadius: 7,
      paddingRight: 0,
      paddingLeft: 0,
      padding: 10
  },

    inputipo:{
      backgroundColor: '#FFF',
      width: (dWidth - 60),
      height: 48,
      color:'#000000',
      fontSize: 17,
      borderRadius: 7,
      paddingRight: 0,
      paddingLeft: 0,
      padding: 5
  },

    areaInputSenha:{
        flexDirection: 'row',
        justifyContent: 'center',
        borderStyle: 'solid'
    },

    btnCadastrar:{
        backgroundColor: '#D49D3D',
        width: (dWidth - 60),
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        marginBottom: 40,
        marginTop: 30
    },
    
    textoCadastrar:{
        color: '#FFFFFF',
        fontSize: 17
    },

    icon:{
        width: 40,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderRadius: 7,
    
      },

      btnLogin:{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        marginBottom: 10,
        marginTop: 5,
      },
  
      textoLogin:{
        color: '#D49D3D',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 16,
        fontStyle: 'italic'
      },
    
})

