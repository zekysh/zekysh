import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  FlatList,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  GestureHandlerRootView, 
  PanGestureHandler, 
  State 
} from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Context para el usuario
const UserContext = createContext();

// Datos de ejemplo ampliados
const mockUsers = [
  {
    id: '1',
    owner: {
      name: 'Ana García',
      age: 25,
      gender: 'femenino',
      maritalStatus: 'soltera',
      lookingFor: 'pasear y lo que surja',
      bio: 'Amo los paseos matutinos y las aventuras al aire libre. Mi perrita Luna es muy sociable.',
      photos: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b169?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      ],
      rating: 4.8,
      completedWalks: 23
    },
    dog: {
      name: 'Luna',
      breed: 'Border Collie',
      age: 2,
      gender: 'hembra',
      personality: 'enérgica',
      lookingFor: 'jugar',
      bio: 'Le encanta correr y es muy inteligente. Siempre está lista para una nueva aventura.',
      photos: [
        'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'
      ]
    },
    location: 'Zaragoza, España',
    coordinates: { lat: 41.6488, lng: -0.8891 },
    distance: '1.2 km',
    availableTimes: ['Mañanas', 'Tardes'],
    preferences: {
      maxDistance: 5,
      ageRange: [1, 10],
      breeds: [],
      onlyFemales: false,
      onlyMales: false
    }
  },
  {
    id: '2',
    owner: {
      name: 'Miguel Rodríguez',
      age: 32,
      gender: 'masculino',
      maritalStatus: 'soltero',
      lookingFor: 'solo pasear',
      bio: 'Disfruto de los paseos tranquilos por el parque. Buscando compañía para caminar con Rex.',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      ],
      rating: 4.5,
      completedWalks: 18
    },
    dog: {
      name: 'Rex',
      breed: 'Pastor Alemán',
      age: 4,
      gender: 'macho',
      personality: 'tranquilo',
      lookingFor: 'socializar',
      bio: 'Es muy obediente y le gusta conocer otros perros. Perfecto para paseos relajados.',
      photos: [
        'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
      ]
    },
    location: 'Zaragoza, España',
    coordinates: { lat: 41.6580, lng: -0.8870 },
    distance: '2.8 km',
    availableTimes: ['Tardes', 'Noches'],
    preferences: {
      maxDistance: 10,
      ageRange: [2, 8],
      breeds: ['Border Collie', 'Labrador'],
      onlyFemales: true,
      onlyMales: false
    }
  },
];

