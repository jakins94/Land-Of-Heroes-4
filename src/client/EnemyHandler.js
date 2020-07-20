
import { newEnemies } from './scenes/GameScene';
import PH from './PlayerHandler';

let enemies = [];

export default {

    enemyLoop() {
        for(let i=0;i<enemies.length;i++) {
            let enemy = enemies[i];

            if(!enemy) break;
            

            enemy.healthBarFront.displayWidth = (enemy.HP / enemy.maxHP) * enemy.healthBarBack.displayWidth;

            if(enemy.destroyTimer > 0) {
                enemy.destroyTimer--;
            } else if(enemy.destroyTimer == 0) {
                enemy.remove();
                enemies.splice(i, 1);
            }

        }
    },

    enemyMove(data) {
        let e = this.enemyById(data.eid);
        if(!e)
            return;

        e.movingX = data.x;
        e.movingY = data.y;

        /*if(e.target != -1) {
            let p = PH.playerByPid(e.target);
        }

        if(!p) return;*/
        

        //let phaser = window.game;
        //let scene = phaser.scene.GetScene('Game');
        //phaser.physics.moveTo(thisPlayer.sprite, thisPlayer.movingX, thisPlayer.movingY, 100);

    },

    enemyList() {
        return enemies;
    },

    addNewEnemies(data) {
        newEnemies(data);
    },

    // add enemy to array in EnemyHandler after creating it in GameScene
    addEnemy(enemy) {
        enemies.push(enemy);
    },

    removeEnemy(data) {
        let eid = data.eid;
        let enemy = this.enemyById(eid);

        if(!enemy) return;

        for(let i=0;i<enemies.length;i++) {
            if(enemies[i].id == eid) {
                enemies[i].destroyTimer = 25;
                enemies[i].sprite.anims.play(enemies[i].spriteName + '_death', false);
                console.log(enemies[i].sprite.anims);
            }
        }
    },

    enemyAttack(data) {
        let e = this.enemyById(data.eid);
        if(!e) return;
        let p = PH.playerByPid(data.pid);
        if(!p) return;

        if (e.sprite.body.x > p.sprite.body.x) {
            //e.sprite.setScale(-e.scaleX, e.scaleY);
            e.sprite.flipX = true;
        } else {
            //e.sprite.setScale(e.scaleX, e.scaleY);
            e.sprite.flipX = false;
        }

        let phaser = window.game;
        let scene = phaser.scene.getScene('Game');

        scene.sword1.play();
        
        //scene.cameras.main.shake(200, 0.005);


        e.target = data.pid;
        e.sprite.anims.play(e.spriteName + '_attack');
        console.log(data)
    },

    takeDamage(data) {

        let damage = data.damage;
        let type = data.type;
        let eid = data.eid;
        let crit = data.crit;

        let player = PH.playerByPid(data.pid);
        if(!player) return;

        let enemy = this.enemyById(eid);
        if(!enemy) return;

        let phaser = window.game;
        let scene = phaser.scene.getScene('Game');

        let damageText = scene.add.bitmapText(enemy.sprite.x, enemy.sprite.y - (enemy.sprite.height/2), 'prstart', damage);
            damageText.setFontSize(20);
            damageText.depth = 7;
            damageText.tint = 0xff0000;
            if(crit) damageText.tint = 0xffff00;
            damageText.setOrigin(0.5);

        scene.tweens.add({
            targets: damageText,
            x: enemy.sprite.x,
            y: enemy.sprite.y - 50,
            duration: 1000,
            ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: false,
            onComplete: damageText.destroy.bind(damageText, false)
        });

        //player.target = eid;
        if(enemy.target == -1) {
            enemy.target = player.pid;

        }

        enemy.HP -= damage;

        if(enemy.HP < 0) enemy.HP = 0;


    },

    enemyById(id) {
        for(let i=0;i<enemies.length;i++) {
            if(enemies[i].id == id) {
                return enemies[i];
            }
        }
        return false;
    }
}