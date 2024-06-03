class Calculadora {
    constructor() {
        this.resultado = 0;
        this.historial = this.cargarHistorial();
        this.inicializar();
    }

    async inicializar() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const config = await response.json();
            this.config = config;
            this.mostrarBienvenida(config.initialMessage);
            this.cargarOperaciones(config.operations);
        } catch (error) {
            console.error('Error al cargar la configuración:', error);
            this.mostrarMensaje('Error al cargar la configuración.');
        }
    }

    cargarOperaciones(operations) {
        const operacionSelect = document.getElementById('operacion');
        operacionSelect.innerHTML = '';  // Limpiar el select antes de añadir nuevas opciones
        operations.forEach(operacion => {
            const option = document.createElement('option');
            option.value = operacion;
            option.textContent = _.capitalize(operacion);
            operacionSelect.appendChild(option);
        });
    }

    mostrarBienvenida(mensaje) {
        const welcomeDiv = document.getElementById('welcomeMessage');
        welcomeDiv.textContent = mensaje;
    }

    sumar(a, b) {
        return a + b;
    }

    restar(a, b) {
        return a - b;
    }

    multiplicar(a, b) {
        return a * b;
    }

    dividir(a, b) {
        if (b !== 0) {
            return a / b;
        } else {
            this.mostrarMensaje("No se puede dividir por cero.");
            return null;
        }
    }

    calcularPorcentaje(total, porcentaje) {
        return (total * porcentaje) / 100;
    }

    iniciar() {
        const operacion = document.getElementById('operacion').value;
        const num1 = parseFloat(document.getElementById('num1').value);
        const num2 = parseFloat(document.getElementById('num2').value);

        if (isNaN(num1) || isNaN(num2)) {
            this.mostrarMensaje("Por favor, ingrese números válidos.");
            return;
        }

        switch (operacion) {
            case "suma":
                this.resultado = this.sumar(num1, num2);
                break;
            case "resta":
                this.resultado = this.restar(num1, num2);
                break;
            case "multiplicacion":
                this.resultado = this.multiplicar(num1, num2);
                break;
            case "division":
                this.resultado = this.dividir(num1, num2);
                break;
            case "porcentaje":
                this.resultado = this.calcularPorcentaje(num1, num2);
                break;
            default:
                this.mostrarMensaje("Operación no válida.");
                return;
        }

        this.mostrarResultado(operacion);
        this.guardarResultado(operacion, num1, num2, this.resultado);
        this.actualizarHistorial();
    }

    mostrarResultado(operacion) {
        const resultadoDiv = document.getElementById('resultado');
        if (this.resultado !== null) {
            resultadoDiv.textContent = `El resultado de la ${operacion} es ${this.resultado}`;
        }
    }

    mostrarMensaje(mensaje) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = mensaje;
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 5000);
    }

    guardarResultado(operacion, num1, num2, resultado) {
        const nuevoResultado = {
            operacion: operacion,
            num1: num1,
            num2: num2,
            resultado: resultado
        };
        this.historial.push(nuevoResultado);
        localStorage.setItem('historial', JSON.stringify(this.historial));
    }

    cargarHistorial() {
        const historialGuardado = localStorage.getItem('historial');
        if (historialGuardado) {
            return JSON.parse(historialGuardado);
        } else {
            return [];
        }
    }

    actualizarHistorial() {
        const historialUL = document.getElementById('historial');
        historialUL.innerHTML = '';
        this.historial.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = `${item.num1} ${this.obtenerSimbolo(item.operacion)} ${item.num2} = ${item.resultado}`;
            historialUL.appendChild(li);
        });
    }

    obtenerSimbolo(operacion) {
        switch (operacion) {
            case 'suma':
                return '+';
            case 'resta':
                return '-';
            case 'multiplicacion':
                return '*';
            case 'division':
                return '/';
            case 'porcentaje':
                return '%';
            default:
                return '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculadora = new Calculadora();
    document.getElementById('calcularBtn').addEventListener('click', () => calculadora.iniciar());
    calculadora.actualizarHistorial();
});
