const Queue = require('./Queue'); 
const { 
    QueueType,
    PRIORITY_LEVELS,
} = require('./constants/index');

// A class representing the scheduler
// It holds a single blocking queue for blocking processes and three running queues 
// for non-blocking processes
class Scheduler { 
    constructor() { 
        this.clock = Date.now();
        this.blockingQueue = new Queue(this, 50, 0, QueueType.BLOCKING_QUEUE);
        this.runningQueues = [];

        for (let i = 0; i < PRIORITY_LEVELS; i++) {
            this.runningQueues[i] = new Queue(this, 10 + i * 20, i, QueueType.CPU_QUEUE);
        }
    }

   
   
    
    
   
    
  
    run() {
         // Executes the scheduler in an infinite loop as long as there are processes in any of the queues
        while (!allEmpty()) {
             // Initialize a variable with the current time and subtract current time by `this.clock` to get the `workTime`
            const time = Date.now();
            const workTime = time - this.clock;
            // `workTime` will be the amount of time each queue will be given to execute their processes for
            // Update `this.clock` with the new current time
            this.clock = time;
            // First, check to see if there are processes in the blocking queue
            if (!this._getBlockingQueue().isEmpty()) {
                 // If there are, execute a blocking process for the amount of time given by `workTime`
                this._getBlockingQueue().doBlockingWork(workTime);
            }
                // Then, iterate through all of the running queues and execute processes on those queues for the amount of time given by `workTime`
            for (let i = 0; i < PRIORITY_LEVELS; i++) {
                let queue = this.runningQueues[i];
                
                if (!queue.isEmpty()) {
                    for (let j = 0; j < processes.length; j++) {
                        let process = processes[j];
                        queue.process.doCPUWork(workTime);
                    }
                }
                // Once that is done, check to see if the queues are empty
                if (this.allEmpty()) {
                    alert("no running queues");
                    // If yes, then break out of the infinite loop
                    break;
                } else {
                    // Otherwise, perform another loop iteration
                    i++;
                }
            }
        }
    }

    // Checks that all queues have no processes 
    allEmpty() {
        this.runningQueues.every(function(queue) {
            return (queue.isEmpty() && this._getBlockingQueue().isEmpty());
        });
    }
    // Adds a new process to the highest priority level running queue
    addNewProcess(process) {
        this.runningQueues[0].enqueue(process);
    }

    // The scheduler's interrupt handler that receives a queue, a process, and an interrupt string
    // In the case of a PROCESS_BLOCKED interrupt, add the process to the blocking queue
    // In the case of a PROCESS_READY interrupt, add the process to highest priority running queue
    // In the case of a LOWER_PRIORITY interrupt, check to see if the input queue is a running queue or blocking queue
    // If it is a running queue, add the process to the next lower priority queue, or back into itself if it is already in the lowest priority queue
    // If it is a blocking queue, add the process back to the blocking queue
    handleInterrupt(queue, process, interrupt) {
        switch(interrupt) {
            case 'PROCESS_BLOCKED':
                this._getBlockingQueue().enqueue(process);
                break;
            case 'PROCESS_READY':
                this.addNewProcess(process);
                break;
            case 'LOWER_PRIORITY':
            if (queue.getQueueType() === QueueType.CPU_QUEUE) {
                const priorityLevel = Math.min(PRIORITY_LEVELS -1, queue.getPriorityLevel() + 1);
                this.runningQueues[priorityLevel].enqueue(process);
            } else {
               this._getBlockingQueue().enqueue(process);
            }
            break;
        default:
            break;
        }
    }

    // Private function used for testing; DO NOT MODIFY
    _getCPUQueue(priorityLevel) {
        return this.runningQueues[priorityLevel];
    }

    // Private function used for testing; DO NOT MODIFY
    _getBlockingQueue() {
        return this.blockingQueue;
    }
}

module.exports = Scheduler;
