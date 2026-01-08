# Todo Webapp Frontend

A Next.js 14 frontend for the Todo Webapp with authentication and task management.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State**: Zustand + Jotai
- **API**: Axios

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update this to your backend URL.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy

### Docker

```bash
# Build
docker build -t todo-frontend .

# Run
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://backend:8000/api todo-frontend
```

### Nginx

For production, serve with Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── dashboard/      # Protected dashboard
│   └── logout/         # Logout handler
├── components/         # React components
│   ├── auth-form.tsx   # Login/Register form
│   ├── task-form.tsx   # Task creation/editing
│   └── task-list.tsx   # Task list display
├── lib/               # Utilities
│   ├── api-client.ts  # Axios configuration
│   └── auth.ts        # Token management
└── hooks/             # Custom React hooks
```
