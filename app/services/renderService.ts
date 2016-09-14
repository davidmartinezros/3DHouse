import WebGLRenderer = THREE.WebGLRenderer;
import Scene = THREE.Scene;
import TrackballControls = THREE.TrackballControls;
import PerspectiveCamera = THREE.PerspectiveCamera;
import Mesh = THREE.Mesh;

declare var Plotly;

export class RenderService {
    private stats: Stats;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls: TrackballControls;
    private sphere: Mesh;

    public init(container: HTMLElement) {
        this.addStats();

        const width = window.innerWidth;
        const height = window.innerHeight - 90;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, width/height);
        this.camera.position.set(0, 0, 100);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
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
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(300, 0, 300);
        this.scene.add(pointLight);

        // load lines
        this.loadLines();

        // start animation
        this.animate();

        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());
    }

    public addStats() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.domElement);
    }

    public addStars(starsCount: number) {
        const stars = new THREE.Geometry();
        const starMaterial = new THREE.PointCloudMaterial({color: 0xffffff});

        for (let i = 0; i < starsCount; i++) {
            let x = Math.random() * 2000 - 1000;
            let y = Math.random() * 2000 - 1000;
            let z = Math.random() * 2000 - 1000;

            let star = new THREE.Vector3(x, y, z);

            stars.vertices.push(star);
        }

        let pointCloud = new THREE.PointCloud(stars, starMaterial);
        this.scene.add(pointCloud);
    }

    public loadLines() {
        Plotly.d3.csv('/source/3d-source.1.csv', (err, rows) => {

            for (var i = 0; i < rows.length; i++) {
                
                console.log(rows[i]['x1'] + "," + rows[i]['y1'] + "," + rows[i]['z1']);
                console.log(rows[i]['x2'] + "," + rows[i]['y2'] + "," + rows[i]['z2']);

                //let point1 = new THREE.Vector3(0.0, 0.0, 0.0);
                //let point2 = new THREE.Vector3(100.0, 100.0, 100.0);
                let point1 = new THREE.Vector3(rows[i]['x1'], rows[i]['y1'], rows[i]['z1']);
                let point2 = new THREE.Vector3(rows[i]['x2'], rows[i]['y2'], rows[i]['z2']);
                const points = new THREE.Geometry();
                const pointsMaterial = new THREE.LineDashedMaterial({color: 0xffffff});
                points.vertices.push(point1);
                points.vertices.push(point2);
                let lineCloud = new THREE.Line(points, pointsMaterial);
                this.scene.add(lineCloud);
            }
        });
    }
    
    /*public unpack(rows, key) {
        return rows.map(row => row[key]);
    }*/

    public updateScale(newScale: number) {
        const that = this;
        new TWEEN.Tween({scale: this.sphere.scale.x})
            .to({scale: newScale}, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function () {
                that.sphere.scale.set(this.scale, this.scale, this.scale);
            })
            .start();
    }

    public animate() {
        window.requestAnimationFrame(_ => this.animate());

        this.stats.update();
        this.controls.update();
        TWEEN.update();

        this.renderer.render(this.scene, this.camera);
    }

    public onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight - 90;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}
