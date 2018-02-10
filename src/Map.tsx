import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Actions, State, InitialState, Reducer, getInitialState } from './GameState';
import { Cell } from './Cell';
import { TerrainCell } from './TerrainCell';
import { Pair, Cubic, myIndexOf, myIndexOfCubic, Pathfinding } from './Utils';
import { Unit, UNITS, UNITS_ESP } from './Unit';
import { Plains } from './Terrains';
import { UnitCell } from './UnitCell';
import { UnitStats } from './UnitStats';

/** Representa el mapa que contendrá las unidades y las casillas **/
export class Map extends React.Component<any, any> {
    unitStats: UnitStats = null;

    restartState() {
        this.state = { cells: new Array<Array<Cell>>(this.props.horizontal), rows: this.props.vertical, columns: this.props.horizontal, alertUnitsNotPlaced: false };
        store.dispatch(Actions.generateSetListener(this));
    }

    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    constructor(props: any) {
        super(props);
        this.restartState();
    }

    /** Renderiza el mapa **/
    render() {
        // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
        return (
            <div>
                <p>Turno del {store.getState().turn%2==0?"Jugador":"Enemigo"}. Día {Math.floor(store.getState().turn/2)}{store.getState().actualState==1?". Victoria":store.getState().actualState==2?". Derrota":""} {store.getState().turn < 2?"(Pre juego)":""}</p>
                <button id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>Salir del juego</button>
                {store.getState().actualState==0?<button id="nextTurn" name="nextTurn" onClick={this.onClickTurn.bind(this)}>Pasar turno</button>:""}
                {store.getState().selectedUnit!=null && store.getState().turn >= 2?<button id="cancelAction" name="cancelAction" onClick={this.onClickCancelAction.bind(this)}>Cancelar acción</button>:""}
                {store.getState().selectedUnit!=null && store.getState().turn >= 2 && store.getState().units[store.getState().selectedUnit].action<2?<button id="nextAction" name="nextAction" onClick={this.onClickUnitAction.bind(this)}>Pasar acción</button>:""}
                {store.getState().turn < 2?<div>
                    <label> Selecciona la unidad:
                        <select defaultValue={null} value={store.getState().selectedUnit} onChange={evt => this.selectUnit(evt.target.value)}>
                            {this.selectOptions()}
                        </select>
                    </label>
                    <button onClick={this.onClickPlaceUnit.bind(this)}>Seleccionar unidad</button></div>:""}
                {this.state.alertUnitsNotPlaced?<p className="alert">ATENCIÓN: Algunas de las unidades no han sido posicionadas en el juego, por favor, posicione las unidades en el juego</p>:""}
                <div>
                    <UnitStats />
                    <div id="map" className="map" onClick={this.onClick.bind(this)} tabIndex={0} onKeyDown={this.onKey.bind(this)} onContextMenu={this.onRightClick.bind(this)}>
                        {this.generateMap.bind(this)().map((a: any) => {
                            return a;
                        })}
                    </div>
                </div>
            </div>
        );
    }

    //Se guarda dicha unidad como seleccionada
    selectUnit(evt: string){
        saveState(Actions.selectUnit(Number(evt)));
    }

    selectOptions(){
        //Creamos todos los options a partir de todas las unidades de la lista de unidades
        let army = [<option selected value={null}>--Selecciona--</option>];
        for(var i = 0; i < store.getState().units.length; i++){
            //Se usa for para generalizar si se añadieran más unidades
            if(store.getState().units[i].player == (store.getState().turn%2==0)){
                for (var j = 0; j < UNITS.length; j++){
                    if(store.getState().units[i].name==UNITS[j]){
                        // La unidad será nombrada de esa manera para poder distinguirla y saber además su tipo
                        army.push(<option value={i}>{"Unidad "+i+" - "+UNITS_ESP[j]}</option>);
                    }
                }
            }
        }
        return army;
    }

    onClickExit(event : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeGameState(0); // Salir de la partida.
    }

