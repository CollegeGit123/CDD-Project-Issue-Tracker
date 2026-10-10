# Cloud-Native Issue Tracking and Automated DevSecOps Deployment Platform

A containerized issue tracking application deployed on AWS using an automated DevSecOps pipeline. The project combines a full-stack web application with automated testing, security scanning, container image publishing, cloud deployment, and infrastructure monitoring.

## Project Overview

The platform allows users to create projects, collaborate through role-based access control, create tickets, and track issue statuses. The application is containerized using Docker and deployed on AWS EC2.

A GitHub Actions pipeline automates code quality checks, testing, security scanning, Docker image publishing, and deployment.

## Key Features

- User registration and JWT-based authentication
- Project creation and collaboration
- Role-based access control for owners, developers, and viewers
- Ticket creation and status management
- PostgreSQL database with Alembic migrations
- Docker-based application deployment
- Nginx reverse proxy
- Automated CI/CD using GitHub Actions
- Container vulnerability scanning
- AWS deployment using ECR and Systems Manager
- CloudWatch monitoring and CPU alarms

## Technology Stack

### Frontend
- React
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- asyncpg
- Alembic
- JWT authentication

### Database
- PostgreSQL

### DevOps and Cloud
- Docker
- Docker Compose
- Nginx
- GitHub Actions
- AWS EC2
- Amazon ECR
- AWS Systems Manager
- AWS IAM OIDC
- Terraform
- Checkov
- Trivy
- CloudWatch
- CloudTrail

## System Architecture

The application uses a React frontend communicating with a FastAPI backend through an Nginx reverse proxy. The backend interacts with PostgreSQL for persistent data storage.

GitHub Actions automates code validation, testing, security scanning, container image publishing, and deployment to AWS EC2.

## Project Structure

```text
CDD-Project-Issue-Tracker/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker/
│   └── nginx.conf
├── frontend/
│   ├── src/
│   ├── package.json
│   └── frontend.Dockerfile
├── migrations/
│   └── versions/
├── src/
│   └── app/
│       ├── models/
│       ├── routers/
│       ├── schemas/
│       ├── auth.py
│       └── main.py
├── tests/
├── terraform/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
├── pyproject.toml
├── requirements.txt
└── README.md

## Prerequisites

Ensure the following tools are installed:

- Python
- Node.js and npm
- Docker and Docker Compose
- Git

## Local Setup

### Prerequisites

- Git
- Python 3.11 or compatible version
- Node.js and npm
- Docker Desktop with Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/CollegeGit123/CDD-Project-Issue-Tracker.git
cd CDD-Project-Issue-Tracker
```

### 2. Start the Application

From the project root, run:

```bash
docker compose up --build -d
```

This builds the application images and starts PostgreSQL, the FastAPI backend, the React frontend, and Nginx.

### 3. Access the Application

Open the following URLs in your browser:

- **Application:** http://localhost
- **API Documentation:** http://localhost/docs
- **Health Check:** http://localhost/health

### 4. Check Container Status

```bash
docker compose ps
```

### 5. View Application Logs

```bash
docker compose logs -f
```

Press `Ctrl + C` to stop following the logs.

### 6. Stop the Application

```bash
docker compose down
```

This stops and removes the containers while preserving the database volume.

To remove the database volume and its stored data as well:

```bash
docker compose down -v
```

**Warning:** The `-v` option permanently removes the Compose-managed database volume and its data.

## Backend Development

### Create a Virtual Environment

On Windows PowerShell:

```powershell
python -m venv CDDvenv
.\CDDvenv\Scripts\Activate.ps1
```

### Install Dependencies

```powershell
pip install -r requirements.txt
```

### Apply Database Migrations

Configure `DATABASE_URL` to point to a running PostgreSQL database, then execute:

```powershell
alembic upgrade head
```

### Run the Backend

```powershell
uvicorn app.main:app --reload --app-dir src
```

### Run Tests

```powershell
pytest
```

### Run Code Quality Checks

```powershell
ruff check .
```

## Backend Development

### Create a Virtual Environment

On Windows PowerShell:

```powershell
python -m venv CDDvenv
.\CDDvenv\Scripts\Activate.ps1
```

### Install Dependencies

```powershell
pip install -r requirements.txt
```

### Run Database Migrations

Ensure PostgreSQL is running and the `DATABASE_URL` environment variable points to the correct database.

Apply migrations:

```powershell
alembic upgrade head
```

### Run the Backend

```powershell
uvicorn app.main:app --reload --app-dir src
```

### Run Tests

```powershell
pytest
```

### Run Ruff

```powershell
ruff check .
```

## Environment Variables

The backend uses environment variables to configure database connectivity and authentication.

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://user:password@localhost:5432/database` |
| `SECRET_KEY` | Secret key used for authentication token security | Set a strong, private value |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration duration, if configured | Refer to the application configuration |

