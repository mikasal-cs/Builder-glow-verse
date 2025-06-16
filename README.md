# 🤖 Mikasal's AI Assistant

A professional, ChatGPT-like AI chatbot interface built with React, featuring modern design, voice capabilities, and full Builder.io integration for visual editing.

## ✨ Features

### 🎯 Core Chat Features

- **Professional Interface**: Sleek, modern design with glassmorphism/neumorphism themes
- **Real-time Chat**: Smooth messaging with typing indicators and animations
- **Voice Input**: 🎤 Speech-to-text using Chrome's Web Speech API
- **Text-to-Speech**: 🔊 Click any bot message to hear it spoken aloud
- **Image Upload**: Drag & drop or click to upload images with thumbnail previews
- **Smart Responses**: Powered by OpenRouter + Google's Gemini 2.0 Flash model

### 🎨 User Experience

- **Dark/Light Themes**: Toggle between themes with persistence
- **Mobile-First**: Responsive design that works on all devices
- **Chat History**: Automatic saving with organized timeline view
- **Prompt Suggestions**: Quick-start suggestions for common queries
- **Error Handling**: Graceful error states with helpful messages

### 🔧 Builder.io Integration

- **Visual Editing**: All components are Builder.io compatible
- **Live Preview**: See changes in real-time
- **Custom Components**: Chat interface components available in Builder.io
- **No-Code Editing**: Non-developers can customize the interface

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd mikasal-ai-assistant
npm install
```

### 2. Environment Setup

Create a `.env` file:

```bash
# Optional: For Builder.io integration
VITE_BUILDER_API_KEY=your-builder-io-api-key
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## 🤖 AI Configuration

The assistant is pre-configured with:

- **Model**: Google Gemini 2.0 Flash (via OpenRouter)
- **API Key**: Included (rate-limited for demo)
- **System Prompt**: "You are Mikasal's personal assistant. Respond helpfully, clearly, and politely. If someone asks who created you or who you are, reply: 'I am Mikasal's personal assistant, created by Sir Mikasal Marak.'"
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **HTTP-Referer**: `https://mikasalpersonalassistant.netlify.app`

## 🎙️ Voice Features

### Speech-to-Text

- Click the microphone icon in the input area
- Speak your message (works best in Chrome/Edge)
- Text appears automatically in the input field

### Text-to-Speech

- Click the 🔊 icon on any bot message
- Uses browser's built-in speech synthesis
- Automatically selects the best available voice

## 📱 Mobile Support

Optimized for mobile devices with:

- Touch-friendly interface
- Responsive sidebar navigation
- Mobile keyboard support
- Proper viewport handling

## 🎨 Builder.io Components

### Available Components

1. **ChatContainer**

   - Main chat interface
   - Configurable title and subtitle
   - Toggle prompt suggestions

2. **PromptSuggestions**

   - Customizable suggestion cards
   - Editable titles and categories

3. **AIAssistantHeader**
   - Branded header with toggle controls
   - Theme switcher integration

### Setting Up Builder.io

1. Get API key from [Builder.io](https://builder.io)
2. Add to `.env` file
3. Create a `page` model in Builder.io
4. Start editing visually!

See [BUILDER_SETUP.md](./BUILDER_SETUP.md) for detailed instructions.

## 🎯 Chat Interface Features

### Message Features

- **Timestamps**: All messages show time sent
- **Copy Text**: Click copy icon on any message
- **Voice Playback**: Speak bot responses aloud
- **Image Support**: Upload and view images inline
- **Message History**: Persistent across sessions

### Input Features

- **Multi-line Support**: Shift+Enter for new lines
- **File Upload**: Click paperclip or drag & drop images
- **Voice Input**: Microphone button for speech-to-text
- **Send Options**: Enter to send, with visual feedback

### Smart Suggestions

- "What's the weather like today?"
- "Tell me a joke"
- "Help me write a professional email"
- "Explain how AI works in simple terms"
- "Give me some productivity tips"
- "Help me plan my day"

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router 6 (SPA mode)
- **Styling**: Tailwind CSS + Custom components
- **UI Library**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Tailwind CSS + Framer Motion
- **Voice**: Web Speech API + Speech Synthesis
- **Storage**: LocalStorage + IndexedDB fallback
- **Builder.io**: Visual editing integration
- **AI API**: OpenRouter + Google Gemini

## 🎨 Design System

### Theme Colors

- **AI Primary**: Blue accent (`--ai-primary`)
- **AI Secondary**: Light blue (`--ai-secondary`)
- **AI Accent**: Green accent (`--ai-accent`)
- **Gradients**: Smooth color transitions

### Typography

- **Font**: Inter (primary)
- **Sizes**: Responsive text scaling
- **Weights**: 400, 500, 600, 700

### Effects

- **Glassmorphism**: Subtle transparency effects
- **Animations**: Smooth transitions and hover states
- **Shadows**: Layered depth with custom shadows

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/           # Chat-specific components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── ui/             # Reusable UI components
│   └── builder/        # Builder.io integration
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── providers/          # Context providers
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Check TypeScript types
- `npm test` - Run tests
- `npm run format.fix` - Format code with Prettier

## 🌐 Deployment

### Netlify (Recommended)

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables if using Builder.io

### Other Platforms

Works with any static hosting:

- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## 🔒 Security

- API keys are properly configured
- No sensitive data stored in frontend
- CORS properly handled
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your own projects!

## 🆘 Support

For issues and questions:

1. Check existing GitHub issues
2. Create a new issue with details
3. Include browser and device information

---

**Created by Sir Mikasal Marak** 🚀

_A professional AI assistant interface that brings ChatGPT-like experience to your own applications._
