# To Do List Web

This API is designed to manage task lists, enabling users to organize tasks in a structured way. The API supports creating multiple task lists, each containing multiple tasks, and allows for additional functionality such as tagging, file attachments, and route authentication. 

## Example Use Case

A user logs into the application to create a new project under their task lists. Within this project, they can add tasks with descriptions, assign tags to categorize these tasks, and attach relevant files for easy access. They can filter tasks by tags or due dates and mark tasks as complete when finished. All data is secure, as only authenticated users have access to their respective task lists and tasks.

**API Documentation**
   - Detailed API documentation is available [here](https://github.com/edilbertocantuaria/ToDoList_V360_Backend).



## Installation and Setup

This API is developed using [Node.js](https://nodejs.org/) and requires either NPM or Yarn to manage dependencies.

### Pre requisites

- [Node.js](https://nodejs.org/) 
- Yarn (v1.22 or higher)
- You can also check if the installation got right or version using the following commands:
  ```bash
    node --version
    yarn --v
  ```

### Installing Dependencies and Running the Application

1. **Clone the repository**:

   ```bash
   git clone https://github.com/edilbertocantuaria/to-do-list-v360-front
   cd to-do-list-v360-front
   ```
2. **Install the dependencies**:
   ```bash
    yarn install
   ```
3. **Running the application**: After installing the dependencies, you can run the API using the following command:
   ```bash
    yarn start
   ``` 
The API will be running by default at http://localhost:3000.

### Linting

To ensure code quality and consistency, this project uses [ESLint](https://eslint.org/). You can run the linter with the following command:
   ```bash
    yarn lint
   ```
This command will check your code for stylistic errors and enforce coding standards defined in the ESLint configuration file.
#### Automatic Fixes
You can also automatically fix some issues by running: 
   ```bash
    yarn lint:fix
   ```
 This command will attempt to fix any fixable errors in your code, helping you maintain a cleaner codebase.
