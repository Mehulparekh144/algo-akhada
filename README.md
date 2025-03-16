# AlgoAkhada 🚀

AlgoAkhada is a dynamic platform that connects developers for collaborative problem-solving sessions. Practice coding interviews, learn from peers, and enhance your algorithmic thinking in real-time.

## ✨ Features

- **Peer-to-Peer Sessions**: Connect with fellow developers for collaborative problem-solving
- **Smart Problem Matching**: Get problems tailored to your skill level
- **Real-time Collaboration**: Work together in synchronized coding sessions
- **Progress Tracking**: Monitor your improvement over time
- **Scheduling System**: Book sessions that fit your calendar
- **Instant Feedback**: Get immediate insights after each session

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Docker and Docker Compose (for local development)
- PostgreSQL database (automatically set up with Docker)

### Database Setup

#### Using Docker (Recommended)

1. Start the PostgreSQL container:

```bash
docker-compose up -d
```

This will create a PostgreSQL instance with the following default configuration:

- Host: localhost
- Port: 5432
- Database: algoakhada
- Username: postgres
- Password: password

You can customize these values by setting environment variables before running docker-compose:

```bash
export POSTGRES_USER=myuser
export POSTGRES_PASSWORD=mypassword
export POSTGRES_DB=mydb
docker-compose up -d
```

#### Manual PostgreSQL Setup

If you prefer to use your own PostgreSQL installation:

1. Install PostgreSQL on your system
2. Create a new database
3. Update the DATABASE_URL in your .env file

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/algoakhada.git
cd algoakhada
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Real-time Communication**: Pusher
- **Container**: Docker & Docker Compose

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name](https://github.com/yourusername) - Lead Developer
- [Team Member](https://github.com/teammember) - Frontend Developer
- [Team Member](https://github.com/teammember) - Backend Developer

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape AlgoAkhada
- Special thanks to our early users for their valuable feedback
- Inspired by the coding interview preparation community

## 📞 Contact

Have questions? Reach out to us:

- Email: support@algoakhada.com
- Twitter: [@algoakhada](https://twitter.com/algoakhada)
- Discord: [Join our community](https://discord.gg/algoakhada)

---

<p align="center">Made with ❤️ by the AlgoAkhada Team</p>
