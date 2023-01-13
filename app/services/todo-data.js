import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

class Todo {
  @tracked text = '';
  @tracked isCompleted = false;

  constructor(text) {
    this.text = text;
  }
}

export default class TodoDataService extends Service {
  @tracked todos = A();

  get all() {
    return this.todos;
  }

  get incomplete() {
    return this.todos.filterBy('isCompleted', false);
  }
  

  @action
  add(text) {
    let newTodo = new Todo(text);

    this.todos.pushObject(newTodo);
  }

  @action
  clearCompleted() {
    this.todos = this.incomplete;
  }

}
