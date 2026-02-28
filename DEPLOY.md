# Deploy UI Script - Quick Reference

## Usage

```bash
# Deploy UI kit only (fast)
./deploy-ui.sh

# Deploy with playground demo (takes ~2-3 minutes)
./deploy-ui.sh --with-playground
```

## What It Does

The script packages the alexbot UI Kit into a `dist/` folder ready for:
- Copying into your projects
- Publishing to npm
- Sharing with your team

## Output Structure

```
dist/
├── components/         # All UI primitives (Button, Input, Modal, etc.)
├── composites/         # Complex components (SubtaskTimeline, ThemeGrid, etc.)
├── hooks/              # React hooks (useSquircle, etc.)
├── themes/             # Theme system and context
├── styles/             # Global CSS with Tailwind config
├── index.js            # Main entry point
├── package.json        # npm package metadata
├── README.md           # Full documentation
├── COMPONENTS.md       # Component API reference
└── playground/         # (optional) Built demo site

Total size: ~200KB (UI kit only), ~800KB (with playground)
```

## Next Steps

### Copy to Your Project
```bash
cp -r dist/ /path/to/your-project/src/ui-kit/
```

### Publish to npm
```bash
cd dist
npm login
npm publish --access public
```

### Deploy Playground
```bash
# The playground/dist folder contains a static site
# Upload to any static hosting (Netlify, Vercel, GitHub Pages)
cd dist/playground
# Deploy with your preferred method
```

## Requirements

- Bash shell
- Node.js (for playground build option)
- npm (for playground build option)

## Notes

- The `dist/` folder is gitignored and recreated on each run
- Playground build requires Node.js 20.19+ (will work with 18+ but shows warning)
- Source files are copied as-is (JSX) - no transpilation
- Consumers of the package need React 18+, Tailwind CSS v4, and peer dependencies
