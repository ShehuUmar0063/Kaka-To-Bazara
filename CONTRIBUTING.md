# Contributing to Kaka-to-Bazara

Thank you for helping improve residual-moisture farming tools for Gombe State farmers!

## Ways to Contribute
- **Agronomic Calibration**: Improve crop maturity windows, soil water-holding thresholds, or Fadama/upland guidance in `src/data/gombeData.ts`.
- **Translations**: Refine natural farming phrasing in Hausa, Fulfulde, or Nigerian Pidgin in `src/data/translations.ts` and `src/data/farmInputsTranslations.ts`.
- **Accessibility & Offline Support**: Enhance low-bandwidth performance and screen-reader usability.

## Development Workflow
1. Fork the repository and create a new branch (`git checkout -b feature/my-change`).
2. Install dependencies with `npm install`.
3. Run type checking and build checks before committing:
   ```bash
   npm run lint
   npm run build
   ```
4. Never commit `.env` files or API keys. Only `.env.example` should be tracked.
5. Open a Pull Request describing the change and how you tested it.
