import { module, test } from 'qunit';
import { setupTest } from 'junkdrawer/tests/helpers';
import {Ember} from 'ember';

module('Unit | Service | todo-data', function (hooks) {
  setupTest(hooks);

  test('todo-data service returns an array', function(assert) {
    const todoData = this.owner.lookup('service:todo-data');
    assert.ok(todoData);
    assert.ok(todoData.all);

    let testTodo = todoData.add("test_item");

    // TODO: consider moving database load to the Application lifecycle, using deferReadiness() 
    // TODO: or alternatively, look at ember-test-setup for deferred setup
    // assert.true(todoData.loaded, 'this test should wait for database to load (or that should be an acceptance test)');

    assert.true(Array.isArray(todoData.all), 'todo-data service returns an array');
    assert.equal(todoData.all.length, 1, 'todo-data should have (1) entry');

    assert.equal(todoData.completed.length, 0, 'completed should be empty');
    todoData.toggleCompletion(testTodo);
    assert.equal(todoData.completed.length, 1, 'completed should now contain (1) item');
    todoData.toggleCompletion(testTodo);
    assert.equal(todoData.completed.length, 0, 'after toggling, completed should be empty again');
    assert.equal(todoData.all.length, 1, 'todo-data.all() should still have 1 entry');

    let testType = todoData.setType(testTodo, 'Movie');
    assert.equal(todoData.all[0].itemType, testType, 'Type should be Movie');
  });
});
