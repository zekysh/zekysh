# Development Guide - DogMeet App

## Quick Start

### 1. Setup Environment
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Clone and setup project
git clone <repository-url>
cd dogmeet-app
npm install
```

### 2. Run the App
```bash
# Start development server
npm start

# Or run on specific platform
npm run android   # Android device/emulator
npm run ios       # iOS device/simulator
npm run web       # Web browser
```

### 3. Development Tools
- **Expo Go**: Install on your phone for testing
- **Android Studio**: For Android emulator
- **Xcode**: For iOS simulator (Mac only)

## Architecture Overview

### State Management
The app uses React Context API for state management:

```javascript
// Global state in UserContext
const useUser = () => useContext(UserContext);

// Available states:
- userProfile: Current user's profile
- matches: Array of matched users
- chats: Chat messages by chatId
- filters: Search filters
- notifications: User notifications
```

### Key Components

#### SwipeCard Component
- Handles pan gestures for swiping
- Manages card animations and transitions
- Supports dual view (owner/dog)
- Photo navigation and indicators

#### Navigation Structure
```
MainNavigation
├── SwipeScreen (default)
│   ├── SwipeCard
│   └── FiltersScreen (modal)
└── MatchesScreen
    ├── ChatScreen
    └── ScheduleWalkScreen
```

## Development Guidelines

### Code Structure
- **Components**: Keep components focused and reusable
- **Styles**: Use StyleSheet.create for performance
- **State**: Minimize re-renders with proper state structure
- **Images**: Use remote URLs for development, local assets for production

### Performance Best Practices
1. **Animations**: Use `useNativeDriver: true` when possible
2. **Lists**: Use FlatList for large datasets
3. **Images**: Implement proper image caching
4. **Memory**: Clean up animations and listeners

### Testing Strategy
```bash
# Unit tests
npm test

# Component testing
npm run test:components

# Integration testing
npm run test:integration
```

## Features Implementation

### Swipe Functionality
The core swipe feature uses:
- `PanGestureHandler` from react-native-gesture-handler
- `Animated.Value` for smooth card movements
- Threshold-based direction detection
- Spring animations for card return/dismiss

### Chat System
Real-time chat implementation:
- Messages stored in Context state
- Timestamp-based message ordering
- Sender identification for bubble styling
- Keyboard-avoiding view for input

### Filter System
Multi-criteria filtering:
- Distance-based filtering
- Age range selection
- Breed preferences
- Gender selection

## Mock Data Structure

### User Profile
```javascript
{
  id: string,
  owner: {
    name: string,
    age: number,
    gender: string,
    bio: string,
    photos: string[],
    rating: number,
    completedWalks: number
  },
  dog: {
    name: string,
    breed: string,
    age: number,
    personality: string,
    photos: string[]
  },
  location: string,
  distance: string
}
```

### Chat Message
```javascript
{
  id: number,
  text: string,
  sender: string,
  timestamp: Date,
  read: boolean
}
```

## Common Development Tasks

### Adding New User Data
1. Update `mockUsers` array in App.js
2. Follow the user profile structure
3. Use Unsplash URLs for photos

### Creating New Screens
1. Create component function
2. Add to navigation in `MainNavigation`
3. Implement proper back navigation
4. Add styles to main StyleSheet

### Modifying Animations
1. Update animation values in component state
2. Modify `Animated.timing` or `Animated.spring` calls
3. Test on device for performance
4. Use `useNativeDriver` when possible

## Debugging Tips

### Common Issues
1. **Gesture conflicts**: Check gesture handler hierarchy
2. **Animation performance**: Verify native driver usage
3. **State updates**: Use React DevTools for state inspection
4. **Image loading**: Check network and cache settings

### Useful Debug Commands
```bash
# Clear Metro cache
npx expo start -c

# Reset Expo cache
expo r -c

# Check bundle size
npx expo export --dump-assetmap
```

## Production Considerations

### Before Production
1. **Replace mock data** with real API calls
2. **Add authentication** system
3. **Implement image upload** functionality
4. **Add error handling** and loading states
5. **Optimize images** and bundle size

### Security
- Validate all user inputs
- Implement proper authentication
- Secure API endpoints
- Handle sensitive data properly

### Performance
- Implement image caching
- Add lazy loading for lists
- Optimize bundle size
- Add performance monitoring

## API Integration

### Expected Backend Endpoints
```
GET /api/users/nearby     # Get nearby users
POST /api/matches        # Create match
GET /api/chats/:id       # Get chat messages
POST /api/chats/:id      # Send message
POST /api/walks          # Schedule walk
```

### State Migration
When integrating with backend:
1. Replace Context state with API calls
2. Add loading states
3. Implement error handling
4. Add offline support

## Contributing

### Pull Request Process
1. Create feature branch from `main`
2. Follow coding standards
3. Add tests for new features
4. Update documentation
5. Submit PR with detailed description

### Code Style
- Use ES6+ features
- Follow React hooks best practices
- Keep components under 200 lines
- Use descriptive variable names
- Add comments for complex logic

---

Happy coding! 🐕💙