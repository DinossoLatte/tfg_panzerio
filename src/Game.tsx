import * as React from 'react';
import * as Redux from 'redux';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'

import { Map } from './Map';
import { Actions, getInitialState } from './GameState';
import { EditMap } from './EditMap';
import { store, saveState } from './Store';
import { Network, Pair } from './Utils';
import { Profile } from './Profile'
import { Infantry, Tank, General, Unit } from './Unit';
import * as StoreEdit from './StoreEdit';
import * as GameEditState from './GameEditState';

const playText = "Jugar";
const roomListText = "Listado de partidas";
const backText = "Volver al menú";
const identifierText = "Identificador";
const numberUsersText = "Número de usuarios";
const createGameText = "Crear partida";
const joinGameText = "Unirse a partida";
const gameFullText = "La partida seleccionada está completa o en progreso";
const editMapMenuButton = "Acceder a la edición del mapa";
const loginAlertText = "Necesita iniciar sesión para acceder a esta funcionalidad";
const profileMenuButton = "Acceder al perfil personal";
const userManualText = "Manual de usuario";
const gameIdentifierText = "Id de la partida: ";
const selectMenuText = "Menú de selección";
const selectText = "--Selecciona--";
const startGameText = "Empezar partida";
const selectMapGameText = "Seleccione el mapa";
const selectAllyArmyText = "Seleccione el batallón aliado";
const selectEnemyArmyText = "Seleccione el batallón enemigo";
const selectAlertText = "Debe seleccionar el batallón y el mapa para continuar";
const createMapTitleText = "Creación del mapa";
const widthText = "Anchura:";
const heightText = "Altura:";
const widthPlaceText = "Anchura";
const heightPlaceText = "Altura";
const createMapText = "Crear mapa";
const numberAlertText = "Deben introducirse valores numéricos mayores a 1";
const editMapText = "Edición del Mapa";
const selectMapText = "Seleccione el mapa: ";
const editMapButtonText = "Modificar mapa";
const deleteMapText = "Eliminar mapa";
const deleteAlertText = "Se ha eliminado correctamente el mapa";
const selectMapAlertText = "Se debe seleccionar un mapa";
const userGoneText = "Un jugador ha dejado la partida";
const playInfo = "Deberá darle a empezar partida y esperar que otro jugador entre a la partida";

