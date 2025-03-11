const preguntas1 = [
    ['Muestro dedicación a las personas que amo', 'Actúo con perseverancia'],
    ['Soy tolerante', 'Prefiero actuar con ética'],
    ['Al pensar, utilizo mi intuición o "sexto sentido"', 'Me siento una persona digna'],
    ['Logro buena concentración mental', 'Perdono todas las ofensas de cualquier persona'],
    ['Normalmente razono mucho', 'Me destaco por el liderazgo en mis acciones'],
    ['Pienso con integridad', 'Me coloco objetivos y metas en mi vida personal'],
    ['Soy una persona de iniciativa', 'En mi trabajo normalmente soy curioso'],
    ['Doy amor', 'Para pensar hago síntesis de las distintas ideas'],
    ['Me siento en calma', 'Pienso con veracidad']
];

const preguntas2 = [
    ['Irrespetar la propiedad', 'Sentir inquietud'],
    ['Ser irresponsable', 'Ser desconsiderado hacia cualquier persona'],
    ['Cae en contradicciones al pensar', 'Sentir intolerancia'],
    ['Ser violento', 'Actuar con cobardía'],
    ['Sentirse presumido', 'Generar divisiones y discordia entre los seres humanos'],
    ['Ser cruel', 'Sentir ira'],
    ['Pensar con confusión', 'Tener odio en el corazón'],
    ['Decir blasfemias', 'Ser escandaloso'],
    ['Crear desigualdades entre los seres humanos', 'Apasionarse por una idea'],
    ['Sentirse inconstante', 'Crear rivalidad hacia otros'],
    ['Pensamientos irracionales', 'Traicionar a un desconocido'],
    ['Ostentar las riquezas materiales', 'Sentirse infeliz'],
    ['Entorpecer la cooperación entre los seres humanos', 'La maldad'],
    ['Odiar a cualquier ser de la naturaleza', 'Hacerse distinciones entre las personas'],
    ['Sentirse intranquilo', 'Ser infiel'],
    ['Tener la mente dispersa', 'Mostrar apatía al pensar'],
    ['La injusticia', 'Sentirse angustiado'],
    ['Vengarse de los que odian a todo el mundo', 'Vengarse del que hace daño a un familiar'],
    ['Usar abusivamente el poder', 'Distraerse'],
    ['Ser desagradecido con los que ayudan', 'Ser egoísta con todos'],
    ['Cualquier forma de irrespeto', 'Odiar']
];

const opciones = [
    { valor: '3-0', texto: 'Totalmente de acuerdo con A (3-0)', descripcion: 'Opción A es mucho más importante que B' },
    { valor: '2-1', texto: 'Ligeramente de acuerdo con A (2-1)', descripcion: 'Opción A es algo más importante que B' },
    { valor: '1-2', texto: 'Ligeramente de acuerdo con B (1-2)', descripcion: 'Opción B es algo más importante que A' },
    { valor: '0-3', texto: 'Totalmente de acuerdo con B (0-3)', descripcion: 'Opción B es mucho más importante que A' }
];

// Supabase configuration
const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'your-anon-key'
};
const supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

function crearFilaPregunta(preguntaA, preguntaB, index, formId) {
    const div = document.createElement('div');
    div.className = 'question-row mb-4 p-3';
    
    const contenido = `
        <div class="row align-items-center">
            <div class="col-md-4 pregunta-container">
                <div class="pregunta-box">
                    <strong class="text-primary">A:</strong> ${preguntaA}
                </div>
            </div>
            <div class="col-md-4">
                <div class="options-container text-center">
                    ${opciones.map(opcion => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" 
                                   name="pregunta${formId}_${index}" 
                                   value="${opcion.valor}" 
                                   id="${formId}_${index}_${opcion.valor}"
                                   data-pregunta-a="${preguntaA}"
                                   data-pregunta-b="${preguntaB}"
                                   required>
                            <label class="form-check-label" for="${formId}_${index}_${opcion.valor}"
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="${opcion.descripcion}">
                                ${opcion.texto}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="col-md-4 pregunta-container">
                <div class="pregunta-box">
                    <strong class="text-primary">B:</strong> ${preguntaB}
                </div>
            </div>
        </div>
    `;
    
    div.innerHTML = contenido;
    document.getElementById(formId).appendChild(div);
}

function inicializarFormulario() {
    preguntas1.forEach((pregunta, index) => {
        crearFilaPregunta(pregunta[0], pregunta[1], index, 'parte1');
    });

    preguntas2.forEach((pregunta, index) => {
        crearFilaPregunta(pregunta[0], pregunta[1], index, 'parte2');
    });
}

function obtenerValoresRespuesta(valor) {
    const [valorA, valorB] = valor.split('-').map(Number);
    return { valorA, valorB };
}

function validarDatosEvaluacion(datos) {
    // Validar estructura básica
    if (!datos.session_id || !datos.informacion_personal || !datos.parte1 || !datos.parte2) {
        throw new Error('Estructura de datos incompleta');
    }

    // Validar información personal
    const { nombre, edad, sexo, email } = datos.informacion_personal;
    if (!nombre || !edad || !sexo || !email) {
        throw new Error('Información personal incompleta');
    }

    // Validar respuestas
    if (!datos.parte1.respuestas || !datos.parte2.respuestas) {
        throw new Error('No se encontraron respuestas');
    }

    if (datos.parte1.respuestas.length !== preguntas1.length) {
        throw new Error('Número incorrecto de respuestas en Parte 1');
    }

    if (datos.parte2.respuestas.length !== preguntas2.length) {
        throw new Error('Número incorrecto de respuestas en Parte 2');
    }

    // Validar timestamps
    if (!datos.parte1.timestamp_inicio || !datos.parte1.timestamp_fin ||
        !datos.parte2.timestamp_inicio || !datos.parte2.timestamp_fin) {
        throw new Error('Timestamps incompletos');
    }

    return true;
}

async function evaluarRespuestas() {
    const evaluarBtn = document.getElementById('evaluarBtn');
    const btnTextoOriginal = evaluarBtn.innerHTML;
    
    try {
        // Validar que todos los campos estén completos
        const infoPersonal = document.getElementById('infoPersonal');
        const parte1Form = document.getElementById('parte1');
        const parte2Form = document.getElementById('parte2');

        if (!infoPersonal.checkValidity()) {
            alert('Por favor complete todos los campos de información personal');
            return;
        }

        if (!validarFormularioCompleto('parte1') || !validarFormularioCompleto('parte2')) {
            alert('Por favor responda todas las preguntas del test');
            return;
        }

        // Validar edad
        const edad = parseInt(document.getElementById('edad').value);
        if (edad < 18 || edad > 120) {
            alert('La edad debe estar entre 18 y 120 años');
            return;
        }

        // Mostrar estado de carga
        evaluarBtn.disabled = true;
        evaluarBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

        const timestamp = new Date().toISOString();
        const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

        // Estructura de datos para Supabase
        const resultados = {
            session_id: sessionId,
            informacion_personal: {
                nombre: document.getElementById('nombre').value.trim(),
                edad: edad,
                sexo: document.getElementById('sexo').value,
                email: document.getElementById('email').value.trim()
            },
            parte1: {
                respuestas: [],
                timestamp_inicio: localStorage.getItem('timestamp_inicio') || timestamp,
                timestamp_fin: timestamp
            },
            parte2: {
                respuestas: [],
                timestamp_inicio: localStorage.getItem('timestamp_inicio') || timestamp,
                timestamp_fin: timestamp
            }
        };

        // Recopilar respuestas de Parte 1
        document.querySelectorAll('#parte1 input[type="radio"]:checked').forEach((radio) => {
            const { valorA, valorB } = obtenerValoresRespuesta(radio.value);
            resultados.parte1.respuestas.push({
                pregunta_a: radio.dataset.preguntaA,
                pregunta_b: radio.dataset.preguntaB,
                valor_a: valorA,
                valor_b: valorB
            });
        });

        // Recopilar respuestas de Parte 2
        document.querySelectorAll('#parte2 input[type="radio"]:checked').forEach((radio) => {
            const { valorA, valorB } = obtenerValoresRespuesta(radio.value);
            resultados.parte2.respuestas.push({
                pregunta_a: radio.dataset.preguntaA,
                pregunta_b: radio.dataset.preguntaB,
                valor_a: valorA,
                valor_b: valorB
            });
        });

        // Calcular totales
        resultados.parte1.total_a = resultados.parte1.respuestas.reduce((sum, r) => sum + r.valor_a, 0);
        resultados.parte1.total_b = resultados.parte1.respuestas.reduce((sum, r) => sum + r.valor_b, 0);
        resultados.parte2.total_a = resultados.parte2.respuestas.reduce((sum, r) => sum + r.valor_a, 0);
        resultados.parte2.total_b = resultados.parte2.respuestas.reduce((sum, r) => sum + r.valor_b, 0);

        // Validar datos antes de enviar
        try {
            validarDatosEvaluacion(resultados);
        } catch (validationError) {
            throw new Error(`Error de validación: ${validationError.message}`);
        }

        console.log('Enviando datos a Supabase:', resultados);
        
        // Intentar insertar en la tabla evaluaciones
        const { data: evalData, error: evalError } = await supabase
            .from('evaluaciones')
            .insert([resultados]);

        if (evalError) {
            console.error('Error de Supabase:', evalError);
            throw new Error(`Error al guardar en Supabase: ${evalError.message}`);
        }

        console.log('Datos guardados exitosamente:', evalData);
        
        // Enviar correo de confirmación
        const emailData = {
            email: resultados.informacion_personal.email,
            nombre: resultados.informacion_personal.nombre,
            timestamp: timestamp
        };

        const { error: emailError } = await supabase
            .from('email_confirmations')
            .insert([emailData]);

        if (emailError) {
            console.error('Error al programar el correo de confirmación:', emailError);
        } else {
            console.log('Correo de confirmación programado');
        }

        alert('Evaluación guardada exitosamente. Recibirá un correo de confirmación en breve.');
        
        // Limpiar almacenamiento local
        localStorage.removeItem('evaluacion_progreso');
        localStorage.removeItem('timestamp_inicio');
        localStorage.setItem('session_id', sessionId);

        // Limpiar formularios
        infoPersonal.reset();
        parte1Form.reset();
        parte2Form.reset();
        
        actualizarProgreso();
        
    } catch (error) {
        console.error('Error al guardar los resultados:', error);
        alert(`Error: ${error.message}. Por favor intente nuevamente.`);
    } finally {
        // Restaurar botón
        evaluarBtn.disabled = false;
        evaluarBtn.innerHTML = btnTextoOriginal;
    }
}

