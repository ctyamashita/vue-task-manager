import { createApp } from 'vue';
import vue3Sortablejs from 'vue-sortable';

let oldTasks = JSON.parse(localStorage.getItem('tasks'));
if (oldTasks === null) oldTasks = []

let oldLists = JSON.parse(localStorage.getItem('lists'));
if (oldLists === null) oldLists = []


createApp({
  data() {
    return {
      newTitle: null,
      newDetails: null,
      newList: null,
      tasks: oldTasks,
      lists: oldLists,
      nextListId: 1,
      nextTaskId: 1
    }
  },
  mounted() {
    const lists = [ ...this.lists ];
    const tasks = [];
    lists.forEach(list=>list.tasks.forEach(task=>tasks.push(task)));
    this.lists.forEach(list=>this.calculateCompletion(list))
    console.log(this.lists[0])

    if (lists.length > 0) {
      const lastListId = lists.sort((a,b) => a.id - b.id);
      this.nextListId = lastListId[lists.length - 1].id + 1;
    }

    if (tasks.length > 0) {
      const lastTaskId = tasks.sort((a,b) => a.id - b.id);
      this.nextTaskId = lastTaskId[tasks.length - 1].id + 1; 
    }
  },
  methods: {
    addTask(e) {
      const el = e.currentTarget;
      const listId = el.dataset.list;
      const list = this.lists.find(list=>list.id == listId);
      list.tasks.push({title: `t-${this.nextTaskId} (Tab to add details)`, details: '', completed: false, id: this.nextTaskId});
      this.nextTaskId += 1;
      this.updateLists();
      setTimeout(() => {
        const tasks = document.querySelector(`.tasks[id="${listId}"]`);
        const input = tasks.lastElementChild.querySelector('.title-input');
        input.focus();
        input.select();
      }, 300);
    },
    addList(e) {
      this.lists.push({id: this.nextListId, title: `List ${this.nextListId}`,tasks: [], completion: 0});
      this.nextListId += 1;
      this.updateLists();
      setTimeout(() => {
        const lists = document.querySelectorAll('.list-title');
        const input = lists[lists.length - 1]
        input.focus();
        input.select()
      }, 300);
    },
    updateTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    deleteTask(listId, index) {
      const list = this.lists.find(list=>list.id == listId);
      list.tasks.splice(index, 1);
      if (list.tasks.length === 0) {
        const listIndex = this.lists.indexOf(list);
        console.log(listIndex)
        this.lists.splice(listIndex, 1);
      }
      this.updateLists();
    },
    updateLists() {
      this.lists.forEach(list=>this.calculateCompletion(list));
      localStorage.setItem('lists', JSON.stringify(this.lists));
    },
    onOrderChange(event) {
      // Remove item from old index
      const oldListId = event.from.id
      const oldList = this.lists.find(list=>list.id == oldListId);
      const task = oldList.tasks.splice(event.oldIndex, 1)[0];
      // // Insert it at new index
      const newListId = event.to.id
      const newList = this.lists.find(list=>list.id == newListId);
      if (task) {
        newList.tasks.splice(event.newIndex, 0, task);
      }
      this.updateLists();
    },
    onDetailsChange(e) {
      const taskId = e.currentTarget.id;
      const listId = e.currentTarget.parentElement.parentElement.id;
      const input = e.currentTarget.innerText;
      const list = this.lists.find(list=>list.id == listId);
      const task = list.tasks.find(task=>task.id == taskId);
      task.details = input;
      this.updateLists();
    },
    calculateCompletion(list) {
      const total = list.tasks.length;
      const completed = list.tasks.filter(task=>task.completed).length;
      const completion = Math.round((completed / total) * 100);
      list.completion = completion
      // list.completion = {background: `linear-gradient(red ${completion}%, white${completion}%)`}
    },
    checkEntry(listId, index) {
      const list = this.lists.find(list=>list.id == listId);
      const task = list.tasks[index];
      if (task.title.length == 0) {
        this.deleteTask(listId, index)
      }
    },
    checkEntryList() {
      this.lists = this.lists.filter(list=>list.title);
      this.updateLists();
    },
    keyUpHandler(e) {
      if (e.key == 'Enter' || e.key == ' ') {
        e.currentTarget.click();
        const task = e.currentTarget.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.firstElementChild
        console.log(task)
        task.focus()
      }

    }
  }
}).use(vue3Sortablejs).mount('#app')
