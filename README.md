# Story Stitch - Weaving Worlds and Connecting Minds 📚✨

A Progressive Web App (PWA) for collaborative storytelling where users join guilds to create amazing stories together.

## 🚀 Features

### 📱 Progressive Web App
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Continue reading stories without internet
- **Push Notifications**: Daily reminders at 8:30 AM to contribute to stories
- **Responsive Design**: Optimized for phones, tablets, and computers

### 🏛️ Guild System
Choose from three magical guilds:
- **Moonshadow Acorns** - Masters of mystical forest tales
- **Stormwing Collective** - Sky pirates and aerial adventures
- **Wispwood Whisperers** - Keepers of ancient woodland secrets

### 📖 Story Creation
- **Collaborative Writing**: Add your 50-word contribution to daily stories
- **Real-time Word Count**: Visual feedback with warnings at limit
- **Rich Story Display**: Beautiful images and formatted text
- **Social Sharing**: Share completed stories on social media

### 📚 Story Archive
- **Great Book of Tales**: Browse all previously created stories
- **Easy Navigation**: Forward and backward arrows to explore stories
- **Guild Attribution**: See which guild contributed to each story
- **Contributor Recognition**: View all participants for each story

## 🛠️ Technology Stack

- **Frontend**: Angular 20+ with standalone components
- **Language**: TypeScript
- **Styling**: SCSS, Bootstrap 5, Angular Material Design
- **PWA**: Service Worker, Web App Manifest
- **Font**: Comic Sans MS (throughout the app)
- **Hosting**: Firebase Hosting
- **Analytics**: Google Analytics
- **AI Integration**: Google AI API

## 🏗️ Project Structure

```
Story-Stitch/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── splash-screen/          # Loading screen
│   │   │   ├── todays-tale/            # Main story creation page
│   │   │   └── great-book-of-tales/    # Story archive
│   │   ├── services/
│   │   │   └── notification.service.ts # Push notifications & network
│   │   └── environments/               # API keys and configuration
│   ├── public/
│   │   ├── icons/                      # PWA icons
│   │   └── manifest.webmanifest        # PWA manifest
│   └── styles.scss                     # Global styles
├── .cursorrules                        # Development guidelines
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Story-Stitch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Update `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your API keys:
   - Firebase project configuration
   - Google AI API key
   - Google Analytics measurement ID

4. **Start development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200`

5. **Build for production**
   ```bash
   ng build --prod
   ```

## 🌐 Firebase Hosting Setup

### Project Configuration
- **Project ID**: story-stitch-39581
- **Project Number**: 370402594416
- **Hosting URL**: https://story-stitch.web.app

### Deployment
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

## 📊 Analytics Integration

The app includes Google Analytics tracking:
- **Measurement ID**: G-2JF3P8ZNL6
- **Stream ID**: 11494934842
- Tracks page views, user interactions, and story submissions

## 🔔 Push Notifications

### Setup
1. Replace `YOUR_VAPID_PUBLIC_KEY` in `notification.service.ts` with your actual VAPID public key
2. Configure push notification server endpoint
3. Test notifications work in production environment

### Features
- Daily story reminders at 8:30 AM
- Offline/online status notifications
- Test notifications for development

## 🎨 Theming & Design

### Guild Themes
Each guild has unique color schemes:
- **Moonshadow Acorns**: Purple gradients (#667eea to #764ba2)
- **Stormwing Collective**: Pink/red gradients (#f093fb to #f5576c)
- **Wispwood Whisperers**: Blue gradients (#4facfe to #00f2fe)

### Typography
- **Primary Font**: Comic Sans MS (all elements)
- **Fallback**: cursive, sans-serif

## 📱 PWA Features

### Offline Functionality
- Story reading available offline
- Network status detection
- Graceful degradation with user notifications

### Installation
- Meets PWA criteria for installability
- Custom app icons and splash screens
- Standalone display mode

## 🧪 Testing

### Development Testing
```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e

# Test PWA functionality
ng build --prod
npx http-server dist/story-stitch
```

### PWA Testing
- Test offline functionality
- Verify push notifications
- Check installation prompts
- Validate responsive design

## 🔒 Security & Privacy

### Data Protection
- User stories stored securely in Firebase
- No personal information required
- Optional push notification consent

### API Security
- Environment variables for sensitive data
- Secure API communication
- Input sanitization for story content

## 🤝 Contributing

### Development Guidelines
1. Follow the `.cursorrules` specifications
2. Use standalone components
3. Maintain Comic Sans MS font consistency
4. Test on multiple devices
5. Ensure PWA compliance

### Code Style
- TypeScript strict mode
- Angular style guide compliance
- Responsive design principles
- Proper error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Angular team for the fantastic framework
- Material Design for beautiful UI components
- Firebase for reliable hosting and backend services
- The open-source community for inspiration and tools

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Check the documentation in `.cursorrules`
- Review the component-specific README files

---

**Start your storytelling journey today!** 🌟

Join a guild, contribute to daily tales, and help weave amazing collaborative stories with Story Stitch.
