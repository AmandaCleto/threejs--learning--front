import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Color,
	BoxGeometry,
	CylinderGeometry,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	DirectionalLight,
	AmbientLight,
	MeshLambertMaterial,
	Group,
	DoubleSide,
	PlaneGeometry,
	MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, cylinder, sphere, jenga;

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

	//group cylinder and sphere into one mesh
	const capsuleI = new Group();

	//cylinder
	const heightCylinderGeometry = 1.3;
	const cylinderGeometry = new CylinderGeometry(0.005, 0.6, heightCylinderGeometry, 10, 1);
	const cylinderMaterial = new MeshStandardMaterial({color:new Color('#cc113c')});
	cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
	cylinder.position.set(3, (heightCylinderGeometry / 2), -0.5);
	capsuleI.add(cylinder);

	//sphere
	const heightSphereGeometry = 35;
	const sphereGeometry = new SphereGeometry(0.22, 35, heightSphereGeometry, 0, 8, 0);
	const sphereMaterial = new MeshStandardMaterial({color:new Color('#c2253c')});
	sphere = new Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(3, (heightCylinderGeometry + 0.3), -0.5)
	capsuleI.add(sphere);

	scene.add(capsuleI);

	//jenga
	const heightJengaGeometry = 0.4;
	const jengaGeometry = new BoxGeometry(3, heightJengaGeometry, 0.9);
	const jengaMaterial = new MeshLambertMaterial({color:0x44b47, side: DoubleSide});
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

	//ground
	const heightGround = 1;
	const groundGeometry = new BoxGeometry( 20, heightGround, 20 );
	const groundMaterial = new MeshBasicMaterial( {color: '#252525', side: DoubleSide} );
	const ground = new Mesh( groundGeometry, groundMaterial );
	ground.rotation.y = -(Math.PI / 2);
	ground.position.y -= heightGround / 2;

	scene.add( ground );

	update();
}

function update(){
	requestAnimationFrame( update );
	cylinder.rotation.y -= 0.01;

	renderer.render( scene, camera );
}

function onResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}