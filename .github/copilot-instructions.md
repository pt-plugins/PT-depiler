# PT-depiler AI Coding Agent Instructions

## Project Overview
PT-depiler is a browser extension (Manifest v3) for enhancing Private Tracker (PT) site usability. Built with Vue 3 + TypeScript + Vuetify, it provides multi-site search, torrent management, and downloader integration.

## Architecture & Key Components

### Web Extension Structure
- **Background Service Worker**: `src/entries/background/main.ts` - handles core extension logic
- **Content Scripts**: `src/entries/content-script/` - injected into PT sites  
- **Options Page**: `src/entries/options/` - Vue 3 SPA for configuration
- **Offscreen Documents**: `src/entries/offscreen/` - for secure operations

### Module System (`src/packages/`)
- **Site**: `@ptd/site` - PT site definitions, scrapers, and metadata
- **Downloader**: `@ptd/downloader` - Integration with qBittorrent, Transmission, etc.
- **BackupServer**: `@ptd/backupServer` - WebDAV, Gist, Google Drive sync
- **MediaServer**: `@ptd/mediaServer` - Jellyfin, Plex, Emby integration
- **Social**: `@ptd/social` - Douban, IMDb, TMDB data fetching

### Storage & State Management
- **Extension Storage**: `@webext-core/storage` for cross-context data persistence
- **Pinia Stores**: Vue state management with persistence plugins
- **IndexedDB**: For large datasets (search results, download history)

## Development Patterns

### Path Aliases (tsconfig.json)
```typescript
"~/*": ["src/*"]           // Root source files
"@/*": ["src/entries/*"]   // Extension entries
"@ptd/*": ["src/packages/*"] // Modular packages
```

### Message Passing
- Use `@webext-core/messaging` for background ↔ content script communication
- Message definitions in `src/entries/messages.ts`
- Pattern: `onMessage("messageType", handler)` and `sendMessage("messageType", data)`

### Site Integration
- Site schemas in `src/packages/site/schemas/` extend `AbstractBittorrentSite`
- Site definitions in `src/packages/site/definitions/` contain metadata + schema mapping
- Selector-based scraping using Sizzle for DOM parsing

### Vue 3 Composition API
- Use `<script setup>` syntax consistently
- Prefer `ref()`/`reactive()` over Options API
- Vuetify 3 components with CSS utility classes

## Build & Development

### Key Commands
```bash
pnpm dev                    # Development server with HMR
pnpm build:dist            # Build Chrome extension
pnpm build:dist-firefox    # Build Firefox addon
pnpm check                 # TypeScript type checking
```

### Browser Targets
- Chrome: Uses service worker background script
- Firefox: Uses legacy background scripts (`ff_main.ts`)
- Conditional manifest via `{{chrome}}` / `{{firefox}}` tokens

### Vite Configuration
- `vite-plugin-web-extension` generates manifest.json dynamically
- Multi-target builds with `TARGET=firefox` environment variable
- Node.js polyfills for crypto, buffer operations

## Testing & Quality

### Code Standards
- Prettier formatting (120 char width, semicolons, trailing commas)
- TypeScript strict mode enabled
- Husky pre-commit hooks for linting

### Site Compatibility
- Support for NexusPHP, Unit3D, Gazelle tracker engines
- Graceful degradation for unsupported sites
- User agent and cookie handling for authentication

## Common Patterns

### Adding New Site Support
1. Create schema in `src/packages/site/schemas/`
2. Add definition in `src/packages/site/definitions/`
3. Implement required methods: `getUserInfo()`, `searchTorrents()`, `getTorrentInfo()`

### Cross-Browser Compatibility
- Use `chrome.*` APIs with feature detection
- Separate entry points for service worker vs background scripts
- Conditional permissions in manifest

### Error Handling
- Graceful fallbacks for network failures
- User-friendly error messages with i18n support
- Background job scheduling with `@webext-core/job-scheduler`

## Key Dependencies
- **Vue Ecosystem**: Vue 3, Vuetify 3, Vue Router, Pinia, Vue I18n
- **Extension Framework**: `@webext-core/*` for cross-browser compatibility
- **Build Tools**: Vite, TypeScript
- **Utilities**: axios, date-fns, es-toolkit, jszip, crypto-js

This is a sophisticated multi-platform extension requiring careful attention to web extension APIs, cross-site scripting, and torrent ecosystem integrations.
