# UAE EOSB Calculator Frontend

A modern, responsive web application for calculating End of Service Benefits (EOSB) according to UAE Labor Law Article 132. This frontend provides an intuitive interface for employees and HR professionals to calculate accurate gratuity amounts with proper RTL support for Arabic users.

## Features

• ✅ **Modern UI/UX** - Clean, responsive design with dark/light theme support
• ✅ **Multi-language Support** - English and Arabic (العربية) with proper RTL layout
• ✅ **Real-time Validation** - Comprehensive form validation with helpful error messages
• ✅ **Accurate Calculations** - Integrated with backend API for precise EOSB calculations
• ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
• ✅ **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
• ✅ **Type Safety** - Built with TypeScript for reliable development
• ✅ **Performance Optimized** - Next.js App Router with optimizations and caching

## Quick Start

### Prerequisites

• Node.js (v18 or later)
• npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone https://github.com/abhisekmallik/uae-gratuity-calculator-frontend
cd uae-gratuity-calculator-frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Start the development server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

- `NEXT_PUBLIC_SHOW_LANGUAGE_SWITCHER`: Set to `true` to show the language switcher in the header, `false` to hide it (default: `false`)

```bash
cp .env.example .env
```

## User Interface Features

### Form Components

• **Employee Details Form** - Intuitive input fields for salary, contract type, and dates
• **Date Pickers** - User-friendly date selection with validation
• **Dropdown Selectors** - Dynamic options loaded from backend configuration
• **Real-time Validation** - Immediate feedback on input errors
• **Clear/Reset Functionality** - Easy form reset with confirmation

### Results Display

• **Calculation Breakdown** - Detailed explanation of EOSB calculation
• **Visual Components** - Charts and progress indicators for service period
• **Currency Formatting** - Proper AED formatting with localization
• **Penalty Information** - Clear display of applicable penalties and reasons

### Internationalization (i18n)

• **Language Support** - English and Arabic with complete translations
• **RTL Layout** - Proper right-to-left layout for Arabic
• **Date Localization** - Culture-specific date formats
• **Number Formatting** - Localized currency and number display

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   └── globals.css        # Global styles with RTL support
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── GratuityCalculator.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/             # React contexts
│   └── AppContext.tsx
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization setup
│   ├── request.ts
│   └── routing.ts
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
│   └── index.ts
└── messages/            # Translation files
    ├── en.json         # English translations
    └── ar.json         # Arabic translations
```

## Technology Stack

• **Framework**: Next.js 14 with App Router
• **Language**: TypeScript
• **Styling**: Tailwind CSS with shadcn/ui components
• **Internationalization**: next-intl
• **State Management**: React Context API
• **Animations**: Framer Motion
• **Form Handling**: React Hook Form with validation
• **Date Handling**: Native JavaScript Date API
• **API Client**: Custom fetch-based client with error handling

## Scripts

• `npm run dev` - Start development server with hot reload
• `npm run build` - Build for production
• `npm start` - Start production server
• `npm run lint` - Run ESLint code quality checks
• `npm run type-check` - TypeScript type checking

## Backend Integration

This frontend integrates with the [UAE EOSB Calculator Backend](https://github.com/abhisekmallik/uae-gratuity-calculator-backend) to provide:

• **Configuration API** - Dynamic dropdown values and calculation rules
• **Calculation API** - Accurate EOSB calculations per UAE Labor Law
• **Validation** - Server-side input validation and error handling

### API Endpoints Used

• `GET /api/eosb/config` - Fetch configuration data
• `POST /api/eosb/calculate` - Calculate EOSB amount
• `GET /api/eosb/health` - Backend health check

## EOSB Calculation Features

### Supported Scenarios

• **All Contract Types** - Unlimited and limited contracts
• **All Termination Types** - Resignation, termination, retirement, death, disability
• **Penalty Calculations** - Automatic application of resignation penalties
• **Service Period** - Precise calculation using actual calendar dates
• **Future Date Support** - Planning and projection scenarios

### Calculation Display

• **Breakdown View** - Detailed calculation steps and formulas
• **Service Summary** - Years, months, and days of service
• **Penalty Information** - Clear explanation of applicable penalties
• **Currency Formatting** - Professional AED amount display

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This application is ready for deployment on Vercel with optimized performance and SEO.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhisekmallik/uae-gratuity-calculator-frontend)

### Automatic Deployment (Recommended)

1. **Connect to Vercel**

   - Fork this repository to your GitHub account
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your repository
   - Vercel will automatically detect Next.js and configure the build settings

2. **Environment Variables**

   Configure these environment variables in the Vercel dashboard:

   ```bash
   NEXT_PUBLIC_API_URL=https://uae-gratuity-calculator-backend.vercel.app
   NEXT_PUBLIC_SHOW_LANGUAGE_SWITCHER=false
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Deploy" - Vercel will build and deploy your application
   - Every push to the main branch will trigger automatic redeployment

### Manual Deployment with Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy to Vercel**

   ```bash
   # Deploy to production
   vercel --prod

   # Or use the npm script
   npm run deploy
   ```

4. **Configure Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   vercel env add NEXT_PUBLIC_SHOW_LANGUAGE_SWITCHER production
   ```

### Vercel Configuration

The project includes optimized Vercel configuration:

- **`vercel.json`** - Deployment settings, redirects, and security headers
- **`.vercelignore`** - Files to exclude from deployment
- **Environment Variables** - Production-ready configuration
- **Performance Optimization** - Caching, compression, and build optimization

### Post-Deployment Verification

After deployment, verify these endpoints:

- **Frontend**: `https://your-app.vercel.app`
- **Health Check**: Ensure the app loads correctly
- **API Integration**: Verify backend connectivity
- **Internationalization**: Test both `/en` and `/ar` routes
- **Responsive Design**: Test on different devices

### Production Considerations

• ✅ **Performance Optimized** - Next.js optimizations and caching
• ✅ **SEO Ready** - Proper meta tags and structured data
• ✅ **Responsive Design** - Mobile-first approach
• ✅ **Accessibility** - WCAG 2.1 AA compliant
• ✅ **Internationalization** - Multi-language support with proper URLs
• ✅ **Error Handling** - Graceful error states and fallbacks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For questions or issues, please create an issue in the repository.

## Related Projects

• [UAE EOSB Calculator Backend](https://github.com/abhisekmallik/uae-gratuity-calculator-backend) - RESTful API backend service

## Summary

This UAE EOSB Calculator Frontend provides a comprehensive, user-friendly interface for calculating End of Service Benefits according to UAE Labor Law. With support for multiple languages, responsive design, and seamless integration with the backend API, it offers a professional solution for employees and HR professionals in the UAE.

### Key Highlights

• 🎯 **Accurate & Reliable** - Integrated with tested backend calculations
• 🌐 **Multilingual** - Full English and Arabic support with RTL layout
• 📱 **Responsive** - Works perfectly on all devices
• ♿ **Accessible** - WCAG compliant for all users
• 🚀 **Performance** - Optimized for speed and SEO
• 🔧 **Configurable** - Environment-based feature toggles

This frontend application provides an intuitive and professional interface for the accurate calculation of UAE EOSB benefits, making it easy for users to understand their end-of-service entitlements.
