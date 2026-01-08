document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica do Carrossel ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    // Pega a largura do slide baseada no tamanho do container
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Organiza os slides um ao lado do outro
    // slide 1 em left: 0, slide 2 em left: largura, etc.
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    // Função para mover o track
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    // Função para atualizar os indicadores (bolinhas)
    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-indicator');
        targetDot.classList.add('current-indicator');
    };

    // Clique no botão Próximo
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        let nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-indicator');
        let nextDot = currentDot.nextElementSibling;

        // Loop infinito: se não houver próximo, volta para o primeiro
        if (!nextSlide) {
            nextSlide = slides[0];
            nextDot = dots[0];
        }

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    });

    // Clique no botão Anterior
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        let prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-indicator');
        let prevDot = currentDot.previousElementSibling;

        // Loop infinito: se não houver anterior, vai para o último
        if (!prevSlide) {
            prevSlide = slides[slides.length - 1];
            prevDot = dots[dots.length - 1];
        }

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
    });

    // Navegação pelos indicadores (bolinhas)
    dotsNav.addEventListener('click', e => {
        // Clica apenas se for um indicador
        const targetDot = e.target.closest('button');
        
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // --- Ajuste Responsivo ---
    // Recalcula a posição se a janela for redimensionada
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = newSlideWidth * index + 'px';
        });
        
        // Mantém o slide atual visível sem quebrar a transição
        const currentSlide = track.querySelector('.current-slide');
        track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
    });
});