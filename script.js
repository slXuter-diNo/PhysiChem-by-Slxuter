/* =========================================================
   PhysiChem - Main JavaScript
   Interactive Physics + Chemistry Explorer
   ========================================================= */


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

let activeCleanup = null;
let selectedElements = [];

const labModal = $("#labModal");
const labContent = $("#labContent");
const labTitle = $("#labTitle");
const labSubtitle = $("#labSubtitle");
const chemistModal = $("#chemistModal");


/* =========================================================
   TOPIC DATABASE
   ========================================================= */

const topics = {

    physics: {

        foundation: [
            {
                name: "Motion",
                desc: "Explore distance, displacement, speed, velocity and acceleration.",
                icon: "🏎️"
            },
            {
                name: "Force & Laws",
                desc: "Experiment with force, mass, acceleration and Newton's laws.",
                icon: "💥"
            },
            {
                name: "Gravitation",
                desc: "Explore gravity, falling objects and planetary motion.",
                icon: "🌍"
            },
            {
                name: "Work, Energy & Power",
                desc: "Experiment with work, kinetic energy and power.",
                icon: "⚙️"
            },
            {
                name: "Sound & Waves",
                desc: "Change frequency and amplitude and watch waves move.",
                icon: "🔊"
            },
            {
                name: "Light & Reflection",
                desc: "Experiment with mirrors, rays and angles of reflection.",
                icon: "🔦"
            },
            {
                name: "Refraction & Lenses",
                desc: "See how light bends through different materials.",
                icon: "🔍"
            },
            {
                name: "Electricity",
                desc: "Build a simple circuit and experiment with voltage and resistance.",
                icon: "⚡"
            },
            {
                name: "Magnetism",
                desc: "Explore magnetic fields around a current-carrying wire.",
                icon: "🧲"
            },
            {
                name: "Heat & Thermodynamics",
                desc: "Explore temperature, heat transfer and particles.",
                icon: "🔥"
            }
        ],

        advanced: [
            {
                name: "Kinetic Theory",
                desc: "Visualize particles moving inside matter.",
                icon: "⚛️"
            },
            {
                name: "Electromagnetic Induction",
                desc: "Move a magnet through a coil and observe induced voltage.",
                icon: "🔋"
            },
            {
                name: "Modern Physics",
                desc: "Explore photons, energy levels and the photoelectric effect.",
                icon: "🌌"
            },
            {
                name: "Atoms & Nuclei",
                desc: "Explore atomic structure and nuclear particles.",
                icon: "⚛️"
            },
            {
                name: "Optical Instruments",
                desc: "Explore how lenses create images.",
                icon: "🔭"
            },
            {
                name: "Fluid Mechanics",
                desc: "Explore pressure, density and fluid flow.",
                icon: "💧"
            }
        ],

        pro: [
            {
                name: "Quantum Physics",
                desc: "Explore probability, energy levels and quantum behavior.",
                icon: "🌀"
            },
            {
                name: "Relativity",
                desc: "Explore time dilation and relativistic motion.",
                icon: "🚀"
            },
            {
                name: "Electromagnetic Waves",
                desc: "Visualize electric and magnetic fields propagating together.",
                icon: "📡"
            },
            {
                name: "Semiconductor Physics",
                desc: "Explore electrons, holes and semiconductor behavior.",
                icon: "💻"
            },
            {
                name: "Nuclear Physics",
                desc: "Explore radioactive decay and nuclear stability.",
                icon: "☢️"
            },
            {
                name: "Astrophysics",
                desc: "Explore planets, stars and orbital motion.",
                icon: "🌌"
            }
        ]
    },


    chemistry: {

        foundation: [
            {
                name: "Matter & Its Nature",
                desc: "Explore solids, liquids, gases and particle motion.",
                icon: "🧊"
            },
            {
                name: "Atomic Structure",
                desc: "Explore protons, neutrons, electrons and shells.",
                icon: "⚛️"
            },
            {
                name: "Periodic Table",
                desc: "Explore all 118 elements and generate chemical formulas.",
                icon: "🧪",
                special: "periodic"
            },
            {
                name: "Chemical Bonding",
                desc: "See how atoms combine to form molecules.",
                icon: "🔗"
            },
            {
                name: "Chemical Reactions",
                desc: "Balance simple chemical reactions interactively.",
                icon: "⚗️"
            },
            {
                name: "Acids, Bases & Salts",
                desc: "Explore the pH scale and acid-base behavior.",
                icon: "🧫"
            },
            {
                name: "Metals & Non-metals",
                desc: "Compare properties of metals and non-metals.",
                icon: "🔩"
            },
            {
                name: "Carbon Chemistry",
                desc: "Explore carbon chains and basic organic structures.",
                icon: "🧬"
            }
        ],

        advanced: [
            {
                name: "Mole Concept",
                desc: "Convert particles, moles and mass interactively.",
                icon: "🔢"
            },
            {
                name: "Stoichiometry",
                desc: "Experiment with reactant quantities and products.",
                icon: "⚖️"
            },
            {
                name: "States of Matter",
                desc: "Change temperature and watch particles move.",
                icon: "🌡️"
            },
            {
                name: "Solutions",
                desc: "Change solute and solvent quantities to explore concentration.",
                icon: "🥤"
            },
            {
                name: "Thermodynamics",
                desc: "Explore heat, energy and enthalpy.",
                icon: "🔥"
            },
            {
                name: "Chemical Equilibrium",
                desc: "Change concentrations and observe equilibrium.",
                icon: "⚖️"
            }
        ],

        pro: [
            {
                name: "Ionic Equilibrium",
                desc: "Explore ion concentration and equilibrium.",
                icon: "🧪"
            },
            {
                name: "Electrochemistry",
                desc: "Explore electrodes, ions and electrochemical cells.",
                icon: "🔋"
            },
            {
                name: "Chemical Kinetics",
                desc: "Explore how concentration and temperature affect reactions.",
                icon: "⏱️"
            },
            {
                name: "Organic Chemistry",
                desc: "Build simple carbon-based molecular structures.",
                icon: "🧬"
            },
            {
                name: "Coordination Chemistry",
                desc: "Explore central metal ions and ligands.",
                icon: "🔗"
            },
            {
                name: "Biochemistry",
                desc: "Explore carbohydrates, proteins, lipids and DNA.",
                icon: "🧬"
            }
        ]
    }
};


/* =========================================================
   TOPIC NORMALIZER
   ========================================================= */

function topicKey(name) {

    return name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "");

}


/* =========================================================
   RENDER TOPIC CARDS
   ========================================================= */

function renderTopics(subject, level) {

    const grid = $(`#${subject}TopicGrid`);

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    const list = topics[subject][level];

    list.forEach((topic, index) => {

        const card = document.createElement("div");

        card.className = "topic-card ready";

        card.innerHTML = `
            <div class="topic-icon">
                ${topic.icon}
            </div>

            <div class="topic-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <h3 class="topic-name">
                ${topic.name}
            </h3>

            <p class="topic-desc">
                ${topic.desc}
            </p>

            <button class="btn small-btn">
                Explore →
            </button>
        `;

        card
            .querySelector("button")
            .addEventListener("click", () => {

                if (topic.special === "periodic") {
                    openChemistStudies();
                } else {
                    openLab(subject, topic.name);
                }

            });

        grid.appendChild(card);

    });

}


/* =========================================================
   LEVEL TABS
   ========================================================= */

$$(".level-btn").forEach(button => {

    button.addEventListener("click", () => {

        const subject = button.dataset.subject;
        const level = button.dataset.level;

        $$(
            `.level-btn[data-subject="${subject}"]`
        ).forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTopics(subject, level);

    });

});


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast = $("#toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);

}


/* =========================================================
   LAB MODAL
   ========================================================= */

