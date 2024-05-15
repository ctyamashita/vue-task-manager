import { createApp } from 'vue';
// import { Sortable } from 'sortablejs'
import vue3Sortablejs from 'vue-sortable';

let oldTasks = JSON.parse(localStorage.getItem('tasks'));
if (oldTasks === null) oldTasks = []


createApp({
  data() {
    return {
      newTitle: null,
      newDetails: null,
      tasks: oldTasks,
      nextId: 1
    }
  },
  mounted() {
    if (this.tasks.length > 0) {
      const tasks = [ ...this.tasks ];
      const lastId = tasks.sort((a, b) => a.id - b.id);
      this.nextId = lastId[this.tasks.length - 1].id + 1;
    }
  },
  methods: {
    addTask(e) {
      e.preventDefault();
      this.tasks.push({title: this.newTitle, details: this.newDetails, completed: false, id: this.nextId});
      this.nextId += 1;
      this.newDetails = '';
      this.newTitle = '';
      document.querySelector('#new-title').focus();
      this.updateTasks();
    },
    updateTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
      this.updateTasks();
    },
    onOrderChange(event) {
      // Remove item from old index
      const task = this.tasks.splice(event.oldIndex, 1)[0];
      // Insert it at new index
      this.tasks.splice(event.newIndex, 0, task);
      this.updateTasks();
    },
    onDetailsChange(e) {
      const id = e.currentTarget.id;
      const input = e.currentTarget.innerText;
      const task = this.tasks.find(task=>task.id == id);
      task.details = input;
      this.updateTasks();
    }
  }
}).use(vue3Sortablejs).mount('#app')
