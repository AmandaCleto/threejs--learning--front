import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Color,
	BoxGeometry,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	DirectionalLight,
	AmbientLight,
	MeshLambertMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, box, sphere, jenga;

init();

function init(){
	//create scene
	scene = new Scene();
	scene.background = new Color(0xcccccc);

	//create camera
	camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 2;

	//create renderer
	renderer = new WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onResize, false);

	//create controls
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set(0,0,0);
	controls.minDistance = 5;
	controls.maxDistance = 20;
	controls.update();

	//create light
	//directional
	const directionalLight = new DirectionalLight();
	directionalLight.position.set(0, 1, 2);
	scene.add(directionalLight);

	//envirement
	const ambientLight = new AmbientLight(new Color('#fff'), 0.6);
	ambientLight.position.set(0, 0, 0)
	scene.add(ambientLight);

	//create objects
	//box
	const heightBoxGeometry = 1.2;
	const boxGeometry = new BoxGeometry(0.5, heightBoxGeometry, 0.5);
	const boxMaterial = new MeshStandardMaterial({color:new Color('#cc113c')});
	box = new Mesh(boxGeometry, boxMaterial);
	box.position.set(3, (heightBoxGeometry / 2), -0.5);
	scene.add(box);

	//sphere
	const heightSphereGeometry = 35;
	const sphereGeometry = new SphereGeometry(0.22, 35, heightSphereGeometry, 0, 8, 0);
	const sphereMaterial = new MeshStandardMaterial({color:new Color('#c2253c')});
	sphere = new Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(3, (heightBoxGeometry + 0.5), -0.5)
	scene.add(sphere);

	//jenga
	const heightJengaGeometry = 0.4;
	const jengaGeometry = new BoxGeometry(3, heightJengaGeometry, 0.9);
	const jengaMaterial = new MeshLambertMaterial({color:0x44b47});
	jenga = new Mesh(jengaGeometry, jengaMaterial);

	for (let row = 0; row < 10; row++) {
		let positionY = (row * (heightJengaGeometry + 0.05)) + heightJengaGeometry / 2;
		let offset = -1;

		for (let count = 0; count < 3; count++) {
			const rowBlock = jenga.clone();

			if (row % 2) {
				rowBlock.rotation.y = Math.PI/2;
				rowBlock.position.set(offset, positionY, 0)
			} else {
				rowBlock.position.set(0, positionY, offset);
			}

			scene.add(rowBlock);
			offset++;
		}
	}

	update();
}

function update(){
	requestAnimationFrame( update );
	box.rotation.y -= 0.01;
	sphere.rotation.y += 0.01;
	renderer.render( scene, camera );
}

function onResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}