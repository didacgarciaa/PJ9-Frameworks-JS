import { DragList } from './dragItem.js';

class PopulateList {
  constructor(listId, checkButtonId, usernameId) {
    this.listElement = document.getElementById(listId);
    this.checkButton = document.getElementById(checkButtonId);
    this.usernameElement = document.getElementById(usernameId);
    this.saveBtn = document.getElementById("saveOrderBtn");
    
    // Bandera que indica si el orden está guardado (heart lleno)
    this.saved = false;
    
    // Recupera el username del localStorage o usa "Guest"
    this.username = localStorage.getItem("username") || "Guest";
    console.log(this.username);
    this.displayUsername();
    this.setupMutationObserver();

    // Orden correcta (la posición ideal de cada país)
    this.correctOrder = [
      { name: "Turquia", population: 2500000 },
      { name: "Marroc", population: 1800000 },
      { name: "Romania", population: 1300000 },
      { name: "Algèria", population: 900000 },
      { name: "Xina", population: 850000 }
    ];
    
    this.shuffleAndPopulate();

    // Evento para el botón de "Comprobar Activitat"
    this.checkButton.addEventListener('click', () => this.checkOrder());

    // Evento para el botón (SVG) de guardar/descartar orden
    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", () => {
         // Toggle del estado guardado
         this.saved = !this.saved;
         if (this.saved) {
           // Llenar el corazón de rojo
           this.saveBtn.querySelector("svg").setAttribute("fill", "red");
           // Guardar el orden actual en el localStorage
           this.saveOrder();
         } else {
           // Vaciar el corazón (quitar el fill)
           this.saveBtn.querySelector("svg").setAttribute("fill", "none");
           // Eliminar el orden guardado para este usuario (si coincide)
           let savedDataStr = localStorage.getItem("savedOrder");
           if (savedDataStr) {
             let savedData = JSON.parse(savedDataStr);
             if (savedData.username === this.username) {
               localStorage.removeItem("savedOrder");
             }
           }
         }
      });
    }
  }

  displayUsername() {
    if (this.usernameElement) {
      this.usernameElement.textContent = `Welcome, ${this.username}!`;
    }
  }

  shuffleAndPopulate() {
    this.listElement.innerHTML = ""; 

    // Comprueba si existe un orden guardado para el usuario actual
    let savedDataStr = localStorage.getItem("savedOrder");
    let countries;
    if (savedDataStr) {
      let savedData = JSON.parse(savedDataStr);
      if (savedData.username === this.username) {
         // Usar el orden guardado
         countries = savedData.order;
         // Actualiza el estado del botón corazón
         if (this.saveBtn) {
           this.saveBtn.querySelector("svg").setAttribute("fill", "red");
           this.saved = true;
         }
      } else {
         // Si no coincide el username, se baraja aleatoriamente
         countries = [...this.correctOrder].sort(() => Math.random() - 0.5);
      }
    } else {
      // Si no hay orden guardado, se baraja aleatoriamente
      countries = [...this.correctOrder].sort(() => Math.random() - 0.5);
    }

    // Crear cada elemento de la lista con la información (almacenada en dataset)
    countries.forEach(({ name, population }) => {
      const li = document.createElement("li");
      li.textContent = name;
      li.className = "drag-item transition-all py-3 px-4 cursor-move bg-white border border-gray-200 rounded-lg shadow";
      li.draggable = true;
      
      li.dataset.name = name;
      li.dataset.population = population;
  
      this.listElement.appendChild(li);
    });
  
    // Inicializar el Drag & Drop para la lista
    new DragList('dragList');
  }

  setupMutationObserver() {
    // Create an observer instance linked to a callback function
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // The list order has changed
          if (this.saved) {
            this.saveOrder();
          }
          // You might break after detecting a childList change
          break;
        }
      }
    });
    
    // Configure the observer: watch for changes in children
    observer.observe(this.listElement, { childList: true });
  }
  
  checkOrder() {
    let items = Array.from(this.listElement.children);
  
    items.forEach((item, index) => {
      let expectedCountry = this.correctOrder[index];
      let actualName = item.dataset.name;
      let actualPopulation = item.dataset.population;
  
      // Muestra "País - Población"
      item.textContent = `${actualName} - ${actualPopulation}`;
  
      // Colorea el fondo según si el país está en la posición correcta
      if (actualName === expectedCountry.name) {
        item.style.backgroundColor = "lightgreen";
      } else {
        item.style.backgroundColor = "lightcoral";
      }
    });
  }

  saveOrder() {
    let items = Array.from(this.listElement.children);
    
    // Obtiene el orden actual en forma de array
    let currentOrder = items.map(item => ({
      name: item.dataset.name,
      population: item.dataset.population
    }));

    // Guarda en localStorage el username y el orden (como ejemplo: [1,5,2,3])
    let savedData = {
      username: this.username,
      order: currentOrder
    };

    localStorage.setItem("savedOrder", JSON.stringify(savedData));

    // (Opcional) Mostrar un mensaje de confirmación en consola
    console.log(`User: "${this.username}" has saved these positions:`, currentOrder);
  }
}

new PopulateList('dragList', 'checkButton', 'usernameDisplay');
