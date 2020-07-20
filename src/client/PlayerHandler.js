import { newPlayer, newUser, bloodEffect } from './scenes/GameScene';
import { requestPlayers } from './Socket';
import { newMessage } from './ChatHandler';
import { setItems } from './Inventory';
import EH from './EnemyHandler';

let players = [];

export default {

    playerLoop() {

        for(let i=0;i<players.length;i++) {
            let player = players[i];

            if(!player) break;

            if(player.target >= 0) {
                let enemy = EH.enemyById(player.target);

                if(!enemy){
                    player.target = -1;
                    console.log('no enemy uhh')
                }

                //player.sprite.anims.play('attack', true);
            }


        }

    },

    playerList() {
        return players;
    },

    playerAttack(data) {
        let p = this.playerByPid(data.pid);
        if(!p) return;
        let e = EH.enemyById(data.eid);
        if(!e) return;

        p.sprite.anims.play('attack');


        let phaser = window.game;
        let scene = phaser.scene.getScene('Game');

        scene.sword2.play();

        p.target = data.eid;

        if(p.sprite.x > e.sprite.x) {
            p.sprite.setScale(-p.scale, p.scale);
            p.sprite.setOrigin(0.5);
        } else {
            p.sprite.setScale(p.scale, p.scale);
            p.sprite.setOrigin(0.5);
        }
    },
    
    // the user (client) is received
    userReceived(p) {
        let player = newUser(p);
        players.push(player);
        requestPlayers();
    },

    newItems(data) {
        console.log(data)
        setItems(data);
    },

    newServerMessage(data) {
        newMessage(data);
    },

    playerCharge(data) {
        let phaser = window.game;
        let scene = phaser.scene.getScene('Game');

        let p = this.playerByPid(data.pid);
        if(!p) return;
        let e = EH.enemyById(data.eid);
        if(!e) return;

        let newX;
        p.target = data.eid;
        if(p.sprite.x > e.sprite.x) {
            newX = e.sprite.x + 32;
            p.sprite.setScale(-p.scale, p.scale);
        } else {
            newX = e.sprite.x - 32;
            p.sprite.setScale(p.scale, p.scale);
        }


        scene.tweens.add({
            targets: p.sprite,
            x: newX,
            y: e.sprite.y,
            duration: 300,
            ease: 'Sine.easeIn',
            repeat: 0,
            yoyo: false,
            onComplete: () => { this.stopMovement(data.pid); }
        });

        //p.localMoveX = e.sprite.body.x;
        //p.localMoveY = e.sprite.body.y;

        //this.stopMovement(data.pid);


    },

    stopMovement(pid) {
        let p = this.playerByPid(pid);
        if(!p) return;

        p.movingX = p.sprite.body.x;
        p.movingY = p.sprite.body.y;

        p.destX = p.sprite.body.x;
        p.destY = p.sprite.body.y;


        p.localMoveX = p.sprite.body.x;
        p.localMoveY = p.sprite.body.y;

        //console.log()

        
    },

    newChat(data) {
        let player = this.playerByPid(data.id);
        if(!player) return;

        let maxLength = 25;
        let maxLines = 4;

        let thisChat = data.name + ': ' + data.msg;
        let newMsg = '';

        let numLines = thisChat.length / maxLength;

        for(let i=0;i<numLines;i++) {
            newMsg += thisChat.slice(0+(i*maxLength), maxLength+(i*maxLength)) + '-\n';
        }

        //if(thisChat.length > maxLength) {
        //    newMsg = thisChat.slice(0, maxLength) + '\n' + thisChat.slice(maxLength);
        //}
        
        player.lastChatText = newMsg;
        player.chatText.x = player.sprite.x;
        player.chatText.y = player.sprite.y - 40;

        player.lastChatTime = Date.now();

    // sends data to ChatHandler also
        newMessage({msg: thisChat});
    },

    // one new player is received
    playerReceived(p) {
        let player = newPlayer(p);
        players.push(player);
    },

    // multiple new players received
    playersReceived(p) {
        for(let i=0;i<p.players.length;i++) {
            let exists = false;
            for(let x=0;x<players.length;x++) {
                if(players[x].pid == p.players[i].pid) {
                    exists = true;
                }
            }
            //only add new player if it doesn't already exist
            if(!exists) {
                let player = newPlayer(p.players[i]);
                players.push(player);
            }
        }
    },

    removePlayer(p) {
        let thisPlayer = this.playerByPid(p.pid);
        console.log('remove p',p)
        if(thisPlayer) {
            for(let i=0;i<players.length;i++) {
                if(players[i].pid == p.pid) {
                    players[i].sprite.destroy();
                    players.splice(i, 1);
                    console.log('players',players)
                }
            }
        }
    },

    gainedExp(data) {
        let p = this.playerByPid(data.pid);
        if(!p) return;

        p.currentExp += data.exp;
    },

    playerMove(data) {
        let thisPlayer = this.playerByPid(data.pid);
        if(!thisPlayer)
            return;
        thisPlayer.movingX = data.x;
        thisPlayer.movingY = data.y;
        thisPlayer.localMoveX = data.x;
        thisPlayer.localMoveY = data.y;
        thisPlayer.moving = true;

        //thisPlayer.target = -1;
        //console.log('player move remove targ')

        //let phaser = window.game;
        //let scene = phaser.scene.GetScene('Game');
        //phaser.physics.moveTo(thisPlayer.sprite, thisPlayer.movingX, thisPlayer.movingY, 100);

    },
    
    playerByPid(id) {
        for(let i=0;i<players.length;i++) {
            var p = players[i];
            if(p.pid == id) {
                return p;
            }
        }
        return false;
    }

    /*sendNewPlayer() {
        console.log(index.mySocket())
        index.mySocket().emit('receivedNewPlayer', {socket : socket });
    }*/
}