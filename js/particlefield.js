class ParticleField {
    constructor() {
        this.particles = [];
        this.partMat = new THREE.MeshBasicMaterial( { color: 'purple', side: THREE.DoubleSide, transparent: true} );
    }

    animate(now) {
        var amp = amplitude[400];
        console.log(amp);
        if(amp > 50) {
            var newPart = new Particle();
            var starGeo = new THREE.SphereGeometry(.3);
            var starMesh = new THREE.Mesh(starGeo, this.partMat);
            newPart.partGroup = new THREE.Group();
            newPart.partGroup.add(starMesh);
            var x = getRandomInt(-10, 10);
            var y = getRandomInt(-10, 10);
            var z = getRandomInt(100, -10);
            newPart.partGroup.position.setX(x);
            newPart.partGroup.position.setY(y);
            newPart.partGroup.position.setZ(z);
            scene.add(newPart.partGroup);
            this.particles.push(newPart);

        }

        // for (var part in this.particles) {
        //     if (this.particles.hasOwnProperty(part)) {
        //         this.setOpacity( part.partGroup, 0.001 );
        //         //part.partGroup.material.opacity -= now * .000001;
        //     }
        // }

        for (var i = 0; i < this.particles.length; i++) {
            var part = this.particles[i];
            //part.partGroup.material.opacity -= now * .000001;
            //this.setOpacity( part.partGroup, 0.5 );
            //part.partGroup.children[0].material.opacity  -= now * .00000001;
        }
    }

    setOpacity(obj, opacity) {

        obj.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material.opacity = opacity;
            }
        });
    }
}

class Particle {
    constructor() {
        this.partGroup;
    }

    animate(now) {

    }
}