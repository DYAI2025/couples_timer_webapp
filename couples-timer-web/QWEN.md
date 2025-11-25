# Couples Timer Web Application

## Project Overview

The Couples Timer is a React-based web application designed to facilitate structured conversation sessions between partners based on the Moeller method. The application provides a neutral, impartial interface that guides couples through various conversation modes with timed phases, including preparation, speaking slots, transitions, and closing periods.

### Key Features
- Multiple preset conversation modes (Maintain, Commitment, Listening)
- Custom mode builder to create personalized conversation flows
- Timer functionality with visual and audio feedback
- Bilingual support (English and German)
- Responsive design using Tailwind CSS

### Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: i18next with react-i18next
- **Animation**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript integration

## Project Structure

```
couples-timer-web/
├── public/                 # Static assets
├── src/
│   ├── components/         # React UI components
│   ├── domain/             # Business logic and types
│   ├── i18n/               # Internationalization setup and translations
│   ├── pages/              # Application pages
│   ├── services/           # Service implementations
│   ├── styles/             # Global styles
│   ├── viewModel/          # View model logic
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Domain Concepts

The application is built around several key domain concepts:

### Session Modes
- **Preset Modes**: Maintain Mode, Commitment Mode, Listening Mode
- **Custom Mode**: User-defined conversation flow
- Each mode consists of a sequence of phases with specific durations

### Phase Types
- `PREP`: Preparation phase for both partners
- `SLOT_A`: Speaking time for Partner A
- `SLOT_B`: Speaking time for Partner B
- `TRANSITION`: Time for switching speakers
- `CLOSING_A`: Closing reflection for Partner A
- `CLOSING_B`: Closing reflection for Partner B
- `COOLDOWN`: Post-session reflection period

### Session States
- `IDLE`: Initial state, no session running
- `RUNNING`: Session is currently active
- `PAUSED`: Session has been paused
- `FINISHED`: Session has completed

## Building and Running

### Prerequisites
- Node.js (version compatible with the project dependencies)
- npm or yarn package manager

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Building for Production
To create an optimized production build:
```bash
npm run build
```
The build output will be placed in the `dist/` directory.

### Other Commands
- Lint the codebase: `npm run lint`
- Preview the production build locally: `npm run preview`

## Testing

The project currently does not include explicit test files in the standard locations. If testing is required, appropriate test files would need to be added.

## Development Conventions

### Code Style
- Code is linted using ESLint with TypeScript-specific rules
- Type checking is enforced through TypeScript compilation
- Component organization follows React best practices

### Styling
- Utility-first CSS approach using Tailwind classes
- Custom colors defined in `tailwind.config.js` for therapeutic UI elements
- Responsive design principles applied consistently

### Internationalization
- UI strings are externalized using i18next
- English and German translations are maintained in corresponding JSON files
- New strings should be added to both language files

## Key Files and Components

### Domain Layer (`src/domain/`)
- `SessionEngine.ts`: Core timer logic and session management
- `SessionMode.ts`: Definition and validation of session modes
- `PhaseConfig.ts`: Configuration for individual phases
- `SessionMode.presets.ts`: Definitions for preset conversation modes

### Services (`src/services/`)
- `TimerService.ts`: Handles time tracking and updates
- `AudioService.ts`: Manages audio feedback during sessions
- `GuidanceService.ts`: Provides session guidance tips

### Internationalization (`src/i18n/`)
- Translation files for different languages
- Initialization and configuration of the i18next library

## Application Flow

1. **Mode Selection**: Users choose from preset modes or create a custom mode
2. **Session Setup**: The selected mode defines the sequence of phases
3. **Session Execution**: The SessionEngine manages the timer and transitions between phases
4. **Guidance**: Contextual tips appear based on the current phase and guidance level
5. **Completion**: Sessions end with a cooldown phase and completion state

## Customization

### Creating Custom Modes
Users can build custom conversation flows using the sequence builder, which allows:
- Adding different phase types
- Setting duration for each phase
- Previewing the custom mode before saving

### Adding New Languages
1. Create a new language directory in `src/i18n/locales/`
2. Add a `translation.json` file with all the required keys
3. Import and add the new translation to `src/i18n/index.ts`
4. Update the language resources object

## Audio Assets

Audio feedback for various events is stored in `public/audio/`. The application provides sound cues for:
- Session start
- Phase transitions
- Slot endings
- Closing and cooldown phases

The `AudioService` manages the playback of these sound files based on session events.