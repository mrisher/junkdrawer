import Component from '@glimmer/component';

export default class ItemTypeComponent extends Component {

    get itemType(){
        return this.args.todo.itemType;
    }

    get allTypes(){
        return Object.keys(Object.getPrototypeOf(this.args.todo.itemType).constructor);
    }
}
