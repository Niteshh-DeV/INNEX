# INNEX

The INNEX 1.0 event website for the Innovative Computer Engineering Club at
Far Western University (ICEC-FWU). INNEX is Sudurpashchim's first
national-level hackathon.

![INNEX 1.0](./public/og/innex-2026.png)

## Overview

This project is a responsive, animated event landing page built with React,
Vite, Tailwind CSS, and Motion. It includes:

- Event information, timeline, tracks, judging criteria, and FAQs
- Registration call-to-actions and registration QR code
- Edition-aware content and countdown behavior
- Accessible navigation, skip-to-content support, and reduced-motion handling
- Open Graph artwork and event JSON-LD metadata

## Requirements

- Node.js 22+
- pnpm 10+

The repository includes a [`.mise.toml`](./.mise.toml) file for the supported
tool versions.

## Getting started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Vite will print the local preview URL in the terminal.

## Available commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Create a production build in `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm format` | Format the project with oxfmt |

## Project structure

```text
content/        Event edition content and validation schemas
public/         Static images, icons, and Open Graph artwork
src/components/ Reusable page sections and UI primitives
src/lib/        Edition resolution and shared application helpers
src/App.tsx     Application shell
src/index.css   Global styles and Tailwind CSS entrypoint
```

## Updating event content

Most event copy and configuration lives in
[`content/editions/2026.ts`](./content/editions/2026.ts). The content is
validated by the schemas in [`content/types.ts`](./content/types.ts).

To prepare a future edition:

1. Copy the current edition file and update its event data.
2. Keep the content shape compatible with the schemas.
3. Update edition resolution in `src/lib/` if the new URL or edition needs a
   different route.
4. Run `pnpm format` and `pnpm build`.

## Deployment

The production output is generated with:

```bash
pnpm build
```

Deploy the resulting `dist/` directory to a static hosting provider that
supports single-page applications.

## License

No license has been specified for this repository yet. Until a license is
added, the source should not be assumed to be available for reuse or
redistribution.
