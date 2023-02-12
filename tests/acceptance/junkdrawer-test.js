import { module, test } from 'qunit';
import { 
  visit, 
  click, 
  currentURL, 
  triggerKeyEvent, 
  settled, 
  fillIn,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'junkdrawer/tests/helpers';

module('Acceptance | junkdrawer', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');
    assert.strictEqual(currentURL(), '/');
    assert.dom('h1').hasText('The Junk Drawer');
    assert.dom('a.ember-view').exists({ count: 3 });
  });

  test('entity count', async function (assert) { 
    await visit('/');
    assert.dom('input.new-todo').exists();
    await fillIn('input.new-todo', 'test_todo_123');
    await triggerKeyEvent('input.new-todo', 'keydown', 'Enter');
    await settled();
    assert.dom('.todo-count strong').hasText('1');
  });
});
