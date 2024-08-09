import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();
const canvContainer = document.querySelector("#canvCont")

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.querySelector('canvas')});


renderer.setSize( window.innerWidth,window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
/*document.body.appendChild( renderer.domElement );
const div = document.getElementById('#myDiv');
div.appendChild(renderer.domElement);*/
const geometry = new THREE.SphereGeometry( 2, 40, 30 );
const material = new THREE.ShaderMaterial( { 
	vertexShader: 
	`
	varying vec2 vertexUV;
	varying vec3 vertexNormal;

    void main()
    {
		vertexUV = uv;
		vertexNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,

	fragmentShader:  `
	uniform sampler2D globeTexture;
	varying vec2 vertexUV;
	varying vec3 vertexNormal;

    void main()
    {
		float intensity = 1.05- dot(vertexNormal, vec3(0.0, 0.0, 0.1));
		vec3 atmosphere = vec3 (0.1,0.1,0.1) * pow(intensity,1.5);
		gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz,1.0);
    }
    `,
	uniforms:{
		globeTexture:{
			value: new THREE.TextureLoader().load('/pics/globe3.jpg')
			
		}
	}
  
  //map: new THREE.TextureLoader().load('./pics/globe.jpg')
} );
const sphere = new THREE.Mesh( geometry, material );

//////////////////////////////////////////////////////////////////////////////////////////////////////



const atmos_geometry = new THREE.SphereGeometry( 2.5, 40, 40 );
const atmos_material = new THREE.ShaderMaterial( { 
	vertexShader:`
	varying vec3 at_vertexNormal;

    void main()
    {
		at_vertexNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,

	fragmentShader:`

	varying vec3 at_vertexNormal;

    void main()
    {
		float intensity = pow(0.0- dot(at_vertexNormal, vec3(0.0, 0.0, 0.2)),1.2);
		gl_FragColor = vec4(0,15,20,5) * intensity;
    }
    `,
	
	side:THREE.BackSide
  
  //map: new THREE.TextureLoader().load('./pics/globe.jpg')
} );
const atmossphere = new THREE.Mesh( atmos_geometry, atmos_material );


///////////////////////////////////////////////////////////////////////////////////////////////

atmossphere.scale.set(1.1,1.1,1.1);



// Füge den Pin hinzu
var pinGeometry = new THREE.SphereGeometry(0.06, 5, 5);
var pinMaterial = new THREE.MeshBasicMaterial({ color: 0xfff });
var pin = new THREE.Mesh(pinGeometry, pinMaterial);

var pinPositionOnGlobe = new THREE.Vector3(0.5, -0.2, 2); // Position des Pins auf der Kugel
pin.position.copy(pinPositionOnGlobe);

//sphere.add(pin);


camera.position.z = 5;
scene.background = new THREE.Color(0xffffff);
const group = new THREE.Group();


group.add(sphere)
group.add(atmossphere)
scene.add(group)

//scene.add(pin);


const mouse = {
	x: undefined,
	y: undefined
}


sphere.get
/////////////////////////////////////////////////Mouse event//////////////////////////////////////////////////////////////////////////

var mouseDown = false;

let targetRotX = 0.05;
let targetRotY = 0.02;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let mouseY = 0;
let mouseYOnMouseDown = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const dragFactor = 0.0003;

addEventListener('mousedown', () => {

	event.preventDefault();
	mouseDown = true;
	mouseXOnMouseDown = event.clientX - windowHalfX;
	mouseYOnMouseDown = event.clientY - windowHalfY;

    var intersects = raycaster.intersectObjects(scene.children, true);

    for (var i = 0; i < intersects.length; i++) {
		
        if (isChildOf(intersects[i].object,pin)) {
            console.log("Pin wurde angeklickt!");
            break;
        }
    }
	
})

addEventListener('mouseup', () => {
    event.preventDefault();
    mouseDown = false;
})

addEventListener('mousemove', () => {

	event.preventDefault();
	if (!mouseDown) return;

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

	targetRotX = (mouseX-mouseXOnMouseDown) * dragFactor;
	targetRotY = (mouseY-mouseYOnMouseDown) * dragFactor;

	sphere.rotateOnWorldAxis(new THREE.Vector3(0,1,0), targetRotX);
	sphere.rotateOnWorldAxis(new THREE.Vector3(1,0,0), targetRotY);

	/*	gsap.to(group.rotation,{
			y:   targetRotX ,
			x:  targetRotY 
		})
	//}*/
	
})

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;




}



function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	
	//for ( let i = 0; i < intersects.length; i ++ ) {

		//console.log(intersects[i].object.name);
	//}

	renderer.render( scene, camera );

}
addEventListener( 'mousemove', onPointerMove );


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//default setting
sphere.rotation.x -= 0.3;
        // Aktualisiere die Position des Pins basierend auf der Position der Kugel
function updatePinPosition() {
    var pinWorldPosition = pinPositionOnGlobe.clone();
    pinWorldPosition.applyMatrix4(sphere.matrixWorld);
    pin.position.copy(pinWorldPosition);
}
function animate() {
	requestAnimationFrame( animate );

	sphere.rotation.y += 0.0005;
	renderer.render( scene, camera );
	requestAnimationFrame(render);
	updatePinPosition();
	 //mouse.x 1.20  bis 2.20 y -0.50 -2.70
	
}



function isChildOf(object, parent) {
    while (object) {
		
        if (object == parent) {
            console.log("dfad");
			return true;
        }
        object = object.parent;
    }
    return false;
}

animate();

        // Funktion zur Anpassung der Szene bei Größenänderung des Fensters
function onWindowResize() {
    // Kamera-Aspect-Ratio anpassen
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

	// Renderer-Größe anpassen
    renderer.setSize(window.innerWidth, window.innerHeight);
}

        // Event-Listener hinzufügen, der bei Fenstergrößeänderung die Anpassung auslöst
window.addEventListener('resize', onWindowResize, false);