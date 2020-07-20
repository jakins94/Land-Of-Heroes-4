import config from './config/config';
import PH from './PlayerHandler';
import EH from './EnemyHandler';
import IH from './ItemHandler';
import { newEquips } from './Equipment';
import { newChat } from './ChatHandler';
import { charactersLoaded, nameAvailable } from './CharSelect';
import io from 'socket.io-client';
import { startGameScenes } from '../index';

let mySocket;
let userToken = 123;
let myUid = 123;

export function sendMovement(x, y, pid) {
    mySocket.emit('player move', {x: x, y: y});
}

export function requestItems() {
    mySocket.emit('request items', {null: null});
}

export function sendHeartbeat(id) {
    mySocket.emit('player heartbeat', { id: mySocket.id });
}

export function requestPlayers() {
    mySocket.emit('request players');
}

export function sendChatMessage(msg) {
    mySocket.emit('chat message', { msg: msg });
}

export function sendAttackEnemy(id) {
    mySocket.emit('player attack enemy', { eid: id });
}

export function pickupItem(id) {
    mySocket.emit('pickup item', { itemId: id });
}

export function dropItem(slot) {
    mySocket.emit('drop item', { slot: slot });
}

export function equipItem(slot) {
    mySocket.emit('equip item', { slot: slot });
}

export function requestCharacters() {
    mySocket.emit('request characters', { id: myUid });
}

export function characterSelected(id) {
    mySocket.emit('character selected', { id: id, uid: myUid });
}

export function checkName(name) {
    mySocket.emit('check name available', { name: name });
}

export function sendCreateCharacter(name, slot) {
    mySocket.emit('create character', { name: name, slot: slot, uid: myUid });
}

export function deleteCharacter(slot) {
    mySocket.emit('delete character', { slot: slot, uid: myUid });
}

export function sendAbility(slot, target) {
    mySocket.emit('cast ability', { slot: slot, target: target });
}

export function newUid(uid) {
    myUid = uid;
    console.log('myUid set to ', myUid)
}

export function socketConnect() {

    userToken = getUrlParameter('token');

    mySocket = io.connect(config.ip);

    mySocket.emit('user auth', { token: userToken });

    //mySocket.emit('user auth', { token: 123 });

    mySocket.on('userConnected', (data) => PH.userReceived(data));
    mySocket.on('playerConnected', (data) => PH.playerReceived(data));
    mySocket.on('playersConnected', (data) => PH.playersReceived(data));
    mySocket.on('playerMove', (data) => PH.playerMove(data));
    mySocket.on('removePlayer', (data) => PH.removePlayer(data));
    mySocket.on('new message', (data) => PH.newChat(data));
    mySocket.on('new server message', (data) => PH.newServerMessage(data));
    mySocket.on('player attack', (data) => PH.playerAttack(data));
    mySocket.on('new items', (data) => PH.newItems(data));
    mySocket.on('gained exp', (data) => PH.gainedExp(data));

    mySocket.on('player charge', (data) => PH.playerCharge(data));


    mySocket.on('new ground item', (data) => IH.createGroundItem(data));
    mySocket.on('remove ground item', (data) => IH.removeGroundItem(data));


    mySocket.on('new enemies', (data) => EH.addNewEnemies(data));
    mySocket.on('enemy take damage', (data) => EH.takeDamage(data));
    mySocket.on('remove enemy', (data) => EH.removeEnemy(data));
    mySocket.on('enemy attack', (data) => EH.enemyAttack(data));
    mySocket.on('enemy move', (data) => EH.enemyMove(data));

    mySocket.on('new equips', (data) => newEquips(data));

    mySocket.on('characters loaded', (data) => charactersLoaded(data));
    mySocket.on('start game', (data) => startGameScenes(data));
    mySocket.on('name available', (data) => nameAvailable(data));

    /*mySocket.on('disconnected', () => {
        this.window.href = config.loginPage;
    });*/


}

export function returnSocket() {
    return mySocket;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}