### Docker Configuration

The provided `docker-compose.yml` defines the following development settings:

- **Database:** PostgreSQL 16
- **Database name:** `cdd_tracker`
- **Database user:** `cdd_user`
- **Database port:** `5433` on the host
- **Backend port:** `8000` internally
- **Frontend port:** `80` internally
- **Application access:** Port `80` through Nginx

The Compose configuration uses development credentials. Replace them with secure values before deploying to a production environment.

**Security:** Never commit production credentials, JWT secrets, AWS access keys, or private configuration files to GitHub.

## Features

### Authentication
- User registration and login.
- JWT-based authentication for protected API endpoints.

### Project Management
- Create and view projects.
- Project owners can manage project membership.
- Add existing registered users to projects using their usernames.

### Role-Based Access Control

| Role | Permissions |
|---|---|
| Owner | Manage project membership and perform project operations |
| Developer | View projects, create tickets, and update ticket statuses |
| Viewer | Read-only project and ticket access |

### Ticket Management
- Create tickets within projects.
- View tickets belonging to accessible projects.
- Update ticket status.
- Supported statuses: `open`, `in_progress`, and `closed`.

### Database Management
- PostgreSQL for persistent storage.
- SQLAlchemy for database access.
- Alembic for database schema migrations.

### Containerization
- Docker containers for the application services.
- Docker Compose for service orchestration.
- Nginx reverse proxy for frontend and API routing.

### Automated DevSecOps Pipeline
- Python linting with Ruff.
- Automated tests with Pytest.
- Infrastructure security scanning with Checkov.
- Container vulnerability scanning with Trivy.
- Docker image publishing to Amazon ECR.
- Automated deployment to Amazon EC2 through AWS Systems Manager.

### Cloud Monitoring
- CloudWatch CPU utilization alarm.
- CloudWatch memory and disk usage metrics.
- CloudTrail management-event history.

## Testing and Verification

The project uses automated testing and security checks to validate application quality before deployment.

### Automated Testing

- **Pytest:** Runs backend tests.
- **PostgreSQL:** Provides the database service for integration tests.
- **Ruff:** Checks Python code for linting issues.

Run the tests locally:

```bash
pytest
```

Run linting:

```bash
ruff check .
```

### Security Scanning

- **Checkov:** Scans Terraform configuration for infrastructure security issues.
- **Trivy:** Scans container images for vulnerabilities.

### Deployment Verification

After deployment, verify that:

- The application loads through the Nginx reverse proxy.
- Authentication works.
- Project membership permissions are enforced.
- Tickets can be created and their statuses updated.
- The backend health endpoint reports a healthy database connection.
- The GitHub Actions workflow completes successfully.

## Security

- JWT-based authentication
- Server-side role and permission checks
- Ruff code-quality checks
- Pytest automated testing
- Checkov infrastructure security scanning
- Trivy container vulnerability scanning
- AWS IAM OIDC authentication for GitHub Actions
- AWS Systems Manager for deployment without requiring SSH-based deployment automation

## Monitoring

Amazon CloudWatch collects EC2 CPU utilization, memory usage, and disk usage metrics. A CloudWatch alarm monitors sustained high CPU utilization.

CloudTrail event history supports auditing of AWS management events.

## Docker Deployment

The application uses Docker to containerize its services and Docker Compose to manage the application stack.

### Build and Start the Services

From the project root, run:

```bash
docker compose up --build -d
```

### Check Running Containers

```bash
docker compose ps
```

### View Application Logs

```bash
docker compose logs -f
```

### Stop the Services

```bash
docker compose down
```

### Architecture

The containerized deployment consists of:

- **Frontend:** React application served through Nginx.
- **Backend:** FastAPI application providing REST APIs.
- **Database:** PostgreSQL for persistent storage.
- **Reverse Proxy:** Nginx routes frontend requests and API traffic to the appropriate services.

Docker Compose manages the services and their communication.

> **Note:** These commands assume the Compose configuration in the repository supports the corresponding services and build settings.

## CI/CD Pipeline

The project uses GitHub Actions to automate code validation, testing, security scanning, container image publishing, and deployment.

### Pipeline Stages

1. **Code Quality:** Ruff checks Python code for linting issues.
2. **Automated Testing:** Pytest executes backend tests using PostgreSQL.
3. **Infrastructure Security:** Checkov scans Terraform configuration for security issues.
4. **Container Build and Security:** Docker images are built for the frontend and backend, then scanned using Trivy for high and critical vulnerabilities.
5. **Image Publishing:** Successfully validated images are pushed to Amazon Elastic Container Registry (ECR).
6. **Automated Deployment:** GitHub Actions initiates deployment to the EC2 instance through AWS Systems Manager (SSM).

### Pipeline Workflow

