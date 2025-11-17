import React from "react";
import { Alert, Pressable, Text } from "react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { supabase } from "../src/lib/supabase";

type Props = {
  categoryId: string;
  onDeleted: () => void;
};

export default function DeleteCategoryButton({ categoryId, onDeleted }: Props) {
  const { user } = useAuth();

  function handleDelete() {
    Alert.alert(
      "Excluir categoria",
      "Tem certeza que deseja excluir essa categoria?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!user) return;

            const { error } = await supabase
              .from("categories")
              .delete()
              .eq("id", categoryId)
              .eq("id_user", user.id);

            if (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
              return;
            }

            onDeleted();
          },
        },
      ]
    );
  }

  return (
    <Pressable
      onPress={handleDelete}
      style={{
        backgroundColor: "red",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16 }}>🗑️</Text>
    </Pressable>
  );
}
