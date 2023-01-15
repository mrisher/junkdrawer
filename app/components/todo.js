import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { isEnterKey, isEscapeKey } from 'ember-todomvc/utils/key';

export default class TodoComponent extends Component {
  @service('todo-data') todos;

  @tracked isEditing = false;

  @action edit() {
    this.originalTitle = this.args.todo.text;

    this.isEditing = true;
    this.args.onStartEditing();
    scheduleOnce('afterRender', this, 'focus');
  }

  @action complete() {
    let { todo } = this.args;

    this.todos.toggleCompletion(todo);
  }

  @action finish() {
    if (!this.isEditing) return;

    let { todo } = this.args;
    let pendingTitle = this.inputElement.value;

    if (!pendingTitle) {
      this.todos.remove(todo);
      return;
    }

    this.todos.updateTitle(todo, pendingTitle);

    this.isEditing = false;
    this.args.onFinishEditing();
  }

  @action onKeyDown(event) {
    if (isEnterKey(event)) {
      event.target.blur();
    } else if (isEscapeKey(event)) {
      this.isEditing = false;
    }
  }

  @action createRef(inputElement) {
    this.inputElement = inputElement;
  }

  focus() {
    if (!this.inputElement) return;

    this.inputElement.focus();
  }
}
