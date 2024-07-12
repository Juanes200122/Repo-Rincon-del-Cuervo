document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
        const content = detail.querySelector('p');

        // Reiniciar la animación
        content.style.animation = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.style.animation = '';
            });
        });
    });
});