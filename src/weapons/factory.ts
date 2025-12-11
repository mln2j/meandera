import {
    Mesh,
    BoxGeometry,
    MeshStandardMaterial,
} from 'three';
import type { WeaponDefinition, WeaponType } from './types';

function createKnifeMesh(): Mesh {
    const handleGeo = new BoxGeometry(0.02, 0.08, 0.02);
    const handleMat = new MeshStandardMaterial({ color: 0x3E3E3A });
    const handle = new Mesh(handleGeo, handleMat);

    const bladeGeo = new BoxGeometry(0.01, 0.1, 0.02);
    const bladeMat = new MeshStandardMaterial({ color: 0xBFC0C0 });
    const blade = new Mesh(bladeGeo, bladeMat);
    blade.position.set(0, -0.09, 0);

    handle.add(blade);

    // rotacija i pozicija da izgleda kao da je u ruci
    handle.rotation.set(10.65, -0.15, -.25);
    handle.position.set(0, 0.1, 0.10);

    return handle;
}


function createPistolMesh(): Mesh {
    const bodyGeo = new BoxGeometry(.2, 0.035, 0.04);
    const bodyMat = new MeshStandardMaterial({ color: 0x6F6F6B });
    const body = new Mesh(bodyGeo, bodyMat);

    const gripGeo = new BoxGeometry(0.04, 0.08, 0.04);
    const gripMat = new MeshStandardMaterial({ color: 0x3E3E3A });
    const grip = new Mesh(gripGeo, gripMat);
    grip.position.set(-.04, -0.08, 0.02);

    body.add(grip);
    body.rotation.set(-0.12, 8, 1.25);
    body.position.set(-.01, .15, .09);

    return body;
}

function createBatMesh(): Mesh {
    const handleGeo = new BoxGeometry(0.03, 0.13, 0.028);
    const handleMat = new MeshStandardMaterial({ color: 0x5B3A1E });
    const handle = new Mesh(handleGeo, handleMat);

    const topGeo = new BoxGeometry(0.05, 0.14, 0.05);
    const topMat = new MeshStandardMaterial({ color: 0x7C4A24 });
    const top = new Mesh(topGeo, topMat);
    top.position.set(0, -0.125, 0);

    handle.add(top);

    // rotacija i pozicija da bude nagnut naprijed/prema sredini
    handle.rotation.set(-1.85, 0.05, -0.05);
    handle.position.set(0, 0.1, 0.1);

    return handle;
}


const weaponDefs: Record<WeaponType, WeaponDefinition> = {
    knife: {
        id: 'knife',
        name: 'Knife',
        damage: 20,
        range: 1.5,
        createMesh: createKnifeMesh,
    },
    pistol: {
        id: 'pistol',
        name: 'Pistol',
        damage: 35,
        range: 20,
        createMesh: createPistolMesh,
    },
    bat: {
        id: 'bat',
        name: 'Baseball Bat',
        damage: 25,
        range: 2.0,
        createMesh: createBatMesh,
    },
};

export function getWeaponDefinition(type: WeaponType): WeaponDefinition {
    return weaponDefs[type];
}
