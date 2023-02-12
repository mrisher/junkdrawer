import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'junkdrawer/tests/helpers';

module('Acceptance | junkdrawer', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('h1').hasText('The Junk Drawer');

    assert.dom('a.ember-view').exists({ count: 3 });
  });
});
