import { pickupItem } from './Socket';


let itemList = [ // Name, sprite name
    ['Health potion', 'healthPotion'],
    ['Coins', 'coins'],
    ['Copper helmet', 'bronzeHelm'],
    ['Copper platelegs', 'bronzeLegs'],
    ['Shield', 'defaultShield'],
    ['Platebody', 'defaultBody'],
    ['Boots', 'defaultBoots'],
    ['Ruby ring', 'rubyRing'],
    ['Copper dagger', 'copperDagger'],
    ['Leather gloves', 'leatherGloves'],
    ['Bonetooth necklace', 'toothNecklace']
    ];

let groundItems = [];

export function getItemList() {
    return itemList;
}

export function adjustedStat(statName) {

    let newStat = statName;

    console.log(newStat)

    switch(statName) {
        case 'critChance':
            newStat = 'Critical chance';
            break;
    }

    console.log(newStat)


    return newStat;

}


export default {

    itemLoop() {
        for(let i=0;i<groundItems.length;i++) {
            if(groundItems[i][2] <= Date.now() - 60000) {
                groundItems[i][1].destroy();
                groundItems.splice(i, 1);
            }
        }
    },

    removeGroundItem(data) {
        for(let i=0;i<groundItems.length;i++) {
            if(groundItems[i][0] == data.itemId) {
                groundItems[i][1].destroy();
                groundItems.splice(i, 1);
            }
        }
    },

    groundItemById(id) {
        for(let i=0;i<groundItems.length;i++) {
            if(groundItems[i] == id) {
                return groundItems[i];
            }
        }
        return false;
    },

    createGroundItem(data) {
        let phaser = window.game;
        let scene = phaser.scene.getScene('Game');
        let itemSprite = scene.physics.add.sprite(data.x, data.y, itemList[data.type][1]).setInteractive();

        itemSprite.setScale(0.6, 0.6);
        itemSprite.depth = 3;

        itemSprite.on('pointerdown', () => {
            pickupItem(data.itemId);
        });


        scene.tweens.add({
            targets: itemSprite,
            y: data.y - 7,
            duration: 1000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        let item = [data.itemId, itemSprite, Date.now()];

        groundItems.push(item);

    }

}