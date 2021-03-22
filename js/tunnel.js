class Tunnel extends Visual {
    constructor() {
        super();
        this.keybind = ['Control', 'Shift', 'Alt', 'F1'];
        this.title = 'Tunnel';
        this.Segments = [];
    }

    animate() {
        if (this.Exiting & this.Segments.every(s => !s.Group.visible)) {
            // speed up tunnel, fade out, and slow down rotation as the tunnel finishes
            //if ()
            this.Enabled = false;
            this.Exiting = false;
        }

        // Determine where the tunnel segments should go next.
        if (this.Enabled) {
            for (let i = 0; i < this.Segments.length; i++) {
                const tunnelSegment = this.Segments[i];
    
                if (!tunnelSegment.Group.visible) { continue; }

                var xNewTunnelSpeed = newTunnelSpeed;
                if (this.Exiting) { xNewTunnelSpeed = 10;}
    
                // Determine if this tunnel segment is ready to be placed onto the end or not.
                let newZ = (tunnelSegment.Group.position.z) + xNewTunnelSpeed;
                if (newZ > tunnelSegmentReset) { 
                    if (this.Exiting)
                    {
                        tunnelSegment.Group.visible = false;
                    }
                    var lastSegment = tunnelSegment;
                    for (let i = 0; i < this.Segments.length; i++) {
                        const curSegment = this.Segments[i];
                        if (curSegment.Group.position.z < lastSegment.Group.position.z) {
                            lastSegment = curSegment;
                        }
                    }
                    newZ = (lastSegment.Group.position.z - tunnelSegmentDepth) + .1;
                }
    
                tunnelSegment.Group.position.z = newZ;
    
                // Rotate tunnel segments.
                if (optionRotate) {
    
                    if (tunnelSegment.SegmentNumber % 2 == 0) { 
                    tunnelSegment.Group.rotation.z += tunnelSegmentRotation; 
                    tunnelSegment.Group.rotation.z += (xNewTunnelSpeed * .01);
                    }
                    else { 
                    tunnelSegment.Group.rotation.z = tunnelSegment.Group.rotation.z - tunnelSegmentRotation; 
                    tunnelSegment.Group.rotation.z = tunnelSegment.Group.rotation.z - (xNewTunnelSpeed * .08);
                    }
                }
            }
        }
    }

    enable() {
        // Reset the tunnel segment positions far in the back so it looks like its approaching.
        for (let i = 0; i < this.Segments.length; i++) {
            const tunnelSegment = this.Segments[i];
            let newZ = (tunnelSegment.SegmentNumber)*-tunnelSegmentDepth;
            newZ -= 40;
            tunnelSegment.Group.position.z = newZ;
            tunnelSegment.Group.visible = true;
        }

        this.Enabling = true;
        this.Enabled = true;
    }

    exit() {
        this.Exiting = true;
    }
}

class TunnelSegment {
    constructor(i) {
        this.SegmentNumber = i;
        this.Walls = [];

        this.buffGeometry = new THREE.BufferGeometry();
        this.vertices = [];

        // Create 4 walls of the same vertices,
        // rotate them accordingly and position them.
        
        // Left wall.
        this.vertices.push(-tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(-tunnelSegmentWidth,-tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(-tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        // Bottom wall.
        this.vertices.push(-tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(-tunnelSegmentWidth,-tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(tunnelSegmentWidth,-tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(-tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,-tunnelSegmentHeight,-tunnelSegmentDepth);
        // Right wall.
        this.vertices.push(tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,-tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(tunnelSegmentWidth,-tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        // Top wall.
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);

        //currentColor += 0x3333BBEF;
        //currentColor += 0x01010F;
        //buffMaterial.color = currentColor;

        // var r = getRandomInt(0, 255); // r is a random number between 0 - 255
        // var g = getRandomInt(0, 255); // g is a random number betwen 100 - 200
        // var b = getRandomInt(0, 255); // b is a random number between 0 - 100
        // var a = getRandomInt(0, 255); // a is a random number between 200 - 255
        // string color = `rgb(${r}, ${g}, ${b}, ${a})`;

        var h = getRandomInt(0, 360); // r is a random number between 0 - 255
        var s = getRandomInt(0, 100); // g is a random number betwen 100 - 200
        var l = getRandomInt(0, 100); // b is a random number between 0 - 100
        var hslColor = `hsl(${h}, ${s}%, ${l}%)`;
        
        var buffMaterial = new THREE.MeshBasicMaterial( { color: hslColor, side: THREE.DoubleSide } );
        this.buffGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.vertices, 3 ) );
        var wallMesh = new THREE.Mesh(this.buffGeometry, buffMaterial);

        this.Group = new THREE.Group();
        this.Group.add(wallMesh);

        scene.add(this.Group);

        // Draw the edges of the walls.
        if (optionShowEdges) {
            var buffMaterial = new THREE.MeshBasicMaterial( {color: `hsl(${h}, ${s}%, ${Math.max(l-10, 0)}%)`, side: THREE.DoubleSide } );

            var edgeGeo = new THREE.BoxBufferGeometry(.5, .5, tunnelSegmentDepth);
            var edgeMesh = new THREE.Mesh(edgeGeo, buffMaterial);
            edgeMesh.position.x = -tunnelSegmentWidth;
            edgeMesh.position.y = -tunnelSegmentHeight;
            edgeMesh.position.z = -tunnelSegmentDepth/2;
            this.Group.add(edgeMesh);

            edgeGeo = new THREE.BoxBufferGeometry(.5, .5, tunnelSegmentDepth);
            edgeMesh = new THREE.Mesh(edgeGeo, buffMaterial);
            edgeMesh.position.x = -tunnelSegmentWidth;
            edgeMesh.position.y = tunnelSegmentHeight;
            edgeMesh.position.z = -tunnelSegmentDepth/2;
            this.Group.add(edgeMesh);

            edgeGeo = new THREE.BoxBufferGeometry(.5, .5, tunnelSegmentDepth);
            edgeMesh = new THREE.Mesh(edgeGeo, buffMaterial);
            edgeMesh.position.x = tunnelSegmentWidth;
            edgeMesh.position.y = -tunnelSegmentHeight;
            edgeMesh.position.z = -tunnelSegmentDepth/2;
            this.Group.add(edgeMesh);

            edgeGeo = new THREE.BoxBufferGeometry(.5, .5, tunnelSegmentDepth);
            edgeMesh = new THREE.Mesh(edgeGeo, buffMaterial);
            edgeMesh.position.x = tunnelSegmentWidth;
            edgeMesh.position.y = tunnelSegmentHeight;
            edgeMesh.position.z = -tunnelSegmentDepth/2;
            this.Group.add(edgeMesh);
        }

        if (optionPyramids) {
            this.GeneratePyramids();
        }
    }

    GeneratePyramids() {
        //var center = MathUtils.lerp();
    }
}

