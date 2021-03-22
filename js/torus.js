class Torus extends Visual  { 
    constructor() {
        super();

        this.keybind = ['Control', 'Shift', 'Alt', 'F2'];
        this.title = 'Torus';

        const wireframeMaterial = new THREE.MeshBasicMaterial( { color: "purple" } );
        const torusGeo = new THREE.TorusGeometry(30, 30, 40, 40, 40);
        const wireframeGeo = new THREE.WireframeGeometry(torusGeo);
    
        this.line = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
        this.line.material.depthTest = true;
        this.line.visible = false;
        this.line.material.opacity = 0;
        this.line.material.transparent = true;
        this.line.rotation.x = 90;
        scene.add( this.line );
    }

    animate(now) {
        if (this.Enabling && readyToEnableVisual) {
            this.line.visible = true;
            this.line.material.opacity += now * .000001;
            if (this.line.material.opacity >= .6) { this.Enabling = false; this.Enabled = true; }
        }

        if (this.Exiting) {
            this.line.material.opacity -= now * .000001;
            if (this.line.material.opacity <= 0) { this.Enabled = false; this.Exiting = false; }
        }
        
        if (this.Enabled)
        {
            this.line.rotation.z += newTunnelSpeed * .05;
            this.line.rotation.y += newTunnelSpeed * .01;
            this.line.rotation.x += newTunnelSpeed * .01;
        }
    }

    enable() {
        this.Enabling = true;
    }

    exit() {
        this.Exiting = true;
    }
}