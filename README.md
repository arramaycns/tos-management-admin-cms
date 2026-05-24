LPMS: TOS Composition & Admin CMS
📌 Project Description
A core sub-module of the Learning Plan Management System (LPMS) for the University of Nueva Caceres (UNC). This system transforms the manual preparation of Tables of Specifications (TOS) into a structured, automated digital workflow. It consists of two synergistic components:

Admin CMS: A centralized control center for managing academic periods, course catalogs, and faculty assignments.

TOS Composition Module: An intelligent workspace for instructors to map assessment items to Course Outcomes (COs) and Intended Learning Outcomes (ILOs) with automated mathematical calculations.

🛠 Tech Stack
Frontend
Framework: React.js (via Vite)

State Management: Client-side state handling

Styling: CSS3 / Sass

HTTP Client: Axios (for REST API communication)

Backend & Database
Runtime: Node.js

Server Framework: Express.js

Database: MySQL 8.0

ORM: Sequelize (Object-Relational Mapper)

Tooling: Docker & Adminer (Containerization and DB management)

Design & Productivity
Design: Figma

IDE: Webstorm / VS Code

Version Control: GitHub

Key Features
1. Admin Content Management
Academic Periods: Manage and activate specific terms (e.g., 2024–2025 Midterms).

Course Catalog: Maintain a searchable database of all university courses.

CO/ILO Templates: Encode and map curriculum standards (Outcomes) to courses.

Course Assignments: Link instructors to specific course offerings per period.

2. Instructor TOS Workspace
Outcome Overview: Auto-populated, read-only view of approved COs and ILOs.

Item Mapping: Dynamic interface to add questions, tag cognitive levels (Bloom’s Taxonomy), and assign points.

Automated Calculations: Real-time computation of percentage weights and point distributions.

TOS Preview: Formatted, read-only validation view before final submission.

Installation Guide
1. Clone the Repository
Bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
2. Environment Setup
The project uses Docker for consistent environment management.

Bash
# Start the backend and database (MySQL + Adminer)
docker-compose up -d
3. Frontend Installation
Bash
# Navigate to frontend folder, install, and run
npm install
npm run dev
Access the UI at http://localhost:5173

API & Communication
The system utilizes a RESTful API architecture:

Protocol: HTTP/HTTPS

Data Format: JSON

Auth: Token-based authentication per request.

Endpoints: Resource-based structure (e.g., /api/tos, /api/courses).
