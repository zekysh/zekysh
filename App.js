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
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Context para el usuario
const UserContext = createContext();

// Datos de ejemplo para usuarios
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
      photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b169?w=400&h=400&fit=crop&crop=face']
    },
    dog: {
      name: 'Luna',
      breed: 'Border Collie',
      age: 2,
      gender: 'hembra',
      personality: 'enérgica',
      lookingFor: 'jugar',
      bio: 'Le encanta correr y es muy inteligente. Siempre está lista para una nueva aventura.',
      photos: ['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop']
    },
    location: 'Zaragoza, España',
    distance: '1.2 km'
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
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face']
    },
    dog: {
      name: 'Rex',
      breed: 'Pastor Alemán',
      age: 4,
      gender: 'macho',
      personality: 'tranquilo',
      lookingFor: 'socializar',
      bio: 'Es muy obediente y le gusta conocer otros perros. Perfecto para paseos relajados.',
      photos: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop']
    },
    location: 'Zaragoza, España',
    distance: '2.8 km'
  },
  {
    id: '3',
    owner: {
      name: 'Carmen López',
      age: 29,
      gender: 'femenino',
      maritalStatus: 'soltera',
      lookingFor: 'pasear y lo que surja',
      bio: 'Me encanta explorar nuevos senderos y hacer amigos. Bella es muy juguetona.',
      photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face']
    },
    dog: {
      name: 'Bella',
      breed: 'Labrador',
      age: 3,
      gender: 'hembra',
      personality: 'amigable',
      lookingFor: 'jugar',
      bio: 'Súper cariñosa y le encanta el agua. Siempre está dispuesta a jugar con otros perros.',
      photos: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop']
    },
    location: 'Zaragoza, España',
    distance: '0.9 km'
  },
  {
    id: '4',
    owner: {
      name: 'David Martín',
      age: 27,
      gender: 'masculino',
      maritalStatus: 'soltero',
      lookingFor: 'solo pasear',
      bio: 'Aficionado al senderismo y los deportes al aire libre. Toby es mi compañero perfecto.',
      photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face']
    },
    dog: {
      name: 'Toby',
      breed: 'Husky',
      age: 5,
      gender: 'macho',
      personality: 'aventurero',
      lookingFor: 'explorar',
      bio: 'Le encanta correr y explorar. Muy resistente para largas caminatas.',
      photos: ['https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop']
    },
    location: 'Zaragoza, España',
    distance: '3.1 km'
  }
];

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
      photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face']
    },
    dog: {
      name: 'Max',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'macho',
      personality: 'juguetón',
      lookingFor: 'socializar',
      bio: 'Es súper amigable y le encanta conocer nuevos amigos. Le gusta correr y jugar con otros perros.',
      photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop']
    },
    location: 'Zaragoza, España',
    availableTimes: ['Mañanas', 'Tardes']
  });
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [swipedUsers, setSwipedUsers] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('profile'); // 'profile', 'swipe', 'matches'

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addMatch = (userId) => {
    const matchedUser = mockUsers.find(u => u.id === userId);
    if (matchedUser && !matches.find(m => m.id === userId)) {
      setMatches(prev => [...prev, { ...matchedUser, matchedAt: new Date() }]);
    }
  };

  const addSwipedUser = (userId, action) => {
    setSwipedUsers(prev => [...prev, { userId, action, swipedAt: new Date() }]);
  };

  const getAvailableUsers = () => {
    return mockUsers.filter(u => !swipedUsers.find(s => s.userId === u.id));
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
      setCurrentScreen
    }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

