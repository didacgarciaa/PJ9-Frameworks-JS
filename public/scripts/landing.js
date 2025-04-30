document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
            currentYear: new Date().getFullYear(),
            informationCards: [
                {
                    title: 'Causas',
                    description: 'Crisis económica, conflictos políticos y falta de empleo en algunos países europeos han impulsado la emigración.',
                    image: './img/Causa.png',
                    alt: 'Factores que causan la emigración en Europa'
                },
                {
                    title: 'Países con más emigración',
                    description: 'Rumania, Polonia y Portugal tienen altos índices de emigración, con ciudadanos buscando mejores oportunidades.',
                    image: './img/Pais.png',
                    alt: 'Países europeos con mayor índice de emigración'
                },
                {
                    title: 'Consecuencias',
                    description: 'La falta de trabajadores y el envejecimiento poblacional afectan a países con alta emigración.',
                    image: './img/_Con.jpg',
                    alt: 'Consecuencias de la emigración en Europa'
                },
                {
                    title: 'Situación actual',
                    description: 'El teletrabajo y la globalización han cambiado las dinámicas de emigración en Europa.',
                    image: './img/act.jpg',
                    alt: 'Situación actual de la emigración en Europa'
                }
            ]
        },
        methods: {
            navigateToLogin() {
                window.location.href = '/login';
            },
            navigateToDetail() {
                window.location.href = '/vue-migration';
            }
        }
    });
});