const manualText = (<div><br />
    <div><p id="bold">Introducción</p>
    PanzergIO es un videojuego de estrategia por turnos en la que dos jugadores luchan con batallones personalizados en un mapa que también es personalizable.
    </div><br />
    <div><p id="bold">Historia</p>
    La historia se basa en un universo alternativo donde la humanidad se encuentra en una Tercera Guerra Mundial en la que todos los paises están en una guerra en la que no existen aliados, solamente enemigos.
    </div><br />
    <div><p id="bold">Unidades</p>
    Hay un total de 5 unidades que pueden agruparse de forma personalizada como el jugador desee formando batallones, cada batallón debe contar obligatoriamente con un General. Cada unidad cuenta con una serie de estadísticas las cuales son:
    <ul>
      <li> Vida: Cantidad de daño que puede soportar la unidad para no morir, una vez llega a 0 la unidad desaparece.</li>
      <li> Alcance: Distancia de la casilla más lejana que puede ser atacada por dicha unidad (se mide en número de casillas). </li>
      <li> Movimiento: Distancia de la casilla más lejana a la que puede llegar una unidad en un turno (se mide en número de casillas). </li>
      <li> Ataque fuerte y débil: Son los dos tipos de ataque que tiene la unidad, se combinan de forma que el ataque fuerte contrarresta a la defensa fuerte y el ataque débil contrarresta a la defensa débil, a continuación se pone la fórmula del daño que puede realizar a una unidad.</li>
      <li> Defensa fuerte y débil: Es la resistencia de la unidad frente a los ataques fuertes y débiles enemigos respectivamente.</li>
      <li> Fórmula del daño: Si una unidad A ataca a una unidad enemiga B, la formula del daño será: "Daño que recibe B = (Ataque fuerte de A - Defensa fuerte de B) + (Ataque débil de A - Ataque débil de B)"</li>
    </ul>
    Aquí se exponen cada una de las Unidades:

    <ul>
      <li> General: Es la unidad principal del juego, si muere se termina la partida. </li>
      <ul>
        <li> Vida: 2</li>
        <li> Alcance: 1</li>
        <li> Movimiento: 1</li>
        <li> Ataque fuerte: 0</li>
        <li> Ataque débil: 1</li>
        <li> Defensa fuerte: 2</li>
        <li> Defensa débil: 1</li>
      </ul>
      <li> Infatería: Es la unidad básica y más equilibrada del juego.</li>
      <ul>
        <li> Vida: 2</li>
        <li> Alcance: 1</li>
        <li> Movimiento: 2</li>
        <li> Ataque fuerte: 2</li>
        <li> Ataque débil: 2</li>
        <li> Defensa fuerte: 2</li>
        <li> Defensa débil: 1</li>
      </ul>
      <li> Tanque: Unidad pesada del juego que tiene mucho daño cuerpo a cuerpo.</li>
      <ul>
        <li> Vida: 4</li>
        <li> Alcance: 1</li>
        <li> Movimiento: 1</li>
        <li> Ataque fuerte: 3</li>
        <li> Ataque débil: 2</li>
        <li> Defensa fuerte: 1</li>
        <li> Defensa débil: 2</li>
      </ul>
      <li> Artillería: Unidad pesada del juego que solo puede atacar a distancia (no puede atacar a las unidades situadas cuerpo a cuerpo).</li>
      <ul>
        <li> Vida: 3</li>
        <li> Alcance: 3</li>
        <li> Movimiento: 2</li>
        <li> Ataque fuerte: 3</li>
        <li> Ataque débil: 2</li>
        <li> Defensa fuerte: 2</li>
        <li> Defensa débil: 2</li>
      </ul>
      <li> Paracaidista: Unidad de infantería con mucha movilidad pero que tras moverse necesita reposar (no puede atacar hasta el siguiente turno).</li>
      <ul>
        <li> Vida: 3</li>
        <li> Alcance: 1</li>
        <li> Movimiento: 5</li>
        <li> Ataque fuerte: 4</li>
        <li> Ataque débil: 3</li>
        <li> Defensa fuerte: 2</li>
        <li> Defensa débil: 1</li>
      </ul>
    </ul>
    </div><br />
    <div><p id="bold">Terrenos</p>
    Hay diferentes tipos de terrenos que pueden ser colocados al crear un nuevo mapa. Cada terreno posee las siguientes características:
    <ul>
      <li> Penalización de movimiento: Es el coste de movimiento por pasar por dicho terreno. Si cuesta 1 significa que cada casilla recorrida de ese tipo te costará 1 de movimiento, mientras que si costara 2 por ejemplo significará que costará 2 de movimiento por cada casilla de ese tipo que recorras.</li>
      <li> Ataque fuerte, ataque débil, defensa fuerte y defensa débil: Son las bonifaciones de dichas estadísticas que recibe una unidad que esté colocada sobre dicha casilla.</li>
    </ul>
    Aquí se exponen cada uno de los terrenos:
    <ul>
      <li> Llanura: Terreno por defecto, no posee ninguna característica en especial.</li>
      <ul>
        <li> Penalización de movimiento: 1</li>
        <li> Ataque fuerte: 0</li>
        <li> Ataque débil: 0</li>
        <li> Defensa fuerte: 0</li>
        <li> Defensa débil: 0</li>
      </ul>
      <li> Montaña: Terreno impasable para todas las unidades (excepto el paracaidista debido a que es una unidad aérea).</li>
      <ul>
        <li> Penalización de movimiento: -1 (no se puede atravesar)</li>
        <li> Ataque fuerte: 0</li>
        <li> Ataque débil: 0</li>
        <li> Defensa fuerte: 0</li>
        <li> Defensa débil: 0</li>
      </ul>
      <li> Colina: Terreno con cierta inclinación.</li>
      <ul>
        <li> Penalización de movimiento: 2</li>
        <li> Ataque fuerte: 1</li>
        <li> Ataque débil: 0</li>
        <li> Defensa fuerte: 1</li>
        <li> Defensa débil: 1</li>
      </ul>
      <li> Bosque: Terreno repleto de árboles.</li>
      <ul>
        <li> Penalización de movimiento: 1</li>
        <li> Ataque fuerte: 0</li>
        <li> Ataque débil: 0</li>
        <li> Defensa fuerte: 0</li>
        <li> Defensa débil: 2</li>
      </ul>
      <li> Río: Terreno húmedo.</li>
      <ul>
        <li> Penalización de movimiento: 1</li>
        <li> Ataque fuerte: 0</li>
        <li> Ataque débil: 0</li>
        <li> Defensa fuerte: -1</li>
        <li> Defensa débil: -1</li>
      </ul>
    </ul>
    </div><br />
    <div><p id="bold">¿Cómo empezar?</p>
    Una vez iniciado el juego y el jugador se encuentre en el menú de inicio, deberá iniciar sesión con su cuenta de Google de forma que podrá acceder al resto de opciones que dispone el juego.
    Para poder jugador en multijugador bastará con que el jugador cree una partida en el menú y otro jugador abra una pestaña en el mismo navegador y acceda al menú, inicie sesión y se una a la partida que está creando el primer jugador.
    </div><br />
    <div><p id="bold">Mecánicas del juego</p>
    Para empezar una partida deberán enfrentarse dos jugadores A (host) y B. Al empezar el jugador A elige mapa (de los que haya creado) y su batallón mientras que el jugador B solo elije su batallón, tras darle a empezar ambos jugadores comenzará el primer turno de colocación de unidades en la que A coloca todas sus unidades del batallón y cuando de a pasar turno podrá colocarlas B (en caso de que se equivoque al colocar una unidad podrá editar su posición seleccionándola de nuevo). Cuando ambos jugadores terminen de colocarlas empezará la partida en la que cada jugador en su turno podrá ir moviendo sus unidades y decidiendo a qué unidad atacar (primero deberá elegir movimiento y luego ataque, en caso de equivocarse podrá cancelar la acción o pasar sino desea realizar movimiento o ataque). La partida termina cuando el General de uno de los jugadores muere.
    </div><br />
    <div><p id="bold">Creación del mapa</p>
    Para crear un mapa se accede a "Edición de mapa" y se selecciona el tamaño del mapa, una vez hecho se pueden ir colocando terrenos sobre el mapa y una vez el resultado sea el deseado se hace clic sobre "Guardar" para guardar dicho mapa.
    Para editar un mapa se accede también a "Edición de mapa" pero esta vez se selecciona el mapa concreto y se edita de la misma forma que se creó el mapa, también hay posibilidad de eliminado.
    </div><br />
    <div><p id="bold">Perfil del jugador</p>
    Al acceder al perfil personal desde el menú se podrá ver el nombre del jugador, el contador de victorias y derrotas y los batallones del jugador que podrán ser editados añadiendo nuevos batallones o modificando los existentes.
    Al crear un batallón se elije un nombre y se van añadiendo unidades (el general se añade automáticamente). Al finalizar dichos cambios aparecerán en la lista de batallones en "Mostrar batallones" y podrán ser guardados dándole al botón "Guardar batallones" ya que los cambios son almacenados en local y deberán ser guardados en servidor una vez el jugador realice todos los cambios que vea oportuno.
    La edición se realiza de forma similar a la creación con la excepción de que se debe seleccionar uno de los batallones que disponga el jugador, es importante que tras realizar todos los cambios se le de al botón "Guardar batallones" para que se guarden dichos datos.
    </div></div>);

class EnterGameButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <button id="enterGame" name="enterGame" className="btn btn-primary btn-sm" onClick={this.onClick.bind(this)}>{playText}</button>
    }

    onClick() {
        if(this.props.parentObject.state.clientId==null){
            window.alert(loginAlertText);
        }else{
            this.props.parentObject.changeGameState(7);
        }
    }
}

// Este panel contendrá información sobre las partidas actuales y crear una nueva partida
class MainPanelMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            games: [],
        }
        this.updateGameList();
    }

    render() {
        return (
            <div className="jumbotron text-center">
                <h2>{roomListText} <button className="btn btn-primary btn-sm" id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>{backText}</button></h2>
                <table className="table" id="gameList">
                    <tbody>
                        <tr>
                            <td>{identifierText}</td>
                            <td>{numberUsersText}</td>
                        </tr>
                        {this.renderGameList()}
                    </tbody>
                </table>

                <button className="btn btn-primary btn-sm" onClick={this.onClickCreate.bind(this)} id="buttonCreateGame" name="buttonCreateGame">{createGameText}</button>
            </div>
        );
    }

    renderGameList() {
        let result = [];
        for(let gameIndex in this.state.games) {
            let game = this.state.games[gameIndex];
            let row = <tr><td>{gameIndex}</td><td>{(game.player1URL?1:0) + (game.player2URL?1:0)} / 2</td><td><button className="btn btn-primary btn-sm" onClick={() => this.onClickJoin(gameIndex)}>{joinGameText}</button></td></tr>
            result.push(row);
        }
        return result;
    }

    onClickCreate() {
        // Creamos la partida
        Network.createGame((result) => {
            // Comprobamos que haya salido bien la operación
            if(result.status) {
                // TODO store.dispatch(Actions.generateNewId(result.gameId)); Creo que el estado no está definido en este momento
                Network.gameId = result.gameId;
                getInitialState(result.gameId, (height, width) => {
                    store.dispatch(Actions.generateFinish());
                    // Cambiamos el estado a pre juego.
                    this.props.parentObject.changeGameState(5);
                });
            }
        })
    }

    onClickJoin(gameId: string) {
        Network.joinGame(gameId, (result) => {
            if(result.status) {
                Network.gameId = result.gameId;
                getInitialState(result.gameId, (height, width) => {
                    store.dispatch(Actions.generateFinish());
                    this.props.parentObject.setState({
                        rows: height,
                        columns: width
                    });
                    // Cambiamos el estado a pre juego.
                    this.props.parentObject.changeGameState(5);
                });
            } else {
                // Vemos el código de error
                if(result.message == "Game is full" || result.message == "Game is over or in progress") {
                    // Avisamos con un warning de que la sala está ocupada
                    window.alert(gameFullText);
                }
            }
        })
    }

    onClickExit() {
        this.props.parentObject.changeGameState(0);
    }

    updateGameList() {
        Network.sendGetGameList((status: { status: boolean, games: any[] }) => {
            if(status.status) {
                this.setState({ games: status.games });
            }
        });
    }

}

class EditGameButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="editGame" name="editGame" className="btn btn-primary btn-sm" onClick={this.onClick.bind(this)}>{editMapMenuButton}</button>
    }

    onClick() {
        if(this.props.parentObject.state.clientId==null){
            window.alert(loginAlertText);
        }else{
            this.props.parentObject.changeGameState(3);
        }
    }
}

class ProfileButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="profileButton" name="profileButton" className="btn btn-primary btn-sm" onClick={this.onClick.bind(this)}>{profileMenuButton}</button>
    }

    onClick() {
        if(this.props.parentObject.state.clientId==null){
            window.alert(loginAlertText);
        }else{
            this.props.parentObject.changeGameState(6);
        }
    }
}


class OptionsMenuButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="optionsMenu" name="optionsMenu" className="btn btn-primary btn-sm" onClick={this.onClick.bind(this)}>{userManualText}</button>
    }

    onClick() {
        this.props.parentObject.changeGameState(1);
    }
}

class OptionsMenu extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <div className="jumbotron text-left">
            <h2>{userManualText} <button className="btn btn-primary btn-sm" id="exitButton" name="exitButton" onClick={this.onClick.bind(this)}>{backText}</button></h2>
            {manualText}
            </div>;
    }

    onClick(clickEvent : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeGameState(0);
    }
}

class PreGameMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            playerArmy: [] as Array<{type: string, number: number}>,
            enemyArmy: [] as Array<{type: string, number: number}>,
            mapId: [] as Array<number>,
            mapName: [] as Array<string>,
            armyId: [] as Array<number>,
            armyName: [] as Array<string>,
            selected: null,
            selectedPlayer: null,
            selectedEnemy: null,
            isPlayer: store.getState().isPlayer,
            id: store.getState().id
        };
        this.getUserIdFromServer((error: { status: boolean, errorCode: string, userId: number })=>{
            this.getArmyIdFromServer(error);
        });
    }

    render() {
        return (
        <div className="jumbotron text-center">
            <h2 id="bold">{gameIdentifierText+this.state.id}</h2>
            <h2>{selectMenuText} <button className="btn btn-primary btn-sm" onClick={this.exitPreGame.bind(this)}>{backText}</button></h2>
            {this.showPlayerMenu()}
            <div className="alert alert-info" id="error">{playInfo}</div>
            <button className="btn btn-primary btn-sm" onClick={this.startGame.bind(this)}>{startGameText}</button><br/>
        </div>);
    }

    updatePlayer(evt: string) {
        // Comprobamos que el select tenga seleccionado el 'custom'
        this.setState({ selectedPlayer: Number(evt) });
    }

    updateEnemy(evt: string) {
        // Comprobamos que el select tenga seleccionado el 'custom'
        this.setState({ selectedEnemy: Number(evt) });
    }

    selectUnits(){
        let army = null;
        if(this.state.armyId) {
            army = [<option selected value={null}>{selectText}</option>];
            for(var i = 0; i < this.state.armyId.length; i++){
                army.push(<option value={this.state.armyId[i]}>{this.state.armyName[i]}</option>);
            }
        }
        return army;
    }

    selectMaps(){
        let map = null;
        if(this.state.mapId){
            map = [<option selected value={null}>{selectText}</option>];
            for(var i = 0; i < this.state.mapId.length; i++){
                map.push(<option value={this.state.mapId[i]}>{this.state.mapName[i]}</option>);
            }
        }
        return map;
    }

    showPlayerMenu() {
        if(this.state.isPlayer) {
            return (
            <div>
                <div className="form-group">
                    <label> {selectAllyArmyText}
                    <select className="form-control" id="player" defaultValue={null} value={this.state.selectedPlayer} onChange={evt => this.updatePlayer(evt.target.value)}>
                        {this.selectUnits()}
                    </select>
                    </label>
                </div>
                <div className="form-group">
                    <label> {selectMapGameText}
                    <select className="form-control" id="map" defaultValue={null} value={this.state.selected} onChange={evt => this.updateMap(evt.target.value)}>
                        {this.selectMaps()}
                    </select>
                    </label>
                </div>
            </div>);
        } else {
            return (<div className="form-group">
                <label> {selectEnemyArmyText}
                <select className="form-control" id="enemy" defaultValue={null} value={this.state.selectedEnemy} onChange={evt => this.updateEnemy(evt.target.value)}>
                    {this.selectUnits()}
                </select>
                </label>
            </div>);
        }
    }

    getUserIdFromServer(callback?: (error: { status: boolean, errorCode: string, userId: number }) => void) {
        // Primero, establecemos la conexión con el servidor
        let connection = Network.getConnection();
        let armyprofileclient: {
            googleId: number
        } = {
            // Incluimos el id del usuario de Google
            googleId: this.props.parentObject.state.clientId
        };
        Network.receiveProfileIdFromServer(armyprofileclient,(statusCode: { status: boolean, error: string, id: number }) => {
            if(!statusCode.status) {
                // Si ha salido mal, alertamos al usuario
                console.log("No se ha podido obtener correctamente el perfil");
            } else {
                callback({status: statusCode.status, errorCode: statusCode.error, userId: statusCode.id});
            }
        });
    }

    getArmyIdFromServer(errorCode: { status: boolean, errorCode: string, userId: number }, callback?: (error: { status: boolean, errorCode: string, armyId: number[], armyName: string[] }) => void) {
        // Primero, establecemos la conexión con el servidor
        var game = this;
        let connection = Network.getConnection();
        let armyclient: {
            userId: number
        } = {
            // Incluimos el id del usuario de Google
            userId: errorCode.userId
        };
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
                //No es necesario llamar al callback porque este ya es el nivel final (cliente)
            } else {
                let data = JSON.parse(event.data);
                game.setState({
                    mapId: game.state.mapId,
                    mapName: game.state.mapName,
                    selected: game.state.selected,
                    selectedPlayer: game.state.selectedPlayer,
                    selectedEnemy: game.state.selectedEnemy,
                    custom: game.state.custom,
                    playerArmy: game.state.playerArmy,
                    enemyArmy: game.state.enemyArmy,
                    armyId: data.armyId,
                    armyName: data.armyName});
                    let connection = Network.getConnection();
                let mapclient: {
                    googleId: number
                } = {
                    // Incluimos el id del usuario de Google
                    googleId: game.props.parentObject.state.clientId
                };
                connection.onmessage = function(event: MessageEvent) {
                    // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
                    // el comando se haya entendido
                    if(event.data == "Command not understood") {
                        // Lanzamos un error
                        console.log("Error when attempting to save, server didn't understood request");
                        //No es necesario llamar al callback porque este ya es el nivel final (cliente)
                    } else {
                        let data = JSON.parse(event.data);
                        game.setState({
                            armyId: game.state.armyId,
                            armyName: game.state.armyName,
                            selected: game.state.selected,
                            selectedPlayer: game.state.selectedPlayer,
                            selectedEnemy: game.state.selectedEnemy,
                            custom: game.state.custom,
                            playerArmy: game.state.playerArmy,
                            enemyArmy: game.state.enemyArmy,
                            mapId: data.mapId,
                            mapName: data.mapName
                        });
                    }
                };
                // Al abrirse la conexión, informamos al servidor del mapa
                connection.send(JSON.stringify({
                    tipo: "getMapId",
                    mapclient: mapclient
                }));
            }
        };
        // Al abrirse la conexión, informamos al servidor del mapa
        connection.send(JSON.stringify({
            tipo: "getArmyId",
            id: Network.gameId,
            armyclient: armyclient
        }));
    }

    //Get map
    getMapFromServer(mapData: { id: number }, callback?: (error: { status: boolean, errorCode: string, map: string }) => void) {
        // Primero, establecemos la conexión con el servidor
        var game= this;
        let connection = Network.getConnection();
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            let data = Network.parseMapServer(event.data);
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
            } else {
                // En caso contrario, ejecutamos el callback sin errores
                if(callback) {
                    callback({ status: true, errorCode: "Success", map: null});
                }
            }
        };
        // Al abrirse la conexión, informamos al servidor del mapa
        connection.send(JSON.stringify({
            tipo: "getMap",
            id: Network.gameId,
            mapData: mapData.id
        }));
    }

    //Get player units
    getPlayerFromServer(army: number
        , callback?: (error: { status: boolean, errorCode: string, units: Array<Unit> }) => void) {
        // Primero, establecemos la conexión con el servidor
        var game= this;
        let connection = Network.getConnection();
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
            } else {
                let data = JSON.parse(event.data);
                let units = new Array<Unit>();
                units = units.concat(Network.parseArmy(data.units, true));
                callback({status: data.status, errorCode: data.error, units: units});
            }
        };
        // Al abrirse la conexión, informamos al servidor del mapa
        connection.send(JSON.stringify({
            tipo: "getUnits",
            id: Network.gameId,
            armyclient: army,
            side: true
        }));
    }

    //Get enemy units
    getEnemyFromServer(army: number
        , callback?: (error: { status: boolean, errorCode: string, units: Array<Unit> }) => void) {
        // Primero, establecemos la conexión con el servidor
        var game= this;
        let connection = Network.getConnection();
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
            } else {
                let data = JSON.parse(event.data);
                let units = new Array<Unit>();
                units = units.concat(Network.parseArmy(data.units, false));
                callback({status: data.status, errorCode: data.error, units: units});
            }
        };
        // Al abrirse la conexión, informamos al servidor del mapa
        connection.send(JSON.stringify({
            tipo: "getUnits",
            id: Network.gameId,
            armyclient: army,
            side: false
        }));
    }

    startGame(event: MouseEvent) {
        if((this.state.selected!=null || !this.state.isPlayer) && (this.state.selectedPlayer!=null || !this.state.isPlayer) && (this.state.selectedEnemy!=null || this.state.isPlayer)){
            //Por ahora se hará este triple callback pero si hubiera multijugador no sería necesario, solo uno
            var game= this;
            // Definimos objetos que nos servirán para hacer el polling del inicio del juego
            var parentObject = this.props.parentObject;
            let pollingStart = function pollingStart() {
                Network.sendSyncState((statusCode, height, width) => {
                    if (statusCode.status == false) {
                        console.error("Ha fallado la sincronización con el servidor");
                        window.alert(userGoneText);
                        throw new Error("error");
                    } else {
                        // Cuando salga bien, emitiremos un guardado de estado y cambiamos al inicio del juego
                        saveState(statusCode.state);
                        parentObject.setState({
                            gameState: 2,
                            rows: height,
                            columns: width
                        });
                        // Comprobamos si el jugador actual es el 2º
                        if(!store.getState().isPlayer) {
                            // Si lo es, necesitaremos esperar al turno del otro jugador
                            store.dispatch(Actions.generateNextTurn());
                        }
                    }
                });
            };
            if(this.state.isPlayer) {
                game.getMapFromServer({id: game.state.selected}, (error: any) => {
                    game.getPlayerFromServer(game.state.selectedPlayer, (errorplayer: { status: boolean, errorCode: string, units: Array<Unit> })=>{
                        pollingStart();
                    });
                });
            } else {
                game.getEnemyFromServer(game.state.selectedEnemy,(errorenemy: { status: boolean, errorCode: string, units: Array<Unit> })=>{
                    pollingStart();
                })
            }


        }else{
            window.alert(selectAlertText);
        }
    }

    // Actualiza el componente de poder introducir el mapa, en el caso de seleccionar
    // la opción de 'Personalizado'.
    updateMap(evt: string) {
        // Comprobamos que el select tenga seleccionado el 'custom'
        this.setState({ selected: Number(evt) });
    }

    exitPreGame(mouseEvent: MouseEvent) {
        // Avisamos al servidor también
        Network.sendExitPreGame((statusCode: { status: boolean, message: string }) => {
            // No hacemos nada, hemos enviado una finalización de la partida.
        });
        // Para salir, cambiamos el estado del menu del juego.
        this.props.parentObject.setState({ gameState: 0 });
    }
}



