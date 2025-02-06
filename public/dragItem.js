export class DragList {
    constructor(listId) {
      this.listElement = document.getElementById(listId);
      this.draggedItem = null;
      this.init();
    }
  
    init() {
      this.listElement.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', (e) => this.dragStart(e, item));
        item.addEventListener('dragend', () => this.dragEnd(item));
        item.addEventListener('dragover', (e) => this.dragOver(e));
        item.addEventListener('dragenter', (e) => this.dragEnter(e, item));
        item.addEventListener('dragleave', () => this.dragLeave(item));
        item.addEventListener('drop', (e) => this.drop(e, item));
      });
    }
  
    dragStart(e, item) {
      this.draggedItem = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.population);
    }
  
    dragEnd(item) {
      item.classList.remove('dragging');
      this.listElement.querySelectorAll('.over').forEach(i => i.classList.remove('over'));
      this.draggedItem = null;
    }
  
    dragOver(e) {
      e.preventDefault();
    }
  
    dragEnter(e, item) {
      if (item !== this.draggedItem) {
        item.classList.add('over');
      }
    }
  
    dragLeave(item) {
      item.classList.remove('over');
    }
  
    drop(e, item) {
      e.preventDefault();
      if (item !== this.draggedItem) {
        let children = Array.from(this.listElement.children);
        let draggedIndex = children.indexOf(this.draggedItem);
        let dropIndex = children.indexOf(item);
  
        if (draggedIndex < dropIndex) {
          this.listElement.insertBefore(this.draggedItem, item.nextSibling);
        } else {
          this.listElement.insertBefore(this.draggedItem, item);
        }
      }
      item.classList.remove('over');
    }
  }
  