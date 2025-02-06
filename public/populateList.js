import { DragList } from './dragItem.js';

class PopulateList {
  constructor(listId, buttonId) {
    this.listElement = document.getElementById(listId);
    this.button = document.getElementById(buttonId);
    this.correctOrder = [
      { name: "Turquia", population: 2500000 },
      { name: "Marroc", population: 1800000 },
      { name: "Romania", population: 1300000 },
      { name: "Algèria", population: 900000 },
      { name: "Xina", population: 850000 }
    ];
    
    this.shuffleAndPopulate();
    this.button.addEventListener('click', () => this.checkOrder());
  }

  shuffleAndPopulate() {
    this.listElement.innerHTML = ""; 
  
    let shuffledCountries = [...this.correctOrder].sort(() => Math.random() - 0.5);
  
    shuffledCountries.forEach(({ name, population }) => {
      const li = document.createElement("li");
      li.textContent = name; // Initially only the country name
      li.className = "drag-item transition-all py-3 px-4 cursor-move bg-white border border-gray-200 rounded-lg shadow";
      li.draggable = true;
      
      // Store data in dataset attributes
      li.dataset.name = name;
      li.dataset.population = population;
  
      this.listElement.appendChild(li);
    });
  
    new DragList('dragList');
  }
  

  checkOrder() {
    let items = Array.from(this.listElement.children);
  
    items.forEach((item, index) => {
      let expectedCountry = this.correctOrder[index];
      let actualName = item.dataset.name;
      let actualPopulation = item.dataset.population;
  
      // Set text format: "País - NumPersonas"
      item.textContent = `${actualName} - ${actualPopulation}`;
  
      // Check if position is correct
      if (actualName === expectedCountry.name) {
        item.style.backgroundColor = "lightgreen";
      } else {
        item.style.backgroundColor = "lightcoral";
      }
    });
  }
  saveOrder() {
    let items = Array.from(this.listElement.children);
    
    let currentOrder = items.map(item => ({
      name: item.dataset.name,
      population: item.dataset.population
    }));
  
    localStorage.setItem("savedOrder", JSON.stringify(currentOrder));
  }
  
}

new PopulateList('dragList', 'checkButton');
