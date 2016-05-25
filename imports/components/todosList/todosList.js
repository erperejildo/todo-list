import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
	constructor($scope) {
		$scope.viewModel(this);

		this.subscribe('tasks');

		this.hideCompleted = false;

		this.helpers({
			tasks() {
				const selector = {};

        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
        	selector.checked = {
        		$ne: true
        	};
        }

        // Show newest tasks at the top
        return Tasks.find(selector, {
        	sort: {
        		createdAt: -1
        	}
        });
    },
    incompleteCount() {
    	return Tasks.find({
    		checked: {
    			$ne: true
    		}
    	}).count();
    },
    currentUser() {
    	return Meteor.user();
    }
})
	}

	addTask(newTask) {
    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask);

    // Clear form
    this.newTask = '';
}

setChecked(task) {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
}

removeTask(task) {
	Meteor.call('tasks.remove', task._id);
	// bad practice
	//Tasks.remove(task._id);

	// When you call a method on the client using Meteor.call, two things happen in parallel:
	// 1.The client sends a request to the server to run the method in a secure environment, just like an AJAX request would work
	// 2.A simulation of the method runs directly on the client to attempt to predict the outcome of the server call using the available information
}

setPrivate(task) {
	Meteor.call('tasks.setPrivate', task._id, !task.private);
}	
}

export default angular.module('todosList', [
	angularMeteor
	])
.component('todosList', {
	templateUrl: 'imports/components/todosList/todosList.html',
	controller: ['$scope', TodosListCtrl]
});