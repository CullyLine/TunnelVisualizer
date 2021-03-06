class Tunnel extends Visual {
    constructor() {
        super();
        this.keybind = ['Control', 'Shift', 'Alt', 'F1'];
        this.title = 'Tunnel';
        this.Segments = [];
        this.fovModifer = .1;
        // s
    }

    animate() {
        if (this.Exiting && this.Segments.every(s => !s.Group.visible)) {
            // speed up tunnel, fade out, and slow down rotation as the tunnel finishes
            //if ()
            this.Enabled = false;
            this.Exiting = false;

            camera.fov = 70;
            camera.updateProjectionMatrix();
        }

        // Determine where the tunnel segments should go next.
        if (this.Enabled) {
            for (let i = 0; i < this.Segments.length; i++) {
                const tunnelSegment = this.Segments[i];
    
                if (!tunnelSegment.Group.visible) { continue; }

                var xNewTunnelSpeed = newTunnelSpeed;
                if (this.Exiting) {
                    xNewTunnelSpeed = 2;

                    //console.log(Math.sin(Date.now() * 0.001) * 70 + 70);
                    if (camera.fov >= 180) { this.fovModifer = -.1; }
                    if (camera.fov <= 70) { this.fovModifer = .1; }
                    camera.fov += this.fovModifer;
                    //console.log(camera.fov);
                    camera.updateProjectionMatrix();
                }
    
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
    
                    if (tunnelSegment.SegmentNumber % 2 === 0) {
                    tunnelSegment.Group.rotation.z += tunnelSegmentRotation; 
                    tunnelSegment.Group.rotation.z += (xNewTunnelSpeed * .008);
                    }
                    else { 
                    tunnelSegment.Group.rotation.z = tunnelSegment.Group.rotation.z - tunnelSegmentRotation; 
                    tunnelSegment.Group.rotation.z = tunnelSegment.Group.rotation.z - (xNewTunnelSpeed * .01);
                    }
                }

                // if (i<20) {
                // var direction = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( tunnelSegment.Group.quaternion );

                var matrix = new THREE.Matrix4();
                matrix.extractRotation( tunnelSegment.Group.matrix );

                var dirX = -1;
                var dirY = -1;
                //if (tunnelSegment.SegmentNumber == 1) { console.log(tunnelSegment.Group.position.x); }
                // if (tunnelSegment.Group.position.x >= 0) { dirX = 1; if (tunnelSegment.SegmentNumber == 1) { console.log("Flipped " + tunnelSegment.Group.position);} }
                //if (tunnelSegment.Group.position.y >= 0) { dirY = 1; }
                var direction = new THREE.Vector3( dirX, dirY, 0 );
                direction = direction.applyMatrix4(matrix);

                // tunnelSegment.Group.position.setX(direction.x * 1);
                // tunnelSegment.Group.position.setY(direction.y * 1);
                // }

                var explosionPower = amplitude[200] * tunnelExplosionPower;
               // explosionPower = 1;
                explosionPower = clamp(explosionPower, 0, 900);
                tunnelSegment.Group.traverse(wall =>
                {
                    //var preRot = wall.matrix;
                    wall.position.setX( explosionPower ); //
                    //console.log(direction.x * explosionPower);
                    wall.position.setY( explosionPower ); //direction.y *
                    //wall.rotateZ(Math.PI / 2);
                    //wall.rotateX(Math.PI);
                    //wall.setRotationFromMatrix(preRot);
                    //wall.updateMatrix();
                });

                //tunnelSegment.Group.updateMatrix();

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

        //currentColor += 0x3333BBEF;
        //currentColor += 0x01010F;
        //buffMaterial.color = currentColor;

        // var r = getRandomInt(0, 255); // r is a random number between 0 - 255
        // var g = getRandomInt(0, 255); // g is a random number betwen 100 - 200
        // var b = getRandomInt(0, 255); // b is a random number between 0 - 100
        // var a = getRandomInt(0, 255); // a is a random number between 200 - 255
        // string color = `rgb(${r}, ${g}, ${b}, ${a})`;

        // Create 4 walls of the same vertices,
        // rotate them accordingly and position them.

        // Top wall.
        var h = getRandomInt(0, 360); // r is a random number between 0 - 255
        var s = getRandomInt(0, 100); // g is a random number betwen 100 - 200
        var l = getRandomInt(0, 100); // b is a random number between 0 - 100
        var hslColor = `hsl(${h}, ${s}%, ${l}%)`;

        // Wall vertices
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        this.vertices.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,0);
        this.vertices.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);

        var buffMaterial;
        if (colorScheme1 == "" && colorScheme2 == "") {
            buffMaterial = new THREE.MeshBasicMaterial( { color: hslColor, side: THREE.DoubleSide} );
        }
        else {
            if (this.SegmentNumber % 2 == 0) {
                buffMaterial = new THREE.MeshBasicMaterial( { color: colorScheme1, side: THREE.DoubleSide});
            }
            else {
                buffMaterial = new THREE.MeshBasicMaterial( { color: colorScheme2, side: THREE.DoubleSide});
            }

        }
        

        this.buffGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.vertices, 3 ) );
        var topWallMesh = new THREE.Mesh(this.buffGeometry, buffMaterial);

        var topGroup = new THREE.Group();
        topGroup.add(topWallMesh);

        if (optionPyramids) {
            var pMesh = this.GeneratePyramids();

            topGroup.add(pMesh);
        }
        topGroup.rotateX(Math.PI);
        topGroup.position.setY(tunnelSegmentHeight*2);
        topGroup.position.setZ(-tunnelSegmentDepth);

        // The new system is to create one template mesh and then make copies of those
        // for the remaining walls.

        var bottomGroup = topGroup.clone(true);
        bottomGroup.rotateX(Math.PI);
        bottomGroup.position.setY(-tunnelSegmentHeight*2);
        bottomGroup.position.setZ(0);

        // var leftGroup = bottomGroup.clone(true);
        // leftGroup.rotateZ(Math.PI / 2);
        // leftGroup.rotateX(Math.PI);
        // leftGroup.position.setZ(-tunnelSegmentDepth);
        // leftGroup.position.setX(-tunnelSegmentWidth * 2);
        // leftGroup.position.setY(0);

        var leftGroup = topGroup.clone(true);
        leftGroup.rotateZ(Math.PI / 2);
        leftGroup.rotateX(Math.PI);
        leftGroup.position.setZ(0);
        leftGroup.position.setX(-tunnelSegmentWidth * 2);
        leftGroup.position.setY(0);

        var rightGroup = topGroup.clone(true);
        rightGroup.rotateZ(Math.PI / 2);
        rightGroup.position.setZ(-tunnelSegmentDepth);
        rightGroup.position.setX(tunnelSegmentWidth * 2);
        rightGroup.position.setY(0);

        this.Group = new THREE.Group();
        this.Group.add(topGroup);
        this.Group.add(bottomGroup);
        this.Group.add(leftGroup);
        this.Group.add(rightGroup);

        topGroup.traverse(wall => {console.log(wall);});

        this.Walls.push(topGroup);
        this.Walls.push(bottomGroup);
        this.Walls.push(leftGroup);
        this.Walls.push(rightGroup);

        scene.add(this.Group);


        // Draw the edges of the walls.
        if (optionShowEdges) {
            console.log(optionShowEdges);
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
    }

    GeneratePyramids() {
        //var center = MathUtils.lerp();
        var pGeo = new THREE.BufferGeometry();
        var pVerts = [];

        var centerPoint = new THREE.Vector3(-tunnelSegmentWidth,tunnelSegmentHeight,0).lerp(new THREE.Vector3(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth), .5);
        centerPoint.y = centerPoint.y + 3;

        pVerts.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        pVerts.push(tunnelSegmentWidth,tunnelSegmentHeight,0);
        pVerts.push(centerPoint.x,centerPoint.y,centerPoint.z);

        pVerts.push(-tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        pVerts.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        pVerts.push(centerPoint.x,centerPoint.y,centerPoint.z);

        pVerts.push(-tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        pVerts.push(-tunnelSegmentWidth,tunnelSegmentHeight,0);
        pVerts.push(centerPoint.x,centerPoint.y,centerPoint.z);

        pVerts.push(tunnelSegmentWidth,tunnelSegmentHeight,-tunnelSegmentDepth);
        pVerts.push(tunnelSegmentWidth,tunnelSegmentHeight,0);
        pVerts.push(centerPoint.x,centerPoint.y,centerPoint.z);

        var h = getRandomInt(0, 360); // r is a random number between 0 - 255
        var s = getRandomInt(0, 100); // g is a random number betwen 100 - 200
        var l = getRandomInt(0, 100); // b is a random number between 0 - 100
        var hslColor = `hsl(${h}, ${s}%, ${l}%)`;

        var pMaterial = new THREE.MeshBasicMaterial( { color: hslColor, side: THREE.DoubleSide} );
        pGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( pVerts, 3 ) );

        return new THREE.Mesh(pGeo, pMaterial);
    }
}


