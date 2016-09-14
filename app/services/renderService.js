System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var WebGLRenderer, Scene, TrackballControls, PerspectiveCamera, Mesh, RenderService;
    return {
        setters:[],
        execute: function() {
            RenderService = (function () {
                function RenderService() {
                }
                RenderService.prototype.init = function (container) {
                    var _this = this;
                    this.addStats();
                    var width = window.innerWidth;
                    var height = window.innerHeight - 90;
                    this.scene = new THREE.Scene();
                    this.camera = new THREE.PerspectiveCamera(45, width / height);
                    this.camera.position.set(-150, 150, 300);
                    this.renderer = new THREE.WebGLRenderer({ antialias: true });
                    this.renderer.setPixelRatio(window.devicePixelRatio);
                    this.renderer.setSize(width, height);
                    this.renderer.setClearColor(0x000000);
                    container.appendChild(this.renderer.domElement);
                    this.controls = new THREE.TrackballControls(this.camera, container);
                    // Sphere
                    /*const textureLoader = new THREE.TextureLoader();
                    textureLoader.load('assets/earth.jpg', t => {
                        let geometry = new THREE.SphereGeometry(5, 50, 50);
                        let material = new THREE.MeshLambertMaterial({map: t});
                        this.sphere = new THREE.Mesh(geometry, material);
            
                        this.scene.add(this.sphere);
                    });*/
                    // Lights
                    var ambientLight = new THREE.AmbientLight(0xcccccc);
                    this.scene.add(ambientLight);
                    var pointLight = new THREE.PointLight(0xffffff);
                    pointLight.position.set(300, 0, 300);
                    this.scene.add(pointLight);
                    // load lines
                    this.loadLines();
                    // load rectangles
                    this.loadRectangles();
                    // start animation
                    this.animate();
                    // bind to window resizes
                    window.addEventListener('resize', function (_) { return _this.onResize(); });
                };
                RenderService.prototype.addStats = function () {
                    this.stats = new Stats();
                    document.body.appendChild(this.stats.domElement);
                };
                RenderService.prototype.addStars = function (starsCount) {
                    var stars = new THREE.Geometry();
                    var starMaterial = new THREE.PointCloudMaterial({ color: 0xffffff });
                    for (var i = 0; i < starsCount; i++) {
                        var x = Math.random() * 2000 - 1000;
                        var y = Math.random() * 2000 - 1000;
                        var z = Math.random() * 2000 - 1000;
                        var star = new THREE.Vector3(x, y, z);
                        stars.vertices.push(star);
                    }
                    var pointCloud = new THREE.PointCloud(stars, starMaterial);
                    this.scene.add(pointCloud);
                };
                RenderService.prototype.loadLines = function () {
                    var _this = this;
                    Plotly.d3.csv('/source/3d-lines.csv', function (err, rows) {
                        for (var i = 0; i < rows.length; i++) {
                            console.log(rows[i]['x1'] + "," + rows[i]['y1'] + "," + rows[i]['z1']);
                            console.log(rows[i]['x2'] + "," + rows[i]['y2'] + "," + rows[i]['z2']);
                            //let point1 = new THREE.Vector3(0.0, 0.0, 0.0);
                            //let point2 = new THREE.Vector3(100.0, 100.0, 100.0);
                            var point1 = new THREE.Vector3(rows[i]['x1'], rows[i]['y1'], rows[i]['z1']);
                            var point2 = new THREE.Vector3(rows[i]['x2'], rows[i]['y2'], rows[i]['z2']);
                            var points = new THREE.Geometry();
                            var pointsMaterial = new THREE.LineDashedMaterial({ color: 0xffffff });
                            points.vertices.push(point1);
                            points.vertices.push(point2);
                            var lineCloud = new THREE.Line(points, pointsMaterial);
                            _this.scene.add(lineCloud);
                        }
                    });
                };
                RenderService.prototype.loadRectangles = function () {
                    var _this = this;
                    Plotly.d3.csv('/source/3d-rectangles.csv', function (err, rows) {
                        for (var i = 0; i < rows.length; i++) {
                            console.log(rows[i]['x1'] + "," + rows[i]['y1'] + "," + rows[i]['z1']);
                            console.log(rows[i]['x2'] + "," + rows[i]['y2'] + "," + rows[i]['z2']);
                            console.log(rows[i]['x3'] + "," + rows[i]['y3'] + "," + rows[i]['z3']);
                            console.log(rows[i]['x4'] + "," + rows[i]['y4'] + "," + rows[i]['z4']);
                            //let point1 = new THREE.Vector3(0.0, 0.0, 0.0);
                            //let point2 = new THREE.Vector3(100.0, 100.0, 100.0);
                            var point1 = new THREE.Vector3(rows[i]['x1'], rows[i]['y1'], rows[i]['z1']);
                            var point2 = new THREE.Vector3(rows[i]['x2'], rows[i]['y2'], rows[i]['z2']);
                            var point3 = new THREE.Vector3(rows[i]['x3'], rows[i]['y3'], rows[i]['z3']);
                            var point4 = new THREE.Vector3(rows[i]['x4'], rows[i]['y4'], rows[i]['z4']);
                            var point5 = new THREE.Vector3(rows[i]['x5'], rows[i]['y5'], rows[i]['z5']);
                            var point6 = new THREE.Vector3(rows[i]['x6'], rows[i]['y6'], rows[i]['z6']);
                            var vertices = new Float32Array([
                                rows[i]['x1'], rows[i]['y1'], rows[i]['z1'],
                                rows[i]['x2'], rows[i]['y2'], rows[i]['z2'],
                                rows[i]['x3'], rows[i]['y3'], rows[i]['z3'],
                                rows[i]['x4'], rows[i]['y4'], rows[i]['z4'],
                                rows[i]['x5'], rows[i]['y5'], rows[i]['z5'],
                                rows[i]['x6'], rows[i]['y6'], rows[i]['z6']
                            ]);
                            var geometry = new THREE.BufferGeometry();
                            // create a simple square shape. We duplicate the top left and bottom right
                            // vertices because each vertex needs to appear once per triangle.
                            // itemSize = 3 because there are 3 values (components) per vertex
                            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                            var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                            var mesh = new THREE.Mesh(geometry, material);
                            _this.scene.add(mesh);
                        }
                    });
                };
                RenderService.prototype.loadBox = function () {
                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                    var mesh = new THREE.Mesh(geometry, material);
                    this.scene.add(mesh);
                };
                /*public unpack(rows, key) {
                    return rows.map(row => row[key]);
                }*/
                RenderService.prototype.updateScale = function (newScale) {
                    var that = this;
                    new TWEEN.Tween({ scale: this.sphere.scale.x })
                        .to({ scale: newScale }, 1000)
                        .easing(TWEEN.Easing.Elastic.InOut)
                        .onUpdate(function () {
                        that.sphere.scale.set(this.scale, this.scale, this.scale);
                    })
                        .start();
                };
                RenderService.prototype.animate = function () {
                    var _this = this;
                    window.requestAnimationFrame(function (_) { return _this.animate(); });
                    this.stats.update();
                    this.controls.update();
                    TWEEN.update();
                    this.renderer.render(this.scene, this.camera);
                };
                RenderService.prototype.onResize = function () {
                    var width = window.innerWidth;
                    var height = window.innerHeight - 90;
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(width, height);
                };
                return RenderService;
            }());
            exports_1("RenderService", RenderService);
        }
    }
});
//# sourceMappingURL=renderService.js.map