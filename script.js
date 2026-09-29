let scene;
let camera;
let renderer;

let raycaster;
let pointer;

let starfield;
let sun;

let planets = [];

let selectedObject = null;
let simulationSeconds = 0;


/* =========================================
   PLANET DATA
========================================= */

const objectInfo = {

    Sun:
        "TYPE: G-TYPE STAR<br>" +
        "MASS: 1.989 × 10³⁰ kg<br>" +
        "DIAMETER: 1.392 million km",

    Mercury:
        "TYPE: TERRESTRIAL PLANET<br>" +
        "ORBIT: 57.9 million km<br>" +
        "YEAR: 88 Earth days",

    Venus:
        "TYPE: TERRESTRIAL PLANET<br>" +
        "ORBIT: 108.2 million km<br>" +
        "YEAR: 224.7 Earth days",

    Earth:
        "TYPE: TERRESTRIAL PLANET<br>" +
        "ORBIT: 149.6 million km<br>" +
        "YEAR: 365.25 days",

    Mars:
        "TYPE: TERRESTRIAL PLANET<br>" +
        "ORBIT: 227.9 million km<br>" +
        "YEAR: 687 Earth days",

    Jupiter:
        "TYPE: GAS GIANT<br>" +
        "ORBIT: 778.5 million km<br>" +
        "YEAR: 11.86 Earth years",

    Saturn:
        "TYPE: GAS GIANT<br>" +
        "ORBIT: 1.43 billion km<br>" +
        "YEAR: 29.45 Earth years",

    Uranus:
        "TYPE: ICE GIANT<br>" +
        "ORBIT: 2.87 billion km<br>" +
        "YEAR: 84 Earth years",

    Neptune:
        "TYPE: ICE GIANT<br>" +
        "ORBIT: 4.50 billion km<br>" +
        "YEAR: 164.8 Earth years"
};


/* =========================================
   VIEW DATA
========================================= */

const viewData = {

    command: [
        "COMMAND CENTER",
        "Interactive scientific visualization and mission analysis.",
        "SOLAR SYSTEM SIMULATION"
    ],

    solar: [
        "SOLAR SYSTEM",
        "Explore planetary motion and orbital structure.",
        "PLANETARY ORBITAL MODEL"
    ],

    asteroids: [
        "ASTEROID HUNTER",
        "Track simulated near-Earth objects and inspect orbital data.",
        "ASTEROID SURVEY // SIMULATION"
    ],

    physics: [
        "PHYSICS LAB",
        "Explore motion, gravity and orbital mechanics.",
        "PHYSICS SIMULATION"
    ],

    earth: [
        "EARTH OBSERVATORY",
        "Inspect Earth as a planetary system.",
        "EARTH OBSERVATION // SIMULATION"
    ]

};


/* =========================================
   START
========================================= */

init();

bootSequence();


/* =========================================
   INITIALIZE THREE.JS
========================================= */

function init() {

    const container =
        document.getElementById("spaceCanvas");


    /* SCENE */

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x02050a);


    /* CAMERA */

    camera =
        new THREE.PerspectiveCamera(
            50,
            container.clientWidth /
                container.clientHeight,
            0.1,
            3000
        );

    camera.position.set(
        0,
        42,
        82
    );


    /* RENDERER */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(
        renderer.domElement
    );


    /* RAYCASTING */

    raycaster =
        new THREE.Raycaster();

    pointer =
        new THREE.Vector2();


    /* BUILD WORLD */

    createStars();

    createSolarSystem();

    addLights();


    /* INPUT */

    container.addEventListener(
        "pointerdown",
        onPointerDown
    );

    container.addEventListener(
        "pointermove",
        onPointerMove
    );

    container.addEventListener(
        "wheel",
        onWheel,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        onResize
    );


    /* NAVIGATION */

    document
        .querySelectorAll(".navButton")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    switchView(
                        button.dataset.view
                    );

                }
            );

        });


    animate();

}


/* =========================================
   STARFIELD
========================================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];


    for (
        let i = 0;
        i < 5000;
        i++
    ) {

        const range = 600;

        positions.push(

            (Math.random() - 0.5) *
                range,

            (Math.random() - 0.5) *
                range,

            (Math.random() - 0.5) *
                range

        );

    }


    geometry.setAttribute(
        "position",

        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0x8edfff,

            size: 0.65,

            transparent: true,

            opacity: 0.75

        });


    starfield =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        starfield
    );

}


/* =========================================
   SOLAR SYSTEM
========================================= */

