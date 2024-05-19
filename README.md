<p align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">NPM-ATOM</h1>
</p>
<p align="center">
    <em>Empowering secure interactions, unlocking seamless experiences!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/commit-activity/m/sharanreddy99/npm-atom" alt="last-commit">
	<img src="https://img.shields.io/github/created-at/sharanreddy99/npm-atom" alt="created_at">
   <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/sharanreddy99/npm-atom">
   <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/sharanreddy99/npm-atom">
   <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/sharanreddy99/npm-atom">

</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>

<br><!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
</details>
<hr>

##  Overview

Npm-atom is a comprehensive open-source project that centralizes user authentication and authorization functionalities. It enhances security by managing token generation, user access validation, and database interactions. This project streamlines user account management through features like login, registration, email verification, and encryption. By integrating essential components like JWT authentication, Redis caching, and MongoDB support, npm-atom ensures robust security measures and seamless user experiences.

---

##  Features

|    |   Feature         | Description |
|----|-------------------|---------------------------------------------------------------|
| ⚙️  | **Architecture**  | Node.js-based project handling authentication functionalities. Centralizes core features like user authentication, token generation, and verification using JWT. Utilizes MongoDB with Mongoose for database operations, Redis for caching, and Express for server setup. Modular structure with clear separation of concerns. |
| 🔩 | **Code Quality**  | Well-structured codebase following best practices. Encapsulates functionalities in separate modules for easier maintenance and scalability. Consistent coding style and naming conventions observed throughout the project. Error handling and logging mechanisms in place for robustness. |
| 📄 | **Documentation** | Extensive inline documentation providing insights into module functionalities, dependencies, and usage. README file offers setup instructions, project overview, and contribution guidelines. Code comments enhance code readability and maintainability. Documentation can be further expanded with examples and API references. |
| 🔌 | **Integrations**  | Dependencies include essential libraries like jwt, express, mongoose, and nodemailer. External integrations with Redis for caching, bcrypt for encryption, and dotenv for environment variables management. Smooth integration with AWS SDK for additional functionalities. |
| 🧩 | **Modularity**    | Highly modular design with individual modules focusing on specific functionalities like authentication, database interactions, logging, and email handling. Encourages code reuse and separation of concerns. Modules can be easily extended or swapped out for improved flexibility. |
| 🧪 | **Testing**       | Testing frameworks/tools not explicitly mentioned in repository details. Implementation of unit tests, integration tests, or end-to-end tests could further enhance code reliability and maintainability. Consider incorporating testing frameworks like Jest or Mocha for comprehensive test coverage. |
| ⚡️  | **Performance**   | Efficient handling of authentication processes, database interactions, and email functionalities. Utilization of encryption algorithms for data security. Potential optimization areas include caching strategies for Redis, query optimizations in database interactions, and overall code performance profiling. |
| 🛡️ | **Security**      | Strong security measures with encryption for sensitive information, user authentication mechanisms, and secure token generation. Proper handling of vulnerabilities like SQL injection or cross-site scripting. Regular updates and monitoring for security patches. Follows secure coding practices for robust data protection. |
| 📦 | **Dependencies**  | Key dependencies include libraries for user authentication, encryption, email handling, logging, and database interactions. Dependencies managed through package.json and package-lock.json for version control and compatibility. Library versions should be regularly updated to ensure security and performance enhancements. |

---

##  Repository Structure

