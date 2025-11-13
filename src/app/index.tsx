import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '@/constants/Colors';


export default function Index() {

  


  return (
    <View style={styles.container}>
      <ActivityIndicator size={44} color = {Colors.green}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center'


},
});

