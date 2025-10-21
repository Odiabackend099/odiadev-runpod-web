# Planning: AGGRESSIVE Fix for Vercel Build Module Resolution

## Problem Statement
Vercel build is failing because Next.js cannot resolve `@/` path aliases for `lib`, `components`, and `contexts` directories. The TypeScript configuration exists but is not being properly utilized during the Webpack build process.

## Implementation Phases

### Phase 1: Update TypeScript Configuration
- **Goal**: Ensure TypeScript correctly recognizes all path aliases
- **Tasks**:
  1. Update `tsconfig.json` with explicit path mappings
  2. Add all necessary directories to include array
  3. Verify baseUrl is set correctly
- **Success Criteria**: TypeScript recognizes all `@/` imports

### Phase 2: Update Next.js Configuration  
- **Goal**: Make Next.js/Webpack aware of path aliases
- **Tasks**:
  1. Add webpack configuration to resolve aliases
  2. Use Node.js path module for absolute paths
  3. Configure both development and production builds
- **Success Criteria**: Webpack resolves all `@/` imports during build

### Phase 3: Verify File Structure
- **Goal**: Ensure all files exist in correct locations
- **Tasks**:
  1. Confirm all component files exist
  2. Confirm all context files exist
  3. Confirm all lib files exist
  4. Check for any duplicate or conflicting files
- **Success Criteria**: All referenced files exist and are accessible

### Phase 4: Test and Deploy
- **Goal**: Verify build works locally and on Vercel
- **Tasks**:
  1. Test local build with `npm run build`
  2. Commit and push changes
  3. Monitor Vercel build logs
  4. Verify successful deployment
- **Success Criteria**: Vercel build completes successfully

## Technical Requirements

### TypeScript Configuration
- `baseUrl`: "." (root directory)
- `paths`: Explicit mappings for `@/*`
- `include`: All TypeScript/TSX files
- `moduleResolution`: "node"

### Next.js Configuration
- Webpack resolve alias configuration
- Path module for absolute path resolution
- No deprecated experimental flags

### File Structure
```
/
├── lib/
│   ├── api.ts
│   └── supabase.ts
├── components/
│   ├── Layout.tsx
│   ├── TTSPlayer.tsx
│   ├── VoiceCloner.tsx
│   └── AudioPlayer.tsx
├── contexts/
│   └── AuthContext.tsx
└── app/
    └── ...
```

## Testing Criteria

### Local Build Test
- Run `npm run build` locally
- Verify no module resolution errors
- Confirm build completes successfully

### Vercel Build Test
- Push to GitHub
- Monitor Vercel build logs
- Verify successful deployment
- Test deployed application

## Risk Mitigation
- Use both TypeScript AND Webpack configuration
- Test locally before pushing
- Keep backup of working configuration
- Use explicit paths if aliases fail