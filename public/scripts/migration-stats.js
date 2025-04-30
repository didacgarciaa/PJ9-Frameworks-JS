const chartData = {
  barChart: {
    labels: ["España", "Italia", "Alemania", "Francia", "Grecia"],
    datasets: [
      {
        label: "Personas que emigran",
        data: [500000, 450000, 600000, 300000, 250000],
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      },
      {
        label: "Personas que llegan",
        data: [200000, 150000, 300000, 100000, 80000],
        backgroundColor: "rgba(54, 162, 235, 0.5)"
      }
    ]
  },
  lineChart: {
    labels: ["2000", "2005", "2010", "2015", "2020"],
    datasets: [
      {
        label: "Población de Italia",
        data: [57000000, 56000000, 55000000, 54000000, 53000000],
        borderColor: "rgba(255, 206, 86, 1)",
        fill: false
      },
      {
        label: "Población de España",
        data: [46000000, 45000000, 44000000, 43000000, 42000000],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false
      },
      {
        label: "Población de Alemania",
        data: [82000000, 81000000, 80000000, 79000000, 78000000],
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false
      }
    ]
  }
};
const MigrationStats = {
  data() {
    return {
      activeTab: 'emigration',
      chartInstance: null,
      years: ['2018', '2019', '2020', '2021', '2022', '2023'],
      countries: ['Espanya', 'Itàlia', 'Alemanya', 'França', 'Grècia'],
      emigrationData: {
        'Espanya': [420000, 450000, 470000, 490000, 500000, 520000],
        'Itàlia': [380000, 400000, 420000, 430000, 450000, 470000],
        'Alemanya': [520000, 550000, 570000, 580000, 600000, 620000],
        'França': [250000, 270000, 280000, 290000, 300000, 320000],
        'Grècia': [200000, 220000, 230000, 240000, 250000, 270000]
      },
      immigrationData: {
        'Espanya': [180000, 190000, 195000, 200000, 210000, 220000],
        'Itàlia': [130000, 140000, 145000, 150000, 160000, 170000],
        'Alemanya': [270000, 280000, 290000, 300000, 310000, 320000],
        'França': [90000, 95000, 98000, 100000, 105000, 110000],
        'Grècia': [70000, 75000, 78000, 80000, 85000, 90000]
      },
      selectedCountry: 'Espanya',
      facts: [
        "El 2023, la UE va registrar 3,7 milions de migrants legals i 385.000 migrants irregulars.",
        "Es van presentar més d'1 milió de sol·licituds d'asil, sent Alemanya, Espanya, França i Itàlia els principals receptors.",
        "Síria, l'Afganistan, Turquia, Veneçuela i Colòmbia van ser els països d'origen més comuns dels sol·licitants.",
        "Els refugiats constitueixen fins a l'1,5% de la població de la UE, amb Alemanya liderant en concessió d'asil.",
        "La UE ha destinat 22.700 milions d'euros per a la gestió migratòria en el període 2021-2027."
      ]
    };
  },
  template: `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button @click="setActiveTab('emigration')" :class="{'bg-[#0E1C26] text-[#DADADA]': activeTab==='emigration', 'bg-gray-100 text-[#0E1C26]': activeTab!=='emigration'}" class="flex-1 py-3 px-4 text-center font-medium transition-colors">Emigració</button>
        <button @click="setActiveTab('immigration')" :class="{'bg-[#0E1C26] text-[#DADADA]': activeTab==='immigration', 'bg-gray-100 text-[#0E1C26]': activeTab!=='immigration'}" class="flex-1 py-3 px-4 text-center font-medium transition-colors">Immigració</button>
        <button @click="setActiveTab('facts')" :class="{'bg-[#0E1C26] text-[#DADADA]': activeTab==='facts', 'bg-gray-100 text-[#0E1C26]': activeTab!=='facts'}" class="flex-1 py-3 px-4 text-center font-medium transition-colors">Dades Clau</button>
      </div>
      <div class="p-6 text-[#0E1C26]">
        <div v-if="activeTab==='emigration'" class="space-y-6">
          <h2 class="text-2xl font-bold">Emigració a Europa</h2>
          <p class="text-gray-700">L'emigració és un fenomen creixent a Europa... Selecciona un país per veure les dades.</p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Selecciona un país:</label>
            <select v-model="selectedCountry" @change="updateChart" class="...">
              <option v-for="c in countries" :key="c" :value="c">{{c}}</option>
            </select>
          </div>
          <div class="h-80"><canvas id="migrationChart"></canvas></div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Tendència d'Emigració: {{selectedCountry}}</h3>
            <p>{{selectedCountry}} ha passat de {{emigrationData[selectedCountry][0].toLocaleString()}} el 2018 a {{emigrationData[selectedCountry][5].toLocaleString()}} el 2023.</p>
          </div>
        </div>
        <div v-if="activeTab==='immigration'" class="space-y-6">
          <h2 class="text-2xl font-bold">Immigració a Europa</h2>
          <p class="text-gray-700">La immigració a Europa varia... influint en demografia i economia.</p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Selecciona un país:</label>
            <select v-model="selectedCountry" @change="updateChart" class="...">
              <option v-for="c in countries" :key="c" :value="c">{{c}}</option>
            </select>
          </div>
          <div class="h-80"><canvas id="migrationChart"></canvas></div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Tendència d'Immigració: {{selectedCountry}}</h3>
            <p>Ha passat de {{immigrationData[selectedCountry][0].toLocaleString()}} el 2018 a {{immigrationData[selectedCountry][5].toLocaleString()}} el 2023.</p>
          </div>
        </div>
        <div v-if="activeTab==='facts'" class="space-y-6">
          <h2 class="text-2xl font-bold">Dades Clau sobre Migració a Europa</h2>
          <p class="text-gray-700">La migració és complexa...</p>
          <ul class="space-y-4">
            <li v-for="(f,i) in facts" :key="i" class="flex items-start"><svg class="w-5 h-5 text-green-500 mr-2 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>{{f}}</span></li>
          </ul>
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Impacte Econòmic</h3>
            <p>Les remeses i la mà d'obra addicional generen beneficis i reptes d'integració.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    this.createChart();
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      if (tab === 'emigration' || tab === 'immigration') {
        this.$nextTick(() => this.createChart());
      }
    },
    createChart() {
      const ctx = document.getElementById('migrationChart');
      if (this.chartInstance) this.chartInstance.destroy();
      if (['emigration','immigration'].includes(this.activeTab)) {
        const data = this.activeTab === 'emigration' ? this.emigrationData[this.selectedCountry] : this.immigrationData[this.selectedCountry];
        const color = this.activeTab==='emigration'? 'rgba(239,68,68,0.8)' : 'rgba(34,197,94,0.8)';
        const border = this.activeTab==='emigration'? 'rgb(220,38,38)' : 'rgb(22,163,74)';
        this.chartInstance = new Chart(ctx, { type:'line', data:{ labels:this.years, datasets:[{ label:this.activeTab==='emigration'?'Emigració':'Immigració', data, backgroundColor:color, borderColor:border, borderWidth:2, tension:0.3, fill:true }] }, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, title:{ display:true, text:'Nombre de persones' } }, x:{ title:{ display:true, text:'Any' } } } } });
      }
    },
    updateChart() { this.createChart(); }
  }
};

Vue.createApp({ components:{ 'migration-stats': MigrationStats } }).mount('#app');