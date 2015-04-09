/*javascript document
	this is a class to load external mesh models into three js and manipulate them
	require OBJLoader.js
	require ColladaLoader.js
	require OBJMTLLoader.js
	require STLLoader.js
*/

threeAsset = function(){};

//these are on events the client code can choose to define.
threeAsset.prototype.onMeshLoaded;
threeAsset.prototype.onColorChanged;

//the base mesh is always available directly on the class. Rememebr, the mesh may have children.
threeAsset.prototype.mesh;
threeAsset.prototype.meshType;
threeAsset.prototype.defaultHex = 0xCCCCCC;
threeAsset.prototype.setColor = function(color){
	if(color == undefined){
		hex = 0x000000;
		defaultcolor = true;
	}else{
		hex = colorutils.rgbaCSStoXHex(color);
	}

	var color = new THREE.MeshLambertMaterial({color: hex, transparent: true, opacity: .8});
	this.mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = color;
					child.castShadow = true;
				}
		});
}
threeAsset.prototype.addToScene = function(s){
		s.add(this.mesh);
}

threeAsset.prototype.onMeshLoadedInternal = function(){
	//this.setColor();
	if(typeof this.onMeshLoaded == "function"){
		this.onMeshLoaded(this.mesh);
	}
}

threeAsset.prototype.loadObj = function(path){
	this.meshType = "OBJ";
	var manager = new THREE.LoadingManager();
	var scope = this;
	var loader = new THREE.OBJLoader( manager );
	loader.load( path, function ( obj ) {
		scope.mesh = obj;
		scope.onMeshLoadedInternal();
	})
}

threeAsset.prototype.loadDAE = function(path){
	this.meshType = "DAE";
	var manager = new THREE.LoadingManager();
	var scope = this;
	var loader = new THREE.ColladaLoader(manager);
	loader.load( path, function (dae) {
		scope.mesh = dae.scene;
		scope.onMeshLoadedInternal();
	})
}
