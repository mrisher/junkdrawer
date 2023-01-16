import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import { getAuth, getRedirectResult, signInWithRedirect, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import ENV from 'ember-todomvc/config/environment';


export default class IndexRoute extends Route {
  @service('todo-data') todos;

  model() {
    let todos = this.todos;

    return {
      get allTodos() {
        return todos.all;
      },
    };
  }
}
