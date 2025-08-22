import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getEvents, enrollToEvent, unenrollFromEvent } from "../services/eventService";

export default function EventScreen({ navigation, route }) {
  const { token, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents({}, token);
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando eventos:", error);
      Alert.alert("Error", "No se pudieron cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filtrar eventos basado en la búsqueda
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const handleEnroll = async (eventId) => {
    try {
      await enrollToEvent(eventId, token);
      Alert.alert("Éxito", "Te has inscrito al evento correctamente");
      fetchEvents(); // Recargar eventos para actualizar estado
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo inscribir al evento");
    }
  };

  const handleUnenroll = async (eventId) => {
    try {
      await unenrollFromEvent(eventId, token);
      Alert.alert("Éxito", "Has cancelado tu inscripción al evento");
      fetchEvents(); // Recargar eventos para actualizar estado
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo cancelar la inscripción");
    }
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

  const isUserEnrolled = (event) => {
    // Esta función debería verificar si el usuario está inscrito
    // Por ahora retornamos false, pero deberías implementar la lógica
    return false;
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventPrice}>
          ${item.price === 0 ? 'Gratis' : item.price}
        </Text>
      </View>
      
      <Text style={styles.eventDescription} numberOfLines={3}>
        {item.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <Text style={styles.eventDate}>
          📅 {formatDate(item.start_date)}
        </Text>
        <Text style={styles.eventDuration}>
          ⏱️ {item.duration_in_minutes} minutos
        </Text>
      </View>
      
      <View style={styles.eventLocation}>
        <Text style={styles.locationText}>
          📍 {item.location?.name || 'Ubicación no disponible'}
        </Text>
        <Text style={styles.locationAddress}>
          {item.location?.full_address || 'Dirección no disponible'}
        </Text>
      </View>
      
      <View style={styles.eventFooter}>
        <Text style={styles.creatorText}>
          Organizado por: {item.creator_user?.first_name} {item.creator_user?.last_name}
        </Text>
        
        <View style={styles.enrollmentSection}>
          <Text style={styles.enrollmentText}>
            {item.max_assistance} cupos disponibles
          </Text>
          
          {item.enabled_for_enrollment ? (
            <TouchableOpacity
              style={[
                styles.enrollButton,
                isUserEnrolled(item) && styles.unenrollButton
              ]}
              onPress={() => 
                isUserEnrolled(item) 
                  ? handleUnenroll(item.id) 
                  : handleEnroll(item.id)
              }
            >
              <Text style={styles.enrollButtonText}>
                {isUserEnrolled(item) ? 'Cancelar Inscripción' : 'Inscribirse'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.disabledText}>Inscripciones cerradas</Text>
          )}
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Eventos</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "500",
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
  },
  eventDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 15,
    lineHeight: 22,
  },
  eventDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 14,
    color: "#95a5a6",
  },
  eventDuration: {
    fontSize: 14,
    color: "#95a5a6",
  },
  eventLocation: {
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 12,
    color: "#95a5a6",
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 15,
  },
  creatorText: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 10,
  },
  enrollmentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  enrollmentText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  enrollButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  unenrollButton: {
    backgroundColor: "#e74c3c",
  },
  enrollButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});