function createSolarSystem() {

    const system =
        new THREE.Group();

    scene.add(
        system
    );


    /* SUN */

    sun =
        createBody(
            "Sun",
            4.2,
            0,
            0xe5a83a
        );

    system.add(
        sun
    );


    /* PLANETS */

    const planetData = [

        [
            "Mercury",
            6,
            0.75,
            0x9c9c9c
        ],

        [
            "Venus",
            9,
            1.15,
            0xc99b58
        ],

        [
            "Earth",
            13,
            1.25,
            0x4d9bd1
        ],

        [
            "Mars",
            17,
            0.95,
            0xc15c42
        ],

        [
            "Jupiter",
            24,
            2.7,
            0xc58c68
        ],

        [
            "Saturn",
            32,
            2.25,
            0xd4b27c
        ],

        [
            "Uranus",
            40,
            1.55,
            0x6ec8d9
        ],

        [
            "Neptune",
            47,
            1.5,
            0x4b65d9
        ]

    ];


    planetData.forEach(
        (
            [
                name,
                distance,
                size,
                color
            ],
            index
        ) => {

            const orbit =
                new THREE.Group();


            const body =
                createBody(
                    name,
                    size,
                    distance,
                    color
                );


            orbit.userData.distance =
                distance;


            orbit.add(
                body
            );


            system.add(
                orbit
            );


            /* ORBIT RING */

            const ringGeometry =
                new THREE.RingGeometry(
                    distance - 0.02,
                    distance + 0.025,
                    128
                );


            const ringMaterial =
                new THREE.MeshBasicMaterial({

                    color: 0x245b6a,

                    transparent: true,

                    opacity: 0.35,

                    side:
                        THREE.DoubleSide

                });


            const ring =
                new THREE.Mesh(
                    ringGeometry,
                    ringMaterial
                );


            ring.rotation.x =
                Math.PI / 2;


            system.add(
                ring
            );


            /* SATURN RINGS */

            if (
                name === "Saturn"
            ) {

                const saturnRingGeometry =
                    new THREE.RingGeometry(
                        size * 1.45,
                        size * 2.05,
                        64
                    );


                const saturnRingMaterial =
                    new THREE.MeshBasicMaterial({

                        color: 0xb89b71,

                        transparent: true,

                        opacity: 0.55,

                        side:
                            THREE.DoubleSide

                    });


                const saturnRing =
                    new THREE.Mesh(
                        saturnRingGeometry,
                        saturnRingMaterial
                    );


                saturnRing.rotation.x =
                    Math.PI / 2.4;


                body.add(
                    saturnRing
                );

            }


            planets.push({

                body: body,

                orbit: orbit,

                distance: distance,

                name: name,

                speed:
                    0.55 /
                    Math.sqrt(
                        index + 1
                    )

            });

        }
    );


    system.rotation.x =
        -0.25;

}


/* =========================================
   CREATE CELESTIAL BODY
========================================= */

function createBody(
    name,
    radius,
    distance,
    color
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            48,
            32
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: color,

            roughness: 0.75,

            metalness: 0.05

        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.x =
        distance;


    mesh.userData.name =
        name;


    mesh.userData.baseScale =
        radius;


    mesh.castShadow =
        true;


    /* SUN GLOW */

    if (
        name === "Sun"
    ) {

        mesh.material.emissive =
            new THREE.Color(
                0xff8a18
            );

        mesh.material.emissiveIntensity =
            1.5;

    }


    return mesh;

}


/* =========================================
   LIGHTING
========================================= */

function addLights() {

    const ambient =
        new THREE.AmbientLight(
            0x7aa9bb,
            0.35
        );


    scene.add(
        ambient
    );


    const sunLight =
        new THREE.PointLight(
            0xffd39b,
            1000,
            300
        );


    sunLight.position.set(
        0,
        0,
        0
    );


    scene.add(
        sunLight
    );

}


/* =========================================
   OBJECT CLICK
========================================= */

function onPointerDown(event) {

    const rect =
        renderer.domElement
            .getBoundingClientRect();


    pointer.x =
        (
            (event.clientX - rect.left)
            /
            rect.width
        ) * 2 - 1;


    pointer.y =
        -(
            (event.clientY - rect.top)
            /
            rect.height
        ) * 2 + 1;


    raycaster.setFromCamera(
        pointer,
        camera
    );


    const objects = [

        sun,

        ...planets.map(
            planet =>
                planet.body
        )

    ];


    const hits =
        raycaster.intersectObjects(
            objects,
            false
        );


    if (
        hits.length > 0
    ) {

        selectObject(
            hits[0]
                .object
                .userData
                .name
        );

    }

}


/* =========================================
   ROTATION
========================================= */

function onPointerMove(event) {

    if (
        !event.buttons
    ) {
        return;
    }


    camera.rotation.y -=
        event.movementX *
        0.003;


    camera.rotation.x -=
        event.movementY *
        0.002;

}


/* =========================================
   ZOOM
========================================= */