```sh
└── npm-atom/
    ├── README.md
    ├── auth
    │   └── index.js
    ├── constants
    │   └── index.js
    ├── crypt
    │   └── index.js
    ├── db
    │   ├── index.js
    │   ├── migrate-mongo-config.js
    │   ├── migrations
    │   ├── models
    │   ├── package-lock.json
    │   ├── package.json
    │   └── utils.js
    ├── email
    │   ├── index.js
    │   └── utils.js
    ├── index.js
    ├── jwt
    │   ├── index.js
    │   └── utils.js
    ├── logger
    │   ├── caller.js
    │   ├── index.js
    │   └── utils.js
    ├── middleware
    │   └── index.js
    ├── package-lock.json
    ├── package.json
    ├── redis
    │   └── index.js
    └── utils
        └── index.js
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                              | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [package-lock.json](https://github.com/sharanreddy99/npm-atom.git/blob/master/package-lock.json) | This code file within the `npm-atom` repository serves the critical purpose of handling authentication functionalities. It encapsulates essential logic for user authentication and authorization. This code module interfaces with other parts of the system to securely manage user access and permissions within the application. The key features provided by this module include user authentication, token generation, and verification mechanisms. It plays a vital role in ensuring secure interactions with the system and maintaining data integrity. |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/index.js)                   | Exports key modules for centralizing functionality in the repository structure. Manages authentication, constants, encryption, database, JWT, logging, middleware, Redis, utilities, and emailing. Centralizes and organizes core functionalities for clear usage.                                                                                                                                                                                                                                                                                              |
| [package.json](https://github.com/sharanreddy99/npm-atom.git/blob/master/package.json)           | Manages npm-atoms metadata, dependencies, and scripts for database migrations and server startup. Centralizes essential project information and configurations for streamlined development and deployment workflows.                                                                                                                                                                                                                                                                                                                                            |

</details>

<details closed><summary>jwt</summary>

| File                                                                               | Summary                                                                                                                                                                                    |
| ---                                                                                | ---                                                                                                                                                                                        |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/jwt/index.js) | Generates and verifies JWT access tokens for user authentication. Utilizes encryption, Redis for storage, and error handling. Integrate with the parent repositorys authentication system. |
| [utils.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/jwt/utils.js) | Generates Redis key for access tokens based on request metadata and email.                                                                                                                 |

</details>

<details closed><summary>constants</summary>

| File                                                                                     | Summary                                                                                                                                                                                                        |
| ---                                                                                      | ---                                                                                                                                                                                                            |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/constants/index.js) | Defines critical constants for various functionalities like logging, JWT, user registration, OTP, and errors within the repository. Supports centralized configuration for consistent behavior across modules. |

</details>

<details closed><summary>middleware</summary>

| File                                                                                      | Summary                                                                                                                                                                                                                                                 |
| ---                                                                                       | ---                                                                                                                                                                                                                                                     |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/middleware/index.js) | Implements middleware functions for logging API requests and handling user authentication. Utilizes logger, database, JWT, Redis, and utility modules. Performs error handling and response generation. Grabs user details and checks session validity. |

</details>

<details closed><summary>utils</summary>

| File                                                                                 | Summary                                                                                                                                                                                                                    |
| ---                                                                                  | ---                                                                                                                                                                                                                        |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/utils/index.js) | Empowers REST API with standardized response handlers, OTP verification utilities, and logging integration. Enhances authentication flows and server responses in a modular fashion within the larger system architecture. |

</details>

<details closed><summary>auth</summary>

| File                                                                                | Summary                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                 | ---                                                                                                                                                                                                                                                                                                                              |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/auth/index.js) | Empowers user authentication and account management. Implements registration, login, logout, profile updates, password reset, email verification, encryption, and decryption functionalities. Enhances security and user experience with middleware, constants, logging, database interactions, JWT, Redis, and email utilities. |

</details>

<details closed><summary>redis</summary>

| File                                                                                 | Summary                                                                                                                                                                                                                                        |
| ---                                                                                  | ---                                                                                                                                                                                                                                            |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/redis/index.js) | Implements Redis interaction for caching and data manipulation within the repositorys architecture. Features include data retrieval, storage, deletion, expiration handling, value incrementation, time-to-live retrieval, and key generation. |

</details>

<details closed><summary>db</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                          |
| ---                                                                                                             | ---                                                                                                                                                                                                                                              |
| [package-lock.json](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/package-lock.json)             | Defines dependencies for the database module, including the package dotenv. Ensures compatibility with Node version 10+. Centralizes management of required packages for efficient and secure operation within the npm-atom repository.          |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/index.js)                               | Establish database connection using Mongoose for the repositorys MongoDB instance. Enables seamless interaction with the database across the codebase.                                                                                           |
| [package.json](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/package.json)                       | Manages database dependencies with dotenv for configuration-based development.                                                                                                                                                                   |
| [migrate-mongo-config.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/migrate-mongo-config.js) | Configure migrate-mongo settings for MongoDB setup, database name, and migration directory. Ensure connection settings comply with deprecation warnings. Maintain changelog collection for applied changes and specify migration file extension. |
| [utils.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/utils.js)                               | Manages database operations (insert, find, update, delete) for collections. Encapsulates common CRUD functions with error handling. Centralizes database interaction in the npm-atom repository.                                                 |

</details>

<details closed><summary>db.models</summary>

| File                                                                                       | Summary                                                                                                                                                                                                                                    |
| ---                                                                                        | ---                                                                                                                                                                                                                                        |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/models/index.js)   | Exports User, Email, and Logs models for database operations, consolidating crucial data-handling functionalities.                                                                                                                         |
| [emails.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/models/emails.js) | Defines MongoDB schema for emails in the npm-atom repository. Models email attributes and status using Mongoose ORM.                                                                                                                       |
| [logs.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/models/logs.js)     | Defines MongoDB schema for logs with various fields like traceid, method, url. Handles logging data structure in the database for npm-atoms application logs.                                                                              |
| [users.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/models/users.js)   | Defines user data schema with encryption, authentication, and validation functionalities. Integrates with the repositorys database utilities and cryptography module. Enhances user object serialization with data transformation methods. |

</details>

<details closed><summary>db.migrations</summary>

| File                                                                                                                                                   | Summary                                                                                                                                                                                                                                                |
| ---                                                                                                                                                    | ---                                                                                                                                                                                                                                                    |
| [20210926065143-otp_email_housemate.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/db/migrations/20210926065143-otp_email_housemate.js) | Defines email template migration to store OTP template for Housemate. Inserts HTML email body with placeholders for OTP value and duration. Deletes the same email template on rollback. Contributes to email service in the repositorys architecture. |

</details>

<details closed><summary>crypt</summary>

| File                                                                                 | Summary                                                                                                                                                                                                                                               |
| ---                                                                                  | ---                                                                                                                                                                                                                                                   |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/crypt/index.js) | Employs cryptographic functions for data encryption, decryption, and hashing. Integrates AES-256-CBC algorithm to secure sensitive information. Supports both string and object manipulation, ensuring data integrity across the npm-atom repository. |

</details>

<details closed><summary>logger</summary>

| File                                                                                    | Summary                                                                                                                                                                                                                  |
| ---                                                                                     | ---                                                                                                                                                                                                                      |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/logger/index.js)   | Implements logging functionalities for API interactions. Initiates, updates API logs, and outputs custom log messages to console and files. Integrates with the parent repositorys architecture for centralized logging. |
| [caller.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/logger/caller.js) | Enables parsing and formatting of error call stack traces, extracting caller details in the repositorys logger module. Enhances error trace readability and provides specific caller information for debugging purposes. |
| [utils.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/logger/utils.js)   | Enables fetching client IP address from request headers, essential for logging context within the repositorys logger module.                                                                                             |

</details>

<details closed><summary>email</summary>

| File                                                                                 | Summary                                                                                                                                                                                                                                                                                          |
| ---                                                                                  | ---                                                                                                                                                                                                                                                                                              |
| [index.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/email/index.js) | Handles email sending and OTP verification using Express routers. Utilizes custom packages for email functionality, logging, Redis support, and utility functions. Implements endpoints for both sending and verifying OTPs, with error handling and response generation.                        |
| [utils.js](https://github.com/sharanreddy99/npm-atom.git/blob/master/email/utils.js) | Enables email functionality for authentication flow. Generates and verifies OTPs, updates placeholders, and sends emails using Nodemailer. Interacts with Redis, logger, constants, and database models. Enhances user experience through secure email communication in the npm-atom repository. |

</details>

---

##  Getting Started
### List of env vars set up for this project

NPM_ATOM_CRYPTO_PASSPHRASE

NPM_ATOM_DATABASE_URL

NPM_ATOM_DATABASE_NAME

NPM_ATOM_APP_NAME

NPM_ATOM_REDIS_HOST

NPM_ATOM_REDIS_PORT

NPM_ATOM_NODE_EMAIL

NPM_ATOM_NODE_CLIENT_ID

NPM_ATOM_NODE_CLIENT_SECRET

NPM_ATOM_NODE_REFRESH_TOKEN


###  Installation

###  Usage

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/sharanreddy99/npm-atom.git/issues)**: Submit bugs found or log feature requests for the `npm-atom` project.
- **[Submit Pull Requests](https://github.com/sharanreddy99/npm-atom.git/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/sharanreddy99/npm-atom.git/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/sharanreddy99/npm-atom.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
   <a href="https://github.com/sharanreddy99/npm-atom.git/graphs/contributors">
      <img src="https://contrib.rocks/image?repo=sharanreddy99/npm-atom">
   </a>
</p>
</details>

---
