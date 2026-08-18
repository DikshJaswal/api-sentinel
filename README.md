# API Sentinel

API Sentinel is a Next.js dashboard for viewing API health, response times,
recent monitoring events, and failure alerts.

The project currently runs in **demo mode**. Demo mode generates temporary
monitoring data, so the dashboard can be used immediately without a database
or a real API endpoint.

## Current features

- Dashboard with API status and health score
- Generated UP/DOWN demo checks
- Response-time chart
- Recent monitoring events
- Failure alert display
- API page with a working **Check Now** action
- Responsive dark interface
- Prisma integration prepared for future persistent data

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL support for real-data mode
- Chart.js and `react-chartjs-2`

## Run the demo

### Requirements

- Node.js 20 or newer
- npm

### Installation

From the project directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The dashboard checks for new demo data automatically. The demo data is kept
in server memory and resets when the development server restarts.

## Project structure

```text
api-sentinel/
├── app/
│   ├── api/              # Monitoring and log API routes
│   ├── alerts/           # Alerts page
│   ├── apis/             # Monitored API page
│   ├── dashboard/        # Main dashboard
│   └── layout.tsx        # Application layout
├── components/           # Reusable UI components
├── lib/
│   ├── mock.ts           # Temporary demo-data store
│   ├── prisma.ts         # Prisma client
│   └── chart.ts          # Chart.js setup
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## Demo-data behavior

When demo mode is enabled, the application:

1. Starts with sample UP and DOWN events.
2. Creates a new generated event whenever monitoring is triggered.
3. Returns the latest events to the dashboard and chart.
4. Keeps up to 50 events in memory.

No real API request is required in this mode.

## Switch to database mode

Database mode is available for the next stage of development. Create a
`.env` file in the project root:

```env
USE_MOCK_DATA="false"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

Then generate the Prisma client and create/update the database schema:

```bash
npx prisma generate
npx prisma db push
```

Start the application normally:

```bash
npm run dev
```

The current database schema stores API check results in the `ApiLog` table.
Real production monitoring will still need endpoint configuration, scheduled
server-side checks, authentication settings, timeouts, retries, and notification
delivery.

## Environment variables

| Variable | Required for demo mode | Purpose |
|---|---:|---|
| `USE_MOCK_DATA` | No | Set to `false` to use the database path |
| `DATABASE_URL` | No | PostgreSQL connection string for database mode |

If `USE_MOCK_DATA` is not `false`, or if `DATABASE_URL` is missing, the app
automatically uses demo mode.

## Available commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm start         # Start the production server
npm run lint      # Run ESLint
```

## Production roadmap

- Support multiple monitored APIs
- Store endpoint configuration in the database
- Run checks with a background worker or scheduled job
- Add request headers and authentication configuration
- Add timeout, retry, and response validation rules
- Add email, Slack, or webhook notifications
- Add user authentication and team/project separation

## License

This project is private and intended for development and internal use unless a
separate license is added.
