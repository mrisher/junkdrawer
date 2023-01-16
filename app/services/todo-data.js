import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import ENV from 'ember-todomvc/config/environment';


class TodoType {
    static Unknown = new TodoType("unknown", "mdi:question-mark-rhombus-outline", "color: #af5b5e;");
	static Movie = new TodoType("movie", "mdi:movie");
    static Book = new TodoType("book", "material-symbols:menu-book-outline-sharp");
    static Show = new TodoType("show", "material-symbols:tv-outline");
    static Place = new TodoType("place", "ic:baseline-place");

    constructor(name, icon, style) {
        this.name = name;
        this.icon = icon;
        this.style = style;
    }
}

class Todo {
  @tracked text = '';
  @tracked isCompleted = false;
  itemType = TodoType.Unknown;

  constructor(text, type) {
    this.text = text;
    this.itemType = type || TodoType.Unknown;
  }

  typeEqual(type) {
    return (type === this.itemType);
  }
}

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: 'junkdrawer-372716.firebaseapp.com',
  databaseURL:
    'https://junkdrawer-372716-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'junkdrawer-372716',
  storageBucket: 'junkdrawer-372716.appspot.com',
  messagingSenderId: '1030245305217',
  appId: '1:1030245305217:web:6da7435ddb20a060b2f680',
  measurementId: 'G-4WCWY2BS1P',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const DATABASE_PARTITION = 'todos';

// example of writing to db
//set(ref(database, "test/t1"), {id: 1, data: 222});

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://junkdrawer-372716-default-rtdb.europe-west1.firebasedatabase.app"
// });

export default class TodoDataService extends Service {
  @tracked todos = [];

  constructor(...args) {
    super(...args);

    onValue(
      ref(database, DATABASE_PARTITION),
      (snapshot) => {
        load(this, deserializeTodoData(JSON.parse(snapshot.val())));
      },
      {
        onlyOnce: true,
      }
    );
  }

  get all() {
    return this.todos;
  }

  get completed() {
    return this.todos.filter((todo) => todo.isCompleted);
  }

  get incomplete() {
    return this.todos.filter((todo) => todo.isCompleted == false);
  }

  get todoCountIsOne() {
    return this.incomplete.length === 1;
  }

  get allTodoTypes() {
    return Object.keys(TodoType);
  }

  @action
  add(text) {
    let newTodo = new Todo(text);

    this.todos.push(newTodo);
    this.todos = this.todos; // self-assignment to trigger Tracked
    this.persist();
  }

  @action remove(todo) {
    this.todos = this.todos.filter((existing) => {
      return existing !== todo;
      this.persist();
    });
  }

  @action
  clearCompleted() {
    this.todos = this.incomplete;
    this.persist();
  }

  @action
  toggleCompletion(todo) {
    todo.isCompleted = !todo.isCompleted;
    this.persist();
  }

  @action updateTitle(todo, title) {
    todo.text = title;
    this.persist();
  }

  @action persist() {
    persist(this.todos);
  }

  @action setType(todo, typeName) {
    todo.itemType = TodoType[typeName];
  }
}

/**************************
 * local storage helpers
 ***************************/
function load(pTodoListComponent, parsedInput) {
  // needs a pointer to the container class so it can set the child "todos" element
  pTodoListComponent.todos = parsedInput || [];
}

function persist(todos) {
  let data = serializeTodos(todos);
  let result = JSON.stringify(data);
  //localStorage.setItem('todos', result);

  // write to firestore
  set(ref(database, DATABASE_PARTITION), result);

  return result;
}

function serializeTodos(todos) {
  return todos.map((todo) => ({
    title: todo.text,
    completed: todo.isCompleted,
  }));
}

function deserializeTodoData(data) {
  return (data || []).map((json) => {
    let todo = new Todo(json.title);

    todo.isCompleted = json.completed;

    return todo;
  });
}
