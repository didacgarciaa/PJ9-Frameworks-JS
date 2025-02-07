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
      const parent = this.listElement;
      const dragged = this.draggedItem;
      const dropTarget = item;

      // Almacenar las referencias de los siguientes nodos antes de modificar el DOM
      const draggedNext = dragged.nextSibling;
      const dropNext = dropTarget.nextSibling;

      // Si los elementos son adyacentes, se intercambian de forma especial
      if (dragged.nextSibling === dropTarget) {
        // Caso: [ ... , dragged, dropTarget, ... ]
        parent.insertBefore(dropTarget, dragged);
      } else if (dropTarget.nextSibling === dragged) {
        // Caso: [ ... , dropTarget, dragged, ... ]
        parent.insertBefore(dragged, dropTarget);
      } else {
        // Caso general: se intercambian usando las referencias almacenadas
        parent.insertBefore(dragged, dropNext);
        parent.insertBefore(dropTarget, draggedNext);
      }
    }
    item.classList.remove('over');
  }
}
