# ClarityDash

An AI-powered SaaS platform for executive management providing intelligent dashboards, decision support, and performance monitoring. Built on Cloudflare Workers and Durable Objects.

[cloudflarebutton]

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## About The Project

ClarityDash is an AI-powered SaaS platform designed for executive management to combat slow decision-making and a lack of operational visibility. The platform provides intelligent, real-time dashboards with automated reporting and predictive analytics, helping leaders track KPIs effortlessly.

It features AI assistants to support strategic decision-making, automatic alerts for performance deviations, and automated analysis of meeting reports to extract key insights and action items. The goal is to transform raw data into actionable intelligence, empowering leaders to steer their organizations with confidence and clarity.

## Key Features

-   **AI-Powered Dashboards**: Get real-time insights with automated reporting and predictive analytics.
-   **Intelligent AI Assistants**: Leverage AI to support and accelerate strategic decision-making.
-   **Proactive Performance Alerts**: Receive automatic notifications about performance deviations before they become critical issues.
-   **Automated Meeting Analysis**: Automatically extract key insights and action items from meeting reports.
-   **Secure & Scalable**: Built on the robust and globally distributed Cloudflare network.
-   **Multi-language Support**: Available in French, Portuguese, Spanish, and English with auto-detection.

## Technology Stack

This project is built with a modern, high-performance technology stack:

-   **Frontend**:
    -   [React](https://reactjs.org/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Vite](https://vitejs.dev/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    -   [Recharts](https://recharts.org/) for data visualization
    -   [Framer Motion](https://www.framer.com/motion/) for animations
-   **Backend**:
    -   [Hono](https://hono.dev/) running on Cloudflare Workers
-   **Storage**:
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for stateful coordination
-   **Deployment**:
    -   [Cloudflare Pages](https://pages.cloudflare.com/) & [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/claritydash.git
    cd claritydash
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file by copying the example file. This step is crucial for connecting to services like Supabase, Stripe, and AI APIs in later phases.
    ```sh
    cp .env.example .env
    ```
    Fill in the required variables in your new `.env` file.

## Usage

To run the application in development mode, which includes both the Vite frontend and the Hono backend worker, use the following command:

```sh
bun dev
```

This will start the development server, typically on `http://localhost:3000`. The frontend will be available in your browser, and API requests will be proxied to your local worker instance.

## Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Build the project:**
    The `deploy` script in `package.json` handles building the Vite frontend and the worker.

2.  **Deploy to Cloudflare:**
    Run the deploy command to publish your application.
    ```sh
    bun deploy
    ```
    Wrangler will guide you through the authentication and deployment process.

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]

## Project Structure

The codebase is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers. This is where all API logic and Durable Object interactions are defined.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and the backend to ensure type safety across the full stack.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.