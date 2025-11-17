import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

interface Category {
  id: number;
  name_category: string;
  initial_value: number;
  current_value: number;
  max_value: number;
  id_user: string;
}

type ItemCardProps = {
  item: Category;
  onPress: () => void;
  onDelete: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress, onDelete }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={styles.cardText}>{item.name_category}</Text>
        <Text style={styles.cardSubText}>
          Uso: {item.current_value}km / {item.max_value}km
        </Text>
      </View>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>X</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const VehicleManagementPage: React.FC = () => {
  const { user, setAuth } = useAuth();


  //tem que ter const em cada movimentacao que vai ter no aplicativo, por isso a quantidade
  const [items, setItems] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCurrentUsage, setNewItemCurrentUsage] = useState<string>('');
  const [newItemMaxUsage, setNewItemMaxUsage] = useState<string>('');
  const [currentUsage, setCurrentUsage] = useState<string>('');
  const [maxUsage, setMaxUsage] = useState<string>('');
  const [todayUsage, setTodayUsage] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    fetchCategories();
  }, [user]);

  async function fetchCategories() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id_user', user?.id)
      .order('name_category');

    if (error) Alert.alert('Erro', error.message);
    else if (data) setItems(data);

    setIsLoading(false);
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    setAuth(null);

    if (error) {
      Alert.alert('Erro', 'Erro ao sair da conta!');
    }
  }

//o .trim evita dar problema de espaçamento

  const handleAddNewItem = async () => {
    if (
      newItemName.trim() === '' ||
      newItemCurrentUsage.trim() === '' ||
      newItemMaxUsage.trim() === ''
    ) {
      Alert.alert('Atenção', 'Preencha todos os 3 campos.');
      return;
    }

    setIsSaving(true);

    const currentUsageNumber = parseFloat(newItemCurrentUsage) || 0;
    const maxUsageNumber = parseFloat(newItemMaxUsage) || 0;

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name_category: newItemName.trim(),
        initial_value: currentUsageNumber,
        current_value: currentUsageNumber,
        max_value: maxUsageNumber,
        id_user: user?.id,
      })
      .select()
      .single();

    if (error) Alert.alert('Erro', error.message);
    else if (data) {
      setItems((prev) => [...prev, data]);
      setNewItemName('');
      setNewItemCurrentUsage('');
      setNewItemMaxUsage('');
      Alert.alert('Sucesso', `"${data.name_category}" foi adicionado!`);
    }

    setIsSaving(false);
  };

  const handleSaveUpdates = async () => {
    if (!selectedItem) return;

    setIsSaving(true);

    const current = parseFloat(currentUsage) || 0;
    const today = parseFloat(todayUsage) || 0;
    const max = parseFloat(maxUsage) || 0;

    const newCurrentValue = current + today;

    const { data, error } = await supabase
      .from('categories')
      .update({
        current_value: newCurrentValue,
        max_value: max,
      })
      .eq('id', selectedItem.id)
      .select()
      .single();

    if (error) Alert.alert('Erro', error.message);
    else if (data) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? data : item
        )
      );
      Alert.alert('Sucesso', 'Item atualizado!');
      handleBackToList();
    }

    setIsSaving(false);
  };

//deletando o item
  async function deleteCategory(id: number) {
    if (!user) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("id_user", user.id);

    if (error) {
      console.log("Erro ao deletar: ", error);
      Alert.alert("Erro", "Não foi possível excluir.");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const handleSelectItem = (item: Category) => {
    setSelectedItem(item);
    setCurrentUsage(item.current_value.toString());
    setMaxUsage(item.max_value.toString());
    setTodayUsage('');
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (selectedItem) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={handleBackToList}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'< Voltar para lista'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Gerenciar: {selectedItem.name_category}</Text>

          <Text style={styles.label}>Uso Atual (km)</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={currentUsage}
            editable={false}
          />

          <Text style={styles.label}>Uso Máximo (km)</Text>
          <TextInput
            style={styles.input}
            value={maxUsage}
            onChangeText={setMaxUsage}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Rodado Hoje (km)</Text>
          <TextInput
            style={[styles.input, styles.todayInput]}
            value={todayUsage}
            onChangeText={setTodayUsage}
            keyboardType="numeric"
            autoFocus={true}
          />

          <TouchableOpacity
            style={[styles.button, styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSaveUpdates}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>

      {/* botao de sair que eu tive que adicionar */}
      <TouchableOpacity
        onPress={handleSignOut}
        style={{ margin: 20, alignSelf: 'flex-end' }}
      >
        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>
          Sair
        </Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => handleSelectItem(item)}
            onDelete={() => deleteCategory(item.id)}  
          />
        )}

        // essa parte aqui eu tive que fazer porque ficava só nulo
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.pageTitle}>Gerenciar Peças</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma peça cadastrada ainda.</Text>}
        ListFooterComponent={
          <View style={styles.addItemContainer}>
            <Text style={styles.label}>Adicionar Nova Peça</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da peça (Ex: Freio)"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <TextInput
              style={styles.input}
              placeholder="Uso Atual (Ex: 100)"
              value={newItemCurrentUsage}
              onChangeText={setNewItemCurrentUsage}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="KM Máximo (Ex: 250)"
              value={newItemMaxUsage}
              onChangeText={setNewItemMaxUsage}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.button, styles.addButton, isSaving && styles.disabledButton]}
              onPress={handleAddNewItem}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Adicionar Novo Item</Text>
              )}
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f0f0f0' },
  container: { padding: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },

  deleteButton: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardText: { fontSize: 18, fontWeight: '500' },
  cardSubText: { fontSize: 14, color: '#666', marginTop: 4 },

  emptyText: { textAlign: 'center', color: '#666', fontSize: 16, marginTop: 40 },

  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },

  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },

  disabledInput: { backgroundColor: '#f5f5ff', color: '#888' },
  todayInput: { borderColor: '#007BFF', borderWidth: 2 },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },

  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  addButton: { backgroundColor: '#28a745' },
  saveButton: { backgroundColor: '#007BFF', marginTop: 10 },
  disabledButton: { opacity: 0.7, backgroundColor: '#999' },

  backButton: { marginBottom: 15, alignSelf: 'flex-start' },
  backButtonText: { fontSize: 16, color: '#007BFF', fontWeight: '500' },

  addItemContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default VehicleManagementPage;
