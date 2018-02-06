import * as React from 'react';
import * as Redux from 'redux';
import { Map } from './Map';
import { Actions, getInitialState } from './GameState';
import { EditMap } from './EditMap';
import { store } from './Store';
import { Network, Pair } from './Utils';
import { Profile } from './Profile'
import { Infantry, Tank, General, Unit } from './Unit';

class EnterGameButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <button id="enterGame" name="enterGame" className="enterGameButton" onClick={this.onClick.bind(this)}>Jugar</button>
    }

    onClick() {
        // Realizamos una llamada al servidor para obtener el estado inicial de las partidas
        getInitialState(() => {
            // Reiniciamos el estado
            store.dispatch(Actions.generateFinish());
            // Y también cambiamos el estado del juego
            this.props.parentObject.changeGameState(5);
            // Comprobamos si hay ganador o perdedor, en cuyo caso se reiniciará el estado al entrar en el juego
            if (store.getState().map && store.getState().actualState > 0) {
                // Si se ha producido esto, debemos reiniciar el estado
                store.dispatch(Actions.generateFinish());
                // Ejecutamos también el reiniciado de estado del mapa
                store.getState().map.restartState();
            }
        });
    }
}

class EditGameButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="editGame" name="editGame" className="editGameButton" onClick={this.onClick.bind(this)}>Acceder a la edición de mapa</button>
    }

    onClick() {
        this.props.parentObject.changeGameState(3);
    }
}

class ProfileButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="profileButton" name="profileButton" className="profileButton" onClick={this.onClick.bind(this)}>Acceder al perfil personal</button>
    }

    onClick() {
        this.props.parentObject.changeGameState(6);
    }
}


class OptionsMenuButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="optionsMenu" name="optionsMenu" className="optionsMenuButton" onClick={this.onClick.bind(this)}>Acceder al menu de opciones</button>
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
        return <div className="optionsMenu">
            <button>Test</button>
            <button>Test</button>
            <button id="exitButton" name="exitButton" onClick={this.onClick.bind(this)}>Volver al menu</button>
        </div>
    }

    onClick(clickEvent : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeGameState(0);
    }
}

class PreGameMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            custom: false,
            // Inicialmente, contendrán los mismos datos que el estado, en estos objectos se almacenarán
            // los ejércitos introducidos por el usuario
            playerArmy: [
                { type: "General", number: 1 },
                { type: "Infantry", number: 1 },
                { type: "Tank", number: 1}
            ],
            enemyArmy: [
                { type: "General", number: 1 },
                { type: "Infantry", number: 1 },
                { type: "Tank", number: 1}
            ]
        };
    }

    render() {
        // En el caso de querer usar un mapa, mostramos una zona para ponerlo
        let customMap = this.state.custom?<textarea id="customMap">Introduzca el JSON aqui</textarea>:"";
        
        return (
        <div className="preGameMenu">
            <h2>Menu de pre juego</h2>
            <div className="playerMenu">
                <SideOptionMenu player={true} parentObject={this} />
            </div>
            <div> className="enemyMenu">
                <SideOptionMenu player={false} parentObject={this} />
            </div>
            <div className="mapMenu">
                <select id="map" onClick={this.updateMap.bind(this)}>
                    <option id="map1" selected={true}>Mapa 1</option>
                    <option id="custom">Personalizado</option>
                </select>

                {customMap}

                <button onClick={this.startGame.bind(this)}>Empezar juego</button>
                <button onClick={this.exitPreGame.bind(this)}>Volver</button>
            </div>
        </div>);
    }

    startGame(event: MouseEvent) {
        // Generamos las unidades del juego
        let units = new Array<Unit>();
        // Y obtenemos el estado inicial del mapa
        let map = store.getState().terrains;
        console.log("Player army: "+this.state.playerArmy);
        // Ejecutamos la función que se encargará de obtener las unidades asociadas al par tipo y número
        units = units.concat(Network.parseArmy(this.state.playerArmy, true));
        units = units.concat(Network.parseArmy(this.state.enemyArmy, false));
        console.log(JSON.stringify(units));

        // Definimos las dimensiones básicas del mapa
        let rows = 6;
        let columns = 6;
        // Antes de ejecutar, comprobamos que exista un mapa personalizado
        if(this.state.custom) {
            // Primero, obtenemos el JSON resultante
            let custom = JSON.parse((document.getElementById("customMap") as HTMLTextAreaElement).value);
            // Obtenemos por un lado el mapa
            map = Network.parseMap(custom.map);
            // Modificamos las dimensiones del mapa
            rows = custom.rows;
            columns = custom.columns;
        }
        store.dispatch(Actions.generatePreGameConfiguration(map, units));
        // Actualizamos el juego para avisar de los cambios
        this.props.parentObject.setState({ 
            gameState: 2,
            rows: rows,
            columns: columns
        });
    }

    // Actualiza el componente de poder introducir el mapa, en el caso de seleccionar
    // la opción de 'Personalizado'.
    updateMap(mouseEvent: MouseEvent) {
        // Comprobamos que el select tenga seleccionado el 'custom'
        let select: HTMLSelectElement = document.getElementById("map") as HTMLSelectElement;
        if(select.options[select.selectedIndex].id == "custom") {
            this.setState({ custom: true });
        } else {
            this.setState({ custom: false });
        }
    }

    exitPreGame(mouseEvent: MouseEvent) {
        // Para salir, cambiamos el estado del menu del juego.
        this.props.parentObject.setState({ gameState: 0 });
    }
}

class SideOptionMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { player: props.player };
    }

    render() {
        return (
            <div className={"sideOption"+this.state.player?"Player":"Enemy"}>
                <p>Introduce en el siguiente campo el código de ejército: </p>
                
                <textarea id={"army_"+this.props.player} onChange={this.onChangeArmy.bind(this)} placeholder="Introduzca aqui el código de ejército" />
            </div>
        );
    }

    onChangeArmy(mouseEvent: React.MouseEvent<HTMLElement>) {
        console.log("Changed for "+this.props.player);
        // Obtenemos el dato de entrada
        let textArea: HTMLTextAreaElement = document.getElementById("army_"+this.props.player) as HTMLTextAreaElement;
        let unitsJSON = textArea.value;
        // Lo transformamos en el tipo requerido
        let unitsPair: Array<{ type: string, number: number }> = JSON.parse(unitsJSON);
        console.log()
        // Cambiamos el estado del padre
        this.props.parentObject.setState({
            custom: this.props.parentObject.state.custom,
            // Dependiendo de que sea el jugador o no, cambiamos el elemento del estado
            playerArmy: this.props.player?unitsPair:this.props.parentObject.state.playerArmy,
            enemyArmy: !this.props.player?unitsPair:this.props.parentObject.state.enemyArmy
        })
    }
}

class CreateMenu extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
        this.state = { error: false };
    }

    render() {
        return <div className="optionsMenu">
            <div>
                Anchura: <input type="text" value={this.props.parentObject.state.editx} onChange={evt => this.updateInput(evt.target.value,this.props.parentObject.state.edity)} />
            </div>
            <div>
                Altura: <input type="text" value={this.props.parentObject.state.edity} onChange={evt => this.updateInput(this.props.parentObject.state.editx,evt.target.value)} />
            </div>
            {this.state.error?<div id="error">Deben introducirse valores numéricos</div>:""}
            <button id="createButton" name="createButton" onClick={this.onClick.bind(this)}>Crear mapa</button>
            <button id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>Volver al menu</button>
        </div>
    }

    updateInput(x: string, y: string) {
        this.props.parentObject.setMapSize(x,y);
    }

    onClick(clickEvent : React.MouseEvent<HTMLElement>) {
        if(this.props.parentObject.state.editx.match(/^\d+$/g) && this.props.parentObject.state.edity.match(/^\d+$/g)){
            this.setState({ error: false });
            this.props.parentObject.changeGameState(4);
        }else{
            this.setState({ error: true });
            this.props.parentObject.changeGameState(3);
        }
    }

    onClickExit(clickEvent : React.MouseEvent<HTMLElement>){
        this.setState({ error: false });
        this.props.parentObject.changeGameState(0);
    }
}

class Game extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
        this.state = { gameState: 0, editx: "5", edity: "5" }; // 0 es el menu del juego, 1 será el menú de opciones, 2 el juego, 3 edición de map y 5 el pre juego
    }

    render() {
        let result: any;
        switch(this.state.gameState) {
            case 1:
                result = <OptionsMenu parentObject={this} />;
                break;
            case 2:
                result = <Map horizontal={this.state.rows} vertical={this.state.columns} parentObject={this} />;
                break;
            case 3:
                result = <CreateMenu parentObject={this} />;
                break;
            case 4:
                result = <EditMap horizontal={this.state.editx} vertical={this.state.edity} parentObject={this} />;
                break;
            case 5: 
                result = <PreGameMenu parentObject={this} />;
                break;
            case 6:
                result = <Profile parentObject={this} />;
                break;
            default:
                result = (
                    <div className="menu">
                        <EnterGameButton parentObject={this} /><br />
                        <EditGameButton parentObject={this} /><br />
                        <ProfileButton parentObject={this} /><br />
                        <OptionsMenuButton parentObject={this} /><br />
                    </div>
                );
                break;
        }

        return result;
    }

    changeGameState(stateNumber: number) {
        this.setState({ gameState: stateNumber, editx: this.state.editx, edity: this.state.edity});
    }

    setMapSize(x: string, y: string){
        this.setState({ gameState: this.state.gameState, editx: x, edity: y});
    }
}

export { Game };
