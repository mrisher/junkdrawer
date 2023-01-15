import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TodoListComponent extends Component {
  @service('todo-data') todos;

  @tracked canToggle = true;

  get areAllComplete() {
    let { todos } = this.args;

    return todos.every((todo) => {
      return todo.isCompleted;
    });
  }

  @action toggleAll() {
    let { todos } = this.args;
    let isCompleted = this.areAllComplete;

    todos.forEach((todo) => (todo.isCompleted = !isCompleted));
  }

  @action disableToggle() {
    this.canToggle = false;
  }

  @action enableToggle() {
    this.canToggle = true;
  }
}
