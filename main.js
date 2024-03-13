import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );

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
			value: new THREE.TextureLoader().load('/pics/globe.jpg')
		}
	}
  
  //map: new THREE.TextureLoader().load('./pics/globe.jpg')
} );
const sphere = new THREE.Mesh( geometry, material );


//////////////////////////////////////////////////////////////////////////////////////////////////////



const atmos_geometry = new THREE.SphereGeometry( 1.9, 40, 30 );
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
		float intensity = pow(0.8- dot(at_vertexNormal, vec3(0.0, 0.0, 0.1)),2.0);
		gl_FragColor = vec4(0.5,0.5,0.5,0.6) * intensity;
    }
    `,
	
	side:THREE.BackSide
  
  //map: new THREE.TextureLoader().load('./pics/globe.jpg')
} );
const atmossphere = new THREE.Mesh( atmos_geometry, atmos_material );


///////////////////////////////////////////////////////////////////////////////////////////////

atmossphere.scale.set(1.1,1.1,1.1);


camera.position.z = 5;
scene.background = new THREE.Color(0xffffff);
const group = new THREE.Group();
group.add(sphere)
group.add(atmossphere)
scene.add(group)




const mouse = {
	x: undefined,
	y: undefined
}


addEventListener('mousemove', () => {
	mouse.x = (event.clientX / innerWidth) * 2 - 1
	mouse.y = -(event.clientY / innerHeight) * 2 +1
})


function animate() {
	requestAnimationFrame( animate );

	//sphere.rotation.x += 0.0001;
	//sphere.rotation.y += 0.002;
	sphere.rotation.y += 0.001;

	gsap.to(group.rotation,{
		y: mouse.x * 0.5,
		x: -(mouse.y) * 0.5,
		duration: 2
	})
	renderer.render( scene, camera );
	
}

animate();