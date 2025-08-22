import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getEvents } from "../services/eventService";

export default function HomeScreen({ navigation }) {
  const { user, token, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents({}, token);
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert("Error", "No se pudieron cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: logout, style: "destructive" }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Hola, {user?.first_name || user?.username || "Usuario"}!
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos Disponibles</Text>
          
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay eventos disponibles</Text>
              <TouchableOpacity 
                style={styles.createEventButton}
                onPress={() => navigation.navigate("Events")}
              >
                <Text style={styles.createEventText}>Ver todos los eventos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            events.slice(0, 3).map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => navigation.navigate("Events", { eventId: event.id })}
              >
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.name}</Text>
                  <Text style={styles.eventPrice}>
                    ${event.price === 0 ? 'Gratis' : event.price}
                  </Text>
                </View>
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
                <View style={styles.eventFooter}>
                  <Text style={styles.eventDate}>
                    📅 {formatDate(event.start_date)}
                  </Text>
                  <Text style={styles.eventLocation}>
                    📍 {event.location?.name || 'Ubicación no disponible'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Events")}
          >
            <Text style={styles.primaryButtonText}>Ver Todos los Eventos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  createEventButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createEventText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  eventCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
  },
  eventDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 12,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  eventLocation: {
    fontSize: 12,
    color: "#95a5a6",
  },
  actions: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
