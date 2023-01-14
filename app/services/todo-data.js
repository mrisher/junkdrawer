import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { initializeApp} from 'firebase/app';
import { getDatabase, ref, set } from "firebase/database";

class Todo {
  @tracked text = '';
  @tracked isCompleted = false;

  constructor(text) {
    this.text = text;
  }
}


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQ1oCUEnV4lgx9R6_d_2RL_Zal6Kab54g",
    authDomain: "junkdrawer-372716.firebaseapp.com",
    databaseURL: "https://junkdrawer-372716-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "junkdrawer-372716",
    storageBucket: "junkdrawer-372716.appspot.com",
    messagingSenderId: "1030245305217",
    appId: "1:1030245305217:web:6da7435ddb20a060b2f680",
    measurementId: "G-4WCWY2BS1P"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(app);

  // example of writing to db
  // set(ref(database, "test/t1"), {id: 1, data: 222});
  
  // var admin = require("firebase-admin");
  
  // var serviceAccount = require("path/to/serviceAccountKey.json");
  
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://junkdrawer-372716-default-rtdb.europe-west1.firebasedatabase.app"
  // });  

export default class TodoDataService extends Service {
  @tracked todos = [];

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

  @action
  add(text) {
    let newTodo = new Todo(text);

    this.todos.push(newTodo);
    this.todos = this.todos; // self-assignment to trigger Tracked
  }

  @action remove(todo) {
    this.todos = this.todos.filter(existing => {
      return existing !== todo;
    });
  }

  @action
  clearCompleted() {
    this.todos = this.incomplete;
  }

  @action
  toggleCompletion(todo) {
    todo.isCompleted = !todo.isCompleted;
  }

  @action updateTitle(todo, title) {
    todo.text = title;
    this.persist();
  }

  @action persist() {
    //persist(this.data);
  }
}
