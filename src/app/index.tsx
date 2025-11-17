import Colors from '@/src/constants/Colors';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


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

