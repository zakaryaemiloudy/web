# 🏥 Blood Bank Management System

A comprehensive blood bank management platform that connects patients, hospitals, donors, and administrators to streamline blood donation and distribution processes.

## 🩸 About This Application

The Blood Bank Management System is a full-stack web application designed to:
- **Manage blood donations** and inventory across multiple hospitals
- **Connect patients** with blood banks for urgent needs
- **Coordinate blood requests** between patients and hospitals
- **Track donor information** and donation history
- **Provide real-time analytics** and reporting for administrators
- **Offer AI-powered assistance** through an intelligent chatbot

## 🎯 Key Features

### 👤 Patient Portal
- **Blood Request Management**: Submit and track blood donation requests
- **Hospital Selection**: Choose from registered hospitals
- **Request Status Tracking**: Monitor request progress in real-time
- **Emergency Requests**: Priority handling for urgent medical needs
- **Donation History**: View past requests and outcomes

### 🏥 Hospital Management
- **Demand Processing**: Review and approve/reject blood requests
- **Stock Management**: Monitor blood inventory levels by type
- **Critical Alerts**: Get notified when blood stocks are low
- **Profile Management**: Update hospital information and contact details
- **Request Analytics**: Track request patterns and blood type distribution

### 🩸 Donor System
- **Donor Registration**: Complete donor profile creation
- **Eligibility Verification**: Automated screening based on medical criteria
- **Donation History**: Track all donations and impact
- **Appointment Scheduling**: Book donation slots at preferred locations
- **Impact Tracking**: See how donations have helped patients

### 📊 Admin Dashboard
- **System Analytics**: Comprehensive statistics and insights
- **User Management**: Manage all user roles and permissions
- **Hospital Oversight**: Monitor all registered hospitals
- **Campaign Management**: Create and manage donation campaigns
- **Emergency Coordination**: Handle critical blood shortage situations

### 🤖 AI Chatbot Assistant
- **24/7 Support**: Intelligent assistant for common questions
- **Blood Type Information**: Educational content about blood types and compatibility
- **Donation Guidance**: Step-by-step donation process assistance
- **Emergency Information**: Critical contacts and procedures
- **Multi-language Support**: Accessible in multiple languages

## 🏗️ System Architecture

### Frontend (Angular 17+)
- **Framework**: Angular 17 with standalone components
- **UI Library**: Tailwind CSS with Material Design icons
- **State Management**: Angular signals for reactive state
- **Routing**: Role-based access control with guards
- **Forms**: Reactive forms with comprehensive validation
- **HTTP Client**: RESTful API integration

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Java 17
- **Database**: MySQL with JPA/Hibernate ORM
- **Security**: Spring Security with JWT authentication
- **API Documentation**: OpenAPI/Swagger integration
- **Validation**: Comprehensive input validation and error handling

### Database Schema
- **Users**: Patient, donor, hospital, and admin accounts
- **Blood Requests**: Patient blood demand tracking
- **Donations**: Donor blood donation records
- **Inventory**: Hospital blood stock management
- **Hospitals**: Registered medical facilities
- **Campaigns**: Blood donation campaigns and events

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Java** 17+ and Maven
- **MySQL** 8.0+
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd blood-bank-system
```

#### 2. Backend Setup (Spring Boot)
```bash
cd Bks

# Configure Database
# Update src/main/resources/application.properties with your MySQL credentials
spring.datasource.url=jdbc:mysql://localhost:3306/blood_bank
spring.datasource.username=your_username
spring.datasource.password=your_password

# Install Dependencies and Run
mvn clean install
mvn spring-boot:run
```

The backend will be available at: `http://localhost:8080`

#### 3. Frontend Setup (Angular)
```bash
cd blood-bank-frontend

# Install Dependencies
npm install

# Start Development Server
npm start
```

The frontend will be available at: `http://localhost:4200`

#### 4. Database Setup
```sql
# Create MySQL Database
CREATE DATABASE blood_bank;

# Run Migration Scripts (if available)
# Located in: Bks/src/main/resources/db/migration/
```

## 📱 Access Points

### Application URLs
- **Frontend Application**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/swagger-ui.html

### Default Login Credentials
```
Admin User:
- Email: admin@bloodbank.com
- Password: admin123

Hospital User:
- Email: hospital@bloodbank.com  
- Password: hospital123

Patient User:
- Email: patient@bloodbank.com
- Password: patient123
```

## 🎮 How to Use the Application

### For Patients
1. **Register/Login**: Create an account or log in
2. **Submit Request**: Navigate to "Demandes" → "Nouvelle demande"
3. **Fill Form**: Complete blood request details
4. **Select Hospital**: Choose preferred hospital from dropdown
5. **Track Status**: Monitor request progress in dashboard

### For Hospital Staff
1. **Login**: Access hospital portal with credentials
2. **View Requests**: Navigate to "Demandes de sang"
3. **Process Requests**: Review, approve, or reject requests
4. **Manage Stocks**: Check inventory levels in "Stocks"
5. **Update Profile**: Edit hospital information in "Profil"

### For Administrators
1. **Dashboard Access**: View system overview and statistics
2. **User Management**: Manage all user accounts and roles
3. **Hospital Oversight**: Monitor hospital activities
4. **Campaign Creation**: Launch donation campaigns
5. **Emergency Response**: Handle critical situations

