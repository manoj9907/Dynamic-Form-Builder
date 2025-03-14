# Dynamic Form Builder and Response Collector
This project is a Dynamic Form Builder and Response Collector built with Node.js, MongoDB, and EJS. It allows Admins to create customizable forms and manage responses, while Users can submit responses securely. The system supports authentication, authorization, and data export.

## Features

- **Form Builder (Admin Only)**
  -Create custom forms with different field types:

Text Input

Dropdown

Radio Buttons

Checkboxes

Date Picker

File Upload

Customize fields with:

Labels

Placeholders

Default values

Required/Optional settings

- Dynamic Form Rendering

Generate unique links for each form.

Users can view and submit responses.

📝 Form Responses (User Side)

Securely collect user responses.

Validate and handle file uploads.

Store responses efficiently in MongoDB.

📊 Response Management (Admin Only)

View all responses for each form.

Export responses as CSV or Excel.

Filter and search responses by date range or specific field values.

🔐 Authentication and Authorization

JWT-based authentication with two roles:

Admin: Create forms, view/export responses.

User: Submit form responses.

🌍 API Endpoints (Postman Collection Available)

User Authentication (Register, Login)

Form Management (Create, Edit, Delete)

Form Response Management (Submit, View, Export)

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Token)

Views: EJS (Embedded JavaScript)

File Uploads: Multer

Export Responses: csv-writer, ExcelJS


## Technology Stack

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user and task data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.




## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manoj9907/Dynamic-Form-Builder.git
   cd task-manager

## API Endpoints
Authentication
POST /api/register

Registers a new user.
Request body:{
    "username":"user",
    "password":"admin@123"
    // "role":"admin"
}

POST /api/login

Logs in a user and returns a JWT token.
Request body: {
    "username":"user",
    "password":"admin@123"
}


## Authors

- [@manojkumar](https://github.com/manoj9907/taskmanager)


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


PORT=3000
MONGO_URI=mongodb+srv://your-db-url
JWT_SECRET=your-secret-key

first step go to http://localhost:3000/api/register
http://localhost:3000/api/login
