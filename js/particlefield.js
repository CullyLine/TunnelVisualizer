class ParticleField {
    constructor() {
        this.particles = [];
    }

    animate(now) {
        var amp = amplitude[400];
        //console.log(amp);
        if(optionRandomlyPlacedParticles && amp > 50) {
            var newPart = new Particle();
            var starGeo = new THREE.SphereGeometry(.3);
            var starMesh = new THREE.Mesh(starGeo, newPart.partMat);
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
        if (optionRandomlyPlacedParticles) {
            for (var i = 0; i < this.particles.length; i++) {
                var part = this.particles[i];
                //part.partGroup.material.opacity -= now * .000001;
                //this.setOpacity( part.partGroup, 0.5 );
                part.partGroup.children[0].material.opacity  -= delta * .002;
                if (part.partGroup.children[0].material.opacity <= 0) {
                    part.partGroup.children[0].traverse(child => {
                        child.geometry.dispose();
                        child.material.dispose();
                        scene.remove(child);
                        scene.remove(part.partGroup);
                        const index = this.particles.indexOf(part);
                        if (index > -1) {
                            this.particles.splice(index, 1);
                        }
                        part = null;
                    });

                }
            }
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
        this.partMat = new THREE.MeshBasicMaterial( { color: 'yellow', side: THREE.DoubleSide, transparent: true} );
    }

    animate(now) {

    }
}