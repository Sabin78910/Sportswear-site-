# Contributing

Thanks for helping improve the Sportswear storefront.

## Workflow

1. Create a branch from `main`:
   - `feature/<short-name>` for new features
   - `fix/<short-name>` for bug fixes
   - `docs/<short-name>` for documentation
2. Make your changes and test them locally with `npm start`.
3. Open a pull request into `main` that describes what changed and why. Add screenshots for any visual change.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(cart): add promo code field
fix(video): stop seeking past the last frame on iOS
docs(readme): update screenshots
```

## Code style

- **Formatting**: 2-space indentation, LF line endings, UTF-8 (see `.editorconfig`).
- **CSS**: use tokens from `css/tokens.css`, never hard-coded colours. Class names follow BEM (`block__element--modifier`).
- **JavaScript**: ES modules, one feature per module, and JSDoc on exported functions. Render dynamic markup with the `html` template from `utils.js` so values are escaped.
- **Assets**: compress images before committing. Encode videos all-intra (see the README).

## Before you open a PR

- [ ] The site runs locally with no console errors
- [ ] Scrolling scrubs the film smoothly in both directions
- [ ] Checked at 390 px (mobile) and 1440 px (desktop), with no horizontal scroll
- [ ] All interactive elements work with the keyboard
- [ ] Screenshots in `docs/screenshots/` are updated if the UI changed
