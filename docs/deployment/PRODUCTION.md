# Dia TTS Production Deployment Guide

This guide covers deploying the Dia TTS service in a production environment with proper monitoring, security, and reliability features.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- NVIDIA Container Toolkit (for GPU deployment)
- At least 8GB RAM (16GB recommended)
- GPU with 8GB+ VRAM (for GPU deployment)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd dia-tts
cp env.example .env
# Edit .env with your configuration
```

### 2. Deploy with Docker Compose

```bash
# GPU deployment (recommended)
docker-compose up -d

# CPU-only deployment
docker-compose -f docker-compose.yml up -d dia-tts-cpu
```

### 3. Verify Deployment

```bash
# Check health
curl http://localhost:8000/api/v1/health

# Check readiness
curl http://localhost:8000/api/v1/ready

# View logs
docker logs -f dia-tts
```

## 📋 Production Features

### ✅ Implemented Features

- **FastAPI-based REST API** with automatic OpenAPI documentation
- **Comprehensive error handling** with proper HTTP status codes
- **Structured logging** with JSON format for log aggregation
- **Health checks** (liveness, readiness, and detailed health)
- **Prometheus metrics** for monitoring and alerting
- **Rate limiting** to prevent abuse
- **Input validation** with detailed error messages
- **CORS configuration** for web integration
- **File upload validation** for voice cloning
- **Multi-stage Docker builds** for optimized images
- **Security scanning** with safety and bandit
- **Comprehensive test suite** with pytest
- **Environment-based configuration** management
- **Graceful shutdown** and resource cleanup

### 🔧 Configuration

All configuration is managed through environment variables. See `env.example` for all available options.

#### Key Production Settings

```bash
# Environment
ENVIRONMENT=production
DEBUG=false

# Security
SECRET_KEY=your-secure-secret-key
RATE_LIMIT_PER_MINUTE=10

# Model
MODEL_DEVICE=cuda  # or 'cpu'
MODEL_DTYPE=float16  # or 'float32' for CPU

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_FILE=/app/logs/dia-tts.log

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

## 🐳 Docker Deployment

### GPU Deployment

```bash
# Build image
docker build -f dia/docker/Dockerfile.gpu -t dia-tts:gpu .

# Run container
docker run -d \
  --name dia-tts \
  --gpus all \
  -p 8000:8000 \
  -p 9090:9090 \
  -e ENVIRONMENT=production \
  -e MODEL_DEVICE=cuda \
  -e LOG_LEVEL=INFO \
  -v $(pwd)/logs:/app/logs \
  dia-tts:gpu
```

### CPU Deployment

```bash
# Build image
docker build -f dia/docker/Dockerfile.cpu -t dia-tts:cpu .

# Run container
docker run -d \
  --name dia-tts-cpu \
  -p 8000:8000 \
  -p 9090:9090 \
  -e ENVIRONMENT=production \
  -e MODEL_DEVICE=cpu \
  -e LOG_LEVEL=INFO \
  -v $(pwd)/logs:/app/logs \
  dia-tts:cpu
```

## 📊 Monitoring and Observability

### Health Endpoints

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/ready` - Readiness check (includes model health)
- `GET /api/v1/live` - Liveness check

### Metrics

- `GET /metrics` - Prometheus metrics endpoint
- Request count and duration
- Model loading time
- Generation duration
- Error rates

### Logging

Structured JSON logs with correlation IDs for easy aggregation and analysis.

## 🔒 Security Features

- **Input validation** for all text and file inputs
- **Rate limiting** per IP address
- **File upload validation** with size and format checks
- **CORS configuration** for cross-origin requests
- **Security headers** and proper error handling
- **Non-root container execution**

## 🧪 Testing

### Run Tests

```bash
# Install test dependencies
pip install -r requirements-dev.txt

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=dia --cov-report=html

# Run security scan
safety check --file requirements-prod.txt
bandit -r dia/
```

### Test Coverage

- Unit tests for core functions
- Integration tests for API endpoints
- Error scenario testing
- Input validation testing
- Model service testing

## 🚀 Deployment Scripts

### Automated Deployment

```bash
# Deploy to production with GPU
./scripts/deploy.sh production gpu

# Deploy to staging with CPU
./scripts/deploy.sh staging cpu
```

The deployment script includes:
- Prerequisites checking
- Security scanning
- Test execution
- Docker image building
- Container deployment
- Health verification

## 📈 Performance Optimization

### GPU Optimization

- Uses `float16` precision for faster inference
- CUDA optimizations enabled
- Model warmup on startup
- Efficient memory management

### CPU Optimization

- Uses `float32` precision for stability
- Optimized for CPU inference
- Memory-efficient processing

### Production Recommendations

1. **Use GPU deployment** for better performance
2. **Set appropriate resource limits** in Docker
3. **Enable monitoring** with Prometheus/Grafana
4. **Configure log aggregation** (ELK stack, etc.)
5. **Set up alerting** for health check failures
6. **Use a reverse proxy** (nginx) for SSL termination
7. **Implement proper backup** strategies

## 🔧 Troubleshooting

### Common Issues

1. **Model loading fails**
   - Check GPU availability and CUDA installation
   - Verify model download permissions
   - Check available disk space

2. **Out of memory errors**
   - Reduce `MAX_TOKENS` parameter
   - Use CPU deployment if GPU memory is insufficient
   - Increase system memory

3. **Slow generation**
   - Use GPU deployment
   - Enable `torch.compile` for faster inference
   - Optimize model parameters

4. **Health check failures**
   - Check model loading status
   - Verify all dependencies are installed
   - Check container logs

### Debug Mode

```bash
# Enable debug logging
docker run -e DEBUG=true -e LOG_LEVEL=DEBUG dia-tts:latest
```

## 📚 API Documentation

Once deployed, visit:
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health
- **Metrics**: http://localhost:9090/metrics

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Run security scans
5. Ensure all tests pass

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## ⚠️ Disclaimer

This is a production-ready deployment of the Dia TTS model. Please ensure you have proper licensing and comply with all applicable laws and regulations when using this service.
