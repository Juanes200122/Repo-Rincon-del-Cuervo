function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function applyRandomColors() {
    for (let i = 1; i <= 15; i++) { //cantidad de tus contenedores de color
        let color = generateRandomColor();
        let container = document.getElementById('color' + i);
        container.style.backgroundColor = color;
        container.setAttribute('data-hex', color); //el color hexadecimal como un atributo
    }
}
function hexToHSL(H) {
    //hex a RGB primero
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    //convertir a HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsl(" + h + "," + s + "%," + l + "%)";
}
function createMonochromaticPalette(baseColor) {
    let hslBase = hexToHSL(baseColor);
    let hslValues = hslBase.match(/(\d+\.?\d*)/g);
    let h = hslValues[0];
    let s = hslValues[1];
    let l = hslValues[2];

    let palette = [];
    for (let i = 0; i < 5; i++) {
        let lAdjusted = Math.max(l - (i * 8), 0);
        palette.push(`hsl(${h}, ${s}%, ${lAdjusted}%)`);
    }
    return palette;
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert(text);
    }).catch(err => {
        console.error('Error al copiar el texto: ', err);
    });
}
function showAlert(color) {
    const alertContainer = document.getElementById('alert-container');
    const alertColor = document.getElementById('alert-color');
    const alertText = document.getElementById('alert-text');

    alertColor.style.backgroundColor = color;
    alertText.textContent = `El color se copió`;

    alertContainer.style.display = 'block';

    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 2000); //2segundo
}
function addClickEventToColorContainers() {
    const colorContainers = document.querySelectorAll('.color-container');
    colorContainers.forEach(container => {
        container.addEventListener('click', function () {
            const colorCode = this.getAttribute('data-hex');
            if (colorCode) {
                copyToClipboard(colorCode);
            }
        });
    });
}
function createColorContainers() {
    const wrapper = document.getElementById('palette-wrapper');
    addColorContainers(wrapper, 12);
    addClickEventToColorContainers();
}
function addColorContainers(wrapper, count) {
    let currentCount = wrapper.children.length;
    for (let i = currentCount; i < currentCount + count; i++) {
        const mainContainer = document.createElement('div');
        mainContainer.classList.add('main-container');

        for (let j = 0; j < 5; j++) {
            const colorContainer = document.createElement('div');
            colorContainer.classList.add('color-container');
            colorContainer.setAttribute('id', 'color' + (i * 5 + j + 1));
            mainContainer.appendChild(colorContainer);
        }
        wrapper.appendChild(mainContainer);
    }
    applyMonochromaticPalettes();
}
function applyMonochromaticPalettes() {
    let mainContainers = document.querySelectorAll('.main-container');
    mainContainers.forEach(container => {
        let baseColor = generateRandomColor();
        let monochromaticColors = createMonochromaticPalette(baseColor);

        container.querySelectorAll('.color-container').forEach((div, i) => {
            let hslColor = monochromaticColors[i % monochromaticColors.length];
            let hslValues = hslColor.match(/(\d+\.?\d*)/g);
            let h = Number(hslValues[0]);
            let s = Number(hslValues[1]);
            let l = Number(hslValues[2]);
            let hexColor = hslToHex(h, s, l);
            div.style.backgroundColor = hexColor;
            div.setAttribute('data-hex', hexColor);
        });
    });
    addClickEventToColorContainers();
}
createColorContainers();
document.getElementById('generate-button').addEventListener('click', () => {
    addColorContainers(document.getElementById('palette-wrapper'), 3);
    applyMonochromaticPalettes();
});
document.getElementById('generate-button2').addEventListener('click', () => {
    addColorContainers(document.getElementById('palette-wrapper'), 0);
    applyMonochromaticPalettes();
});