function openLab(subject, topic) {

    if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
    }

    labTitle.textContent = topic;
    labSubtitle.textContent =
        `${subject === "physics" ? "Physics" : "Chemistry"} Interactive Laboratory`;

    labContent.innerHTML = "";

    labModal.classList.add("open");
    document.body.classList.add("modal-open");

    const key = topicKey(topic);

    const simulation = simulations[key];

    if (simulation) {

        activeCleanup = simulation(labContent);

    } else {

        renderGenericLab(labContent, topic);

    }

    showToast(`${topic} lab opened`);

}


function closeLab() {

    if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
    }

    labContent.innerHTML = "";

    labModal.classList.remove("open");

    document.body.classList.remove("modal-open");

}


/* =========================================================
   CLOSE LAB EVENTS
   ========================================================= */

$("#closeLabBtn").addEventListener("click", closeLab);

labModal.addEventListener("click", event => {

    if (event.target === labModal) {
        closeLab();
    }

});


/* =========================================================
   GENERIC LAB
   ========================================================= */

function renderGenericLab(container, topic) {

    container.innerHTML = `

        <div class="lab-intro-card">

            <div class="big-lab-icon">
                🔬
            </div>

            <h3>${topic}</h3>

            <p>
                This interactive laboratory lets you explore
                the important ideas behind ${topic}.
            </p>

            <div class="concept-grid">

                <div>
                    <strong>01</strong>
                    <span>Observe</span>
                </div>

                <div>
                    <strong>02</strong>
                    <span>Change values</span>
                </div>

                <div>
                    <strong>03</strong>
                    <span>Experiment</span>
                </div>

            </div>

        </div>

    `;

    return () => {};
}


/* =========================================================
   THREE.JS HELPERS
   ========================================================= */

function createThreeScene(container, options = {}) {

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
        options.background || 0x0d1117
    );


    const camera = new THREE.PerspectiveCamera(
        45,
        Math.max(container.clientWidth, 300) /
        Math.max(container.clientHeight, 400),
        0.1,
        1000
    );

    camera.position.set(
        options.cameraX || 0,
        options.cameraY || 2,
        options.cameraZ || 8
    );


    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth || 700,
        container.clientHeight || 430
    );

    container.appendChild(renderer.domElement);


    const ambient = new THREE.AmbientLight(
        0xffffff,
        0.8
    );

    scene.add(ambient);


    const light = new THREE.PointLight(
        0xffffff,
        1.5
    );

    light.position.set(5, 6, 8);

    scene.add(light);


    const clock = new THREE.Clock();

    let animationId;


    function animate(callback) {

        function frame() {

            animationId = requestAnimationFrame(frame);

            const time = clock.getElapsedTime();

            if (callback) {
                callback(time);
            }

            renderer.render(scene, camera);

        }

        frame();

    }


    function resize() {

        const width =
            container.clientWidth || 700;

        const height =
            container.clientHeight || 430;

        camera.aspect = width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    }


    window.addEventListener("resize", resize);


    function cleanup() {

        cancelAnimationFrame(animationId);

        window.removeEventListener(
            "resize",
            resize
        );

        renderer.dispose();

        if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(
                renderer.domElement
            );
        }

    }


    return {
        scene,
        camera,
        renderer,
        animate,
        cleanup
    };

}


/* =========================================================
   3D OBJECT HELPERS
   ========================================================= */

function createSphere(
    radius,
    color,
    position = [0, 0, 0]
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            32,
            32
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.35,
            metalness: 0.1
        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        position[0],
        position[1],
        position[2]
    );

    return mesh;

}


function createCylinder(
    radius,
    height,
    color,
    position = [0, 0, 0]
) {

    const geometry =
        new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            32
        );

    const material =
        new THREE.MeshStandardMaterial({
            color
        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        position[0],
        position[1],
        position[2]
    );

    return mesh;

}


function createLine(
    start,
    end,
    color = 0x58a6ff
) {

    const geometry =
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(
                start[0],
                start[1],
                start[2]
            ),
            new THREE.Vector3(
                end[0],
                end[1],
                end[2]
            )
        ]);

    const material =
        new THREE.LineBasicMaterial({
            color
        });

    return new THREE.Line(
        geometry,
        material
    );

}


/* =========================================================
   UI CONTROL HELPERS
   ========================================================= */

function makeRange(
    label,
    min,
    max,
    value,
    step,
    onInput
) {

    const wrapper =
        document.createElement("div");

    wrapper.className = "sim-control";

    const title =
        document.createElement("label");

    title.innerHTML =
        `<span>${label}</span>
         <b>${value}</b>`;

    const input =
        document.createElement("input");

    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;

    input.addEventListener("input", () => {

        title.querySelector("b").textContent =
            input.value;

        onInput(Number(input.value));

    });

    wrapper.appendChild(title);
    wrapper.appendChild(input);

    return wrapper;

}


function createLabLayout(container) {

    container.innerHTML = `

        <div class="simulation-layout">

            <div class="simulation-stage"></div>

            <div class="simulation-controls"></div>

        </div>

        <div class="simulation-info"></div>

    `;

    return {
        stage: container.querySelector(
            ".simulation-stage"
        ),
        controls: container.querySelector(
            ".simulation-controls"
        ),
        info: container.querySelector(
            ".simulation-info"
        )
    };

}


/* =========================================================
   SIMULATIONS
   ========================================================= */

const simulations = {};


/* =========================================================
   MOTION
   ========================================================= */