    //Se debe permitir solo si esta en pardida (this.actualstate==0), sino no hace nada
    onClickTurn(event : React.MouseEvent<HTMLElement>) {
        //Si se pulsa al botón se pasa de turno esto se hace para asegurar que el jugador no quiere hacer nada o no puede en su turno
        //Evitando pasar turno automaticamente ya que el jugador quiera ver alguna cosa de sus unidades o algo aunque no tenga movimientos posibles
        // Pero antes de poder pasar el turno, comprobamos si ha posicionado todas sus unidades
        if(
            // Primero, comprobamos si estamos en la fase de pre juego
            store.getState().turn < 2
            // Después vemos si de las unidades ...
            && store.getState().units.some((unit) => {
                // Son del jugador y éstas están fuera de la zona de juego (por defecto (-1, -1))
                return unit.player == (store.getState().turn%2 == 0) && (unit.position.row < 0 || unit.position.column < 0);
        })) {
            // Esto quiere decir que debemos informar al jugador, cambiando el siguiente atributo
            this.setState({
                cells: this.state.cells,
                rows: this.state.rows,
                columns: this.state.columns,
                alertUnitsNotPlaced: true
            });
        } else {
            // En caso contrario, pasamos el turno
            // Y eliminamos la restricción
            this.setState({
                cells: this.state.cells,
                rows: this.state.rows,
                columns: this.state.columns,
                alertUnitsNotPlaced: false
            });
            saveState(Actions.generateNextTurn()); //Se usa para obligar a actualizar el estado (tambien actualiza los used)
        }
    }

    onClickUnitAction(event : React.MouseEvent<HTMLElement>) {
        //Dependiendo de la accion de la unidad pasará a la siguiente acción y será usada o no
        saveState(Actions.generateNextAction(store.getState().selectedUnit));
    }

    onClickCancelAction(event : React.MouseEvent<HTMLElement>) {
        //Con esto se cancela la acción actual para que se pueda seleccionar otra unidad
        saveState(Actions.generateSetListener(this));
    }

