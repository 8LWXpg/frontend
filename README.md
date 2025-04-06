# AI Chat Interface

This project provides a UI for interacting with AI chat APIs. It's built with Svelte, TypeScript, and Vite.

## Features

- Chat interface for communicating with AI models
- Server management for connecting to different AI endpoints
- Support for multiple models per server
- Responsive design for desktop and mobile use

## API Endpoints Used

The UI interacts with the following API endpoints:

- `POST: {url}/api/chat` - Send messages to the AI
- `GET: {url}/api/tools` - Get available tools
- `GET: {url}/api/servers` - List available servers
- `PUT: {url}/api/servers` - Add or update servers
- `GET: {url}/api/models` - Get available models for a server

## Setup and Configuration

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the API URL in `.env`:
   ```
   VITE_API_URL=http://your-api-url
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Building for Production

To create a production build:

```
npm run build
```

You can preview the production build with:

```
npm run preview
```