simulations.motion = function(container) {

    const ui = createLabLayout(container);

    ui.controls.innerHTML = "";

    let speed = 5;
    let acceleration = 0;

    const speedControl = makeRange(
        "Speed",
        0,
        20,
        speed,
        0.1,
        value => {
            speed = value;
        }
    );

    const accelerationControl = makeRange(
        "Acceleration",
        -5,
        5,
        acceleration,
        0.1,
        value => {
            acceleration = value;
        }
    );

    ui.controls.appendChild(speedControl);
    ui.controls.appendChild(accelerationControl);


    const sim =
        createThreeScene(
            ui.stage,
            {
                cameraY: 2,
                cameraZ: 10
            }
        );


    const track =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                12,
                0.15,
                1
            ),
            new THREE.MeshStandardMaterial({
                color: 0x30363d
            })
        );

    track.position.y = -1;

    sim.scene.add(track);


    const car =
        createSphere(
            0.65,
            0x58a6ff
        );

    car.scale.set(
        1.5,
        0.65,
        0.8
    );

    car.position.set(
        -5,
        -0.25,
        0
    );

    sim.scene.add(car);


    let velocity = speed;
    let position = -5;


    sim.animate(() => {

        velocity += acceleration * 0.016;

        velocity = Math.max(
            -20,
            Math.min(20, velocity)
        );

        position += velocity * 0.016;

        if (position > 5.3) {
            position = -5.3;
        }

        if (position < -5.3) {
            position = 5.3;
        }

        car.position.x = position;

        ui.info.innerHTML = `
            <strong>Motion</strong>
            <span>Velocity: ${velocity.toFixed(2)} m/s</span>
            <span>Acceleration: ${acceleration.toFixed(2)} m/s²</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   FORCE & LAWS
   ========================================================= */

simulations.forceandlaws = function(container) {

    const ui = createLabLayout(container);

    let mass = 5;
    let force = 20;

    ui.controls.appendChild(
        makeRange(
            "Mass (kg)",
            1,
            20,
            mass,
            1,
            value => {
                mass = value;
            }
        )
    );

    ui.controls.appendChild(
        makeRange(
            "Force (N)",
            0,
            100,
            force,
            1,
            value => {
                force = value;
            }
        )
    );


    const sim =
        createThreeScene(
            ui.stage,
            {
                cameraZ: 9
            }
        );


    const ground =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                10,
                0.2,
                2
            ),
            new THREE.MeshStandardMaterial({
                color: 0x30363d
            })
        );

    ground.position.y = -1.5;

    sim.scene.add(ground);


    const box =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.4,
                1.4,
                1.4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x58a6ff
            })
        );

    box.position.y = -0.8;

    sim.scene.add(box);


    let x = -3;


    sim.animate(() => {

        const acceleration =
            force / mass;

        x += acceleration * 0.01;

        if (x > 3) {
            x = -3;
        }

        box.position.x = x;

        ui.info.innerHTML = `
            <strong>Newton's Second Law</strong>
            <span>F = ma</span>
            <span>Acceleration = ${acceleration.toFixed(2)} m/s²</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   GRAVITATION
   ========================================================= */

simulations.gravitation = function(container) {

    const ui = createLabLayout(container);

    let gravity = 9.8;

    ui.controls.appendChild(
        makeRange(
            "Gravity",
            0,
            25,
            gravity,
            0.1,
            value => {
                gravity = value;
            }
        )
    );


    const sim =
        createThreeScene(
            ui.stage,
            {
                cameraY: 1,
                cameraZ: 9
            }
        );


    const planet =
        createSphere(
            1.7,
            0x1f6feb
        );

    planet.position.y = -1.5;

    sim.scene.add(planet);


    const moon =
        createSphere(
            0.45,
            0xc9d1d9
        );

    sim.scene.add(moon);


    let angle = 0;


    sim.animate(time => {

        angle += 0.01 *
            (gravity / 9.8);

        moon.position.x =
            Math.cos(angle) * 3.2;

        moon.position.y =
            Math.sin(angle) * 1.6 - 1.5;

        ui.info.innerHTML = `
            <strong>Gravitational Simulation</strong>
            <span>Gravity: ${gravity.toFixed(1)} m/s²</span>
            <span>Orbital speed changes with gravitational strength.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   WORK ENERGY POWER
   ========================================================= */

simulations.workenergyandpower = function(container) {

    const ui = createLabLayout(container);

    let force = 20;
    let distance = 5;

    ui.controls.appendChild(
        makeRange(
            "Force (N)",
            0,
            100,
            force,
            1,
            value => force = value
        )
    );

    ui.controls.appendChild(
        makeRange(
            "Distance (m)",
            0,
            20,
            distance,
            0.1,
            value => distance = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const box =
        createSphere(
            0.7,
            0x58a6ff
        );

    sim.scene.add(box);


    sim.animate(time => {

        box.position.x =
            Math.sin(time) * 2;

        const work =
            force * distance;

        ui.info.innerHTML = `
            <strong>Work = Force × Distance</strong>
            <span>Work = ${work.toFixed(1)} J</span>
            <span>Force: ${force} N</span>
            <span>Distance: ${distance} m</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   SOUND & WAVES
   ========================================================= */

simulations.soundandwaves = function(container) {

    const ui = createLabLayout(container);

    let frequency = 4;
    let amplitude = 1;

    ui.controls.appendChild(
        makeRange(
            "Frequency",
            1,
            12,
            frequency,
            0.1,
            value => frequency = value
        )
    );

    ui.controls.appendChild(
        makeRange(
            "Amplitude",
            0.2,
            2,
            amplitude,
            0.1,
            value => amplitude = value
        )
    );


    const canvas =
        document.createElement("canvas");

    canvas.className = "wave-canvas";

    ui.stage.appendChild(canvas);

    const ctx =
        canvas.getContext("2d");


    function resizeCanvas() {

        canvas.width =
            canvas.clientWidth *
            window.devicePixelRatio;

        canvas.height =
            canvas.clientHeight *
            window.devicePixelRatio;

        ctx.setTransform(
            window.devicePixelRatio,
            0,
            0,
            window.devicePixelRatio,
            0,
            0
        );

    }


    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    let running = true;


    function draw(time) {

        if (!running) {
            return;
        }

        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.beginPath();

        for (
            let x = 0;
            x < width;
            x++
        ) {

            const y =
                height / 2 +
                Math.sin(
                    x * 0.04 * frequency -
                    time * 4
                ) *
                amplitude *
                40;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

        }

        ctx.strokeStyle = "#58a6ff";
        ctx.lineWidth = 3;
        ctx.stroke();


        ui.info.innerHTML = `
            <strong>Sound Wave</strong>
            <span>Frequency: ${frequency.toFixed(1)} Hz</span>
            <span>Amplitude: ${amplitude.toFixed(1)}</span>
        `;

    }


    let frame;

    function animate(time) {

        frame =
            requestAnimationFrame(animate);

        draw(time / 1000);

    }

    animate(0);


    return () => {

        running = false;

        cancelAnimationFrame(frame);

        window.removeEventListener(
            "resize",
            resizeCanvas
        );

    };

};


/* =========================================================
   LIGHT & REFLECTION
   ========================================================= */

simulations.lightandreflection = function(container) {

    const ui = createLabLayout(container);

    let angle = 35;

    ui.controls.appendChild(
        makeRange(
            "Incident Angle",
            0,
            80,
            angle,
            1,
            value => angle = value
        )
    );


    const canvas =
        document.createElement("canvas");

    canvas.className = "wave-canvas";

    ui.stage.appendChild(canvas);

    const ctx =
        canvas.getContext("2d");


    function draw() {

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        canvas.width =
            w * window.devicePixelRatio;

        canvas.height =
            h * window.devicePixelRatio;

        ctx.setTransform(
            window.devicePixelRatio,
            0,
            0,
            window.devicePixelRatio,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        const cx = w / 2;
        const cy = h / 2;


        ctx.strokeStyle = "#8b949e";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(50, cy);
        ctx.lineTo(w - 50, cy);
        ctx.stroke();


        const radians =
            angle * Math.PI / 180;


        ctx.strokeStyle = "#58a6ff";
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            cx -
            Math.sin(radians) * 180,
            cy -
            Math.cos(radians) * 180
        );

        ctx.lineTo(
            cx,
            cy
        );

        ctx.stroke();


        ctx.strokeStyle = "#79c0ff";

        ctx.beginPath();

        ctx.moveTo(
            cx,
            cy
        );

        ctx.lineTo(
            cx +
            Math.sin(radians) * 180,
            cy -
            Math.cos(radians) * 180
        );

        ctx.stroke();


        ctx.strokeStyle = "#6e7681";
        ctx.setLineDash([8, 8]);

        ctx.beginPath();

        ctx.moveTo(
            cx,
            cy - 190
        );

        ctx.lineTo(
            cx,
            cy + 190
        );

        ctx.stroke();

        ctx.setLineDash([]);


        ui.info.innerHTML = `
            <strong>Law of Reflection</strong>
            <span>Angle of incidence = ${angle}°</span>
            <span>Angle of reflection = ${angle}°</span>
        `;

    }


    draw();

    window.addEventListener(
        "resize",
        draw
    );


    return () => {

        window.removeEventListener(
            "resize",
            draw
        );

    };

};


/* =========================================================
   REFRACTION & LENSES
   ========================================================= */

simulations.refractionandlenses = function(container) {

    const ui = createLabLayout(container);

    let refractiveIndex = 1.5;

    ui.controls.appendChild(
        makeRange(
            "Refractive Index",
            1,
            2.5,
            refractiveIndex,
            0.01,
            value => refractiveIndex = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const glass =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4,
                4,
                0.4
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x58a6ff,
                transparent: true,
                opacity: 0.25
            })
        );

    sim.scene.add(glass);


    const ray =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.035,
                0.035,
                6,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffcc66
            })
        );

    ray.rotation.z =
        Math.PI / 2.8;

    sim.scene.add(ray);


    sim.animate(time => {

        glass.rotation.y =
            Math.sin(time * 0.5) * 0.15;

        ui.info.innerHTML = `
            <strong>Refraction</strong>
            <span>Refractive index: ${refractiveIndex.toFixed(2)}</span>
            <span>Higher refractive index → stronger bending of light.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ELECTRICITY
   ========================================================= */

simulations.electricity = function(container) {

    const ui = createLabLayout(container);

    let voltage = 12;
    let resistance = 6;

    ui.controls.appendChild(
        makeRange(
            "Voltage (V)",
            1,
            24,
            voltage,
            1,
            value => voltage = value
        )
    );

    ui.controls.appendChild(
        makeRange(
            "Resistance (Ω)",
            1,
            20,
            resistance,
            1,
            value => resistance = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const battery =
        createCylinder(
            0.7,
            1.6,
            0x58a6ff,
            [-3, 0, 0]
        );

    sim.scene.add(battery);


    const bulb =
        createSphere(
            0.65,
            0xffcc66,
            [3, 0, 0]
        );

    sim.scene.add(bulb);


    const wire1 =
        createLine(
            [-3, 0.8, 0],
            [3, 0.8, 0]
        );

    const wire2 =
        createLine(
            [-3, -0.8, 0],
            [3, -0.8, 0]
        );

    sim.scene.add(wire1);
    sim.scene.add(wire2);


    sim.animate(time => {

        const current =
            voltage / resistance;

        const brightness =
            Math.min(
                2,
                current / 2
            );

        bulb.material.emissive =
            new THREE.Color(
                0xffaa22
            );

        bulb.material.emissiveIntensity =
            brightness;

        bulb.scale.setScalar(
            1 + Math.sin(time * 8) * 0.03
        );


        ui.info.innerHTML = `
            <strong>Ohm's Law</strong>
            <span>I = V / R</span>
            <span>Current = ${current.toFixed(2)} A</span>
            <span>Power = ${(voltage * current).toFixed(2)} W</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   MAGNETISM
   ========================================================= */

simulations.magnetism = function(container) {

    const ui = createLabLayout(container);

    let current = 5;

    ui.controls.appendChild(
        makeRange(
            "Current (A)",
            1,
            20,
            current,
            1,
            value => current = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const wire =
        createCylinder(
            0.12,
            5,
            0x8b949e
        );

    wire.rotation.z =
        Math.PI / 2;

    sim.scene.add(wire);


    const rings = [];


    for (let i = 1; i <= 4; i++) {

        const ring =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    i * 0.6,
                    0.025,
                    12,
                    64
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x58a6ff
                })
            );

        ring.rotation.y =
            Math.PI / 2;

        sim.scene.add(ring);

        rings.push(ring);

    }


    sim.animate(time => {

        rings.forEach(
            (ring, index) => {

                ring.rotation.x =
                    time * current *
                    0.1 *
                    (index + 1);

            }
        );


        ui.info.innerHTML = `
            <strong>Magnetic Field</strong>
            <span>Current = ${current} A</span>
            <span>Magnetic field strength increases with current.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   HEAT & THERMODYNAMICS
   ========================================================= */

simulations.heatandthermodynamics = function(container) {

    const ui = createLabLayout(container);

    let temperature = 50;

    ui.controls.appendChild(
        makeRange(
            "Temperature",
            0,
            100,
            temperature,
            1,
            value => temperature = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const particles = [];


    for (let i = 0; i < 30; i++) {

        const particle =
            createSphere(
                0.12,
                0x58a6ff
            );

        particle.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );

        sim.scene.add(particle);

        particles.push({
            mesh: particle,
            vx: Math.random() - 0.5,
            vy: Math.random() - 0.5
        });

    }


    sim.animate(() => {

        const speed =
            0.005 +
            temperature * 0.0008;


        particles.forEach(p => {

            p.mesh.position.x +=
                p.vx * speed * 10;

            p.mesh.position.y +=
                p.vy * speed * 10;


            if (
                Math.abs(p.mesh.position.x) > 3
            ) {
                p.vx *= -1;
            }

            if (
                Math.abs(p.mesh.position.y) > 1.5
            ) {
                p.vy *= -1;
            }

        });


        ui.info.innerHTML = `
            <strong>Particle Motion</strong>
            <span>Temperature: ${temperature}°C</span>
            <span>Higher temperature → faster particle motion.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   KINETIC THEORY
   ========================================================= */

simulations.kinetictheory = simulations.heatandthermodynamics;


/* =========================================================
   ELECTROMAGNETIC INDUCTION
   ========================================================= */

simulations.electromagneticinduction = function(container) {

    const ui = createLabLayout(container);

    let speed = 5;

    ui.controls.appendChild(
        makeRange(
            "Magnet Speed",
            1,
            10,
            speed,
            0.1,
            value => speed = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const coil =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.4,
                0.15,
                16,
                80
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd29922
            })
        );

    sim.scene.add(coil);


    const magnet =
        createSphere(
            0.5,
            0xf85149
        );

    sim.scene.add(magnet);


    sim.animate(time => {

        magnet.position.x =
            Math.sin(
                time * speed
            ) * 2.4;

        const emf =
            Math.abs(
                Math.cos(
                    time * speed
                )
            ) * speed;

        ui.info.innerHTML = `
            <strong>Electromagnetic Induction</strong>
            <span>Magnet speed: ${speed.toFixed(1)}</span>
            <span>Relative induced EMF: ${emf.toFixed(2)}</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   MODERN PHYSICS
   ========================================================= */

simulations.modernphysics = function(container) {

    const ui = createLabLayout(container);

    let frequency = 5;

    ui.controls.appendChild(
        makeRange(
            "Light Frequency",
            1,
            10,
            frequency,
            0.1,
            value => frequency = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const photon =
        createSphere(
            0.18,
            0x79c0ff
        );

    sim.scene.add(photon);


    const electron =
        createSphere(
            0.3,
            0xffcc66
        );

    electron.position.set(
        0,
        -1.5,
        0
    );

    sim.scene.add(electron);


    sim.animate(time => {

        photon.position.x =
            -4 +
            ((time * frequency) % 8);

        photon.position.y =
            Math.sin(time * 5) * 0.5;


        if (
            photon.position.x > 0
        ) {

            electron.position.y =
                -1.5 +
                Math.max(
                    0,
                    Math.sin(
                        (time - 1) * 4
                    )
                ) * 3;

        }


        ui.info.innerHTML = `
            <strong>Photon Energy</strong>
            <span>E = hf</span>
            <span>Frequency: ${frequency.toFixed(1)} units</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ATOMS & NUCLEI
   ========================================================= */

simulations.atomsandnuclei = function(container) {

    return simulations.atomicstructure(container);

};


/* =========================================================
   ATOMIC STRUCTURE
   ========================================================= */

simulations.atomicstructure = function(container) {

    const ui = createLabLayout(container);

    let electrons = 6;

    ui.controls.appendChild(
        makeRange(
            "Electrons",
            1,
            18,
            electrons,
            1,
            value => {
                electrons = value;
                rebuild();
            }
        )
    );


    const sim =
        createThreeScene(
            ui.stage,
            {
                cameraZ: 10
            }
        );


    const atomGroup =
        new THREE.Group();

    sim.scene.add(atomGroup);


    function rebuild() {

        atomGroup.clear();


        const nucleus =
            createSphere(
                0.65,
                0xf85149
            );

        atomGroup.add(nucleus);


        const shells = [
            2,
            8,
            8
        ];

        let remaining =
            electrons;


        shells.forEach(
            (count, shellIndex) => {

                if (remaining <= 0) {
                    return;
                }

                const actual =
                    Math.min(
                        remaining,
                        count
                    );

                remaining -= actual;


                const radius =
                    1.4 +
                    shellIndex * 0.85;


                const ring =
                    new THREE.Mesh(
                        new THREE.TorusGeometry(
                            radius,
                            0.025,
                            12,
                            64
                        ),
                        new THREE.MeshBasicMaterial({
                            color: 0x58a6ff
                        })
                    );

                ring.rotation.x =
                    Math.PI / 2;

                atomGroup.add(ring);


                for (
                    let i = 0;
                    i < actual;
                    i++
                ) {

                    const angle =
                        i /
                        actual *
                        Math.PI *
                        2;

                    const electron =
                        createSphere(
                            0.12,
                            0x79c0ff,
                            [
                                Math.cos(angle) * radius,
                                0,
                                Math.sin(angle) * radius
                            ]
                        );

                    atomGroup.add(
                        electron
                    );

                }

            }
        );

    }


    rebuild();


    sim.animate(time => {

        atomGroup.rotation.y =
            time * 0.3;


        ui.info.innerHTML = `
            <strong>Atomic Structure</strong>
            <span>Electrons: ${electrons}</span>
            <span>Electron shells are shown as orbital rings.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   OPTICAL INSTRUMENTS
   ========================================================= */

simulations.opticalinstruments = simulations.refractionandlenses;


/* =========================================================
   FLUID MECHANICS
   ========================================================= */

simulations.fluidmechanics = function(container) {

    const ui = createLabLayout(container);

    let pressure = 50;

    ui.controls.appendChild(
        makeRange(
            "Pressure",
            0,
            100,
            pressure,
            1,
            value => pressure = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const water =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                3,
                2
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x58a6ff,
                transparent: true,
                opacity: 0.35
            })
        );

    water.position.y = -0.5;

    sim.scene.add(water);


    const bubbles = [];


    for (let i = 0; i < 20; i++) {

        const bubble =
            createSphere(
                0.08,
                0xe6edf3,
                [
                    (Math.random() - 0.5) * 4,
                    -1.5 + Math.random() * 3,
                    (Math.random() - 0.5) * 1.5
                ]
            );

        sim.scene.add(bubble);

        bubbles.push(bubble);

    }


    sim.animate(() => {

        bubbles.forEach(
            bubble => {

                bubble.position.y +=
                    0.01;

                if (
                    bubble.position.y > 1
                ) {
                    bubble.position.y = -2;
                }

            }
        );


        ui.info.innerHTML = `
            <strong>Fluid Mechanics</strong>
            <span>Pressure: ${pressure}</span>
            <span>Pressure increases with depth in a fluid.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   QUANTUM PHYSICS
   ========================================================= */

simulations.quantumphysics = function(container) {

    const ui = createLabLayout(container);

    let energy = 5;

    ui.controls.appendChild(
        makeRange(
            "Energy Level",
            1,
            10,
            energy,
            1,
            value => energy = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const wave =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                2,
                0.06,
                12,
                80
            ),
            new THREE.MeshBasicMaterial({
                color: 0x58a6ff
            })
        );

    sim.scene.add(wave);


    sim.animate(time => {

        wave.scale.set(
            1 + Math.sin(
                time * energy
            ) * 0.25,
            1 + Math.sin(
                time * energy
            ) * 0.25,
            1
        );

        wave.rotation.z =
            time * 0.5;


        ui.info.innerHTML = `
            <strong>Quantum Energy</strong>
            <span>Energy level: ${energy}</span>
            <span>Quantum systems can occupy discrete energy states.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   RELATIVITY
   ========================================================= */

simulations.relativity = function(container) {

    const ui = createLabLayout(container);

    let velocity = 0.5;

    ui.controls.appendChild(
        makeRange(
            "Velocity / c",
            0,
            0.99,
            velocity,
            0.01,
            value => velocity = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const ship =
        createSphere(
            0.5,
            0x58a6ff
        );

    sim.scene.add(ship);


    sim.animate(time => {

        const gamma =
            1 /
            Math.sqrt(
                1 - velocity * velocity
            );


        ship.position.x =
            Math.sin(time * 2) * 3;


        ui.info.innerHTML = `
            <strong>Special Relativity</strong>
            <span>Velocity: ${(velocity * 100).toFixed(0)}% of c</span>
            <span>Lorentz factor γ: ${gamma.toFixed(3)}</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ELECTROMAGNETIC WAVES
   ========================================================= */

simulations.electromagneticwaves = function(container) {

    const ui = createLabLayout(container);

    let frequency = 3;

    ui.controls.appendChild(
        makeRange(
            "Frequency",
            1,
            10,
            frequency,
            0.1,
            value => frequency = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const electric =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.5,
                0.05,
                8,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x58a6ff
            })
        );

    sim.scene.add(electric);


    const magnetic =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.5,
                0.05,
                8,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0xf85149
            })
        );

    magnetic.rotation.x =
        Math.PI / 2;

    sim.scene.add(magnetic);


    sim.animate(time => {

        electric.scale.setScalar(
            1 +
            Math.sin(
                time * frequency
            ) *
            0.3
        );

        magnetic.scale.setScalar(
            1 +
            Math.sin(
                time * frequency +
                Math.PI / 2
            ) *
            0.3
        );


        ui.info.innerHTML = `
            <strong>Electromagnetic Wave</strong>
            <span>Electric and magnetic fields oscillate perpendicular to each other.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   SEMICONDUCTOR PHYSICS
   ========================================================= */

simulations.semiconductorphysics = function(container) {

    const ui = createLabLayout(container);

    let voltage = 5;

    ui.controls.appendChild(
        makeRange(
            "Voltage",
            0,
            10,
            voltage,
            0.1,
            value => voltage = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const electrons = [];


    for (let i = 0; i < 12; i++) {

        const electron =
            createSphere(
                0.12,
                0x58a6ff,
                [
                    -3 +
                    Math.random() * 6,
                    -1 +
                    Math.random() * 2,
                    0
                ]
            );

        sim.scene.add(electron);

        electrons.push(electron);

    }


    sim.animate(() => {

        electrons.forEach(
            electron => {

                electron.position.x +=
                    voltage * 0.002;

                if (
                    electron.position.x > 3
                ) {
                    electron.position.x = -3;
                }

            }
        );


        ui.info.innerHTML = `
            <strong>Semiconductor</strong>
            <span>Applied voltage: ${voltage.toFixed(1)} V</span>
            <span>Electrons drift through the material.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   NUCLEAR PHYSICS
   ========================================================= */

simulations.nuclearphysics = function(container) {

    const ui = createLabLayout(container);

    let halfLife = 5;

    ui.controls.appendChild(
        makeRange(
            "Half-life",
            1,
            20,
            halfLife,
            1,
            value => halfLife = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const nucleus =
        createSphere(
            1,
            0xf85149
        );

    sim.scene.add(nucleus);


    const particles = [];


    for (let i = 0; i < 10; i++) {

        const p =
            createSphere(
                0.12,
                0x79c0ff
            );

        sim.scene.add(p);

        particles.push({
            mesh: p,
            angle: Math.random() * Math.PI * 2
        });

    }


    sim.animate(time => {

        particles.forEach(
            (particle, index) => {

                const r =
                    1.5 +
                    ((time / halfLife) %
                    3);

                particle.mesh.position.x =
                    Math.cos(
                        particle.angle
                    ) * r;

                particle.mesh.position.y =
                    Math.sin(
                        particle.angle
                    ) * r;

            }
        );


        ui.info.innerHTML = `
            <strong>Radioactive Decay</strong>
            <span>Half-life: ${halfLife} time units</span>
            <span>Decay follows an exponential law.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ASTROPHYSICS
   ========================================================= */

simulations.astrophysics = function(container) {

    const ui = createLabLayout(container);

    let orbitalSpeed = 1;

    ui.controls.appendChild(
        makeRange(
            "Orbital Speed",
            0.2,
            3,
            orbitalSpeed,
            0.1,
            value => orbitalSpeed = value
        )
    );


    const sim =
        createThreeScene(
            ui.stage,
            {
                cameraZ: 12
            }
        );


    const star =
        createSphere(
            1,
            0xffcc66
        );

    sim.scene.add(star);


    const planet =
        createSphere(
            0.3,
            0x58a6ff
        );

    sim.scene.add(planet);


    sim.animate(time => {

        const angle =
            time * orbitalSpeed;

        planet.position.x =
            Math.cos(angle) * 3;

        planet.position.z =
            Math.sin(angle) * 3;


        ui.info.innerHTML = `
            <strong>Planetary Orbit</strong>
            <span>Orbital speed: ${orbitalSpeed.toFixed(1)}</span>
            <span>Gravity keeps planets in orbit around stars.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   MATTER & ITS NATURE
   ========================================================= */

simulations.matteranditsnature =
    simulations.heatandthermodynamics;


/* =========================================================
   CHEMICAL BONDING
   ========================================================= */

simulations.chemicalbonding = function(container) {

    const ui = createLabLayout(container);

    let molecule = "H₂O";

    const buttons =
        document.createElement("div");

    buttons.className = "mol-select";


    ["H₂O", "CO₂", "CH₄", "NH₃"].forEach(
        formula => {

            const button =
                document.createElement("button");

            button.className = "mol-btn";
            button.textContent = formula;

            button.addEventListener(
                "click",
                () => {
                    molecule = formula;
                    buildMolecule();
                }
            );

            buttons.appendChild(button);

        }
    );


    ui.controls.appendChild(buttons);


    const sim =
        createThreeScene(ui.stage);


    const group =
        new THREE.Group();

    sim.scene.add(group);


    function atom(
        radius,
        color,
        position
    ) {

        const mesh =
            createSphere(
                radius,
                color,
                position
            );

        group.add(mesh);

    }


    function bond(
        a,
        b
    ) {

        const line =
            createLine(
                a,
                b,
                0xc9d1d9
            );

        group.add(line);

    }


    function buildMolecule() {

        group.clear();


        if (molecule === "H₂O") {

            atom(
                0.55,
                0xf85149,
                [0, 0, 0]
            );

            atom(
                0.3,
                0xe6edf3,
                [-1, -0.7, 0]
            );

            atom(
                0.3,
                0xe6edf3,
                [1, -0.7, 0]
            );

            bond(
                [0, 0, 0],
                [-1, -0.7, 0]
            );

            bond(
                [0, 0, 0],
                [1, -0.7, 0]
            );

        }


        if (molecule === "CO₂") {

            atom(
                0.6,
                0xf85149,
                [0, 0, 0]
            );

            atom(
                0.45,
                0x8b949e,
                [-1.6, 0, 0]
            );

            atom(
                0.45,
                0x8b949e,
                [1.6, 0, 0]
            );

            bond(
                [-1.6, 0, 0],
                [0, 0, 0]
            );

            bond(
                [0, 0, 0],
                [1.6, 0, 0]
            );

        }


        if (molecule === "CH₄") {

            atom(
                0.55,
                0x8b949e,
                [0, 0, 0]
            );

            const positions = [
                [1.2, 0.8, 0],
                [-1.2, 0.8, 0],
                [0, -1.2, 0.8],
                [0, -1.2, -0.8]
            ];

            positions.forEach(
                position => {

                    atom(
                        0.28,
                        0xe6edf3,
                        position
                    );

                    bond(
                        [0, 0, 0],
                        position
                    );

                }
            );

        }


        if (molecule === "NH₃") {

            atom(
                0.55,
                0x58a6ff,
                [0, 0.3, 0]
            );

            const positions = [
                [1, -0.8, 0],
                [-1, -0.8, 0],
                [0, -0.8, 1]
            ];

            positions.forEach(
                position => {

                    atom(
                        0.28,
                        0xe6edf3,
                        position
                    );

                    bond(
                        [0, 0.3, 0],
                        position
                    );

                }
            );

        }

    }


    buildMolecule();


    sim.animate(time => {

        group.rotation.y =
            time * 0.35;


        ui.info.innerHTML = `
            <strong>Molecular Structure</strong>
            <span>Selected molecule: ${molecule}</span>
            <span>Atoms are connected by simplified chemical bonds.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   CHEMICAL REACTIONS
   ========================================================= */

simulations.chemicalreactions = function(container) {

    const ui = createLabLayout(container);

    let reaction = 0;

    const reactions = [
        "2H₂ + O₂ → 2H₂O",
        "CH₄ + 2O₂ → CO₂ + 2H₂O",
        "HCl + NaOH → NaCl + H₂O"
    ];


    const button =
        document.createElement("button");

    button.className = "btn small-btn";
    button.textContent = "Run Reaction";


    ui.controls.appendChild(button);


    const sim =
        createThreeScene(ui.stage);


    const particles = [];


    button.addEventListener(
        "click",
        () => {

            reaction++;

            if (
                reaction >= reactions.length
            ) {
                reaction = 0;
            }

            particles.forEach(
                particle =>
                    sim.scene.remove(
                        particle
                    )
            );

            particles.length = 0;


            for (let i = 0; i < 12; i++) {

                const p =
                    createSphere(
                        0.15 +
                        Math.random() * 0.15,
                        i % 2
                            ? 0x58a6ff
                            : 0xf85149
                    );

                p.position.set(
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 3,
                    0
                );

                sim.scene.add(p);

                particles.push(p);

            }

        }
    );


    sim.animate(time => {

        particles.forEach(
            (particle, index) => {

                particle.position.x +=
                    Math.sin(
                        time + index
                    ) * 0.002;

            }
        );


        ui.info.innerHTML = `
            <strong>Reaction</strong>
            <span>${reactions[reaction]}</span>
            <span>Atoms are rearranged; they are not created or destroyed.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ACIDS BASES SALTS
   ========================================================= */

simulations.acidsbasessalts = function(container) {

    const ui = createLabLayout(container);

    let ph = 7;

    ui.controls.appendChild(
        makeRange(
            "pH",
            0,
            14,
            ph,
            0.1,
            value => ph = value
        )
    );


    const scale =
        document.createElement("div");

    scale.className =
        "ph-large-scale";


    const marker =
        document.createElement("div");

    marker.className =
        "ph-large-marker";


    scale.appendChild(marker);

    ui.stage.appendChild(scale);


    function update() {

        marker.style.left =
            `${(ph / 14) * 100}%`;


        let type = "Neutral";

        if (ph < 7) {
            type = "Acidic";
        }

        if (ph > 7) {
            type = "Basic";
        }


        ui.info.innerHTML = `
            <strong>pH Scale</strong>
            <span>pH = ${ph.toFixed(1)}</span>
            <span>Solution: ${type}</span>
        `;

    }


    update();


    return () => {};

};


/* =========================================================
   METALS & NON-METALS
   ========================================================= */

simulations.metalsandnonmetals = function(container) {

    const ui = createLabLayout(container);

    let conductivity = 80;

    ui.controls.appendChild(
        makeRange(
            "Conductivity",
            0,
            100,
            conductivity,
            1,
            value => conductivity = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const metal =
        createSphere(
            1,
            0xd29922,
            [-2, 0, 0]
        );

    const nonmetal =
        createSphere(
            1,
            0x58a6ff,
            [2, 0, 0]
        );


    sim.scene.add(metal);
    sim.scene.add(nonmetal);


    sim.animate(time => {

        metal.rotation.y =
            time;

        nonmetal.rotation.y =
            -time;


        ui.info.innerHTML = `
            <strong>Metals vs Non-metals</strong>
            <span>Selected conductivity: ${conductivity}%</span>
            <span>Metals generally conduct electricity better than non-metals.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   CARBON CHEMISTRY
   ========================================================= */

simulations.carbonchemistry = function(container) {

    return simulations.organicchemistry(container);

};


/* =========================================================
   MOLE CONCEPT
   ========================================================= */

simulations.moleconcept = function(container) {

    const ui = createLabLayout(container);

    let moles = 1;

    ui.controls.appendChild(
        makeRange(
            "Moles",
            0,
            10,
            moles,
            0.1,
            value => moles = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const group =
        new THREE.Group();

    sim.scene.add(group);


    for (let i = 0; i < 100; i++) {

        const p =
            createSphere(
                0.05,
                0x58a6ff
            );

        p.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );

        group.add(p);

    }


    sim.animate(time => {

        group.rotation.y =
            time * 0.15;


        const particles =
            moles *
            6.022e23;


        ui.info.innerHTML = `
            <strong>Mole Concept</strong>
            <span>Moles: ${moles.toFixed(1)}</span>
            <span>Particles represented: ${particles.toExponential(2)}</span>
            <span>1 mole = 6.022 × 10²³ particles.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   STOICHIOMETRY
   ========================================================= */

simulations.stoichiometry = function(container) {

    const ui = createLabLayout(container);

    let reactant = 2;

    ui.controls.appendChild(
        makeRange(
            "Reactant amount",
            0,
            10,
            reactant,
            0.1,
            value => reactant = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const product =
        createSphere(
            0.6,
            0x58a6ff
        );

    sim.scene.add(product);


    sim.animate(time => {

        const productAmount =
            reactant / 2;


        product.scale.setScalar(
            0.5 +
            productAmount * 0.15
        );


        ui.info.innerHTML = `
            <strong>Stoichiometry</strong>
            <span>Reactant: ${reactant.toFixed(1)} mol</span>
            <span>Product: ${productAmount.toFixed(2)} mol</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   STATES OF MATTER
   ========================================================= */

simulations.statesofmatter = function(container) {

    return simulations.heatandthermodynamics(container);

};


/* =========================================================
   SOLUTIONS
   ========================================================= */

simulations.solutions = function(container) {

    const ui = createLabLayout(container);

    let solute = 5;

    ui.controls.appendChild(
        makeRange(
            "Solute",
            0,
            20,
            solute,
            0.1,
            value => solute = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const liquid =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2,
                2,
                3,
                32
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x58a6ff,
                transparent: true,
                opacity: 0.4
            })
        );

    liquid.position.y = -0.5;

    sim.scene.add(liquid);


    sim.animate(time => {

        liquid.scale.y =
            0.7 +
            solute * 0.02;


        ui.info.innerHTML = `
            <strong>Solution</strong>
            <span>Solute amount: ${solute.toFixed(1)} units</span>
            <span>Increasing solute increases concentration.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   THERMODYNAMICS CHEMISTRY
   ========================================================= */

simulations.thermodynamics = simulations.heatandthermodynamics;


/* =========================================================
   CHEMICAL EQUILIBRIUM
   ========================================================= */

simulations.chemicalequilibrium = function(container) {

    const ui = createLabLayout(container);

    let reactant = 50;

    ui.controls.appendChild(
        makeRange(
            "Reactant %",
            0,
            100,
            reactant,
            1,
            value => reactant = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const left =
        createSphere(
            0.7,
            0x58a6ff,
            [-2, 0, 0]
        );

    const right =
        createSphere(
            0.7,
            0xf85149,
            [2, 0, 0]
        );


    sim.scene.add(left);
    sim.scene.add(right);


    sim.animate(time => {

        const equilibrium =
            100 -
            reactant;


        left.scale.setScalar(
            0.5 +
            reactant / 100
        );

        right.scale.setScalar(
            0.5 +
            equilibrium / 100
        );


        ui.info.innerHTML = `
            <strong>Chemical Equilibrium</strong>
            <span>Reactants: ${reactant}%</span>
            <span>Products: ${equilibrium}%</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   IONIC EQUILIBRIUM
   ========================================================= */

simulations.ionicequilibrium = function(container) {

    const ui = createLabLayout(container);

    let concentration = 0.5;

    ui.controls.appendChild(
        makeRange(
            "Ion concentration",
            0,
            1,
            concentration,
            0.01,
            value => concentration = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const ions = [];


    for (let i = 0; i < 20; i++) {

        const ion =
            createSphere(
                0.12,
                i % 2
                    ? 0x58a6ff
                    : 0xf85149
            );

        sim.scene.add(ion);

        ions.push(ion);

    }


    sim.animate(time => {

        ions.forEach(
            (ion, index) => {

                ion.position.x =
                    Math.sin(
                        time +
                        index
                    ) * 2;

                ion.position.y =
                    Math.cos(
                        time * 0.8 +
                        index
                    ) * 1.5;

            }
        );


        ui.info.innerHTML = `
            <strong>Ionic Equilibrium</strong>
            <span>Ion concentration: ${concentration.toFixed(2)} M</span>
            <span>Ion concentration affects equilibrium position.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ELECTROCHEMISTRY
   ========================================================= */

simulations.electrochemistry = function(container) {

    const ui = createLabLayout(container);

    let voltage = 1.5;

    ui.controls.appendChild(
        makeRange(
            "Cell Voltage",
            0,
            3,
            voltage,
            0.01,
            value => voltage = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const anode =
        createCylinder(
            0.5,
            3,
            0xd29922,
            [-2, 0, 0]
        );

    const cathode =
        createCylinder(
            0.5,
            3,
            0x58a6ff,
            [2, 0, 0]
        );


    sim.scene.add(anode);
    sim.scene.add(cathode);


    const ions = [];


    for (let i = 0; i < 12; i++) {

        const ion =
            createSphere(
                0.1,
                i % 2
                    ? 0xf85149
                    : 0x58a6ff
            );

        sim.scene.add(ion);

        ions.push(ion);

    }


    sim.animate(time => {

        ions.forEach(
            (ion, index) => {

                ion.position.x =
                    -1.3 +
                    ((time * 0.5 +
                    index * 0.4) % 2.6);

                ion.position.y =
                    Math.sin(
                        time + index
                    ) * 1.5;

            }
        );


        ui.info.innerHTML = `
            <strong>Electrochemical Cell</strong>
            <span>Cell voltage: ${voltage.toFixed(2)} V</span>
            <span>Ion movement transfers charge through the system.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   CHEMICAL KINETICS
   ========================================================= */

simulations.chemicalkinetics = function(container) {

    const ui = createLabLayout(container);

    let temperature = 25;

    ui.controls.appendChild(
        makeRange(
            "Temperature °C",
            0,
            100,
            temperature,
            1,
            value => temperature = value
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const particles = [];


    for (let i = 0; i < 25; i++) {

        const particle =
            createSphere(
                0.1,
                0x58a6ff
            );

        particle.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 3,
            0
        );

        sim.scene.add(particle);

        particles.push({
            mesh: particle,
            phase: Math.random() * 10
        });

    }


    sim.animate(time => {

        const speed =
            0.3 +
            temperature / 50;


        particles.forEach(
            particle => {

                particle.mesh.position.x +=
                    Math.sin(
                        time +
                        particle.phase
                    ) *
                    speed *
                    0.002;

                particle.mesh.position.y +=
                    Math.cos(
                        time * 1.2 +
                        particle.phase
                    ) *
                    speed *
                    0.002;

            }
        );


        ui.info.innerHTML = `
            <strong>Chemical Kinetics</strong>
            <span>Temperature: ${temperature}°C</span>
            <span>Higher temperature generally increases particle collisions.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   ORGANIC CHEMISTRY
   ========================================================= */

simulations.organicchemistry = function(container) {

    const ui = createLabLayout(container);

    let carbonCount = 4;

    ui.controls.appendChild(
        makeRange(
            "Carbon atoms",
            1,
            10,
            carbonCount,
            1,
            value => {
                carbonCount = value;
                rebuild();
            }
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const group =
        new THREE.Group();

    sim.scene.add(group);


    function rebuild() {

        group.clear();


        for (
            let i = 0;
            i < carbonCount;
            i++
        ) {

            const carbon =
                createSphere(
                    0.35,
                    0x8b949e,
                    [
                        (i -
                        carbonCount / 2) *
                        0.8,
                        0,
                        0
                    ]
                );

            group.add(carbon);


            if (i > 0) {

                const previous =
                    [
                        (
                            i - 1 -
                            carbonCount / 2
                        ) * 0.8,
                        0,
                        0
                    ];

                const current =
                    [
                        (
                            i -
                            carbonCount / 2
                        ) * 0.8,
                        0,
                        0
                    ];

                group.add(
                    createLine(
                        previous,
                        current
                    )
                );

            }

        }

    }


    rebuild();


    sim.animate(time => {

        group.rotation.y =
            Math.sin(time) * 0.3;


        ui.info.innerHTML = `
            <strong>Organic Carbon Chain</strong>
            <span>Carbon atoms: ${carbonCount}</span>
            <span>Carbon can form long chains and many different structures.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   COORDINATION CHEMISTRY
   ========================================================= */

simulations.coordinationchemistry = function(container) {

    const ui = createLabLayout(container);

    let ligands = 4;

    ui.controls.appendChild(
        makeRange(
            "Ligands",
            2,
            8,
            ligands,
            1,
            value => {
                ligands = value;
                rebuild();
            }
        )
    );


    const sim =
        createThreeScene(ui.stage);


    const group =
        new THREE.Group();

    sim.scene.add(group);


    function rebuild() {

        group.clear();


        const metal =
            createSphere(
                0.55,
                0xd29922
            );

        group.add(metal);


        for (
            let i = 0;
            i < ligands;
            i++
        ) {

            const angle =
                i /
                ligands *
                Math.PI *
                2;


            const position = [
                Math.cos(angle) * 2,
                Math.sin(angle) * 2,
                0
            ];


            const ligand =
                createSphere(
                    0.25,
                    0x58a6ff,
                    position
                );

            group.add(ligand);


            group.add(
                createLine(
                    [0, 0, 0],
                    position
                )
            );

        }

    }


    rebuild();


    sim.animate(time => {

        group.rotation.z =
            time * 0.25;


        ui.info.innerHTML = `
            <strong>Coordination Complex</strong>
            <span>Central metal + ${ligands} ligands</span>
            <span>Ligands coordinate around a central metal ion.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   BIOCHEMISTRY
   ========================================================= */

simulations.biochemistry = function(container) {

    const ui = createLabLayout(container);

    let type = "DNA";


    const select =
        document.createElement("select");

    select.className = "lab-select";

    [
        "DNA",
        "Protein",
        "Carbohydrate",
        "Lipid"
    ].forEach(
        value => {

            const option =
                document.createElement("option");

            option.value = value;
            option.textContent = value;

            select.appendChild(option);

        }
    );


    select.addEventListener(
        "change",
        () => {

            type =
                select.value;

            rebuild();

        }
    );


    ui.controls.appendChild(select);


    const sim =
        createThreeScene(ui.stage);


    const group =
        new THREE.Group();

    sim.scene.add(group);


    function rebuild() {

        group.clear();


        for (let i = 0; i < 14; i++) {

            const angle =
                i * 0.7;

            const radius =
                1.4;


            const p =
                createSphere(
                    0.18,
                    i % 2
                        ? 0x58a6ff
                        : 0xf85149,
                    [
                        Math.cos(angle) *
                        radius,
                        i * 0.25 -
                        1.5,
                        Math.sin(angle) *
                        radius
                    ]
                );

            group.add(p);

        }

    }


    rebuild();


    sim.animate(time => {

        group.rotation.y =
            time * 0.4;


        ui.info.innerHTML = `
            <strong>Biochemistry</strong>
            <span>Selected: ${type}</span>
            <span>Biomolecules have complex structures built from smaller units.</span>
        `;

    });


    return sim.cleanup;

};


/* =========================================================
   PERIODIC TABLE / CHEMIST STUDIES
   ========================================================= */

function openChemistStudies() {

    if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
    }

    labModal.classList.remove("open");

    chemistModal.classList.add("open");

    document.body.classList.add("modal-open");

    renderPeriodicTable();

}


/* =========================================================
   PERIODIC TABLE RENDER
   ========================================================= */

function renderPeriodicTable() {

    const table =
        $("#periodicTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    selectedElements = [];


    elementsData.forEach(element => {

        const [
            atomicNumber,
            symbol,
            name,
            valency,
            category,
            row,
            column
        ] = element;


        const cell =
            document.createElement("button");

        cell.className =
            `element-cell category-${category}`;


        cell.style.gridRow =
            row;

        cell.style.gridColumn =
            column;


        cell.innerHTML = `
            <span class="atomic-number">
                ${atomicNumber}
            </span>

            <span class="symbol">
                ${symbol}
            </span>

            <span class="name">
                ${name}
            </span>
        `;


        cell.addEventListener(
            "click",
            () => {

                toggleElementSelection(
                    cell,
                    element
                );

            }
        );


        table.appendChild(cell);

    });

}


/* =========================================================
   ELEMENT SELECTION
   ========================================================= */

function toggleElementSelection(
    cell,
    element
) {

    const index =
        selectedElements.findIndex(
            item =>
                item[0] === element[0]
        );


    if (index !== -1) {

        selectedElements.splice(
            index,
            1
        );

        cell.classList.remove(
            "selected"
        );

        return;

    }


    if (selectedElements.length >= 2) {

        showToast(
            "Select only 2 elements"
        );

        return;

    }


    selectedElements.push(element);

    cell.classList.add(
        "selected"
    );

}


/* =========================================================
   FORMULA GENERATOR
   ========================================================= */

function gcd(a, b) {

    while (b !== 0) {

        const temp = b;

        b = a % b;

        a = temp;

    }

    return Math.abs(a);

}


function subscriptNumber(number) {

    const map = {
        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉"
    };

    return String(number)
        .split("")
        .map(
            digit => map[digit] || digit
        )
        .join("");

}


function generateFormula() {

    const result =
        $("#formulaResult");


    if (
        selectedElements.length !== 2
    ) {

        result.innerHTML = `
            <span class="error-text">
                Please select exactly 2 elements.
            </span>
        `;

        return;

    }


    const first =
        selectedElements[0];

    const second =
        selectedElements[1];


    const [
        number1,
        symbol1,
        name1,
        valency1,
        category1
    ] = first;


    const [
        number2,
        symbol2,
        name2,
        valency2,
        category2
    ] = second;


    if (
        category1 === "noble" ||
        category2 === "noble"
    ) {

        result.innerHTML = `
            <span class="error-text">
                Noble gases generally do not form simple ionic compounds.
            </span>
        `;

        return;

    }


    let v1 =
        Math.abs(Number(valency1));

    let v2 =
        Math.abs(Number(valency2));


    if (
        !v1 ||
        !v2
    ) {

        result.innerHTML = `
            <span class="error-text">
                Valency data is unavailable for this pair.
            </span>
        `;

        return;

    }


    const divisor =
        gcd(v1, v2);


    v1 /= divisor;
    v2 /= divisor;


    let formula =
        symbol1;

    if (v2 > 1) {
        formula +=
            subscriptNumber(v2);
    }


    formula += symbol2;

    if (v1 > 1) {
        formula +=
            subscriptNumber(v1);
    }


    result.innerHTML = `

        <div class="formula-card">

            <span>
                ${name1} + ${name2}
            </span>

            <strong class="formula-output">
                ${formula}
            </strong>

            <small>
                Criss-cross method:
                ${v1} × ${v2}
            </small>

        </div>

    `;

}


$("#generateFormulaBtn")
    .addEventListener(
        "click",
        generateFormula
    );


/* =========================================================
   CLOSE CHEMIST MODAL
   ========================================================= */

function closeChemistStudies() {

    chemistModal.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


$("#closeChemistBtn")
    .addEventListener(
        "click",
        closeChemistStudies
    );


chemistModal.addEventListener(
    "click",
    event => {

        if (
            event.target === chemistModal
        ) {

            closeChemistStudies();

        }

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeLab();

        closeChemistStudies();

    }
);


/* =========================================================
   NAVBAR ACTIVE LINK
   ========================================================= */

const sections =
    $$("section[id]");

const navLinks =
    $$("nav a");


window.addEventListener(
    "scroll",
    () => {

        let current = "home";


        sections.forEach(
            section => {

                const top =
                    section.offsetTop - 150;

                if (
                    window.scrollY >= top
                ) {

                    current =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) === `#${current}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   HERO BUTTON
   ========================================================= */

$$('a[href^="#"]').forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                const target =
                    document.querySelector(
                        link.getAttribute(
                            "href"
                        )
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    }
);


/* =========================================================
   FADE-IN OBSERVER
   ========================================================= */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


$$(
    ".section, .topic-card, .about-card"
).forEach(
    element => {

        observer.observe(
            element
        );

    }
);


/* =========================================================
   INITIAL LOAD
   ========================================================= */

renderTopics(
    "physics",
    "foundation"
);

renderTopics(
    "chemistry",
    "foundation"
);


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const navbar =
    $(".navbar");

if (navbar) {

    navbar.addEventListener(
        "click",
        event => {

            if (
                event.target.tagName !== "A"
            ) {
                return;
            }

            const nav =
                event.target.closest(
                    "nav"
                );

            if (nav) {
                nav.classList.remove(
                    "mobile-open"
                );
            }

        }
    );

}


/* =========================================================
   DONE
   ========================================================= */

console.log(
    "PhysiChem loaded successfully 🚀"
);