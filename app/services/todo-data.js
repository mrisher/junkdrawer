import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, set, get, onValue } from 'firebase/database';
import {
  getAuth,
  connectAuthEmulator,
  getRedirectResult,
  signInWithRedirect,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import ENV from 'junkdrawer/config/environment';

class TodoType {
  static Unknown = new TodoType(
    'Unknown',
    'mdi:question-mark-rhombus-outline',
    'color: #af5b5e;'
  );
  static Movie = new TodoType('Movie', 'mdi:movie');
  static Book = new TodoType(
    'Book',
    'material-symbols:menu-book-outline-sharp'
  );
  static Show = new TodoType('Show', 'material-symbols:tv-outline');
  static Place = new TodoType('Place', 'ic:baseline-place');

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
    this.itemType = TodoType[type] || TodoType.Unknown;
  }

  typeEqual(type) {
    return type === this.itemType;
  }
}

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TODO: Explore firebase functions for hiding secrets: https://www.youtube.com/watch?v=Pk5xgifoLYI 
// (firebase:functions:config set)
const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: 'junkdrawer-372716.web.app',
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

// Do Authentication (if necessary)
const auth = getAuth();
const database = getDatabase(app);
if (ENV.environment === 'development' || ENV.environment === 'test') {
    connectAuthEmulator(auth, "http://localhost:9099");

    // database testing functions https://firebase.google.com/docs/emulator-suite/connect_rtdb
    // TODO: Clear database for tests
    connectDatabaseEmulator(database, "localhost", 9000);
}
const provider = new GoogleAuthProvider();

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
  DatabasePartition = '';

  constructor(...args) {
    super(...args);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // alert("User " + user.displayName + " signed in");
        // Initialize Realtime Database and get a reference to the service
        this.DatabasePartition = ENV.FIREBASE_DATABASE_PARTITION.replace(
          '$USERID',
          auth.currentUser.uid
        );
        onValue(
          ref(database, this.DatabasePartition),
          (snapshot) => {
            load(this, deserializeTodoData(JSON.parse(snapshot.val())));
          },
          {
            onlyOnce: true,
          }
        );
      } else {
        // User is signed out
        // ...
        signInWithRedirect(auth, provider);
      }
    });
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

  @action setType(todo, typeName) {
    todo.itemType = TodoType[typeName];
    this.persist();
  }

  @action persist() {
    persist(this.todos, this.DatabasePartition);
  }
}

/**************************
 * local storage helpers
 ***************************/
function load(pTodoListComponent, parsedInput) {
  // needs a pointer to the container class so it can set the child "todos" element
  pTodoListComponent.todos = parsedInput || [];
}

function persist(todos, partition) {
  let data = serializeTodos(todos);
  let result = JSON.stringify(data);

  // write to firestore
  set(ref(database, partition), result);

  return result;
}

function serializeTodos(todos) {
  return todos.map((todo) => ({
    title: todo.text,
    completed: todo.isCompleted,
    type: todo.itemType.name,
  }));
}

function deserializeTodoData(data) {
  return (data || []).map((json) => {
    let todo = new Todo(json.title, json.type);

    todo.isCompleted = json.completed;

    return todo;
  });
}
