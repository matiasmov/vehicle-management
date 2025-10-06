import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSignIn(){

    setLoading(true);
    


  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Gerenciamento Veicular<Text style={{ color: Colors.green }}>App</Text>
        </Text>
        <Text style={styles.slogan}>Adminstre seus veículos em um lugar só!</Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Digite seu email..."
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha..."
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Acessar</Text>
        </Pressable>

        <Link href='/(auth)/signup/page' style={styles.link}>
        <Text> Ainda não possui uma conta? Cadastre-se</Text>
        
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: Colors.zinc,
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 24,
    color: Colors.white,
    marginBottom: 34,
  },
  form: {
    flex:  1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,

  },
  label: {
    color: Colors.zinc,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 14,
  },
  button:{
    backgroundColor: Colors.green,
    paddingTop:14,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
  },
  buttonText:{
    color: Colors.white,
    fontWeight: 'bold'
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
  }
});
