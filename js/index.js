

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );
document.getElementById('container').appendChild( renderer.domElement );
  
// Contains all visuals
var visuals = [];
var readyToEnableVisual = false;

var stats = new Stats();

var torus = new Torus();

var tunnel = new Tunnel();
var tunnelLength = 30;
var tunnelSegmentDepth = 10;
var tunnelSegmentHeight = 7;
var tunnelSegmentWidth = 7; 
var tunnelSegmentReset = 20;
var tunnelSegmentRotation = .001;
var newTunnelSpeed = 0;

var currentColor = 0xFFFFFF;

var optionRotate = true;
var optionPyramids = true;
var optionShowEdges = true;

var analyser;
var amplitude;
var freqSlider;

var keysPressed = [];

function gotStream(stream) {
    var audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    //analyser.connect(audioCtx.destination);

    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    amplitude = new Uint8Array(analyser.frequencyBinCount);
   
    return navigator.mediaDevices.enumerateDevices();
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setup() {
    console.log(navigator.mediaDevices.enumerateDevices());
    const constraints = {
        //audio: true
        audio: {deviceId: 'e504075294c925afb145b3f122b6f97563dbd3df7bd90e19722270325647b64e'}
    }
    var stream = navigator.mediaDevices.getUserMedia(constraints).then(gotStream);
    await new Promise(r => setTimeout(r, 1000));

    // Create the tunnel.
    for (let i = 0; i < tunnelLength; i++) {
        tunnel.Segments.push(new TunnelSegment(i));
    }

    // Initialize the tunnel segment positions.
    for (let i = 0; i < tunnel.Segments.length; i++) {
        const tunnelSegment = tunnel.Segments[i];
        let newZ = (tunnelSegment.SegmentNumber)*-tunnelSegmentDepth;
        tunnelSegment.Group.position.z = newZ;
    }

    // Setup fps counter.
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';
    document.getElementById('container').appendChild( stats.domElement );

    // Load custom text.
    const loader = new THREE.FontLoader();
    // loader.load( 'resources/Krabby Patty_Regular.json', function ( font ) {

    //     const textGeo = new THREE.TextGeometry( "Rawr xD", {

    //         font: font,

    //         size: 3,
    //         height: 1,
    //         curveSegments: 2,

    //         // bevelThickness: .5,
    //         // bevelSize: .1,
    //         // bevelEnabled: true

    //     } );

    //     //const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    //     const textMaterial = new THREE.MeshBasicMaterial( { color: 'yellow', side: THREE.DoubleSide, wireframe:false } );

    //     textMesh = new THREE.Mesh( textGeo, textMaterial );
    //     textMesh.position.x = -6;
    //     //mesh.position.y = FLOOR + 67; 
    //     textMesh.position.z = -10;
    //     textMesh.position.y = 0;
    //     //textMesh.position.x = 0;

    //     textMesh.castShadow = true;
    //     textMesh.receiveShadow = true;

        

    //     scene.add( textMesh );

    // } );

    freqSlider = document.getElementById('setZoom');
    freqSlider.max = analyser.frequencyBinCount - 1;
    freqSlider.value = 118;

    document.getElementById("enableTorus").onclick = function () 
    {
        tunnel.Exiting = true; 
        torus.enable();
        console.log("enabling torus");
    };
    
    document.addEventListener('keydown', (event) => {
        keysPressed.push(event.key);
     
        var visual = visuals.find(function(element) {
            return element.keybind.every(e => keysPressed.includes(e));
        });

        if (visual != null && !visual.Enabled) { 
            console.log(visual.title); 

            // Exit the current visual.
            visuals.filter(v => v.Enabled == true)[0].exit();
            visual.enable();
        }
    });
     
    document.addEventListener('keyup', (event) => {
        const index = keysPressed.indexOf(event.key);
        if (index > -1) {
            keysPressed.splice(index, 1);
            }
    });

    visuals.filter(v => v instanceof Tunnel)[0].Enabled = true;

    animate();
}
setup();

function animate(now) {
    requestAnimationFrame( animate );

    analyser.getByteFrequencyData(amplitude);

    newTunnelSpeed = .1;
    var freqAmp = amplitude[freqSlider.value];
    newTunnelSpeed = freqAmp * .009;

    // console.log(visuals.map(function(obj) {
    //     return obj.Enabled;
    // }).join(", "));

    if (visuals.every(v => !v.Enabled)) { 
        readyToEnableVisual = true; 
    }   

    // Animate the tunnel.
    tunnel.animate();

    // Animate the torus.
    torus.animate(now);

    readyToEnableVisual = false;

    renderer.render( scene, camera );
    stats.update();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }