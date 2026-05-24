# LPMS: TOS Composition and Admin CMS
Project Description
The Table of Specifications (TOS) Composition Module with Admin Content Management System (CMS) is a core sub-module of the Learning Plan Management System (LPMS) developed for the University of Nueva Caceres (UNC). This system is designed to transform the manual preparation of TOS documents into a structured, automated, and error-free digital workflow.

The system is divided into two primary components:

- The Admin CMS: A centralized control center for managing institutional data, course catalogs, and faculty assignments.

- The TOS Composition Interface: An intelligent workspace for instructors that automates mathematical calculations and ensures alignment with approved curriculum standards.

# Tech Stack
Frontend
- Framework: React.js (built with Vite)
  
- Styling: CSS3 / Sass
  
- HTTP Client: Axios

- State Management: Client-side state handling and routing

Backend and Database
- Runtime: Node.js

- Server Framework: Express.js

- Database: MySQL 8.0

- ORM: Sequelize

- Containerization: Docker and Adminer (for database management)

Design and Tools
- Design: Figma

- Version Control: GitHub

- Development Environment: Webstorm / VS Code

# Key Features
1. Admin Content Management System
  - Academic Periods: Centralized creation and activation of academic years, semesters, and exam types.
  
  - Course Catalog: Maintenance of a searchable and filterable database of university courses.
  
  - CO and ILO Templates: Management of Course Outcomes and Intended Learning Outcomes mapped to specific courses.
  
  - Assignments: Dynamic linking of instructors to specific courses for active academic terms.

2. Instructor TOS Module
  - Automated Data Retrieval: Direct fetching of approved COs and ILOs from the Learning Plan.
  
  - Dynamic Calculations: Real-time computation of percentage weights and point distributions based on target inputs.
  
  - Assessment Mapping: Tools for tagging items with cognitive levels (Bloom’s Taxonomy) and point values.
  
  - Reusability: Features to save drafts and pre-fill data from previous TOS reports.

# Installation Guide
1. Clone the Repository

    Bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
   
2. Environment Setup

    The project uses Docker to manage the database and backend environment.

    Bash
    docker-compose up -d
   
3. Frontend Setup

     Bash
    # Install dependencies
    npm install

    # Start the development server
    npm run dev
    The application will be accessible at http://localhost:5173.

# Interface and Communication

Communication Protocol
- All communication between the React.js frontend and Express.js backend occurs through a RESTful API.

- Data Format: JSON (JavaScript Object Notation).

- Authentication: Token-based authentication required for all data-sensitive requests.

# API Structure
- GET: Resource retrieval (Courses, Outcomes, TOS Status)

- POST: Creation of new records (Assignments, Periods)

- PUT / PATCH: Bulk updates and status changes

- DELETE: Removal of specific assignments or records