function validarFormularioCompleto(formId) {
    const form = document.getElementById(formId);
    const preguntas = form.querySelectorAll('input[type="radio"]');
    const preguntasRespondidas = form.querySelectorAll('input[type="radio"]:checked');
    const totalPreguntas = preguntas.length / 4; // 4 opciones por pregunta
    return preguntasRespondidas.length === totalPreguntas;
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarFormulario();
    cargarProgreso();

    // Inicializar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Event listeners para actualizar progreso
    document.querySelectorAll('input, select').forEach(elemento => {
        elemento.addEventListener('change', actualizarProgreso);
    });

    // Event listener para guardar progreso
    document.getElementById('guardarProgresoBtn').addEventListener('click', (e) => {
        e.preventDefault();
        guardarProgreso();
    });

    // Event listener para evaluar respuestas
    document.getElementById('evaluarBtn').addEventListener('click', (e) => {
        e.preventDefault();
        evaluarRespuestas();
    });

    // Guardar timestamp de inicio
    if (!localStorage.getItem('timestamp_inicio')) {
        localStorage.setItem('timestamp_inicio', new Date().toISOString());
    }

    // Generar session_id si no existe
    if (!localStorage.getItem('session_id')) {
        localStorage.setItem('session_id', crypto.randomUUID());
    }
});

function actualizarProgreso() {
    const totalPreguntas = preguntas1.length + preguntas2.length + 4; // 4 campos personales
    let preguntasRespondidas = 0;

    // Contar campos personales completados
    ['nombre', 'edad', 'sexo', 'email'].forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento.value) preguntasRespondidas++;
    });

    // Contar preguntas respondidas en parte 1
    document.querySelectorAll('#parte1 input[type="radio"]:checked').forEach(() => {
        preguntasRespondidas++;
    });

    // Contar preguntas respondidas en parte 2
    document.querySelectorAll('#parte2 input[type="radio"]:checked').forEach(() => {
        preguntasRespondidas++;
    });

    const porcentaje = (preguntasRespondidas / totalPreguntas) * 100;
    const progressBar = document.getElementById('formProgress');
    progressBar.style.width = `${porcentaje}%`;
    progressBar.setAttribute('aria-valuenow', porcentaje);
}

function guardarProgreso() {
    const progreso = {
        informacion_personal: {
            nombre: document.getElementById('nombre').value,
            edad: document.getElementById('edad').value,
            sexo: document.getElementById('sexo').value,
            email: document.getElementById('email').value
        },
        parte1: {},
        parte2: {},
        timestamp: new Date().toISOString()
    };

    // Guardar respuestas de parte 1
    document.querySelectorAll('#parte1 input[type="radio"]:checked').forEach((radio) => {
        progreso.parte1[radio.name] = radio.value;
    });

    // Guardar respuestas de parte 2
    document.querySelectorAll('#parte2 input[type="radio"]:checked').forEach((radio) => {
        progreso.parte2[radio.name] = radio.value;
    });

    localStorage.setItem('evaluacion_progreso', JSON.stringify(progreso));
    alert('Progreso guardado exitosamente');
}

function cargarProgreso() {
    const progreso = JSON.parse(localStorage.getItem('evaluacion_progreso'));
    if (!progreso) return;

    // Cargar información personal
    if (progreso.informacion_personal) {
        Object.entries(progreso.informacion_personal).forEach(([campo, valor]) => {
            const elemento = document.getElementById(campo);
            if (elemento) elemento.value = valor;
        });
    }

    // Cargar respuestas parte 1
    if (progreso.parte1) {
        Object.entries(progreso.parte1).forEach(([pregunta, valor]) => {
            const radio = document.getElementById(`parte1_${pregunta.split('_')[1]}_${valor}`);
            if (radio) radio.checked = true;
        });
    }

    // Cargar respuestas parte 2
    if (progreso.parte2) {
        Object.entries(progreso.parte2).forEach(([pregunta, valor]) => {
            const radio = document.getElementById(`parte2_${pregunta.split('_')[1]}_${valor}`);
            if (radio) radio.checked = true;
        });
    }

    actualizarProgreso();
}
