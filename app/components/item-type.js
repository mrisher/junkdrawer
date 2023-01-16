import Component from '@glimmer/component';

export default class ItemTypeComponent extends Component {

    get getName(){
        return this.args.todo.itemType.name;
    }
}
