# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Neon Tech PostgreSQL account and credentials

## Setup Instructions

### 1. Environment Configuration
The `.env` file in the root directory contains all necessary environment variables for deployment.

**Update the following values with your Neon Tech credentials:**

```env
# Get these from your Neon Tech dashboard
SPRING_DATASOURCE_URL=postgresql://your_user:your_password@your-endpoint.neon.tech:5432/your_db?sslmode=require
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### 2. Build and Run with Docker

#### Option A: Using Docker Compose (Recommended for local development)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Option B: Using Docker directly with Neon Tech (Production)
```bash
# Build the Docker image
docker build -f backend/Dockerfile -t cdw-backend:latest .

# Run the container with environment variables
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="postgresql://user:password@host:5432/db?sslmode=require" \
  -e SPRING_DATASOURCE_USERNAME="your_user" \
  -e SPRING_DATASOURCE_PASSWORD="your_password" \
  --name cdw-backend \
  cdw-backend:latest
```

### 3. Connect to Neon Tech PostgreSQL

1. Go to [Neon Tech Console](https://console.neon.tech/)
2. Create a new database or use existing one
3. Copy the connection string from the "Connection" button
4. Update the `.env` file with your credentials

**Connection String Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### 4. Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `neon_user` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Your secure password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL strategy | `update` or `validate` |
| `VNPAY_PAYURL` | VNPay payment URL | Provided by VNPay |
| `VNPAY_TMNCODE` | VNPay merchant code | Your merchant code |
| `VNPAY_HASHSECRET` | VNPay secret key | Your secret key |

### 5. Verify Deployment

```bash
# Check if backend is running
curl http://localhost:8080/health

# Check logs
docker-compose logs backend
```

### 6. Important Notes for Production

- **Change JWT_SECRET**: Update `JWT_SECRET` in `.env` with a strong, unique key
- **Use HTTPS**: Update `VNPAY_RETURNURL` to use HTTPS
- **Database Backups**: Enable automatic backups in Neon Tech settings
- **SSL/TLS**: Neon Tech uses SSL by default (`sslmode=require`)
- **Environment Variables**: Never commit `.env` to version control (it's in `.gitignore`)

### 7. Troubleshooting

**Connection refused error:**
- Check if `SPRING_DATASOURCE_URL` is correct
- Verify Neon Tech database is running
- Check firewall/network settings

**SSL error:**
- Ensure `sslmode=require` is in the connection string
- Neon Tech requires SSL connections

**Port already in use:**
```bash
# Change port in docker-compose.yml or use different port
docker run -d -p 9080:8080 cdw-backend:latest
```

## Additional Resources

- [Neon Tech Documentation](https://neon.tech/docs)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
