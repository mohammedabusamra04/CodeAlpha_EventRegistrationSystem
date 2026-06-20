<h1>🎪 EventPulse — Premium Event Registration System</h1>

<p>EventPulse is a robust, production-ready Event Registration and Management System. Designed with a secure Node.js & Express REST API backend and a lightweight, dynamic vanilla JavaScript frontend, EventPulse provides organizers and attendees with a seamless workflow for discovering, hosting, reviewing, and registering for premium events.</p>

<hr />

<h2>🔗 Live Demo</h2>

<p>Experience the live application deployed on Render:<br />
👉 <strong><a href="https://codealpha-eventregistrationsystem-1.onrender.com/" target="_blank">EventPulse Live Demo</a></strong></p>

<hr />

<h2>✨ Features</h2>

<h3>👤 User & Organizer Management</h3>
<ul>
  <li><strong>Role-Based Access Control (RBAC):</strong> Distinct permissions for <code>user</code>, <code>organizer</code>, and <code>admin</code> roles.</li>
  <li><strong>Secure Authentication:</strong> JWT-based stateless authentication with password hashing powered by <code>bcrypt</code>.</li>
  <li><strong>Profile Customization:</strong> Support for user avatars, phone numbers, and profile details.</li>
</ul>

<h3>📅 Event Management & Discovery</h3>
<ul>
  <li><strong>Full CRUD Operations:</strong> Organizers can create, edit, publish, and delete events.</li>
  <li><strong>Lifecycle States:</strong> Events transition smoothly through <code>draft</code>, <code>published</code>, <code>cancelled</code>, and <code>completed</code> states.</li>
  <li><strong>Categorization:</strong> Events are grouped dynamically under specific categories (e.g., Tech, Music, Business).</li>
  <li><strong>Capacity Tracking:</strong> Real-time seat availability tracking to prevent overbooking.</li>
</ul>

<h3>🎟️ Registration & Ticketing</h3>
<ul>
  <li><strong>One-Click Registrations:</strong> Attendees can register for events and receive unique ticket codes.</li>
  <li><strong>Status Tracking:</strong> Ticket lifecycle states including <code>pending</code>, <code>confirmed</code>, <code>cancelled</code>, and <code>attended</code>.</li>
  <li><strong>Flexible Payments:</strong> Support for tracking <code>free</code>, <code>paid</code>, and <code>refunded</code> transactions.</li>
</ul>

<h3>💬 Social & Interaction</h3>
<ul>
  <li><strong>Event Reviews & Ratings:</strong> Registered attendees can rate events (1-5 stars) and write comments.</li>
  <li><strong>Notification System:</strong> Instant alerts for registrations, reminders, event cancellations, and reviews.</li>
</ul>

<hr />

<h2>🛠️ Tech Stack</h2>

<h3>Backend</h3>
<ul>
  <li><strong>Runtime Environment:</strong> Node.js (v18+)</li>
  <li><strong>Framework:</strong> Express.js (v5)</li>
  <li><strong>ORM:</strong> Sequelize (v6)</li>
  <li><strong>Database:</strong> PostgreSQL (Production/Config), SQLite (Local/Development testing)</li>
  <li><strong>Security:</strong> Helmet, Express Rate Limit (DDoS mitigation), CORS middleware</li>
</ul>

<h3>Frontend</h3>
<ul>
  <li><strong>Markup & Structure:</strong> Semantic HTML5</li>
  <li><strong>Styling:</strong> Vanilla CSS (Glassmorphism design, responsive layouts)</li>
  <li><strong>Client-side Logic:</strong> Vanilla JavaScript (ES6 Fetch API)</li>
</ul>

<hr />

<h2>📁 Project Structure</h2>

<pre><code>CodeAlpha_EventRegistrationSystem/
├── public/                 # Static assets served by Express
│   ├── css/
│   │   └── style.css       # Core design system & modern UI styling
│   └── js/
│       ├── auth.js         # Authentication helpers
│       ├── dashboard.js    # Attendee & Organizer dashboard actions
│       ├── event-details.js# Single event interactions & reviews
│       ├── events.js       # Event listing and category filtering
│       └── main.js         # Core fetch wrappers & navigation controller
├── src/                    # Backend application source code
│   ├── config/
│   │   ├── database.js     # Sequelize database connection setup
│   │   └── seed.js         # Database seeding script (default categories & test data)
│   ├── controllers/        # Business logic for all modules
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── notificationController.js
│   │   ├── registrationController.js
│   │   └── reviewController.js
│   ├── middleware/         # Custom Express middlewares
│   │   ├── auth.js         # JWT verification & user session payload injector
│   │   └── validation/     # Request body and parameter schema validator
│   │       ├── helpers.js  # Validation utility helpers
│   │       ├── index.js    # Validation middleware initialization
│   │       └── schemas.js  # Joi/custom schemas for API requests
│   ├── models/             # Sequelize database schemas & associations
│   │   ├── index.js
│   │   ├── Category.js
│   │   ├── Event.js
│   │   ├── Notification.js
│   │   ├── Registration.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/             # RESTful API route endpoints
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── notifications.js
│   │   ├── registrations.js
│   │   └── reviews.js
│   ├── app.js              # Express app setup & middleware stacking
│   └── server.js           # Server listener & database synchronization
├── views/                  # Static frontend page templates
│   ├── admin.html          # Organizer/Admin management view
│   ├── dashboard.html      # Attendee personalized space
│   ├── event-details.html  # Event details, reviews, and sign-ups
│   ├── events.html         # Browse & filter published events
│   ├── index.html          # Landing page
│   ├── login.html          # User login
│   └── register.html       # User registration
├── .env.example            # Sample configuration file
├── database.sqlite         # Local development SQLite database
├── package.json            # Scripts & project dependencies
└── test_api.js             # API test automation script
</code></pre>

