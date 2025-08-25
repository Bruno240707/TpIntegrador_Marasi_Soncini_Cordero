import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Button, StyleSheet, RefreshControl } from "react-native";
import api from "../services/api";

export default function EventScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/event");
      setEvents(response.data);
    } catch (error) {
      console.error("Error al obtener eventos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/enroll`);
      fetchEvents();
    } catch (error) {
      console.error("Error al inscribirse:", error.message);
    }
  };

  const unenroll = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}/unenroll`);
      fetchEvents();
    } catch (error) {
      console.error("Error al desinscribirse:", error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => {
    const isUserEnrolled = item.is_user_enrolled === true;
    return (
      <View style={styles.eventContainer}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.enrollmentText}>
          {item.available_spots} cupos disponibles
        </Text>
        {isUserEnrolled ? (
          <Button title="Desinscribirse" onPress={() => unenroll(item.id)} color="red" />
        ) : (
          <Button title="Inscribirse" onPress={() => enroll(item.id)} color="green" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Disponibles</Text>
      {loading ? (
        <Text>Cargando eventos...</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  eventContainer: { marginBottom: 20, padding: 15, borderWidth: 1, borderRadius: 10 },
  eventName: { fontSize: 18, fontWeight: "bold" },
  enrollmentText: { marginVertical: 5, fontStyle: "italic" },
});