// Datos de chats de ejemplo
const mockChats = {};
const mockWalkHistory = [];
const mockNotifications = [];

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    owner: {
      name: 'Carlos Mendoza',
      age: 28,
      gender: 'masculino',
      maritalStatus: 'soltero',
      lookingFor: 'pasear y lo que surja',
      bio: 'Me encanta conocer gente nueva mientras paseamos con nuestros perros. Disfruto de los parques y las caminatas al aire libre.',
      photos: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      ],
      rating: 5.0,
      completedWalks: 0
    },
    dog: {
      name: 'Max',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'macho',
      personality: 'juguetón',
      lookingFor: 'socializar',
      bio: 'Es súper amigable y le encanta conocer nuevos amigos. Le gusta correr y jugar con otros perros.',
      photos: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop'
      ]
    },
    location: 'Zaragoza, España',
    coordinates: { lat: 41.6561, lng: -0.8773 },
    availableTimes: ['Mañanas', 'Tardes'],
    preferences: {
      maxDistance: 5,
      ageRange: [1, 10],
      breeds: [],
      onlyFemales: false,
      onlyMales: false
    },
    settings: {
      notifications: true,
      location: true,
      privacy: 'public'
    }
  });
  
  // Estados para todas las funcionalidades
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [swipedUsers, setSwipedUsers] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('swipe');
  const [chats, setChats] = useState(mockChats);
  const [walkHistory, setWalkHistory] = useState(mockWalkHistory);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filters, setFilters] = useState({
    maxDistance: 10,
    ageRange: [1, 10],
    breeds: [],
    gender: 'all',
    personality: 'all'
  });
  const [scheduledWalks, setScheduledWalks] = useState([]);

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addMatch = (userId) => {
    const matchedUser = mockUsers.find(u => u.id === userId);
    if (matchedUser && !matches.find(m => m.id === userId)) {
      const newMatch = { 
        ...matchedUser, 
        matchedAt: new Date(),
        chatId: `chat_${userId}_${Date.now()}`
      };
      setMatches(prev => [...prev, newMatch]);
      
      // Inicializar chat
      setChats(prev => ({
        ...prev,
        [newMatch.chatId]: {
          id: newMatch.chatId,
          participants: [userProfile.owner.name, matchedUser.owner.name],
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }));
      
      // Añadir notificación
      addNotification({
        type: 'match',
        title: '¡Nuevo Match!',
        message: `Has hecho match con ${matchedUser.owner.name} y ${matchedUser.dog.name}`,
        userId: userId,
        timestamp: new Date()
      });
    }
  };

  const addSwipedUser = (userId, action) => {
    setSwipedUsers(prev => [...prev, { userId, action, swipedAt: new Date() }]);
  };

  const getAvailableUsers = () => {
    let available = mockUsers.filter(u => !swipedUsers.find(s => s.userId === u.id));
    
    // Aplicar filtros
    if (filters.maxDistance < 50) {
      available = available.filter(u => parseFloat(u.distance) <= filters.maxDistance);
    }
    
    if (filters.ageRange[0] > 1 || filters.ageRange[1] < 10) {
      available = available.filter(u => 
        u.dog.age >= filters.ageRange[0] && u.dog.age <= filters.ageRange[1]
      );
    }
    
    if (filters.breeds.length > 0) {
      available = available.filter(u => filters.breeds.includes(u.dog.breed));
    }
    
    if (filters.gender !== 'all') {
      available = available.filter(u => u.dog.gender === filters.gender);
    }
    
    return available;
  };

  const sendMessage = (chatId, message) => {
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [
          ...prev[chatId].messages,
          {
            id: Date.now(),
            text: message,
            sender: userProfile.owner.name,
            timestamp: new Date(),
            read: false
          }
        ],
        lastMessage: {
          text: message,
          timestamp: new Date(),
          sender: userProfile.owner.name
        }
      }
    }));
  };

  const scheduleWalk = (walkData) => {
    const newWalk = {
      id: Date.now(),
      ...walkData,
      status: 'scheduled',
      createdAt: new Date()
    };
    setScheduledWalks(prev => [...prev, newWalk]);
    
    addNotification({
      type: 'walk_scheduled',
      title: 'Paseo Programado',
      message: `Paseo programado para ${walkData.date} a las ${walkData.time}`,
      walkId: newWalk.id,
      timestamp: new Date()
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      ...notification,
      read: false
    }, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const addToWalkHistory = (walkData) => {
    setWalkHistory(prev => [{
      id: Date.now(),
      ...walkData,
      completedAt: new Date()
    }, ...prev]);
  };

  const rateUser = (userId, rating, review) => {
    // Lógica para calificar usuario
    console.log('Rating user:', userId, rating, review);
  };

  return (
    <UserContext.Provider value={{
      user,
      userProfile,
      updateUserProfile,
      setUser,
      loading,
      matches,
      addMatch,
      swipedUsers,
      addSwipedUser,
      getAvailableUsers,
      currentScreen,
      setCurrentScreen,
      chats,
      sendMessage,
      filters,
      setFilters,
      scheduledWalks,
      scheduleWalk,
      walkHistory,
      addToWalkHistory,
      notifications,
      addNotification,
      markNotificationAsRead,
      rateUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

// Componente de Chat Individual
const ChatScreen = ({ chatId, userName, userPhoto, onBack }) => {
  const { chats, sendMessage } = useUser();
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef();
  
  const chat = chats[chatId] || { messages: [] };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(chatId, messageText.trim());
      setMessageText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.chatContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header del chat */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Image source={{ uri: userPhoto }} style={styles.chatUserPhoto} />
        <Text style={styles.chatUserName}>{userName}</Text>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="videocam" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Mensajes */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {chat.messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === userName ? styles.receivedMessage : styles.sentMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === userName ? styles.receivedMessageText : styles.sentMessageText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input de mensaje */}
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Escribe un mensaje..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Pantalla de Filtros
const FiltersScreen = ({ onBack }) => {
  const { filters, setFilters } = useUser();
  const [localFilters, setLocalFilters] = useState(filters);

  const breeds = ['Labrador', 'Golden Retriever', 'Pastor Alemán', 'Border Collie', 'Bulldog', 'Husky', 'Beagle', 'Poodle'];

  const applyFilters = () => {
    setFilters(localFilters);
    onBack();
  };

  const resetFilters = () => {
    const defaultFilters = {
      maxDistance: 10,
      ageRange: [1, 10],
      breeds: [],
      gender: 'all',
      personality: 'all'
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filtersHeader}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.filtersTitle}>Filtros</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.resetText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.filtersContent}>
        {/* Distancia máxima */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Distancia máxima: {localFilters.maxDistance} km</Text>
          <View style={styles.sliderContainer}>
            {[1, 5, 10, 25, 50].map(distance => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.distanceOption,
                  localFilters.maxDistance === distance && styles.distanceOptionActive
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, maxDistance: distance }))}
              >
                <Text style={[
                  styles.distanceOptionText,
                  localFilters.maxDistance === distance && styles.distanceOptionTextActive
                ]}>
                  {distance}km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Edad del perro */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>
            Edad: {localFilters.ageRange[0]} - {localFilters.ageRange[1]} años
          </Text>
          <View style={styles.ageRangeContainer}>
            <Text>Min: </Text>
            <View style={styles.ageOptions}>
              {[1, 2, 3, 4, 5].map(age => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.ageOption,
                    localFilters.ageRange[0] === age && styles.ageOptionActive
                  ]}
                  onPress={() => setLocalFilters(prev => ({
                    ...prev,
                    ageRange: [age, prev.ageRange[1]]
                  }))}
                >
                  <Text style={[
                    styles.ageOptionText,
                    localFilters.ageRange[0] === age && styles.ageOptionTextActive
                  ]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.ageRangeContainer}>
            <Text>Max: </Text>
            <View style={styles.ageOptions}>
              {[6, 7, 8, 9, 10].map(age => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.ageOption,
                    localFilters.ageRange[1] === age && styles.ageOptionActive
                  ]}
                  onPress={() => setLocalFilters(prev => ({
                    ...prev,
                    ageRange: [prev.ageRange[0], age]
                  }))}
                >
                  <Text style={[
                    styles.ageOptionText,
                    localFilters.ageRange[1] === age && styles.ageOptionTextActive
                  ]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Razas */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Razas preferidas</Text>
          <View style={styles.breedsContainer}>
            {breeds.map(breed => (
              <TouchableOpacity
                key={breed}
                style={[
                  styles.breedOption,
                  localFilters.breeds.includes(breed) && styles.breedOptionActive
                ]}
                onPress={() => {
                  setLocalFilters(prev => ({
                    ...prev,
                    breeds: prev.breeds.includes(breed)
                      ? prev.breeds.filter(b => b !== breed)
                      : [...prev.breeds, breed]
                  }));
                }}
              >
                <Text style={[
                  styles.breedOptionText,
                  localFilters.breeds.includes(breed) && styles.breedOptionTextActive
                ]}>
                  {breed}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Género */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Género del perro</Text>
          <View style={styles.genderOptions}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'macho', label: 'Macho' },
              { key: 'hembra', label: 'Hembra' }
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.genderOption,
                  localFilters.gender === option.key && styles.genderOptionActive
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, gender: option.key }))}
              >
                <Text style={[
                  styles.genderOptionText,
                  localFilters.gender === option.key && styles.genderOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyFiltersButton} onPress={applyFilters}>
        <Text style={styles.applyFiltersText}>Aplicar Filtros</Text>
      </TouchableOpacity>
    </View>
  );
};

// Pantalla de Programar Paseo
const ScheduleWalkScreen = ({ matchId, onBack }) => {
  const { scheduleWalk, matches } = useUser();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');

  const match = matches.find(m => m.id === matchId);
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const times = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const locations = [
    'Parque Grande José Antonio Labordeta',
    'Parque del Agua Luis Buñuel',
    'Parque de los Príncipes de España',
    'Parque Bruil',
    'Ribera del Ebro'
  ];

  const handleScheduleWalk = () => {
    if (!selectedDate || !selectedTime || !selectedLocation) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const walkData = {
      matchId,
      partnerName: match.owner.name,
      partnerPhoto: match.owner.photos[0],
      dogName: match.dog.name,
      date: selectedDate,
      time: selectedTime,
      location: selectedLocation,
      duration: parseInt(duration),
      notes
    };

    scheduleWalk(walkData);
    Alert.alert('¡Éxito!', 'Paseo programado correctamente', [
      { text: 'OK', onPress: onBack }
    ]);
  };

  return (
    <View style={styles.scheduleContainer}>
      <View style={styles.scheduleHeader}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.scheduleTitle}>Programar Paseo</Text>
      </View>

      <ScrollView style={styles.scheduleContent}>
        {match && (
          <View style={styles.partnerInfo}>
            <Image source={{ uri: match.owner.photos[0] }} style={styles.partnerPhoto} />
            <Text style={styles.partnerName}>{match.owner.name} & {match.dog.name}</Text>
          </View>
        )}

        {/* Selección de fecha */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Fecha *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateOptions}>
              {dates.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                return (
                  <TouchableOpacity
                    key={dateStr}
                    style={[styles.dateOption, isSelected && styles.dateOptionActive]}
                    onPress={() => setSelectedDate(dateStr)}
                  >
                    <Text style={[styles.dateOptionDay, isSelected && styles.dateOptionDayActive]}>
                      {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                    </Text>
                    <Text style={[styles.dateOptionDate, isSelected && styles.dateOptionDateActive]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Selección de hora */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Hora *</Text>
          <View style={styles.timeOptions}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeOption, selectedTime === time && styles.timeOptionActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeOptionText,
                  selectedTime === time && styles.timeOptionTextActive
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selección de ubicación */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Ubicación *</Text>
          {locations.map((location) => (
            <TouchableOpacity
              key={location}
              style={[styles.locationOption, selectedLocation === location && styles.locationOptionActive]}
              onPress={() => setSelectedLocation(location)}
            >
              <Text style={[
                styles.locationOptionText,
                selectedLocation === location && styles.locationOptionTextActive
              ]}>
                {location}
              </Text>
              <Ionicons 
                name="location" 
                size={16} 
                color={selectedLocation === location ? "#007AFF" : "#666"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Duración */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Duración (minutos)</Text>
          <View style={styles.durationOptions}>
            {['30', '60', '90', '120'].map((dur) => (
              <TouchableOpacity
                key={dur}
                style={[styles.durationOption, duration === dur && styles.durationOptionActive]}
                onPress={() => setDuration(dur)}
              >
                <Text style={[
                  styles.durationOptionText,
                  duration === dur && styles.durationOptionTextActive
                ]}>
                  {dur}min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notas */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Notas adicionales</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Escribe cualquier información adicional..."
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleWalk}>
        <Text style={styles.scheduleButtonText}>Programar Paseo</Text>
      </TouchableOpacity>
    </View>
  );
};

// Componente de tarjeta para swipe (completado)
const SwipeCard = ({ user, onSwipe, isVisible }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const [currentView, setCurrentView] = useState('owner');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: false }),
      Animated.spring(rotate, { toValue: 0, useNativeDriver: false }),
    ]).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      if (Math.abs(translationX) > width * 0.3 || Math.abs(velocityX) > 1000) {
        const direction = translationX > 0 ? 'right' : 'left';
        
        Animated.parallel([
          Animated.timing(pan.x, {
            toValue: direction === 'right' ? width : -width,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(rotate, {
            toValue: direction === 'right' ? 1 : -1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          onSwipe(direction);
        });
      } else {
        resetPosition();
      }
    }
  };

  const rotateAndTranslate = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      {
        rotate: rotate.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-30deg', '0deg', '30deg'],
        }),
      },
      { scale },
    ],
  };

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, width * 0.3],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = pan.x.interpolate({
    inputRange: [-width * 0.3, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const currentPhotos = currentView === 'owner' ? user.owner.photos : user.dog.photos;
  const currentInfo = currentView === 'owner' ? user.owner : user.dog;

  const nextPhoto = () => {
    if (currentPhotoIndex < currentPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={[styles.swipeCard, rotateAndTranslate]}>
        {/* Indicadores de swipe */}
        <Animated.View style={[styles.swipeIndicator, styles.likeIndicator, { opacity: likeOpacity }]}>
          <Text style={styles.likeText}>LIKE</Text>
        </Animated.View>
        
        <Animated.View style={[styles.swipeIndicator, styles.passIndicator, { opacity: passOpacity }]}>
          <Text style={styles.passText}>PASS</Text>
        </Animated.View>

        {/* Toggle de vista */}
        <View style={styles.cardToggleContainer}>
          <TouchableOpacity
            style={[
              styles.cardToggleButton,
              currentView === 'owner' && styles.cardToggleButtonActive
            ]}
            onPress={() => {
              setCurrentView('owner');
              setCurrentPhotoIndex(0);
            }}
          >
            <Text style={[
              styles.cardToggleText,
              currentView === 'owner' && styles.cardToggleTextActive
            ]}>
              Dueño
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.cardToggleButton,
              currentView === 'dog' && styles.cardToggleButtonActive
            ]}
            onPress={() => {
              setCurrentView('dog');
              setCurrentPhotoIndex(0);
            }}
          >
            <Text style={[
              styles.cardToggleText,
              currentView === 'dog' && styles.cardToggleTextActive
            ]}>
              Perro
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenedor de foto */}
        <View style={styles.photoContainer}>
          <Image 
            source={{ uri: currentPhotos[currentPhotoIndex] }} 
            style={styles.cardPhoto}
            resizeMode="cover"
          />

          {/* Indicadores de fotos */}
          {currentPhotos.length > 1 && (
            <View style={styles.photoIndicators}>
              {currentPhotos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.photoIndicator,
                    index === currentPhotoIndex && styles.photoIndicatorActive
                  ]}
                />
              ))}
            </View>
          )}

          {/* Navegación de fotos */}
          {currentPhotoIndex > 0 && (
            <TouchableOpacity style={styles.photoNavLeft} onPress={prevPhoto}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          
          {currentPhotoIndex < currentPhotos.length - 1 && (
            <TouchableOpacity style={styles.photoNavRight} onPress={nextPhoto}>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Información de la carta */}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{currentInfo.name}</Text>
            <Text style={styles.cardAge}>, {currentInfo.age}{currentView === 'dog' ? '' : ''}</Text>
          </View>
          
          <Text style={styles.cardDistance}>{user.distance}</Text>
          
          {currentView === 'owner' && (
            <View style={styles.ownerInfo}>
              <Text style={styles.infoLabel}>Buscando: {user.owner.lookingFor}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{user.owner.rating}</Text>
                <Text style={styles.walksText}>({user.owner.completedWalks} paseos)</Text>
              </View>
            </View>
          )}
          
          {currentView === 'dog' && (
            <View style={styles.dogInfo}>
              <Text style={styles.infoLabel}>Raza: {user.dog.breed}</Text>
              <Text style={styles.infoLabel}>Personalidad: {user.dog.personality}</Text>
              <Text style={styles.infoLabel}>Le gusta: {user.dog.lookingFor}</Text>
            </View>
          )}
          
          <Text style={styles.cardBio}>{currentInfo.bio}</Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

// Pantalla principal de swipe
const SwipeScreen = () => {
  const { getAvailableUsers, addSwipedUser, addMatch, setCurrentScreen } = useUser();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setUsers(getAvailableUsers());
  }, []);

  const handleSwipe = (direction) => {
    const currentUser = users[currentIndex];
    if (!currentUser) return;

    addSwipedUser(currentUser.id, direction);
    
    if (direction === 'right') {
      // Simular match (50% de probabilidad)
      if (Math.random() > 0.5) {
        addMatch(currentUser.id);
      }
    }

    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleActionButton = (action) => {
    handleSwipe(action === 'like' ? 'right' : 'left');
  };

  if (showFilters) {
    return <FiltersScreen onBack={() => setShowFilters(false)} />;
  }

  const currentUser = users[currentIndex];
  const hasMoreCards = currentIndex < users.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.swipeHeader}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Ionicons name="options" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={styles.swipeTitle}>DogMeet</Text>
        
        <View style={styles.locationIndicator}>
          <Ionicons name="location" size={16} color="#007AFF" />
          <Text style={styles.locationText}>Zaragoza</Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.swipeContainer}>
        {hasMoreCards ? (
          <View style={styles.cardStack}>
            {/* Próxima carta */}
            {users[currentIndex + 1] && (
              <View style={[styles.swipeCard, { transform: [{ scale: 0.95 }], zIndex: 1 }]}>
                <View style={styles.photoContainer}>
                  <Image 
                    source={{ uri: users[currentIndex + 1].owner.photos[0] }} 
                    style={styles.cardPhoto}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{users[currentIndex + 1].owner.name}</Text>
                </View>
              </View>
            )}
            
            {/* Carta actual */}
            <SwipeCard
              user={currentUser}
              onSwipe={handleSwipe}
              isVisible={true}
            />
          </View>
        ) : (
          <View style={styles.noMoreCards}>
            <Text style={styles.noMoreCardsText}>No hay más perfiles</Text>
            <Text style={styles.noMoreCardsSubtext}>
              Prueba ajustando tus filtros o vuelve más tarde
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setCurrentIndex(0);
                setUsers(getAvailableUsers());
              }}
            >
              <Text style={styles.resetButtonText}>Buscar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Botones de acción */}
      {hasMoreCards && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.passButton]}
            onPress={() => handleActionButton('pass')}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.superLikeButton]}
            onPress={() => handleActionButton('superlike')}
          >
            <Ionicons name="star" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleActionButton('like')}
          >
            <Ionicons name="heart" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Pantalla de matches