    onClickPlaceUnit(mouseEvent: MouseEvent) {
        // Obtenemos el índice
        let selectedIndex = store.getState().selectedUnit;
        console.log("Index: "+selectedIndex);
        // Si no está definido
        if(selectedIndex == null
            || (// O en el caso de estarlo, es posible incrementar el índice
                // Si la próxima unidad no es del jugador
                !store.getState().units[selectedIndex + 1].player == (store.getState().turn%2 == 0)
                || store.getState().units.length <= selectedIndex + 1 // O sobrepasa el límite de la lista
        )) {
            console.log("Entra en no definido");
            // Entonces debemos encontrar el índice de una unidad del jugador
            selectedIndex = store.getState().units.indexOf(store.getState().units.find((unit) => unit.player == (store.getState().turn%2 == 0)));
        }
        console.log("Resutado "+selectedIndex);

        // Ejecutamos la selección de unidad
        store.dispatch(Actions.generateMove(selectedIndex, store.getState().turn%2 == 0));
        // Y, para indicar al jugador de la unidad seleccionada, cambiamos el
        // indicador de la izquierda
        this.unitStats.setState({ unit: store.getState().units[selectedIndex], terrain: null });
    }
/*
    onClickNextUnit(mouseEvent: MouseEvent) {
        // Obtenemos el índice
        let selectedIndex = store.getState().selectedUnit;
        console.log("Index: "+selectedIndex);
        // Si no está definido
        if(selectedIndex == null
            || (// O en el caso de estarlo, es posible incrementar el índice
                // Si la próxima unidad no es del jugador
                !store.getState().units[selectedIndex + 1].player == (store.getState().turn%2 == 0)
                || store.getState().units.length <= selectedIndex + 1 // O sobrepasa el límite de la lista
        )) {
            console.log("Entra en no definido");
            // Entonces debemos encontrar el índice de una unidad del jugador
            selectedIndex = store.getState().units.indexOf(store.getState().units.find((unit) => unit.player == (store.getState().turn%2 == 0)));
        } else {
            console.log("Entra en ya definido");
            // En otro caso ya está definido y es válido el incremento
            selectedIndex = selectedIndex + 1;
        }
        console.log("Resutado "+selectedIndex);

        // Ejecutamos la selección de unidad
        store.dispatch(Actions.generateMove(selectedIndex, store.getState().turn%2 == 0));
        // Y, para indicar al jugador de la unidad seleccionada, cambiamos el
        // indicador de la izquierda
        this.unitStats.setState({ unit: store.getState().units[selectedIndex], terrain: null });
    }
*/
    onKey(keyEvent : React.KeyboardEvent<HTMLElement>) {
        let keyCode = keyEvent.key;
        let cursorPosition, newCursorPosition : Pair;
        console.log("KeyCode: "+keyCode);
        switch(keyCode) {
            case 'Escape':
                this.props.parentObject.changeGameState(0); // Retornamos al menu.
                break;
            // Los siguientes casos corresponden con las teclas del numpad, para mover el cursor
            case '1':
                // La tecla 1 del numpad (-1,+1)
                // Primero, obtenemos la posición de la casilla
                cursorPosition = store.getState().cursorPosition;
                // Crearemos una nueva posición resultado
                newCursorPosition = new Pair(cursorPosition.row + (cursorPosition.column&1?1:0), cursorPosition.column - 1);
                // Llamamos a la acción para cambiarlo
                break;
            case '2':
                // La tecla 2 del numpad (0,+1)
                cursorPosition = store.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row + 1, cursorPosition.column);
                break;
            case '3':
                // La tecla 3 del numpad (+1,+1)
                cursorPosition = store.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row + (cursorPosition.column&1?1:0), cursorPosition.column + 1);
                break;
            case '7':
                // La tecla 7 del numpad (-1,-1)
                cursorPosition = store.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row - (cursorPosition.column&1?0:1), cursorPosition.column - 1);
                break;
            case '8':
                // La tecla 8 del numpad (0, -1)
                cursorPosition = store.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row - 1, cursorPosition.column);
                break;
            case '9':
                // La tecla 9 del numpad (+1, -1)
                cursorPosition = store.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row - (cursorPosition.column&1?0:1), cursorPosition.column + 1);
                break;
            case '4':
                if(store.getState().selectedUnit!=null){
                    //Con esto se cancela la acción actual para que se pueda seleccionar otra unidad
                    saveState(Actions.generateSetListener(this));
                }
                break;
            case '6':
                if(store.getState().selectedUnit!=null && store.getState().units[store.getState().selectedUnit].action<2){
                    //Dependiendo de la accion de la unidad pasará a la siguiente acción y será usada o no
                    saveState(Actions.generateNextAction(store.getState().selectedUnit));
                }
                break;
            case '5':
            case ' ':
                // Realizar el click en la posición
                cursorPosition = store.getState().cursorPosition;
                this.clickAction(cursorPosition.row, cursorPosition.column);
                break;
        }
        // Si puede hacerse el movimiento, realiza la acción
        if(newCursorPosition && newCursorPosition.row >= 0 && newCursorPosition.column >= 0 && newCursorPosition.column <= this.props.vertical && newCursorPosition.row <= this.props.horizontal) {
            saveState(Actions.generateCursorMovement(newCursorPosition));
        }
    }

    onClick(event : React.MouseEvent<HTMLElement>) {
        let position = Pathfinding.getPositionClicked(event.clientX, event.clientY);

        //Si el juego está terminado entonces no hace nada, por eso comprueba si todavía sigue la partida
        if(store.getState().actualState == 0){
            //Guardamos la posición actual y la nueva posición
            this.clickAction(position.row, position.column);
        }
    }

    onRightClick(event: React.MouseEvent<HTMLElement>) {
        // Primero, evitamos que genere el menú del navegador
        event.preventDefault();
        // Obtenemos la posición donde ha realizado click
        let position = Pathfinding.getPositionClicked(event.clientX, event.clientY);
        // Comprobamos que exista una unidad en esa posición
        let unit = store.getState().units[myIndexOf(store.getState().units.map(x => x.position), position)];
        // También comprobamos que exista un terreno en la posición
        // Pero antes, vemos que la posición sea alcanzable
        let terrain = null;
        if(position.row >= 0 && position.row <= this.props.vertical &&
            position.column >= 0 && position.column <= this.props.horizontal) {
                // Si es válida, iteramos por los terrenos y si no se encuentra, se emite un Plains
                let terrainIndex = myIndexOf(store.getState().terrains.map(x => x.position), position);
                terrain = terrainIndex > -1?store.getState().terrains[terrainIndex]:Plains.create(position);
        }
        // Actualizamos el estado de la barra de estadísticas
        this.unitStats.setState({ unit: unit, terrain: terrain });
    }

    clickAction(row: number, column: number) {
        let newPosition: Pair = new Pair(row,column);
        let side : boolean = store.getState().turn%2 == 0; // Representa el bando del jugador actual
        let unitIndex: number = myIndexOf(store.getState().units.map(x=>x.position), newPosition); // Obtenemos la posición de la unidad donde ha realizado click o -1.
        let unitEnemy: boolean; //Vale true si la unidad seleccionada es enemiga de las unidades del turno actual
        unitIndex!=-1? // Si se ha seleccionado una unidad
            side? // Si el turno es del "aliado"
                unitEnemy = !store.getState().units[unitIndex].player // Asigna como enemigo el contrario de la unidad que ha hecho click
                :unitEnemy = store.getState().units[unitIndex].player // Asigna como enemigo la unidad que ha hecho click
            :false; // En caso contrario, no hagas nada?

        //Vemos si la unidad ha sido usada (si hay una unidad seleccionada vemos si esta ha sido usada o no, y sino vemos si la unidad del click es seleccionada)

        let used: boolean = store.getState().selectedUnit!=null?
            store.getState().units[store.getState().selectedUnit].used:
            unitIndex!=-1?store.getState().units[unitIndex].used:false;
        // También comprobaremos si la unidad ha realizado un ataque, que permitirá que la unidad ataque por separado con respecto al movimiento
        let hasAttacked: boolean = store.getState().selectedUnit != null?
            // Se activará este boolean cuando se ha seleccionado una unidad y además se ha seleccionado un enemigo
            store.getState().units[store.getState().selectedUnit].hasAttacked && unitEnemy:
            true;
        if(!used){
            //Si el indice es != -1 (está incluido en la lista de unidades) y está en modo de espera de movimiento se generará el estado de movimiento
            if((unitIndex!= -1 && !unitEnemy) // La unidad clickeada existe y es del jugador
                && store.getState().type == "SET_LISTENER" // El tipo de estado es esperando selección
                ){
                saveState(Actions.generateMove(unitIndex, side));
            //Si hace clic en una possición exterior, mantiene el estado de en movimiento (seleccionado) y sigue almacenando la unidad seleccionada
            }else if(
                newPosition.column<0 // La posición no es negativa en columnas
                || newPosition.column>this.props.horizontal // Ni es superior al número de celdas horizontales
                || newPosition.row<0 // La posición no es negativa en filas
                || newPosition.row>this.props.vertical // Ni es superior al número de celdas verticales
                ){
                saveState(Actions.generateMove(store.getState().selectedUnit, side));
            //En caso de que no esté incluida en la lista de unidades y esté en estado de movimiento
            }else if(
                // unitIndex!=-1 // La unidad existe
                store.getState().selectedUnit != null // Se tiene seleccionada una unidad
                && (myIndexOf(store.getState().visitables, newPosition) != -1 // Y la posición de la unidad es alcanzable
                    || store.getState().turn < 2 // O estamos en la fase de pre juego
                )){
                let selectedUnit = store.getState().selectedUnit; // Índice de la unidad seleccionada
                let actualPosition = store.getState().units[selectedUnit].position; //Obtenemos la posición actual
                //Primero se comprueba si es un ataque (si selecciona a un enemigo durante el movimiento)
                if(unitIndex != -1 && unitEnemy && store.getState().units[selectedUnit].action == 1 && !store.getState().units[selectedUnit].hasAttacked){ // Si se ha escogido una unidad y ésta es enemiga
                    saveState(Actions.generateMove(store.getState().selectedUnit, side));
                    // Se atacará, esto incluye el movimiento si es aplicable
                    saveState(Actions.generateAttack(unitIndex, side, null));
                } else {
                    // En caso contrario, se ejecutará el movimiento como siempre
                    // El valor de null es si se hace que justo tras el movimiento seleccione otra unidad, en este caso no es necesario así que se pondrá null
                    saveState(Actions.generateChangeUnitPos(selectedUnit, newPosition, null, side));
                }
            }
        } else if(!hasAttacked // En el caso de que tenga posiblidad de atacar y ha hecho click a la unidad enemiga
            || store.getState().turn >= 2 // O no estamos en la fase de pre juego
        ) {
            // Realizamos el ataque:
            saveState(Actions.generateAttack(unitIndex, side, null));
        }
    }

    /** Función auxiliar usada para renderizar el mapa. Consiste en recorrer todas las columnas acumulando las casillas. **/
    generateMap() {
        var accum = [];
        // Repetirá este for hasta que se llegue al número de columnas especificado
        for(var i = 0; i <= this.props.vertical*2 + 1; i++) { // Necesitamos 2*verticales para ordenarlos correctamente
            // Este método retornará una lista con las casillas en fila
            accum.push(this.generateCellRow.bind(this)(i));
        }

        return accum;
    }

    /** Función auxiliar que servirá para generar las casillas en una fila **/
    generateCellRow(num_row: number) {
        var accum2 = [];
        this.state.cells[num_row] = new Array<Cell>(this.props.horizontal);
        // Este bucle iterará hasta el número de celdas horizontales especificado en el props.
        for(var j = num_row%2==0?0:1; j < this.props.horizontal; j = j+2) { // Incrementamos en 2 porque el elemento entre cada hex tendrá el valor j + 1.
            let column = j;
            let row = num_row%2==0?num_row/2:Math.floor(num_row/2);
            var cell = <Cell row={row} column={column} />;
            this.state.cells[row][column] = cell;
            accum2.push(cell);
        }

        // Se retorna en un div que dependiendo de que se trate de la fila par o impar, contendrá también la clase celRowOdd.
        return (
            <div className={"cellRow" + (num_row%2==0?"":" cellRowOdd")}>
                {accum2}
            </div>
        );
    }
}
