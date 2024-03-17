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
		float intensity = pow(0.0- dot(at_vertexNormal, vec3(0.0, 0.0, 0.5)),2.0);
		gl_FragColor = vec4(0,20,20,5) * intensity;
    }
    `,
	
	side:THREE.BackSide
  
  //map: new THREE.TextureLoader().load('./pics/globe.jpg')
} );
const atmossphere = new THREE.Mesh( atmos_geometry, atmos_material );


///////////////////////////////////////////////////////////////////////////////////////////////

atmossphere.scale.set(1.1,1.1,1.1);



// Füge den Pin hinzu
var pinGeometry = new THREE.SphereGeometry(0.05, 10, 10);
var pinMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
var pin = new THREE.Mesh(pinGeometry, pinMaterial);
var pinPositionOnGlobe = new THREE.Vector3(0.6, -1.1, 1.5); // Position des Pins auf der Kugel
pin.position.copy(pinPositionOnGlobe);
sphere.add(pin);


camera.position.z = 5;
scene.background = new THREE.Color(0xffffff);
const group = new THREE.Group();
group.add(sphere)
group.add(atmossphere)
scene.add(group)

scene.add(pin);


const mouse = {
	x: undefined,
	y: undefined
}
/////////////////////////////////////////////////Mouse event//////////////////////////////////////////////////////////////////////////

var mouseDown = false;

addEventListener('mousedown', () => {

	event.preventDefault();
	mouseDown = true;
	
})

addEventListener('mouseup', () => {
    event.preventDefault();
    mouseDown = false;
})

addEventListener('mousemove', () => {
	event.preventDefault();
	if (!mouseDown) return;

	mouse.x = (event.clientX / window.innerWidth) * 4 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 4 +1

	gsap.to(group.rotation,{
		y:  + mouse.x * 1.5,
		x:  -(mouse.y) * 1.5
	})

	
})

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

	sphere.rotation.y += 0.001;
	renderer.render( scene, camera );
	updatePinPosition();
	
}

animate();