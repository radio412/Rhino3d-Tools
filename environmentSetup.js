/*javascript document
  environmentSetup is a class which will read in istanbul specific data, models and display a heatmap of the data on the 3d model
  require jquery
  require three.js
  require utils.js
*/

environmentSetup = function(){};

//private members. Chill out, this isn't taking up ram. This is just a list of the members of this class so I can keep track. Call me a duck, and I'll gladly welcome him in. 
environmentSetup.prototype.camera;
environmentSetup.prototype.scene;
environmentSetup.prototype.container;
environmentSetup.prototype.ambient;
environmentSetup.prototype.renderer;
environmentSetup.prototype.directionalLight;
environmentSetup.prototype.mousedown;
environmentSetup.prototype.windowHalfX;
environmentSetup.prototype.windowHalfY;
environmentSetup.prototype.objects;
environmentSetup.prototype.mouseX = 0;
environmentSetup.prototype.mouseY = 0;
//define some default colors
environmentSetup.prototype.white = new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: 0.7, transparent: true } );
environmentSetup.prototype.green = new THREE.MeshLambertMaterial( { color: 0x8dc53e, opacity: 0.7, transparent: true } );
environmentSetup.prototype.blue = new THREE.MeshLambertMaterial( { color: 0x0492e6, transparent: false } );
environmentSetup.prototype.barelyblue = new THREE.MeshLambertMaterial( { color: 0xe6f6ff, opacity: 0.7, transparent: true } );

environmentSetup.prototype.init = function(jquerydiv){

  //empty the div before building anything
  jquerydiv.empty();

  //add a place to track objects in the scene
  this.objects = [];

  //Find the element to build everything in
  this.container = jquerydiv[0];

  //define the scene
  this.scene = new THREE.Scene();

  //define the camera
  this.defineCamera();


  //add ambient light to the scene
  this.ambient = new THREE.AmbientLight(  0x615c3e  );
	this.scene.add( this.ambient );

  //add a directional light
  this.addSun();

  //define the renderer
  this.defineRendererWithShadows();

  //render the scene in the container
	this.container.appendChild( this.renderer.domElement );

  //add events for controls
  this.addSystemEvents();

  //start the show
  this.animate();

}

environmentSetup.prototype.defineCamera = function(){
  console.log("camera");
  this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 8000 );
	this.camera.position.z = 1000;
}
environmentSetup.prototype.defineRendererWithShadows = function(){
  console.log("renderer");
  //define the renderer with shadows
  this.renderer = new THREE.WebGLRenderer({antialias:true});
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;
  this.renderer.setSize( window.innerWidth, window.innerHeight);
}

environmentSetup.prototype.addSun = function(){
  console.log("sun");
  //add a directional light to mimic the sun, with shadows
  this.directionalLight = new THREE.DirectionalLight( 0xffeedd );
  this.directionalLight.position.set( 200, 400, 200 );
  this.directionalLight.castShadow = true;
  this.directionalLight.shadowMapWidth = this.directionalLight.shadowMapHeight = 1048;
  var d = 1000;
  this.directionalLight.shadowCameraLeft = -d;
  this.directionalLight.shadowCameraRight = d;
  this.directionalLight.shadowCameraTop = d;
  this.directionalLight.shadowCameraBottom = -d;
  this.directionalLight.shadowCameraFar = 1500;
  this.directionalLight.shadowDarkness = 0.5;
  this.scene.add( this.directionalLight );
}

environmentSetup.prototype.addSystemEvents = function(){
  //add events for controls
  console.log("events");
  var scope = this;
  this.windowHalfX = window.innerWidth / 2;
  this.windowHalfY = window.innerHeight / 2;
  document.addEventListener( 'mousemove', function(e){scope.onDocumentMouseMove(e);}, false );
  document.addEventListener( 'mouseup', function(){scope.onDocumentMouseUp();}, false );
  document.addEventListener( 'mousedown', function(){scope.onDocumentMouseDown();}, false );
  window.addEventListener( 'resize', function(){scope.onWindowResize();}, false );

}

environmentSetup.prototype.animate = function(func){
  this.render();
  var scope = this;
  requestAnimationFrame( function() { scope.animate(); } );
}

environmentSetup.prototype.render = function(){
  if(this.mouseX == 0){
		this.mouseX = 150;
		this.mouseY = -150;
	}
  this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 1;
  this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 1;
  this.camera.lookAt( this.scene.position );
  this.renderer.setClearColor( 0xe6f6ff, 0 );
  this.renderer.render( this.scene, this.camera );
}

environmentSetup.prototype.mousedown = false;

environmentSetup.prototype.onDocumentMouseUp = function(){
  this.mousedown = false;
}
environmentSetup.prototype.onDocumentMouseDown = function(){
  this.mousedown = true;
}
environmentSetup.prototype.onDocumentMouseMove = function(event){
  if(this.mousedown == true){
		this.mouseX = ( event.clientX - this.windowHalfX ) / 2;
		this.mouseY = ( event.clientY - this.windowHalfY ) / 2;
	}
}
environmentSetup.prototype.onWindowResize = function() {
  console.log("resize");
	this.windowHalfX = window.innerWidth / 2;
	this.windowHalfY = window.innerHeight / 2;
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize( window.innerWidth, window.innerHeight );
}

environmentSetup.prototype.loadModels = function(data){

}

environmentSetup.prototype.createColorPalette = function(){
    return colorSpectrum;
}

environmentSetup.prototype.colorModel = function(data, colorSpectrum){

}
