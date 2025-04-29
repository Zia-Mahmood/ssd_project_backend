# SSD Project Backend

## Overview
This repository contains the backend implementation for the SSD project. The backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database. It serves as the backbone for managing chat conversations, report requests, and user interactions with meta-models.

The backend provides RESTful APIs that integrate seamlessly with the [frontend application](https://github.com/Zia-Mahmood/SSD_Project_Frontend). It ensures efficient communication, data persistence, and validation for the entire application workflow.

---

## Features
- **Chat Management:**
  - Store user conversations with structured metadata.
  - Retrieve chat history for specific users.
- **Report Requests:**
  - Manage report requests associated with conversations.
  - Update the status of report requests (Accept, Reject, Resubmit).
  - Append comments and summaries.
- **Database Schema Design:**
  - `ChatLog` Schema for storing conversation details.
  - `ReportRequest` Schema for managing reports linked to conversations.
- **Integration with Frontend:**
  - Provides APIs to fetch, update, and create data utilized by the frontend.

---

## How the Backend Works
### 1. Schemas
- **ChatLog Schema:**
  - Manages conversation details, including user email, log name, and chat history.
  - Ensures unique identification of chats via a compound index.
- **ReportRequest Schema:**
  - Links report requests to specific conversations using `conversationHistory` (foreign key reference to `ChatLog`).
  - Stores status (`pending`, `accepted`, etc.), comments, and summaries.

### 2. Key Functionalities
#### Chat Management
- **API Endpoint:** `GET /api/chatlogs/prevChats`
  - Fetches all chats for a specific user.
  - Checks if each chat is linked to a report request and appends corresponding status, summary, and comments.
  - Default values are added for chats not linked to report requests.

#### Report Request Management
- **Accept Report:**
  - **Endpoint:** `PUT /api/reports/accept/:id`
  - Updates the `status` of a report request to `Accepted`.

- **Reject Report:**
  - **Endpoint:** `PUT /api/reports/reject/:id`
  - Updates the `status` of a report request to `Rejected`.

- **Send Reply:**
  - **Endpoint:** `PUT /api/reports/sendReply/:id`
  - Updates the `status` of a report request to `Resubmit` and appends a comment to the `comments` array.

#### Middleware & Error Handling
- Validates incoming requests and parameters.
- Provides detailed error messages with appropriate HTTP status codes.

### 3. Hosting
The backend can be hosted using services like **Heroku**, **Render**, or **AWS**. Ensure environment variables (API keys and MongoDB connection string) are correctly configured.

---

## How to Run the Backend Locally
### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.
- [MongoDB](https://www.mongodb.com/) database (local or cloud-based).

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Zia-Mahmood/ssd_project_backend.git
   cd ssd_project_backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Setup Environment Variables:**
   - Create a `.env` file in the root directory.
   - Download the `config.env` file from this [Google Drive link](https://drive.google.com/file/d/17T3F9tEZxLcUUU_l7od3txiAoNuu-AAH/view?usp=sharing).
   - Add the following variables:
     ```env
     PORT=6001
     MONGO_URI=your_mongodb_connection_string
     API_KEY=your_api_key
     ```

4. **Start the Server:**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:6001`.

5. **Test the APIs:**
   Use tools like **Postman** or **cURL** to test the API endpoints.

---

## Integration with Frontend
The backend is integrated with the frontend hosted on **Netlify**. The frontend repository can be found [here](https://github.com/Zia-Mahmood/SSD_Project_Frontend).

For now, the dummy hosted URL for the frontend is:
[https://dummy-netlify-link.com](https://dummy-netlify-link.com)

---

## Demo Video
- A demo video explaining the functionality of the backend and its integration with the frontend can be added for future users. Upload the video to a platform like **Google Drive** or **YouTube** and provide the link here.
- **Link for Demo Video:**
  [https://drive.google.com/file/d/17QnG2BscQNpWWOzM0lhbtEV8y7t4x46V/view?usp=sharing](https://drive.google.com/file/d/17QnG2BscQNpWWOzM0lhbtEV8y7t4x46V/view?usp=sharing)

---

## Disclaimer
The API keys provided in the `config.env` file are intended for demonstration purposes only. These keys might expire or become invalid in the future. Please replace them with your own keys for production use.

---

## Contributions
Feel free to fork this repository and raise pull requests for any enhancements or bug fixes.

---

