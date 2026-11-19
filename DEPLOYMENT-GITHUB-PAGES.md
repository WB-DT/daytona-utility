# Deployment instructions for wb-dt.github.io/daytona-utility

Repository mapping assumption: the live URL `https://wb-dt.github.io/daytona-utility/index.html` is published from the root of the `daytona-utility` GitHub Pages repository or from the configured publishing folder that currently contains `index.html`.

## Exact destination paths

```text
daytona-utility/
├── index.html
├── manifest.v524.json
├── README.md
├── v524-extraction-checklist.json
├── v524-index-integration-validation.json
└── assets/
    ├── performance-review-portal.v524.css
    ├── performance-review-template.v524.js
    ├── performance-review-core.v524.js
    └── performance-review-components.v524.js
```

Replace the existing repository-root `index.html` with the package `index.html`. Create the `assets` directory directly beside `index.html`, then place all four assets inside it. Do not put the assets in the repository root and do not nest the package folder inside `daytona-utility`.

The deployed URLs will be:

- `https://wb-dt.github.io/daytona-utility/index.html`
- `https://wb-dt.github.io/daytona-utility/assets/performance-review-portal.v524.css?v=524.0`
- `https://wb-dt.github.io/daytona-utility/assets/performance-review-template.v524.js?v=524.0`
- `https://wb-dt.github.io/daytona-utility/assets/performance-review-core.v524.js?v=524.0`
- `https://wb-dt.github.io/daytona-utility/assets/performance-review-components.v524.js?v=524.0`

## GitHub upload procedure

1. Open the GitHub repository that publishes `wb-dt.github.io/daytona-utility`.
2. Confirm the Pages source in **Settings → Pages**. Use that exact branch/folder, commonly `main` and `/ (root)`.
3. Back up the current `index.html` as `index-v522-backup.html` or create a release/tag before replacing files.
4. Upload the package `index.html` to the publishing root and replace the existing file.
5. Create or open the publishing-root `assets` folder.
6. Upload all four v524 assets into `assets`.
7. Commit all five runtime files together in one commit. Suggested message: `Deploy Performance Review Portal v524 asset extraction`.
8. Wait for the GitHub Pages deployment workflow to complete.
9. Open each asset URL directly and verify HTTP 200, then open the app in a private browser window.
10. In DevTools Network, confirm the order template → core → components and ensure no 404 responses.

## Do not deploy this way

Incorrect nesting:

```text
daytona-utility/PerformanceReviewPortal-v524-template-extraction/index.html
```

That would publish the app at a different URL and break the current launch link.