// Componente de tarjeta para swipe
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

  const swipeCard = (direction) => {
    const screenWidth = width;
    const toValue = direction === 'right' ? screenWidth : -screenWidth;
    
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: toValue, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(scale, { toValue: 0.8, useNativeDriver: false }),
    ]).start(() => {
      onSwipe(direction);
      pan.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      rotate.setValue(0);
    });
  };

  const handlePanGesture = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    pan.setValue({ x: translationX, y: translationY });
    
    // Rotación basada en el movimiento horizontal
    const rotation = translationX / width * 30;
    rotate.setValue(rotation);
    
    // Escala basada en la distancia del centro
    const distance = Math.sqrt(translationX * translationX + translationY * translationY);
    const newScale = Math.max(0.9, 1 - distance / (width * 2));
    scale.setValue(newScale);
  };

  const handlePanEnd = (event) => {
    const { translationX, velocityX } = event.nativeEvent;
    const threshold = width * 0.3;
    
    if (translationX > threshold || velocityX > 500) {
      swipeCard('right');
    } else if (translationX < -threshold || velocityX < -500) {
      swipeCard('left');
    } else {
      resetPosition();
    }
  };

  const currentProfile = currentView === 'owner' ? user.owner : user.dog;
  const photos = currentProfile.photos || [];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (!isVisible) return null;

  return (
    <PanGestureHandler
      onGestureEvent={handlePanGesture}
      onHandlerStateChange={(event) => {
        if (event.nativeEvent.state === State.END) {
          handlePanEnd(event);
        }
      }}
    >
      <Animated.View
        style={[
          styles.swipeCard,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate: rotate.interpolate({
                inputRange: [-30, 0, 30],
                outputRange: ['-30deg', '0deg', '30deg'],
              })},
              { scale: scale },
            ],
          },
        ]}
      >
        {/* Indicadores de swipe */}
        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.likeIndicator,
            {
              opacity: pan.x.interpolate({
                inputRange: [0, width * 0.3],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <Text style={styles.likeText}>💚 LIKE</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.passIndicator,
            {
              opacity: pan.x.interpolate({
                inputRange: [-width * 0.3, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <Text style={styles.passText}>❌ PASS</Text>
        </Animated.View>

        {/* Toggle entre persona y mascota */}
        <View style={styles.cardToggleContainer}>
          <TouchableOpacity
            style={[styles.cardToggleButton, currentView === 'owner' && styles.cardToggleButtonActive]}
            onPress={() => setCurrentView('owner')}
          >
            <Text style={[styles.cardToggleText, currentView === 'owner' && styles.cardToggleTextActive]}>
              👤
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cardToggleButton, currentView === 'dog' && styles.cardToggleButtonActive]}
            onPress={() => setCurrentView('dog')}
          >
            <Text style={[styles.cardToggleText, currentView === 'dog' && styles.cardToggleTextActive]}>
              🐕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Área de foto con navegación */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photos[currentPhotoIndex] }}
            style={styles.cardPhoto}
            resizeMode="cover"
          />
          
          {/* Indicadores de fotos */}
          {photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {photos.map((_, index) => (
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

          {/* Botones de navegación de fotos */}
          {photos.length > 1 && (
            <>
              <TouchableOpacity style={styles.photoNavLeft} onPress={prevPhoto}>
                <View style={styles.photoNavButton} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoNavRight} onPress={nextPhoto}>
                <View style={styles.photoNavButton} />
              </TouchableOpacity>
            </>
          )}

          {/* Overlay con información */}
          <View style={styles.cardOverlay}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {currentView === 'owner' 
                  ? `${user.owner.name}, ${user.owner.age}`
                  : user.dog.name
                }
              </Text>
              {currentView === 'dog' && (
                <Text style={styles.cardBreed}>{user.dog.breed} • {user.dog.age} años</Text>
              )}
              <Text style={styles.cardDistance}>📍 {user.distance}</Text>
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.cardDetails}>
          <Text style={styles.cardBio} numberOfLines={3}>
            {currentProfile.bio}
          </Text>
          
          <View style={styles.cardTags}>
            <View style={[styles.tag, { backgroundColor: currentView === 'owner' ? '#EC4899' : '#3B82F6' }]}>
              <Text style={styles.tagText}>
                {currentView === 'owner' ? user.owner.lookingFor : user.dog.personality}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{currentProfile.gender}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

// Pantalla de swipe principal
const SwipeScreen = () => {
  const { getAvailableUsers, addSwipedUser, addMatch } = useUser();
  const [availableUsers, setAvailableUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatch, setLastMatch] = useState(null);

  useEffect(() => {
    setAvailableUsers(getAvailableUsers());
  }, []);

  const handleSwipe = (direction) => {
    if (currentIndex >= availableUsers.length) return;
    
    const currentUser = availableUsers[currentIndex];
    addSwipedUser(currentUser.id, direction);
    
    if (direction === 'right') {
      // Simular probabilidad de match (70%)
      const isMatch = Math.random() > 0.3;
      if (isMatch) {
        addMatch(currentUser.id);
        setLastMatch(currentUser);
        setShowMatchModal(true);
      }
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const handleLike = () => {
    handleSwipe('right');
  };

  const handlePass = () => {
    handleSwipe('left');
  };

  const currentUser = availableUsers[currentIndex];
  const nextUser = availableUsers[currentIndex + 1];

  if (currentIndex >= availableUsers.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>🐕</Text>
          <Text style={styles.emptyStateTitle}>¡No hay más perfiles!</Text>
          <Text style={styles.emptyStateSubtitle}>
            Vuelve más tarde para ver nuevos usuarios en tu área
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.swipeContainer}>
        {/* Tarjetas */}
        <View style={styles.cardsContainer}>
          {nextUser && (
            <View style={[styles.swipeCard, styles.backCard]}>
              <Image
                source={{ uri: nextUser.owner.photos[0] }}
                style={styles.cardPhoto}
                resizeMode="cover"
              />
            </View>
          )}
          
          {currentUser && (
            <SwipeCard
              user={currentUser}
              onSwipe={handleSwipe}
              isVisible={true}
            />
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.passButton} onPress={handlePass}>
            <Ionicons name="close" size={32} color="#EF4444" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Ionicons name="heart" size={32} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de match */}
      <MatchModal
        visible={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        user={lastMatch}
      />
    </SafeAreaView>
  );
};

// Modal de match
const MatchModal = ({ visible, onClose, user }) => {
  const { userProfile } = useUser();
  
  if (!user) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.matchModalOverlay}>
        <View style={styles.matchModalContent}>
          <Text style={styles.matchTitle}>¡ES UN MATCH! 🎉</Text>
          
          <View style={styles.matchPhotos}>
            <Image
              source={{ uri: userProfile.owner.photos[0] }}
              style={styles.matchPhoto}
            />
            <View style={styles.matchHeartContainer}>
              <Ionicons name="heart" size={40} color="#EC4899" />
            </View>
            <Image
              source={{ uri: user.owner.photos[0] }}
              style={styles.matchPhoto}
            />
          </View>
          
          <Text style={styles.matchSubtitle}>
            A ti y a {user.owner.name} les gustaron mutuamente
          </Text>
          
          <View style={styles.matchButtons}>
            <TouchableOpacity style={styles.matchKeepSwiping} onPress={onClose}>
              <Text style={styles.matchKeepSwipingText}>Seguir explorando</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.matchSendMessage} onPress={onClose}>
              <Text style={styles.matchSendMessageText}>Enviar mensaje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Pantalla de matches
const MatchesScreen = () => {
  const { matches } = useUser();
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Mis Matches 💕</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>💔</Text>
          <Text style={styles.emptyStateTitle}>Aún no tienes matches</Text>
          <Text style={styles.emptyStateSubtitle}>
            ¡Sigue explorando para encontrar tu match perfecto!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Mis Matches 💕</Text>
        <Text style={styles.matchCount}>{matches.length} matches</Text>
      </View>
      
      <ScrollView style={styles.matchesList}>
        {matches.map((match) => (
          <TouchableOpacity
            key={match.id}
            style={styles.matchItem}
            onPress={() => setSelectedMatch(match)}
          >
            <Image
              source={{ uri: match.owner.photos[0] }}
              style={styles.matchAvatar}
            />
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{match.owner.name}</Text>
              <Text style={styles.matchPreview}>
                Toca para ver el perfil completo
              </Text>
            </View>
            <View style={styles.matchMeta}>
              <Ionicons name="heart" size={20} color="#EC4899" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de perfil del match */}
      {selectedMatch && (
        <Modal visible={!!selectedMatch} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedMatch(null)}>
                <Text style={styles.modalCancelButton}>Cerrar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Perfil de {selectedMatch.owner.name}</Text>
              <TouchableOpacity>
                <Text style={styles.modalSaveButton}>💬 Mensaje</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <ProfileCard 
                profile={selectedMatch}
                currentView="owner"
                setCurrentView={() => {}}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

// Navegación principal con tabs
const NavigationTabs = () => {
  const { currentScreen, setCurrentScreen } = useUser();

  const tabs = [
    { key: 'profile', icon: 'person', label: 'Perfil' },
    { key: 'swipe', icon: 'heart', label: 'Explorar' },
    { key: 'matches', icon: 'chatbubbles', label: 'Matches' },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, currentScreen === tab.key && styles.tabActive]}
          onPress={() => setCurrentScreen(tab.key)}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={currentScreen === tab.key ? '#EC4899' : '#9CA3AF'}
          />
          <Text style={[
            styles.tabLabel,
            currentScreen === tab.key && styles.tabLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Pantalla de autenticación con login social
const AuthScreen = () => {
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUser({ id: '1', email, name: name || 'Usuario' });
    } catch (error) {
      Alert.alert('Error', 'Error en la autenticación');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      // Simular login social
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userData = {
        google: { id: '1', email: 'usuario@gmail.com', name: 'Usuario Google' },
        facebook: { id: '1', email: 'usuario@facebook.com', name: 'Usuario Facebook' }
      };
      setUser(userData[provider]);
      Alert.alert('Éxito', `Conectado con ${provider === 'google' ? 'Google' : 'Facebook'}`);
    } catch (error) {
      Alert.alert('Error', `Error conectando con ${provider === 'google' ? 'Google' : 'Facebook'}`);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.authContent}
      >
        <Text style={styles.authTitle}>🐕 DoggyWalks</Text>
        <Text style={styles.authSubtitle}>
          {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
        </Text>

        {/* Botones de login social */}
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <Text style={styles.socialButtonText}>📧 Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.socialButton, styles.facebookButton]}
          onPress={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <Text style={styles.socialButtonText}>📘 Continuar con Facebook</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {!isLogin && (
          <TextInput
            style={styles.authInput}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.authInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.authInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.authButton} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.authButtonText}>
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.authSwitchText}>
            {isLogin 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'
            }
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Modal para generar rutas de paseo
const RouteGeneratorModal = ({ visible, onClose }) => {
  const [distance, setDistance] = useState('2');
  const [duration, setDuration] = useState('30');
  const [maxPeople, setMaxPeople] = useState('4');
  const [petGender, setPetGender] = useState('cualquiera');
  const [routeGenerated, setRouteGenerated] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const generateRoute = async () => {
    // Simular generación de ruta
    setCurrentLocation({
      lat: 41.6488,
      lng: -0.8891,
      address: 'Parque Grande José Antonio Labordeta, Zaragoza'
    });
    setRouteGenerated(true);
  };

  const resetRoute = () => {
    setRouteGenerated(false);
    setCurrentLocation(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelButton}>Cerrar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Generar Ruta</Text>
          <TouchableOpacity onPress={resetRoute}>
            <Text style={styles.modalResetButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {!routeGenerated ? (
            <>
              {/* Configuración de la ruta */}
              <View style={styles.routeSection}>
                <Text style={styles.routeSectionTitle}>Configuración del Paseo</Text>
                
                <View style={styles.routeOption}>
                  <Text style={styles.routeLabel}>Distancia (km)</Text>
                  <View style={styles.routeButtons}>
                    {['1', '2', '3', '5', '10'].map((km) => (
                      <TouchableOpacity
                        key={km}
                        style={[styles.routeButton, distance === km && styles.routeButtonActive]}
                        onPress={() => setDistance(km)}
                      >
                        <Text style={[styles.routeButtonText, distance === km && styles.routeButtonTextActive]}>
                          {km} km
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.routeOption}>
                  <Text style={styles.routeLabel}>Duración (minutos)</Text>
                  <View style={styles.routeButtons}>
                    {['15', '30', '45', '60', '90'].map((min) => (
                      <TouchableOpacity
                        key={min}
                        style={[styles.routeButton, duration === min && styles.routeButtonActive]}
                        onPress={() => setDuration(min)}
                      >
                        <Text style={[styles.routeButtonText, duration === min && styles.routeButtonTextActive]}>
                          {min} min
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.routeOption}>
                  <Text style={styles.routeLabel}>Máximo de personas</Text>
                  <View style={styles.routeButtons}>
                    {['2', '4', '6', '8', '10+'].map((people) => (
                      <TouchableOpacity
                        key={people}
                        style={[styles.routeButton, maxPeople === people && styles.routeButtonActive]}
                        onPress={() => setMaxPeople(people)}
                      >
                        <Text style={[styles.routeButtonText, maxPeople === people && styles.routeButtonTextActive]}>
                          {people}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.routeOption}>
                  <Text style={styles.routeLabel}>Preferencia sexo mascota</Text>
                  <View style={styles.routeButtons}>
                    {[
                      { key: 'cualquiera', label: 'Cualquiera' },
                      { key: 'macho', label: 'Machos' },
                      { key: 'hembra', label: 'Hembras' }
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.key}
                        style={[styles.routeButton, petGender === option.key && styles.routeButtonActive]}
                        onPress={() => setPetGender(option.key)}
                      >
                        <Text style={[styles.routeButtonText, petGender === option.key && styles.routeButtonTextActive]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.generateRouteButton} onPress={generateRoute}>
                <Text style={styles.generateRouteButtonText}>🗺️ Generar Ruta</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Mapa y ruta generada */}
              <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map" size={48} color="#3B82F6" />
                  <Text style={styles.mapPlaceholderText}>Mapa de la Ruta</Text>
                  <Text style={styles.mapLocationText}>{currentLocation?.address}</Text>
                </View>
              </View>

              <View style={styles.routeInfo}>
                <Text style={styles.routeInfoTitle}>Detalles de la Ruta</Text>
                <View style={styles.routeInfoGrid}>
                  <View style={styles.routeInfoItem}>
                    <Ionicons name="walk" size={20} color="#EC4899" />
                    <Text style={styles.routeInfoLabel}>Distancia</Text>
                    <Text style={styles.routeInfoValue}>{distance} km</Text>
                  </View>
                  <View style={styles.routeInfoItem}>
                    <Ionicons name="time" size={20} color="#EC4899" />
                    <Text style={styles.routeInfoLabel}>Duración</Text>
                    <Text style={styles.routeInfoValue}>{duration} min</Text>
                  </View>
                  <View style={styles.routeInfoItem}>
                    <Ionicons name="people" size={20} color="#EC4899" />
                    <Text style={styles.routeInfoLabel}>Max personas</Text>
                    <Text style={styles.routeInfoValue}>{maxPeople}</Text>
                  </View>
                  <View style={styles.routeInfoItem}>
                    <Ionicons name="paw" size={20} color="#EC4899" />
                    <Text style={styles.routeInfoLabel}>Preferencia</Text>
                    <Text style={styles.routeInfoValue}>{petGender}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.shareRouteButton}>
                <Text style={styles.shareRouteButtonText}>📤 Compartir Ruta</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Modal para valoraciones
const RatingModal = ({ visible, onClose, type, targetName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitRating = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una puntuación');
      return;
    }
    
    Alert.alert('Valoración enviada', `Has valorado ${type} con ${rating}/10 puntos`);
    setRating(0);
    setComment('');
    onClose();
  };

  const getRatingEmoji = (score) => {
    if (score >= 9) return '🤩';
    if (score >= 7) return '😊';
    if (score >= 5) return '😐';
    if (score >= 3) return '😕';
    return '😞';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Valorar</Text>
          <TouchableOpacity onPress={submitRating}>
            <Text style={styles.modalSaveButton}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>
              ¿Cómo fue tu experiencia con {targetName}?
            </Text>
            <Text style={styles.ratingSubtitle}>
              {type === 'usuario' ? 'Valora al usuario' : 
               type === 'perro' ? 'Valora a la mascota' : 'Valora el paseo'}
            </Text>

            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={[styles.ratingStar, rating >= star && styles.ratingStarActive]}
                  onPress={() => setRating(star)}
                >
                  <Text style={[styles.ratingStarText, rating >= star && styles.ratingStarTextActive]}>
                    {star}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <View style={styles.ratingFeedback}>
                <Text style={styles.ratingEmoji}>{getRatingEmoji(rating)}</Text>
                <Text style={styles.ratingScore}>{rating}/10</Text>
              </View>
            )}

            <TextInput
              style={styles.ratingComment}
              placeholder="Escribe un comentario (opcional)..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Modal para reportar usuarios
const ReportModal = ({ visible, onClose, userName }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const reportReasons = [
    { id: 'inappropriate_behavior', label: 'Comportamiento inapropiado', icon: '⚠️' },
    { id: 'harassment', label: 'Acoso o intimidación', icon: '🚫' },
    { id: 'fake_profile', label: 'Perfil falso', icon: '🎭' },
    { id: 'spam', label: 'Spam o promoción no deseada', icon: '📧' },
    { id: 'dangerous_dog', label: 'Perro agresivo o peligroso', icon: '🐕‍🦺' },
    { id: 'no_show', label: 'No se presentó al paseo', icon: '⏰' },
    { id: 'inappropriate_content', label: 'Contenido inapropiado', icon: '🔞' },
    { id: 'other', label: 'Otro motivo', icon: '📝' }
  ];

  const submitReport = () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Por favor selecciona un motivo');
      return;
    }
    
    Alert.alert(
      'Reporte enviado',
      'Gracias por tu reporte. Nuestro equipo lo revisará.',
      [{ text: 'OK', onPress: () => {
        setSelectedReason('');
        setAdditionalInfo('');
        onClose();
      }}]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Reportar Usuario</Text>
          <TouchableOpacity onPress={submitReport}>
            <Text style={styles.modalSaveButton}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>
              Reportar a {userName}
            </Text>
            <Text style={styles.reportSubtitle}>
              ¿Cuál es el motivo de tu reporte?
            </Text>

            <View style={styles.reportReasons}>
              {reportReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reportReason,
                    selectedReason === reason.id && styles.reportReasonActive
                  ]}
                  onPress={() => setSelectedReason(reason.id)}
                >
                  <Text style={styles.reportReasonIcon}>{reason.icon}</Text>
                  <Text style={[
                    styles.reportReasonText,
                    selectedReason === reason.id && styles.reportReasonTextActive
                  ]}>
                    {reason.label}
                  </Text>
                  {selectedReason === reason.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reportComment}
              placeholder="Información adicional (opcional)..."
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.reportDisclaimer}>
              <Ionicons name="information-circle" size={16} color="#6B7280" />
              <Text style={styles.reportDisclaimerText}>
                Los reportes son confidenciales y ayudan a mantener la comunidad segura.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Modal para editar perfil
const EditProfileModal = ({ visible, onClose, profile, onSave, isOwner }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newPhoto, setNewPhoto] = useState('');

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = () => {
    onSave(editedProfile);
    onClose();
  };

  const addPhoto = () => {
    if (newPhoto.trim()) {
      const updatedPhotos = [...(editedProfile.photos || []), newPhoto.trim()];
      setEditedProfile(prev => ({ ...prev, photos: updatedPhotos }));
      setNewPhoto('');
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = editedProfile.photos.filter((_, i) => i !== index);
    setEditedProfile(prev => ({ ...prev, photos: updatedPhotos }));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            Editar {isOwner ? 'Mi Perfil' : 'Perfil de Mascota'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSaveButton}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Editar fotos */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Fotos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {editedProfile.photos?.map((photo, index) => (
                <View key={index} style={styles.editPhotoContainer}>
                  <Image source={{ uri: photo }} style={styles.editPhoto} />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addPhotoContainer}>
                <TextInput
                  style={styles.photoInput}
                  placeholder="URL de nueva foto"
                  value={newPhoto}
                  onChangeText={setNewPhoto}
                />
                <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
                  <Ionicons name="add" size={24} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Editar información básica */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Información básica</Text>
            
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.editInput}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
            />

            {isOwner && (
              <>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.editInput}
                  value={editedProfile.age?.toString()}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, age: parseInt(text) || 0 }))}
                  keyboardType="numeric"
                />
              </>
            )}

            {!isOwner && (
              <>
                <Text style={styles.inputLabel}>Raza</Text>
                <TextInput
                  style={styles.editInput}
                  value={editedProfile.breed}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, breed: text }))}
                />
                
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.editInput}
                  value={editedProfile.age?.toString()}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, age: parseInt(text) || 0 }))}
                  keyboardType="numeric"
                />
              </>
            )}

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.editInput, styles.bioInput]}
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Componente de tarjeta de perfil con edición
const ProfileCard = ({ profile, currentView, setCurrentView, onEdit }) => {
  const getStatusColor = (status) => {
    const colors = {
      "soltero": "#10B981", "soltera": "#10B981",
      "casado": "#3B82F6", "casada": "#3B82F6",
      "divorciado": "#F59E0B", "divorciada": "#F59E0B"
    };
    return colors[status] || "#6B7280";
  };

  const getLookingForColor = (lookingFor) => {
    const colors = {
      "solo pasear": "#3B82F6",
      "pasear y lo que surja": "#8B5CF6"
    };
    return colors[lookingFor] || "#6B7280";
  };

  const currentProfile = currentView === 'owner' ? profile.owner : profile.dog;
  const photos = currentProfile.photos || [];
  const defaultPhoto = currentView === 'owner' 
    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, currentView === 'owner' && styles.toggleButtonActive]}
            onPress={() => setCurrentView('owner')}
          >
            <Text style={[styles.toggleText, currentView === 'owner' && styles.toggleTextActive]}>
              👤 Persona
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, currentView === 'dog' && styles.toggleButtonActive]}
            onPress={() => setCurrentView('dog')}
          >
            <Text style={[styles.toggleText, currentView === 'dog' && styles.toggleTextActive]}>
              🐕 Mascota
            </Text>
          </TouchableOpacity>
        </View>
        
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(currentView === 'owner')}>
            <Ionicons name="pencil" size={20} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.photoSection, { backgroundColor: currentView === 'owner' ? '#EC4899' : '#3B82F6' }]}>
        <Image 
          source={{ uri: photos[0] || defaultPhoto }} 
          style={styles.mainPhoto}
          resizeMode="cover"
        />
        <View style={styles.photoOverlay}>
          <Text style={styles.name}>
            {currentView === 'owner' 
              ? `${profile.owner.name}, ${profile.owner.age}`
              : profile.dog.name
            }
          </Text>
          {currentView === 'dog' && (
            <Text style={styles.breed}>{profile.dog.breed} • {profile.dog.age} años</Text>
          )}
          <Text style={styles.location}>📍 {profile.location || 'Ubicación no disponible'}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.bio}>{currentProfile.bio}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Género:</Text>
            <Text style={styles.detailValue}>{currentProfile.gender}</Text>
          </View>
          
          {currentView === 'owner' && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estado civil:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(profile.owner.maritalStatus) }]}>
                  <Text style={styles.statusText}>{profile.owner.maritalStatus}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Buscando:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getLookingForColor(profile.owner.lookingFor) }]}>
                  <Text style={styles.statusText}>{profile.owner.lookingFor}</Text>
                </View>
              </View>
            </>
          )}
          
          {currentView === 'dog' && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Personalidad:</Text>
                <Text style={styles.detailValue}>{profile.dog.personality}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Busca:</Text>
                <Text style={styles.detailValue}>{profile.dog.lookingFor}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

// Pantalla principal de la aplicación
const MainApp = () => {
  const { userProfile, updateUserProfile, currentScreen, setCurrentScreen } = useUser();
  const [currentView, setCurrentView] = useState('owner');
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIsOwner, setEditIsOwner] = useState(true);

  const handleEditProfile = (isOwner) => {
    setEditIsOwner(isOwner);
    setShowEditModal(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    if (editIsOwner) {
      updateUserProfile({ owner: updatedProfile });
    } else {
      updateUserProfile({ dog: updatedProfile });
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'swipe':
        return <SwipeScreen />;
      case 'matches':
        return <MatchesScreen />;
      default:
        return (
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.appTitle}>🐕 DoggyWalks</Text>
              <TouchableOpacity 
                style={styles.routeButton}
                onPress={() => setShowRouteModal(true)}
              >
                <Ionicons name="map" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <ProfileCard 
                profile={userProfile}
                currentView={currentView}
                setCurrentView={setCurrentView}
                onEdit={handleEditProfile}
              />

              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setShowRatingModal(true)}
                >
                  <Ionicons name="star" size={24} color="#F59E0B" />
                  <Text style={styles.actionButtonText}>Valorar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setShowReportModal(true)}
                >
                  <Ionicons name="flag" size={24} color="#EF4444" />
                  <Text style={styles.actionButtonText}>Reportar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Modales */}
            <RouteGeneratorModal 
              visible={showRouteModal}
              onClose={() => setShowRouteModal(false)}
            />
            
            <RatingModal
              visible={showRatingModal}
              onClose={() => setShowRatingModal(false)}
              type={currentView === 'owner' ? 'usuario' : 'perro'}
              targetName={currentView === 'owner' ? userProfile.owner.name : userProfile.dog.name}
            />
            
            <ReportModal
              visible={showReportModal}
              onClose={() => setShowReportModal(false)}
              userName={userProfile.owner.name}
            />
            
            <EditProfileModal
              visible={showEditModal}
              onClose={() => setShowEditModal(false)}
              profile={editIsOwner ? userProfile.owner : userProfile.dog}
              onSave={handleSaveProfile}
              isOwner={editIsOwner}
            />
          </SafeAreaView>
        );
    }
  };

  return (
    <View style={styles.mainContainer}>
      {renderCurrentScreen()}
      <NavigationTabs />
    </View>
  );
};

