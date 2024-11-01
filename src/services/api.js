import axios from "axios";

const BASE_URL = "https://todolist-v360.onrender.com";

function createConfig(token) {
  return { headers: { Authorization: `${token}` } };
}

// health
function health() {
  const promise = axios.get(`${BASE_URL}/up`);

  return promise;
}

// Users
async function login(body) {
  const promise = axios.post(`${BASE_URL}/users/login`, body);

  return promise;
}

async function signUp(body) {
  const promise = axios.post(`${BASE_URL}/users/signup`, body);

  return promise;
}

function getMe(token) {
  const config = createConfig(token);
  const promise = axios.get(`${BASE_URL}/users/profile`, config);

  return promise;
}

// Task Lists
async function getTaskLists(token) {
  const config = createConfig(token);
  const promise = axios.get(`${BASE_URL}/task-lists`, config);

  return promise;
}

function getTaskList(listId, token) {
  const config = createConfig(token);
  const promise = axios.get(`${BASE_URL}/task-lists/${listId}`, config);

  return promise;
}

function postTaskList(body, token) {
  const config = createConfig(token);
  const promise = axios.post(`${BASE_URL}/task-lists`, body, config);

  return promise;
}

function putTaskList(listId, body, token) {
  const config = createConfig(token);
  const promise = axios.put(`${BASE_URL}/task-lists/${listId}`, body, config);

  return promise;
}

function deleteTaskList(listId, token) {
  const config = createConfig(token);
  const promise = axios.delete(`${BASE_URL}/task-lists/${listId}`, config);

  return promise;
}

// Tasks
function getTasks(listId, taskId, token) {
  const config = createConfig(token);
  const promise = axios.get(
    `${BASE_URL}/task-lists/${listId}/tasks/${taskId}`,
    config
  );

  return promise;
}

function postTask(listId, body, token) {
  const config = createConfig(token);
  const promise = axios.post(
    `${BASE_URL}/task-lists/${listId}/tasks/`,
    body,
    config
  );

  return promise;
}

function putTask(listId, taskId, body, token) {
  const config = createConfig(token);
  const promise = axios.put(
    `${BASE_URL}/task-lists/${listId}/tasks/${taskId}`,
    body,
    config
  );
  return promise;
}

function deleteTask(listId, taskId, token) {
  const config = createConfig(token);
  const promise = axios.delete(
    `${BASE_URL}/task-lists/${listId}/tasks/${taskId}`,
    config
  );

  return promise;
}

// Tags
function getTags(token) {
  const config = createConfig(token);
  const promise = axios.get(`${BASE_URL}/tags`, config);

  return promise;
}

function getTag(tagId, token) {
  const config = createConfig(token);
  const promise = axios.get(`${BASE_URL}/tags/${tagId}`, config);

  return promise;
}

function postTag(body, token) {
  const config = createConfig(token);
  const promise = axios.post(`${BASE_URL}/tags`, body, config);

  return promise;
}

function putTag(tagId, body, token) {
  const config = createConfig(token);
  const promise = axios.put(`${BASE_URL}/tags/${tagId}`, body, config);

  return promise;
}

function deleteTag(tagId, token) {
  const config = createConfig(token);
  const promise = axios.delete(`${BASE_URL}/tags/${tagId}`, config);

  return promise;
}

const api = {
  health,
  login,
  signUp,
  getMe,
  getTaskLists,
  getTaskList,
  postTaskList,
  putTaskList,
  deleteTaskList,
  getTasks,
  postTask,
  putTask,
  deleteTask,
  getTags,
  getTag,
  postTag,
  putTag,
  deleteTag
};

export default api;
