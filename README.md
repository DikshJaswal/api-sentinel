# API Sentinel

A comprehensive API monitoring and management dashboard built with Next.js 16, TypeScript, and Tailwind CSS. Real-time monitoring, health tracking, and performance analytics for your APIs.

## 🚀 Features

- **Real-time Monitoring**: Auto-refresh dashboard every 15 seconds
- **Health Tracking**: SLA monitoring with uptime percentage calculations
- **Performance Analytics**: Response time tracking and trend analysis
- **Alert System**: Automatic failure detection and notifications
- **Data Visualization**: Interactive charts and graphs
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Database Integration**: Prisma ORM for data persistence

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma ORM
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Custom SVG components
- **Deployment**: Vercel ready

## 📊 Dashboard Features

- **API Status**: Real-time up/down monitoring
- **Response Time**: Performance metrics with trend indicators
- **Health Score**: SLA percentage with visual indicators
- **Recent Events**: Activity log with timestamps
- **Interactive Charts**: Response time visualization
- **Alert Banners**: Failure notifications

## 🏗️ Project Structure

```
api-sentinel/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Main dashboard page
│   ├── alerts/        # Alerts management
│   ├── apis/          # API management
│   └── layout.tsx     # Root layout
├── components/        # Reusable React components
├── lib/              # Utility functions
├── prisma/           # Database schema
└── public/           # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/api-sentinel.git
cd api-sentinel
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Configure your database connection and API endpoints
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

1. **Dashboard**: View real-time API monitoring data
2. **APIs**: Manage and configure monitored endpoints
3. **Alerts**: View and manage system alerts
4. **Settings**: Configure monitoring intervals and thresholds

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="your_database_connection_string"

# API Configuration
API_ENDPOINTS="your_api_endpoints"
MONITORING_INTERVAL=15000

# Next.js
NEXTAUTH_SECRET="your_secret_key"
```

### Database Setup

The project uses Prisma for database management. Update the schema in `prisma/schema.prisma` and run migrations:

```bash
npx prisma migrate dev
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting

## 📧 Contact

Your Name - [@yourusername](https://github.com/yourusername)

---

**Built with ❤️ using modern web technologies**