class CreateMenu extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
        this.state = { error: false,
            mapId: [] as Array<number>,
            mapName: [] as Array<string>};
        this.getMapIdFromServer();
    }

    getMapIdFromServer(callback?: (error: { status: boolean, errorCode: string, mapId: number[], mapName: string[] }) => void) {
        // Primero, establecemos la conexión con el servidor
        let game = this;
        let connection = Network.getConnection();
        let mapclient: {
            googleId: number
        } = {
            // Incluimos el id del usuario de Google
            googleId: this.props.parentObject.state.clientId
        };
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
                //No es necesario llamar al callback porque este ya es el nivel final (cliente)
            } else {
                let data = JSON.parse(event.data);
                game.setState({mapId: data.mapId, mapName: data.mapName});
            }
        };
        connection.send(JSON.stringify({
            tipo: "getMapId",
            mapclient: mapclient
        }));
    }

    render() {
        return <div className="jumbotron text-center">
            <h2> {createMapTitleText} <button className="btn btn-primary btn-sm" id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>{backText}</button></h2>
            <label> {widthText}
                <input type="text" className="form-control" placeholder={widthPlaceText} value={this.props.parentObject.state.editx} onChange={evt => this.updateInput(evt.target.value,this.props.parentObject.state.edity)} />
            </label>
            <label> {heightText}
                <input type="text" className="form-control" placeholder={heightPlaceText} value={this.props.parentObject.state.edity} onChange={evt => this.updateInput(this.props.parentObject.state.editx,evt.target.value)} />
            </label>
            <button className="btn btn-primary btn-sm" id="createButton" name="createButton" onClick={this.onClickCreate.bind(this)}>{createMapText}</button><br/>
            {this.state.error?<div className="alert alert-danger" id="error">{numberAlertText}</div>:""}
            <h2> {editMapText} </h2>
            <label> {selectMapText}
            <select className="form-control" id="map" defaultValue={null} value={this.state.selected} onChange={evt => this.updateMap(evt.target.value)}>
                {this.selectMaps()}
            </select>
            </label>
            <button className="btn btn-primary btn-sm" id="createButton" name="createButton" onClick={this.onClick.bind(this)}>{editMapButtonText}</button>
            <button className="btn btn-primary btn-sm" id="createButton" name="createButton" onClick={this.onClickDelete.bind(this)}>{deleteMapText}</button><br />
        </div>
    }

    onClickDelete(event: React.MouseEvent<HTMLElement>) {
        let jsonResult = {
            id: this.props.parentObject.state.selected
        };
        if(this.props.parentObject.state.selected!=null){
            // Enviaremos al servidor el contenido del mapa
            Network.deleteMapToServer(jsonResult);
            // Finalmente, mostramos en el textarea el resultado
            this.getMapIdFromServer();
            this.props.parentObject.changeSelected(null);
            window.alert(deleteAlertText);
        }
    }

    // Actualiza el componente de poder introducir el mapa, en el caso de seleccionar
    // la opción de 'Personalizado'.
    updateMap(evt: string) {
        // Comprobamos que el select tenga seleccionado el 'custom'
        this.props.parentObject.changeSelected(evt);
    }

    selectMaps(){
        let map = [<option selected value={null}>{selectText}</option>];
        for(var i = 0; i < this.state.mapId.length; i++){
            map.push(<option value={this.state.mapId[i]}>{this.state.mapName[i]}</option>);
        }
        return map;
    }

    updateInput(x: string, y: string) {
        this.props.parentObject.setMapSize(x,y);
    }

    onClickCreate(clickEvent : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeSelected(null);
        if(this.props.parentObject.state.editx.match(/^[1-9][0-9]*$/g) && this.props.parentObject.state.edity.match(/^[1-9][0-9]*$/g)
            && Number(this.props.parentObject.state.editx)>1 && Number(this.props.parentObject.state.edity)>1){
            this.setState({ error: false });
            this.props.parentObject.changeGameState(4);
        }else{
            this.setState({ error: true });
            this.props.parentObject.changeGameState(3);
        }
    }

    onClick(clickEvent : React.MouseEvent<HTMLElement>) {
        if(this.props.parentObject.state.selected!=null){
            this.setState({ error: false });
            //Es necesario porque rows y columns no se actualizan
            let game = this;
            let connection = Network.getConnection();
            connection.onmessage = function(event: MessageEvent) {
                // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
                // el comando se haya entendido
                let data = Network.parseMapServer(event.data);
                if(event.data == "Command not understood") {
                    // Lanzamos un error
                    console.log("Error when attempting to save, server didn't understood request");
                } else {
                    // En caso contrario, ejecutamos el callback sin errores
                    game.props.parentObject.setMapSize(data.rows, data.columns);
                }
            };
            connection.send(JSON.stringify({
                tipo: "getMap",
                mapData: Number(this.props.parentObject.state.selected)
            }));

            this.props.parentObject.changeGameState(4);
        }else{
            window.alert(selectMapAlertText);
            this.props.parentObject.changeGameState(3);
        }
    }

    onClickExit(clickEvent : React.MouseEvent<HTMLElement>){
        this.setState({ error: false });
        this.props.parentObject.changeGameState(0);
    }
}

