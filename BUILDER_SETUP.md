# Builder.io Integration Setup

This chat application is now fully integrated with Builder.io, allowing you to make components editable in the Builder.io visual editor.

## 🚀 Quick Setup

### 1. Get Your Builder.io API Key

1. Go to [Builder.io](https://builder.io) and create an account
2. Create a new space or use an existing one
3. Go to Account Settings → API Keys
4. Copy your Public API Key

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
VITE_BUILDER_API_KEY=your-builder-io-api-key-here
```

### 3. Setup Your Builder.io Space

1. In your Builder.io dashboard, go to Models
2. Create a new model called `page` (if it doesn't exist)
3. Set the preview URL to your development/production URL

## 🎯 Available Builder.io Components

The following components are registered and editable in Builder.io:

### `ChatContainer`

Main chat interface component with configurable:

- **title**: Title text above prompt suggestions
- **subtitle**: Subtitle text below the title
- **showPromptSuggestions**: Toggle prompt suggestions visibility
- **className**: Additional CSS classes

### `PromptSuggestions`

Prompt suggestions component with configurable:

- **title**: Main title text
- **subtitle**: Subtitle text
- **className**: Additional CSS classes

### `AIAssistantHeader`

Header component with Mikasal's Assistant branding

- **isSidebarOpen**: Sidebar state (boolean)

## 🔧 Usage

### In Builder.io Editor

1. Create a new page in Builder.io
2. Drag and drop the registered components from the components panel
3. Configure the props in the right sidebar
4. Publish your changes

### In Your React App

The app automatically loads Builder.io content for:

- Main chat interface at `/`
- Custom Builder.io pages at `/builder/*`

### Accessing Builder.io Preview

Visit your app with Builder.io preview parameters:

```
http://localhost:5173?builder.preview=page&builder.space=your-space-id
```

## 🎨 Customizing Components

To add more components to Builder.io:

1. Create your React component in `src/components/`
2. Make sure it accepts props for customization
3. Add it to `builder-registry.ts`:

```typescript
{
  component: YourComponent,
  name: 'YourComponent',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Default title',
    },
  ],
  canHaveChildren: false,
}
```

## 🌐 Production Deployment

1. Set your production Builder.io API key in your hosting environment
2. Update your Builder.io preview URLs to point to your production domain
3. The chat functionality will work seamlessly with Builder.io content

## 💡 Features

- ✅ Professional ChatGPT-like interface
- ✅ Voice input (Web Speech API)
- ✅ Text-to-speech with 🔊 icons
- ✅ Image upload and display
- ✅ Dark/light theme toggle
- ✅ Chat history persistence
- ✅ Mobile-responsive design
- ✅ Builder.io visual editing
- ✅ OpenRouter + Gemini 2.0 Flash integration
- ✅ Proper error handling and loading states

## 🔗 Integration Details

- **API**: OpenRouter with Gemini 2.0 Flash model
- **Voice**: Chrome Web Speech API for speech-to-text
- **TTS**: Browser SpeechSynthesis API
- **Storage**: LocalStorage for chat history
- **Styling**: Tailwind CSS with glassmorphism effects
- **Builder.io**: Fully integrated for visual editing

The system prompt is configured as requested:

> "You are Mikasal's personal assistant. Respond helpfully, clearly, and politely. If someone asks who created you or who you are, reply: 'I am Mikasal's personal assistant, created by Sir Mikasal Marak.'"