function onWheel(event) {

    camera.position.z =
        THREE.MathUtils.clamp(

            camera.position.z +
            event.deltaY *
            0.035,

            30,

            180

        );

}


/* =========================================
   SELECT OBJECT
========================================= */

function selectObject(name) {

    selectedObject =
        name;


    document.getElementById(
        "objectName"
    ).textContent =
        name.toUpperCase();


    document.getElementById(
        "objectData"
    ).innerHTML =
        objectInfo[name] ||
        "DATA LINK PENDING";


    addFeed(
        "Target acquired: " +
        name
    );

}


/* =========================================
   CHANGE MODULE
========================================= */

function switchView(view) {

    document
        .querySelectorAll(
            ".navButton"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",

                button.dataset.view ===
                view
            );

        });


    const data =
        viewData[view];


    document.getElementById(
        "viewTitle"
    ).textContent =
        data[0];


    document.getElementById(
        "viewDescription"
    ).textContent =
        data[1];


    document.getElementById(
        "sceneTitle"
    ).textContent =
        data[2];


    if (
        view === "asteroids"
    ) {

        document.getElementById(
            "objectsTracked"
        ).textContent =
            "143";


        addFeed(
            "Asteroid survey database opened."
        );

    } else {

        document.getElementById(
            "objectsTracked"
        ).textContent =
            "08";


        addFeed(
            view.toUpperCase() +
            " module activated."
        );

    }

}


/* =========================================
   SYSTEM FEED
========================================= */

function addFeed(message) {

    const feed =
        document.getElementById(
            "systemFeed"
        );


    const line =
        document.createElement(
            "p"
        );


    const now =
        new Date()
            .toLocaleTimeString(
                "en-GB"
            );


    line.innerHTML =
        `<span>[${now}]</span> ${message}`;


    feed.prepend(
        line
    );


    while (
        feed.children.length > 5
    ) {

        feed.removeChild(
            feed.lastChild
        );

    }

}


/* =========================================
   BOOT SEQUENCE
========================================= */

function bootSequence() {

    const progress =
        document.getElementById(
            "progressBar"
        );


    const status =
        document.getElementById(
            "bootStatus"
        );


    const screen =
        document.getElementById(
            "bootScreen"
        );


    const stages = [

        [
            15,
            "INITIALIZING RENDER ENGINE..."
        ],

        [
            32,
            "LOADING CELESTIAL DATABASE..."
        ],

        [
            51,
            "CALIBRATING SENSOR ARRAY..."
        ],

        [
            73,
            "BUILDING ORBITAL MODEL..."
        ],

        [
            91,
            "SYNCHRONIZING MISSION SYSTEMS..."
        ],

        [
            100,
            "ASTRA-X READY."
        ]

    ];


    let index = 0;


    const timer =
        setInterval(
            () => {

                const [
                    value,
                    message
                ] =
                    stages[index++];


                progress.style.width =
                    value + "%";


                status.textContent =
                    message;


                if (
                    value === 100
                ) {

                    clearInterval(
                        timer
                    );


                    setTimeout(
                        () => {

                            screen.style.opacity =
                                "0";


                            setTimeout(
                                () => {

                                    screen.remove();

                                },
                                800
                            );

                        },
                        500
                    );

                }

            },
            350
        );

}


/* =========================================
   ANIMATION LOOP
========================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    simulationSeconds +=
        1 / 60;


    const time =
        performance.now() *
        0.00003;


    /* PLANET ORBITS */

    planets.forEach(
        planet => {

            planet.orbit.rotation.y =
                time *
                planet.speed;


            planet.body.rotation.y +=
                0.003;

        }
    );


    /* SUN */

    sun.rotation.y +=
        0.002;


    /* STARFIELD */

    starfield.rotation.y +=
        0.00003;


    /* SIMULATION CLOCK */

    document.getElementById(
        "simulationTime"
    ).textContent =
        formatTime(
            simulationSeconds
        );


    renderer.render(
        scene,
        camera
    );

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(seconds) {

    const total =
        Math.floor(seconds);


    const s =
        total % 60;


    const m =
        Math.floor(
            total / 60
        ) % 60;


    const h =
        Math.floor(
            total / 3600
        );


    return [

        h,
        m,
        s

    ]
        .map(
            value =>
                String(value)
                    .padStart(2, "0")
        )
        .join(":");

}


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now =
        new Date();


    document.getElementById(
        "clock"
    ).textContent =
        now.toLocaleTimeString(
            "en-GB"
        );

}


setInterval(
    updateClock,
    1000
);


updateClock();


/* =========================================
   RESIZE
========================================= */

function onResize() {

    const container =
        document.getElementById(
            "spaceCanvas"
        );


    camera.aspect =
        container.clientWidth /
        container.clientHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

}