const MatchesScreen = () => {
  const { matches, setCurrentScreen } = useUser();
  const [selectedChat, setSelectedChat] = useState(null);
  const [scheduleWalkMatch, setScheduleWalkMatch] = useState(null);

  if (selectedChat) {
    return (
      <ChatScreen
        chatId={selectedChat.chatId}
        userName={selectedChat.owner.name}
        userPhoto={selectedChat.owner.photos[0]}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  if (scheduleWalkMatch) {
    return (
      <ScheduleWalkScreen
        matchId={scheduleWalkMatch.id}
        onBack={() => setScheduleWalkMatch(null)}
      />
    );
  }

  return (
    <View style={styles.matchesContainer}>
      <Text style={styles.screenTitle}>Matches</Text>
      
      {matches.length === 0 ? (
        <View style={styles.noMatches}>
          <Text style={styles.noMatchesText}>Aún no tienes matches</Text>
          <Text style={styles.noMatchesSubtext}>
            Sigue deslizando para encontrar tu pareja perfecta para pasear
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          style={styles.matchesList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.matchItem}
              onPress={() => setSelectedChat(item)}
            >
              <View style={styles.matchMainInfo}>
                <Image source={{ uri: item.owner.photos[0] }} style={styles.matchPhoto} />
                <View style={styles.matchInfo}>
                  <Text style={styles.matchName}>{item.owner.name} & {item.dog.name}</Text>
                  <Text style={styles.matchDistance}>{item.distance}</Text>
                  <Text style={styles.matchTime}>
                    Match: {item.matchedAt.toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.matchActions}>
                <TouchableOpacity 
                  style={styles.scheduleButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setScheduleWalkMatch(item);
                  }}
                >
                  <Ionicons name="calendar" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

// Navegación principal
const MainNavigation = () => {
  const { currentScreen, setCurrentScreen } = useUser();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'swipe':
        return <SwipeScreen />;
      case 'matches':
        return <MatchesScreen />;
      default:
        return <SwipeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
      
      {/* Navegación inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'swipe' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('swipe')}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={currentScreen === 'swipe' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.navButtonText,
            currentScreen === 'swipe' && styles.navButtonTextActive
          ]}>
            Buscar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'matches' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('matches')}
        >
          <Ionicons 
            name="heart" 
            size={24} 
            color={currentScreen === 'matches' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.navButtonText,
            currentScreen === 'matches' && styles.navButtonTextActive
          ]}>
            Matches
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos completos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Estilos para SwipeCard
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  swipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  cardStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  swipeCard: {
    width: width - 40,
    height: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
  },
  
  // Indicadores de swipe
  swipeIndicator: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  likeIndicator: {
    right: 20,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  passIndicator: {
    left: 20,
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  likeText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  },
  passText: {
    color: '#F44336',
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  // Toggle de vista
  cardToggleContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 5,
  },
  cardToggleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  cardToggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardToggleText: {
    fontSize: 16,
    color: 'white',
  },
  cardToggleTextActive: {
    color: '#333',
  },
  
  // Contenedor de foto
  photoContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
  },
  
  // Indicadores de fotos
  photoIndicators: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 3,
  },
  photoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  photoIndicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Navegación de fotos
  photoNavLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 4,
  },
  photoNavRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 4,
  },
  
  // Información de la carta
  cardInfo: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardAge: {
    fontSize: 24,
    color: '#666',
    marginLeft: 5,
  },
  cardDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ownerInfo: {
    marginBottom: 10,
  },
  dogInfo: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  walksText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  cardBio: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  
  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#F44336',
  },
  superLikeButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  
  // No más cartas
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Pantalla de matches
  matchesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 20,
  },
  noMatches: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMatchesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMatchesSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  matchesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  matchDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  matchTime: {
    fontSize: 12,
    color: '#999',
  },
  matchActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleButton: {
    padding: 8,
  },
  
  // Navegación inferior
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navButtonActive: {
    // Estilos para botón activo
  },
  navButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  navButtonTextActive: {
    color: '#007AFF',
  },
  
  // Estilos para Chat
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  chatUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatUserName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  callButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  receivedMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  
  // Estilos para Filtros
  filtersContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resetText: {
    fontSize: 16,
    color: '#007AFF',
  },
  filtersContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  distanceOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  distanceOptionText: {
    fontSize: 14,
    color: '#666',
  },
  distanceOptionTextActive: {
    color: 'white',
  },
  ageRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ageOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  ageOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 5,
  },
  ageOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ageOptionText: {
    fontSize: 14,
    color: '#666',
  },
  ageOptionTextActive: {
    color: 'white',
  },
  breedsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  breedOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  breedOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  breedOptionText: {
    fontSize: 14,
    color: '#666',
  },
  breedOptionTextActive: {
    color: 'white',
  },
  genderOptions: {
    flexDirection: 'row',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 5,
  },
  genderOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderOptionText: {
    fontSize: 14,
    color: '#666',
  },
  genderOptionTextActive: {
    color: 'white',
  },
  applyFiltersButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Estilos para Programar Paseo
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  scheduleContent: {
    flex: 1,
  },
  partnerInfo: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  partnerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleSection: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dateOptions: {
    flexDirection: 'row',
  },
  dateOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    minWidth: 60,
  },
  dateOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dateOptionDay: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  dateOptionDayActive: {
    color: 'white',
  },
  dateOptionDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  dateOptionDateActive: {
    color: 'white',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  timeOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#666',
  },
  timeOptionTextActive: {
    color: 'white',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  locationOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  locationOptionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  locationOptionTextActive: {
    color: 'white',
  },
  durationOptions: {
    flexDirection: 'row',
  },
  durationOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 5,
  },
  durationOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  durationOptionText: {
    fontSize: 14,
    color: '#666',
  },
  durationOptionTextActive: {
    color: 'white',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Componente principal de la aplicación
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <MainNavigation />
      </UserProvider>
    </GestureHandlerRootView>
  );
}