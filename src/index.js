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
	MeshBasicMaterial,
	PointLight,
	TorusGeometry,
	WebGLCubeRenderTarget,
} from 'three';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, cylinder, sphere, building, cubeCamera, luminaire;

init();

function init(){
	//create scene
	scene = new Scene();
	scene.background = new Color(0xffffff);

	//create camera
	camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(40, 20, 20);

	//create renderer
	renderer = new WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onResize, false);

	//create controls
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set(0, 0, 0);
	controls.minDistance = 0;
	controls.maxDistance = 100;
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

	//ground
	const heightGround = 5;
	const widthGround = 100;
	const groundGeometry = new BoxGeometry( widthGround, heightGround, widthGround );
	const groundMaterial = new MeshBasicMaterial( {color: '#252525', side: DoubleSide} );
	const ground = new Mesh( groundGeometry, groundMaterial );
	ground.rotation.y = -(Math.PI / 2);
	ground.position.y -= heightGround / 2;

	scene.add( ground );






	//create objects
	//group cylinder and sphere into one mesh
	const capsulePerson = new Group();

	//cylinder body
	const personCylinderHeight = 5;
	const personCylinderGeometry = new CylinderGeometry(0.005, 2, personCylinderHeight, 10, 1);
	const personCylinderMaterial = new MeshStandardMaterial({color:new Color('#cc113c')});
	cylinder = new Mesh(personCylinderGeometry, personCylinderMaterial);
	cylinder.position.set(20, (personCylinderHeight / 2), -0.5);
	capsulePerson.add(cylinder);

	//sphere head
	const heightHeadSphereGeometry = 40;
	const headSphereGeometry = new SphereGeometry(1, 10, heightHeadSphereGeometry, 0, 8, 0);
	const headSphereMaterial = new MeshStandardMaterial({color:new Color('#c2253c')});
	sphere = new Mesh(headSphereGeometry, headSphereMaterial);
	sphere.position.set(20, (personCylinderHeight + 0.3), -0.5)

	capsulePerson.add(sphere);
	scene.add(capsulePerson);

	//buiding
	const heightBuildingGeometry = 3;
	const buildingGeometry = new BoxGeometry(20, heightBuildingGeometry, 20);
	const buildingMaterial = new MeshLambertMaterial({color:0x44b47, side: DoubleSide});
	building = new Mesh(buildingGeometry, buildingMaterial);

	for (let row = 0; row < 10; row++) {
		let positionY = (row * (heightBuildingGeometry)) + heightBuildingGeometry / 2;
		let offset = -1;

		for (let count = 0; count < 3; count++) {
			const rowBlock = building.clone();

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

	//lamp-post
	//base-lamp-post
	const capsuleLampPost = new Group();

	const heightBaseLampPost = 2;
	const baseLampPostGeometry = new CylinderGeometry( 0.5, 1.5, heightBaseLampPost, 6, 1 );
	const baseLampPostMaterial = new MeshBasicMaterial( {color: '#cccccc', side: DoubleSide} ); luminaire
	const basePost = new Mesh( baseLampPostGeometry, baseLampPostMaterial );
	basePost.position.set(15, (heightBaseLampPost / 2), -8);
	capsuleLampPost.add(basePost);

	//trunk-lamp-post
	const heightTrunkLampPost = 25;
	const baseTrunkPostGeometry = new CylinderGeometry( 0.3, 0.3, heightTrunkLampPost, 6, 1 );
	const baseTrunkPostMaterial = new MeshBasicMaterial( {color: '#ccc'} );
	const baseTrunkPost = new Mesh( baseTrunkPostGeometry, baseTrunkPostMaterial );
	baseTrunkPost.position.set(15, (heightTrunkLampPost / 2), -8);
	capsuleLampPost.add(baseTrunkPost);

	//top-base-post //REFLECT
	const heightTopBasePost = 1;
	const topBasePostGeometry = new CylinderGeometry( 0.2, 1, heightTopBasePost, 8, 1, true );

		const renderReflective = new WebGLCubeRenderTarget( 128, { format:  THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
		cubeCamera = new THREE.CubeCamera( 1, 100000, renderReflective );
		scene.add( cubeCamera );

		const luminairePostMaterial = new MeshBasicMaterial({envMap: cubeCamera.renderTarget.texture });
	luminaire = new Mesh( topBasePostGeometry, luminairePostMaterial );
		luminaire.position.set(17,  24.7 + (heightTopBasePost / 2), -5.5);
	capsuleLampPost.add(luminaire);

	//top-base-circle-post
	const heightTopBaseSpherePost = 0.3;
	const topBasePostSphereGeometry = new SphereGeometry(heightTopBaseSpherePost, 10, 10);
	const topBasePostSphereMaterial = new MeshBasicMaterial( {color: '#cccccc', side: DoubleSide} );
	const topBasePostSphere = new Mesh( topBasePostSphereGeometry, topBasePostSphereMaterial );
	topBasePostSphere.position.set(17,  25.7 + (heightTopBaseSpherePost / 2), -5.5);
	capsuleLampPost.add(topBasePostSphere);

	//lamp-post
	const heightLampPost = 0.3;
	const lampPostGeometry = new SphereGeometry(heightLampPost, 10, 10);
	const lampPostMaterial = new MeshBasicMaterial( {color: '#FFF615', side: DoubleSide} );
	const lampPost = new Mesh( lampPostGeometry, lampPostMaterial );
	lampPost.position.set(17,  24.7 + (heightLampPost / 2), -5.5);
	capsuleLampPost.add(lampPost);

	//light for lamp
	const pointLight = new PointLight( 0xfff612, 2, 20, -10 );
	pointLight.position.set(17,  24.7 + (heightLampPost / 2), -5.5);
	capsuleLampPost.add(pointLight);

	//torus
	const torusGeometry = new TorusGeometry( 1, .3, 6, 7, 1.6);
	const torusMaterial = new MeshBasicMaterial( { color: 0xcccccc } );
	const torus = new Mesh( torusGeometry, torusMaterial );
	torus.position.set(15.7,  12.45 + (heightTrunkLampPost / 2), -7.2);
	torus.rotation.y = 2.3;
	capsuleLampPost.add(torus);

	//torus connection
	const torusLampConnectionGeometry = new CylinderGeometry( 0.3, 0.3, 5, 32);
	const torusLampConnectionMaterial = new MeshBasicMaterial( { color: 0xcccccc } );
	const torusConnection = new Mesh( torusLampConnectionGeometry, torusLampConnectionMaterial );
	torusConnection.position.set(15.5,  13.4 + (heightTrunkLampPost / 2), -7.3);
	torusConnection.rotation.x = 1.6;
	torusConnection.rotation.z = -0.7;
	capsuleLampPost.add( torusConnection );

	scene.add(capsuleLampPost)

	update();
}

function update(){
	requestAnimationFrame( update );
	cylinder.rotation.y -= 0.01;

	luminaire.visible = false;
	cubeCamera.update( renderer, scene );
	luminaire.visible = true;

	renderer.render( scene, camera );
}

function onResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}