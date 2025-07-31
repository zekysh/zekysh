# DogMeet - Dating App for Dog Owners

A React Native mobile application that connects dog owners for walks, playdates, and potential relationships. Built with Expo and featuring swipe-based matching, real-time chat, and walk scheduling.

## Features

### 🐕 Core Functionality
- **Swipe-based Matching**: Tinder-style swiping with smooth animations
- **Dual Profiles**: View both owner and dog information in each card
- **Smart Filtering**: Filter by distance, dog age, breed, and gender
- **Real-time Chat**: Message matched users
- **Walk Scheduling**: Plan and organize dog walks with matches
- **Photo Gallery**: Multiple photos for both owners and dogs

### 🎨 User Experience
- **Beautiful UI**: Modern, clean design with smooth animations
- **Gesture Controls**: Pan gestures for card swiping
- **Photo Navigation**: Swipe through multiple photos
- **Visual Feedback**: Like/pass indicators during swiping
- **Responsive Design**: Works on various screen sizes

### 📱 Technical Features
- **React Native + Expo**: Cross-platform mobile development
- **Context API**: State management
- **Animated API**: Smooth animations and transitions
- **Gesture Handler**: Advanced touch interactions
- **TypeScript Ready**: Easy to convert to TypeScript

## Screenshots

### Main Screens
- **Swipe Screen**: Discover new dog owners and their pets
- **Matches Screen**: View your matches and start conversations
- **Chat Screen**: Real-time messaging with matches
- **Filters Screen**: Customize your search preferences
- **Schedule Screen**: Plan walks with your matches

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dogmeet-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## Project Structure

```
dogmeet-app/
├── App.js                 # Main application component
├── package.json          # Dependencies and scripts
├── app.json             # Expo configuration
├── babel.config.js      # Babel configuration
└── assets/              # Images and static assets
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

## Architecture

### Components
- **UserProvider**: Context provider for user state management
- **SwipeCard**: Animated card component with gesture handling
- **SwipeScreen**: Main discovery screen with card stack
- **MatchesScreen**: Display and manage matches
- **ChatScreen**: Real-time messaging interface
- **FiltersScreen**: Search preferences configuration
- **ScheduleWalkScreen**: Walk planning interface

### State Management
- Uses React Context API for global state
- Local state for component-specific data
- Mock data for development and testing

### Key Features Implementation

#### Swipe Gestures
```javascript
// Pan gesture handling with spring animations
const onGestureEvent = Animated.event(
  [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
  { useNativeDriver: false }
);
```

#### Real-time Chat
```javascript
// Message sending with timestamp
const sendMessage = (chatId, message) => {
  setChats(prev => ({
    ...prev,
    [chatId]: {
      ...prev[chatId],
      messages: [...prev[chatId].messages, newMessage]
    }
  }));
};
```

#### Smart Filtering
```javascript
// Multi-criteria filtering
const getAvailableUsers = () => {
  return mockUsers.filter(user => {
    // Distance, age, breed, gender filtering
    return matchesCriteria(user, filters);
  });
};
```

## Customization

### Adding New Features
1. **Profile Editing**: Add user profile management
2. **Location Services**: Real GPS-based distance calculation
3. **Push Notifications**: Real-time message notifications
4. **Video Calls**: Integration with video calling services
5. **Social Features**: Photo sharing, stories, group walks

### Styling
The app uses a comprehensive StyleSheet with:
- **Color Scheme**: Blue (#007AFF) primary, with green/red accents
- **Typography**: Bold headings, readable body text
- **Shadows**: Consistent elevation and depth
- **Responsive Design**: Adapts to different screen sizes

### Mock Data
Currently uses static mock data. To integrate with a backend:
1. Replace mock data with API calls
2. Add authentication
3. Implement real-time messaging
4. Add image upload functionality

## Dependencies

### Core Dependencies
- **react-native**: 0.72.6
- **expo**: ~49.0.15
- **react-native-gesture-handler**: Touch gesture handling
- **react-native-reanimated**: High-performance animations
- **@expo/vector-icons**: Icon library

### Development Dependencies
- **@babel/core**: JavaScript compiler
- **babel-preset-expo**: Expo-specific Babel preset

## Performance Considerations

### Optimizations Implemented
- **FlatList**: Efficient list rendering for matches
- **Image Optimization**: Proper image sizing and caching
- **Animation Performance**: Native driver where possible
- **State Management**: Minimal re-renders with Context API

### Recommended Improvements
- **Image Lazy Loading**: Load images on demand
- **Virtual Scrolling**: For large lists
- **Memory Management**: Image cleanup and caching
- **Bundle Splitting**: Code splitting for faster loading

## Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run on web browser
```

### Testing
To add testing:
```bash
npm install --save-dev jest react-test-renderer
```

### Debugging
- Use Expo Developer Tools
- React Native Debugger
- Flipper integration for advanced debugging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For gesture handling and animation libraries
- **Unsplash**: For placeholder images
- **Design Inspiration**: Modern dating app UX patterns

## Future Roadmap

### Phase 1: Core Features ✅
- [x] Swipe matching
- [x] Basic chat
- [x] Walk scheduling
- [x] Filtering

### Phase 2: Enhanced Features 🚧
- [ ] User authentication
- [ ] Real-time messaging
- [ ] Push notifications
- [ ] Photo upload

### Phase 3: Advanced Features 📋
- [ ] Video calls
- [ ] Group walks
- [ ] Social features
- [ ] Premium features

## Support

For support, email support@dogmeet.app or open an issue on GitHub.

---

**Made with ❤️ for dog lovers everywhere** 🐕