class GoogleLogout extends GoogleLogin {
    // Para evitar que aparezca el menú de inicio de sesión, se sobreescribe la acción de Login
    signIn(e: any) {
        // Se llamará a la propiedad de onSuccess siempre
        this.props.onSuccess(null);
    }
}

class Game extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
        this.state = {
            gameState: 0, // 0 es el menu del juego, 1 será el menú de opciones, 2 el juego, 3 edición de map y 5 el pre juego
            editx: "5",
            edity: "5",
            clientId: null, // Id del cliente loggeado
            selected: null,
            clientAvatar: null,
        };
    }

    render() {
        let result: any;
        switch(this.state.gameState) {
            case 1:
                result = <OptionsMenu parentObject={this} />;
                break;
            case 2:
                result = <Map horizontal={this.state.columns} vertical={this.state.rows} parentObject={this} />;
                break;
            case 3:
                result = <CreateMenu parentObject={this} />;
                break;
            case 4:
                result = <EditMap horizontal={this.state.editx} vertical={this.state.edity} selected={this.state.selected} parentObject={this} />;
                break;
            case 5:
                result = <PreGameMenu parentObject={this} />;
                break;
            case 6:
                result = <Profile parentObject={this} />;
                break;
            case 7:
                result = <MainPanelMenu parentObject={this} />;
                break;
            default:
                let loginInfo = null;
                if(this.state.clientId != null) { // Si el usuario ha iniciado sesión
                    loginInfo = <GoogleLogout clientId="637676591689-hqqsmqkfh446ot5klmul2tr8q8v1dsq6" buttonText="Logout" onSuccess={this.onLogOut.bind(this)} onFailure={(e) => console.error(e)} />// La sección de registro contendrá el cierre de sesión
                } else {
                    loginInfo = <GoogleLogin clientId="637676591689-hqqsmqkfh446ot5klmul2tr8q8v1dsq6" onSuccess={this.onLogIn.bind(this)} onFailure={(e) => console.error(e)}  /> // En otro caso, contendrá el inicio de sesión
                }
                result = (
                    <div>
                        <script src="https://apis.google.com/js/platform.js" async defer></script>
                        <meta name="google-signin-client_id" content=" 637676591689-00d0rmr0ib1gsidcqtdleva0qkor596k.apps.googleusercontent.com" />

                        <div className="jumbotron text-center">
                            <div className="menu">
                                <h1> PanzergIO </h1>
                                <EnterGameButton parentObject={this} /><br />
                                <EditGameButton parentObject={this} /><br />
                                <ProfileButton parentObject={this} /><br />
                                <OptionsMenuButton parentObject={this} /><br />
                            </div>
                            <div className="loginDiv">
                                {loginInfo}
                            </div>
                        </div>
                    </div>
                );
                break;
        }

        let aud = '<audio src="./sounds/menu.ogg" loop autoplay ></audio>';

        let res = this.state.gameState!=2?
                    (<div>
                        <div dangerouslySetInnerHTML={{__html: aud}}>
                        </div>
                        {result}
                    </div>):result;

        return res;
    }

    changeSelected(selected: string) {
        this.setState({
            selected: selected
        });
    }

    changeGameState(stateNumber: number) {
        this.setState({
            gameState: stateNumber,
            editx: this.state.editx,
            edity: this.state.edity,
            clientId: this.state.clientId
        });
    }

    setMapSize(x: string, y: string){
        this.setState({ gameState: this.state.gameState, editx: x, edity: y});
    }

    onLogIn(response: GoogleLoginResponse) {
        // Enviamos al servidor los datos del login
        Network.sendLogInInfo(() => {
            // También cambiamos el estado de este objeto para tener en cuenta eso
            this.setState({
                gameState: this.state.gameState,
                editx: this.state.editx,
                edity: this.state.edity,
                clientId: Number(response.getBasicProfile().getId()),
                clientAvatar: response.getBasicProfile().getImageUrl()
            });
        }, Number(response.getBasicProfile().getId()));
    }

    onLogOut() {
        // Enviamos el cerrado de sesión al servidor
        Network.sendLogOut(() => {
            // También cambiamos el estado de este objeto para tener en cuenta eso
            this.setState({
                gameState: this.state.gameState,
                editx: this.state.editx,
                edity: this.state.edity,
                clientId: null
            });
        })
    }
}

export { Game };