### AI Chatbot Usage
1. **Access**: Click chatbot icon or navigate to `/chatbot`
2. **Ask Questions**: Type queries about blood donation, hospitals, etc.
3. **Quick Actions**: Use pre-defined buttons for common questions
4. **Get Help**: Receive instant assistance 24/7

## 🔧 Development Guide

### Project Structure
```
blood-bank-system/
├── Bks/                          # Spring Boot Backend
│   ├── src/main/java/com/bks/    # Java source code
│   ├── src/main/resources/       # Configuration files
│   └── pom.xml                   # Maven dependencies
├── blood-bank-frontend/          # Angular Frontend
│   ├── src/app/                  # Angular application code
│   ├── src/assets/               # Static assets
│   ├── package.json              # Node dependencies
│   └── angular.json              # Angular configuration
├── .gitignore                    # Git ignore file
└── README.md                     # This documentation
```

### Frontend Development
```bash
# Install new dependencies
npm install <package-name>

# Run tests
ng test

# Build for production
ng build

# Generate new component
ng generate component component-name
```

### Backend Development
```bash
# Compile and run tests
mvn test

# Package application
mvn package

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### API Endpoints
- **Authentication**: `/api/auth/*`
- **Patient Operations**: `/api/patient/*`
- **Hospital Operations**: `/api/hospital/*`
- **Admin Operations**: `/api/admin/*`
- **Blood Requests**: `/api/demandes/*`
- **Donations**: `/api/dons/*`

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Different permissions for each user type
- **Password Encryption**: Bcrypt hashing for password security
- **Session Management**: Secure session handling

### Data Protection
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output encoding and CSP headers
- **CORS Configuration**: Proper cross-origin resource sharing

## 📊 System Features Overview

### Blood Type Compatibility
- **Universal Donors**: O- (can donate to all types)
- **Universal Recipients**: AB+ (can receive from all types)
- **Type Matching**: Automatic compatibility checking
- **Emergency Protocols**: Special handling for critical situations

### Request Workflow
1. **Patient Submission** → **Hospital Review** → **Status Update** → **Donor Notification** → **Fulfillment**
2. **Real-time Updates**: Status changes communicated instantly
3. **Priority Handling**: Emergency requests processed first
4. **Quality Control**: All requests validated before processing

### Inventory Management
- **Real-time Tracking**: Live stock level monitoring
- **Critical Alerts**: Automatic notifications for low stock
- **Expiration Tracking**: Monitor blood product expiry dates
- **Distribution Planning**: Optimize blood allocation

## 🤝 Contributing Guidelines

### Code Standards
- **Frontend**: Follow Angular style guide and TypeScript best practices
- **Backend**: Follow Java coding conventions and Spring Boot patterns
- **Documentation**: Update README and code comments for new features
- **Testing**: Write unit tests for all new functionality

### Git Workflow
1. **Create Feature Branch**: `git checkout -b feature/feature-name`
2. **Make Changes**: Implement your feature with proper testing
3. **Commit Changes**: `git commit -m "feat: add new feature"`
4. **Push Branch**: `git push origin feature/feature-name`
5. **Create Pull Request**: Submit for code review

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
- **Database Connection**: Verify MySQL credentials and database exists
- **Port Conflicts**: Ensure port 8080 is available
- **Java Version**: Confirm Java 17+ is installed

#### Frontend Issues
- **Node Version**: Ensure Node.js 18+ is installed
- **Port Conflicts**: Check if port 4200 is available
- **Dependency Issues**: Run `npm install` to refresh dependencies

#### Database Issues
- **Migration Failures**: Check SQL syntax and permissions
- **Connection Timeouts**: Verify database server is running
- **Permission Errors**: Ensure database user has proper privileges

### Getting Help
1. **Check Logs**: Review application logs for error details
2. **Documentation**: Refer to API documentation at `/swagger-ui.html`
3. **Community**: Post issues in project repository discussions
4. **Support**: Contact development team for critical issues

## 📈 Future Enhancements

### Planned Features
- **Mobile Application**: Native iOS and Android apps
- **Blood Bank Locator**: GPS-based nearby blood bank finder
- **Donor Matching**: AI-powered donor-patient matching system
- **Real-time Notifications**: SMS and email alerts
- **Blockchain Integration**: Enhanced security and transparency
- **Machine Learning**: Predictive analytics for demand forecasting

### Technical Improvements
- **Microservices Architecture**: Split into smaller, focused services
- **Docker Containerization**: Simplified deployment and scaling
- **Cloud Integration**: AWS/Azure deployment options
- **Performance Optimization**: Caching and database optimization
- **Advanced Analytics**: Business intelligence and reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Development Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Backend Developer Name]
- **Frontend Developer**: [Frontend Developer Name]
- **UI/UX Designer**: [Designer Name]
- **Database Administrator**: [DBA Name]

## 📞 Contact & Support

- **Email**: support@bloodbank.com
- **Documentation**: [Documentation Link]
- **Issue Tracker**: [GitHub Issues Link]
- **Community Forum**: [Forum Link]

---

**Thank you for using the Blood Bank Management System! Together, we're saving lives through technology and innovation.** 🩸❤️