<hr />

<h2>🚀 Getting Started</h2>

<h3>📋 Prerequisites</h3>
<p>Ensure you have the following installed on your local machine:</p>
<ul>
  <li><strong>Node.js</strong> (v18 or higher)</li>
  <li><strong>npm</strong> (bundled with Node.js)</li>
  <li><strong>PostgreSQL</strong> (or use the SQLite file for quick local testing)</li>
</ul>

<h3>🔧 Installation</h3>

<ol>
  <li>
    <strong>Clone the Repository</strong>
    <pre><code class="language-bash">git clone https://github.com/mohammedabusamra04/CodeAlpha_EventRegistrationSystem.git
cd CodeAlpha_EventRegistrationSystem</code></pre>
  </li>
  <li>
    <strong>Install Dependencies</strong>
    <pre><code class="language-bash">npm install</code></pre>
  </li>
  <li>
    <strong>Configure Environment Variables</strong><br />
    Duplicate <code>.env.example</code> to create a <code>.env</code> file:
    <pre><code class="language-bash">cp .env.example .env</code></pre>
    Open <code>.env</code> and fill in your credentials:
    <pre><code class="language-env">PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=event_registration_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d</code></pre>
  </li>
</ol>

<h3>💻 Running Locally</h3>
<ul>
  <li>
    <strong>Start in Development Mode</strong> (with automatic reload):
    <pre><code class="language-bash">npm run dev</code></pre>
  </li>
  <li>
    <strong>Start in Production Mode</strong>:
    <pre><code class="language-bash">npm start</code></pre>
  </li>
</ul>
<p>Once running, access the landing page at: <code>http://localhost:5000</code></p>

<hr />

<h2>🧪 API Documentation</h2>

<p>The REST API exposes the following endpoints (all requests/responses use JSON format):</p>

<details>
  <summary>🔑 Authentication Endpoints (<code>/api/auth</code>)</summary>
  <table border="1">
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Auth Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/register</code></td>
        <td>Register a new user account</td>
        <td>❌</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/login</code></td>
        <td>Authenticate user and return a JWT</td>
        <td>❌</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary>📅 Event Endpoints (<code>/api/events</code>)</summary>
  <table border="1">
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Auth Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/</code></td>
        <td>Create a new event</td>
        <td>🔐 (Admin/Organizer)</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/</code></td>
        <td>Retrieve list of all events</td>
        <td>❌</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/:id</code></td>
        <td>Retrieve details of a single event</td>
        <td>❌</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/:id</code></td>
        <td>Update an existing event</td>
        <td>🔐 (Admin/Organizer)</td>
      </tr>
      <tr>
        <td><code>DELETE</code></td>
        <td><code>/:id</code></td>
        <td>Delete/cancel an event</td>
        <td>🔐 (Admin/Organizer)</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary>🎟️ Registration Endpoints (<code>/api/registrations</code>)</summary>
  <table border="1">
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Auth Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/:eventId</code></td>
        <td>Register current user for an event</td>
        <td>🔐</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/</code></td>
        <td>Get current user's registrations</td>
        <td>🔐</td>
      </tr>
      <tr>
        <td><code>DELETE</code></td>
        <td><code>/:id</code></td>
        <td>Cancel a registration</td>
        <td>🔐</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary>💬 Review Endpoints (<code>/api/reviews</code>)</summary>
  <table border="1">
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Auth Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/:eventId</code></td>
        <td>Submit rating & review for an event</td>
        <td>🔐</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/:eventId</code></td>
        <td>Get all reviews for an event</td>
        <td>❌</td>
      </tr>
      <tr>
        <td><code>DELETE</code></td>
        <td><code>/:id</code></td>
        <td>Delete a review</td>
        <td>🔐</td>
      </tr>
    </tbody>
  </table>
</details>

<details>
  <summary>🔔 Notification Endpoints (<code>/api/notifications</code>)</summary>
  <table border="1">
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Auth Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>GET</code></td>
        <td><code>/user</code></td>
        <td>Get all notifications for current user</td>
        <td>🔐</td>
      </tr>
      <tr>
        <td><code>PATCH</code></td>
        <td><code>/mark-as-read/:id</code></td>
        <td>Mark notification as read</td>
        <td>🔐</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/event/:eventId</code></td>
        <td>Get notifications for a specific event</td>
        <td>🔐</td>
      </tr>
    </tbody>
  </table>
</details>

<hr />

<h2>🔒 Security Notes</h2>
<ul>
  <li><strong>Helmet.js</strong> is integrated to set secure HTTP headers and protect the application from common web vulnerabilities.</li>
  <li><strong>Express Rate Limit</strong> protects the API from brute-force attempts and DDoS attacks by limiting requests to <code>100</code> per 15-minute window per IP.</li>
  <li><strong>ORM Protection:</strong> Database interactions are mediated through Sequelize, preventing SQL injection vulnerabilities.</li>
</ul>

<hr />

<h2>🔮 Future Improvements</h2>
<ul>
  <li>[ ] <strong>Payment Integration:</strong> Implement Stripe or PayPal SDKs for paid event ticket purchases.</li>
  <li>[ ] <strong>Interactive Seating Charts:</strong> Allow organizers to define maps and users to select seats.</li>
  <li>[ ] <strong>PDF Ticket Generator:</strong> Auto-email a styled PDF ticket with a QR code upon registration.</li>
  <li>[ ] <strong>WebSockets Integration:</strong> Live notifications for event changes or seat availability counts.</li>
</ul>
```
