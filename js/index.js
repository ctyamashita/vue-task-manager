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
      newList: null,
      tasks: oldTasks,
      lists: [
        {
          id: 1, 
          tasks: [
            {
              id: 1,
              title: 'task 1 from list 1',
              details: 'task 1 details',
              completed: false
            }
          ]
        },
        {
          id: 2,
          tasks: [
            {
              id: 2,
              title: 'task 1 from list 2',
              details: 'task 1 details',
              completed: false
            },
            {
              id: 3,
              title: 'task 2 from list 2',
              details: 'task 2 details',
              completed: false
            }
          ]
        }
      ],
      nextId: 1,
      nextListId: 1,
      nextTaskId: 1
    }
  },
  mounted() {
<<<<<<< Updated upstream
    if (this.tasks.length > 0) {
      const tasks = [ ...this.tasks ]
      const lastId = tasks.sort((a, b) => a.id - b.id)
      this.nextId = lastId[this.tasks.length - 1].id + 1
=======
    // if (this.tasks.length > 0) {
    //   const tasks = [ ...this.tasks ];
    //   const lastId = tasks.sort((a, b) => a.id - b.id);
    //   this.nextId = lastId[this.tasks.length - 1].id + 1;
    // }

    const lists = [ ...this.lists ];
    const tasks = [];
    lists.forEach(list=>list.tasks.forEach(task=>tasks.push(task)));

    if (lists.length > 0) {
      const lastListId = lists.sort((a,b) => a.id - b.id);
      this.nextListId = lastListId[lists.length - 1].id + 1;
    }

    if (tasks.length > 0) {
      const lastTaskId = tasks.sort((a,b) => a.id - b.id);
      this.nextTaskId = lastTaskId[tasks.length - 1].id + 1; 
>>>>>>> Stashed changes
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
      this.tasks.splice(index, 1)
      this.updateTasks()
    },
    updateLists() {
      localStorage.setItem('lists', JSON.stringify(this.lists));
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
