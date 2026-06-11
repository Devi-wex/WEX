# LedgerFX

A production-ready full-stack application for managing USD purchase transactions and converting them to supported foreign currencies using real-time U.S. Treasury exchange rates.

## Architecture & Tech Stack

This project is built using modern frameworks to emulate a high-quality SaaS product:

### Backend
- **Java 21** & **Spring Boot 3**
- **Spring Data JPA** & **H2 Embedded Database**: For plug-and-play persistence without requiring external database servers (like Dockerized PostgreSQL), preserving data locally in files.
- **Spring Validation**: For robust data validation.
- **REST APIs**: Structured properly using DTOs, Exception Handlers, and Service layers.

### Frontend
- **React 18** & **TypeScript**
- **Vite** (Lightning-fast build tool)
- **Tailwind CSS v4** & **shadcn/ui**: For a highly polished, accessible, and responsive user interface.
- **TanStack React Query**: For asynchronous data fetching, caching, and state management.
- **React Hook Form & Zod**: For complex form validation.
- **Lucide React**: For scalable SVG icons.

## Features

1. **Dashboard Overview**: Get a high-level overview of the total transactions, USD volume, and system connectivity.
2. **Transaction Management**: Record new USD purchases up to 2 decimals with validation.
3. **Currency Conversion**: Convert any transaction using the official U.S. Treasury Reporting Rates of Exchange API. 
4. **Intelligent Rate Selection**: The system automatically pulls the best available rate spanning from your transaction date going back up to 6 months.
5. **Supported Currencies Explorer**: Search and view all supported currencies and their latest rates from the Treasury.

## Running the Application

This application is designed to be "plug and play" with zero external service requirements.

### 1. Run the Backend

You will need Java 21 installed (`JAVA_HOME` correctly set).

```bash
cd backend
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.
The embedded H2 database will store its files in the `./backend/data` directory automatically.

### 2. Run the Frontend

You will need Node.js (v18+) installed.

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`. Open this URL in your browser to interact with LedgerFX.