```text
Code Push to GitHub
        |
        v
   Ruff Linting
        |
        v
  Pytest + PostgreSQL
        |
        v
 Terraform Security Scan
        |
        v
 Docker Build + Trivy Scan
        |
        v
   Publish Images to ECR
        |
        v
 Deploy to EC2 through SSM
        |
        v
 Application Health Check
```

### Deployment Security

- GitHub Actions authenticates with AWS using OpenID Connect (OIDC).
- IAM roles provide controlled access to AWS resources.
- AWS Systems Manager executes deployment commands without requiring SSH-based deployment automation.
- Container images are stored in Amazon ECR.
- Deployment runs only after the preceding pipeline jobs succeed.

### Pipeline Configuration

The workflow is defined in:

`.github/workflows/ci.yml`

The pipeline can be monitored through the **Actions** tab of the GitHub repository.

## AWS Deployment

The application is deployed on Amazon Web Services (AWS) using a containerized architecture.

### AWS Services Used

| Service | Purpose |
|---|---|
| Amazon EC2 | Hosts the application containers |
| Amazon ECR | Stores backend and frontend Docker images |
| AWS Systems Manager (SSM) | Executes deployment commands remotely |
| AWS IAM | Controls permissions for AWS resources |
| GitHub Actions OIDC | Enables secure authentication from GitHub Actions |
| Amazon CloudWatch | Collects system metrics and monitors CPU utilization |
| AWS CloudTrail | Provides management-event history for auditing |
| Terraform | Defines infrastructure as code |

### Deployment Process

1. GitHub Actions validates and tests the application.
2. Docker images are built and scanned.
3. Approved images are published to Amazon ECR.
4. GitHub Actions invokes AWS Systems Manager.
5. The EC2 instance pulls the specified image versions and updates the running services.
6. The deployment script checks application health.

### Monitoring

Amazon CloudWatch is configured to collect:

- EC2 CPU utilization
- Memory usage
- Disk utilization

A CloudWatch alarm monitors sustained high CPU utilization.

CloudTrail event history can be used to review AWS management events.

### Managing Deployment Costs

The EC2 instance can be stopped when the application is not needed and restarted for demonstrations.

Stopping EC2 reduces compute charges, but associated resources such as EBS storage and an allocated public IPv4 address may continue to incur charges.

## API Documentation

The backend is built with FastAPI and provides REST API endpoints for authentication, project management, project membership, and ticket management.

### Interactive API Documentation

When the backend is running, access Swagger UI at:

`http://127.0.0.1:8000/docs`

The OpenAPI schema is available at:

`http://127.0.0.1:8000/openapi.json`

### Main API Operations

| Module | Operations |
|---|---|
| Authentication | User registration and login |
| Projects | Create and list accessible projects |
| Project Membership | Add members, update roles, and remove members |
| Tickets | Create and list tickets |
| Ticket Status | Update ticket status |

Authenticated endpoints use JWT-based authentication.


## Security

The project incorporates security practices across the application and deployment pipeline:

- **JWT Authentication:** Authenticates users accessing protected API endpoints.
- **Role-Based Access Control:** Restricts project and ticket operations according to user permissions.
- **Ruff:** Checks Python code quality.
- **Pytest:** Runs automated tests.
- **Checkov:** Scans Terraform configuration for security issues.
- **Trivy:** Scans container images for vulnerabilities.
- **AWS IAM and OIDC:** Controls access from GitHub Actions to AWS.
- **AWS Systems Manager:** Supports remote deployment without requiring SSH-based deployment automation.

## Known Limitations

- The application currently uses HTTP rather than HTTPS.
- Ticket status changes are manual; automatic updates from external repositories are not implemented.
- Email notifications and SNS alerts are not configured.
- Memory and disk metrics are collected, but dedicated alarms for them have not been configured.

## Live Application

**Application URL:** http://devsecops-issue-tracker.duckdns.org

The application is hosted on AWS EC2. The instance may be stopped when the application is not required, so the website may not always be available.

## Usage

1. Register a user account or log in.
2. Create a project.
3. Add existing registered users as project members.
4. Assign members the developer or viewer role.
5. Create tickets within a project.
6. Update ticket statuses as work progresses.

Project owners manage membership and have access to project operations. Developers can create tickets and update their statuses, while viewers have read-only access.

## Future Enhancements

- HTTPS with TLS certificates
- Email notifications and SNS alerts
- Additional CloudWatch alarms for memory and disk usage
- Integration with external Git repositories and automated issue updates
- Enhanced ticket history and activity tracking

## Conclusion

This project demonstrates the integration of full-stack application development with containerization, automated testing, security scanning, continuous integration, continuous deployment, and cloud infrastructure monitoring.

By combining FastAPI, React, PostgreSQL, Docker, GitHub Actions, and AWS services, the platform provides a practical implementation of a cloud-native application supported by a DevSecOps workflow.

## Author

Developed as an academic project for the Cloud Architecture and DevOps coursework.