// Componente principal de la aplicación
const AppContent = () => {
  const { user } = useUser();
  
  return user ? <MainApp /> : <AuthScreen />;
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  // Estilos principales existentes
  authContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  authContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  socialButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  authInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  authButton: {
    backgroundColor: '#EC4899',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  authSwitchText: {
    textAlign: 'center',
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },

  // Nuevos estilos para el sistema de swipe y matches
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  
  // Estilos de navegación
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    // No background change needed, just icon/text color
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#EC4899',
    fontWeight: '600',
  },

  // Estilos de swipe
  swipeContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  swipeCard: {
    width: width - 40,
    height: height * 0.75,
    backgroundColor: 'white',
    borderRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  backCard: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
    zIndex: 0,
  },
  
  // Indicadores de swipe
  swipeIndicator: {
    position: 'absolute',
    top: 100,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 3,
  },
  likeIndicator: {
    right: 20,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  passIndicator: {
    left: 20,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  likeText: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: 'bold',
  },
  passText: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Toggle en la tarjeta
  cardToggleContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    padding: 4,
    zIndex: 5,
  },
  cardToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  cardToggleButtonActive: {
    backgroundColor: 'white',
  },
  cardToggleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardToggleTextActive: {
    color: '#1F2937',
  },

  // Foto de la tarjeta
  photoContainer: {
    height: '70%',
    position: 'relative',
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
  },
  
  // Indicadores y navegación de fotos
  photoIndicators: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    zIndex: 5,
  },
  photoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  photoIndicatorActive: {
    backgroundColor: 'white',
  },
  photoNavLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  photoNavRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  photoNavButton: {
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },

  // Overlay de información
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
    padding: 20,
  },
  cardInfo: {
    // Info styling handled by individual elements
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardBreed: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  cardDistance: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },

  // Detalles de la tarjeta
  cardDetails: {
    padding: 20,
    flex: 1,
  },
  cardBio: {
    fontSize: 16,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 16,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },

  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 30,
    gap: 40,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // Estados vacíos
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Modal de match
  matchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(236, 72, 153, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchModalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 24,
    textAlign: 'center',
  },
  matchPhotos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  matchPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
  },
  matchHeartContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  matchButtons: {
    gap: 12,
    width: '100%',
  },
  matchKeepSwiping: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  matchKeepSwipingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  matchSendMessage: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#EC4899',
  },
  matchSendMessageText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Pantalla de matches
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  matchCount: {
    fontSize: 16,
    color: '#6B7280',
  },
  matchesList: {
    flex: 1,
    padding: 16,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  matchPreview: {
    fontSize: 14,
    color: '#6B7280',
  },
  matchMeta: {
    alignItems: 'center',
    paddingLeft: 12,
  },

  // Estilos existentes continuados...
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  routeButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Estilos de tarjeta
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#1F2937',
  },
  editButton: {
    padding: 8,
  },
  photoSection: {
    height: 300,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  breed: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  infoSection: {
    padding: 20,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 20,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Estilos de acciones
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  
  // Estilos de modales
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalSaveButton: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalResetButton: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  
  // Estilos específicos de ruta
  routeSection: {
    marginBottom: 24,
  },
  routeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  routeOption: {
    marginBottom: 20,
  },
  routeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  routeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  routeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  routeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  routeButtonTextActive: {
    color: 'white',
  },
  generateRouteButton: {
    backgroundColor: '#EC4899',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  generateRouteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    marginBottom: 24,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
  },
  mapLocationText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  routeInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  routeInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  routeInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  routeInfoItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  routeInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  shareRouteButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareRouteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos de valoración
  ratingSection: {
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  ratingStars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  ratingStar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ratingStarActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  ratingStarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  ratingStarTextActive: {
    color: 'white',
  },
  ratingFeedback: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  ratingScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ratingComment: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 120,
  },
  
  // Estilos de reporte
  reportSection: {
    width: '100%',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  reportSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  reportReasons: {
    gap: 12,
    marginBottom: 24,
  },
  reportReason: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportReasonActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  reportReasonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reportReasonText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  reportReasonTextActive: {
    color: '#059669',
    fontWeight: '500',
  },
  reportComment: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    marginBottom: 16,
  },
  reportDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  reportDisclaimerText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 8,
  },
  
  // Estilos de edición
  editSection: {
    marginBottom: 24,
  },
  editSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  photosScroll: {
    marginBottom: 16,
  },
  editPhotoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  editPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addPhotoContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  photoInput: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  addPhotoButton: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default App;