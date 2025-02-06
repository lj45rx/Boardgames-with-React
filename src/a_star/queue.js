class SimplestPriorityQueueEntry{
    constructor(key, priority){
        this.key = key;
        this.priority = priority;
    }
}

// quickest solution - not very elegant, especially updating priorities
export class SimplestPriorityQueue{
    constructor(){
        this.priorityKeyPairs = [];
        this.keys = new Set();
    }

    isEmpty(){
        return this.priorityKeyPairs.length == 0;
    }

    #updateExisting(newKey, newValue){
        for(let i = 0; i < this.priorityKeyPairs.length; i++){
            let entry = this.priorityKeyPairs[i];
            // find key
            if(entry.key == newKey){
                this.priorityKeyPairs[i].priority = newValue;
                this.#sort();
                return;
            }
        }
    }

    add(key, priorityValue){
        if(this.keys.has(key)){
            this.#updateExisting(key, priorityValue);
            return;
        }
        this.keys.add(key);    

        // both of these work:
        this.priorityKeyPairs.push(new SimplestPriorityQueueEntry(key, priorityValue));
        //this.priorityKeyPairs.push({key:key, priority:priorityValue});

        this.#sort();
    }

    getNext(){
        const popped = this.priorityKeyPairs.pop();
        if(popped == undefined) return null; // was empty

        this.keys.delete(popped.key); // remove key from set before returning it
        return popped.key;
    }

    #sort(){
        // sort by first element, largest to smallest (to get next with pop())
        this.priorityKeyPairs.sort((a,b) => b.priority-a.priority);
    }
}