import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { storeEdit, saveState } from './StoreEdit';
import { ReducerEdit, StateEdit, EditActions, InitialStateEdit} from './GameEditState';
import { Cell } from './Cell';
import { EditCell } from './EditCell';
import { TerrainCell } from './TerrainCell';
import { Pair, Cubic, myIndexOf, CUBIC_DIRECTIONS, myIndexOfCubic, Pathfinding, Network } from './Utils';
import { UnitCell } from './UnitCell';
import { UnitStats } from './UnitStats';
import { EditStats } from './EditStats';
import { Terrain, Plains, ImpassableMountain, Hills, Forest, River, TERRAINS, TERRAINS_ESP, TERRAINS_CREATE, TERR_CREATE} from './Terrains';

const editMapText = "Edición del mapa";
const nameText = "Nombre";
const backText = "Volver atrás";
const createTerrainText = "Crear terreno";
const selectTypeText = "Selecciona el tipo del terreno: ";
const selectedTerrain = "Terreno seleccionado:";
const selectText = "--Selecciona--";
const noneText = "Ninguno";
const saveText = "Guardar mapa";
const terrainListText = TERRAINS_ESP;
const mapWithoutName = "Mapa sin nombre";
const saveAlertText = "Se ha guardado correctamente el mapa";

export class EditMap extends React.Component<any, any> {
    editStats: EditStats = null;

    restartState() {
        this.state = {
            cells: new Array<Array<EditCell>>(this.props.horizontal),
            rows: this.props.vertical,
            columns: this.props.horizontal,
            name: "Mapa sin nombre",
            selected: Number(this.props.selected),
            request: 0
        };
        storeEdit.dispatch(EditActions.generateSetListener(this));
    }

    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    constructor(props: any) {
        super(props);
        this.restartState();
    }

    /** Renderiza el mapa **/
    render() {
        if(this.props.selected!=null){
            console.log("--------------->Entra en el else: valor del selected: "+this.props.selected);
            //Solo se ejecutara una vez
            if(this.state.request<2){
                this.getMapFromServer({id: Number(this.props.selected)},(error: { status: boolean, errorCode: string, retmap: Array<Terrain> })=>{});
                this.state.request++;
            }
            console.log(storeEdit.getState().terrains.length);
        }
        // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
        return (
            <div className="jumbotron text-center">
                <h4> {editMapText} <button className="btn btn-primary btn-sm" id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>{backText}</button></h4>
                <label> {nameText} <input className="form-control" type="text" value={this.state.name} onChange={evt => this.updateInput(evt.target.value)} /></label>
                <div>
                    {storeEdit.getState().type!=1?<button className="btn btn-primary btn-sm" id="terrainButton" name="terrainButton" onClick={this.onClickCreateTerrain.bind(this)}>{createTerrainText}</button>:""}
                    {storeEdit.getState().type==1?<div>
                        <label> {selectTypeText}
                            <select className="form-control" defaultValue={null} value={storeEdit.getState().selected} onChange={evt => this.selected(evt.target.value)}>
                                {this.selectOptionsTerrains()}
                            </select>
                        </label>
                        {storeEdit.getState().type==1?<p id="bold">{selectedTerrain} {storeEdit.getState().selected!=null&&storeEdit.getState().selected!=selectText?storeEdit.getState().selected:noneText} </p>:""}
                    </div>:""}
                    <button className="btn btn-primary btn-sm" id="generateButton" name="generateButton" onClick={this.onClickGenerateMap.bind(this)}>{saveText}</button>
                </div>
                <div className="row">
                    <EditStats map={this}/>
                    <div className="col-sm-9">
                        <div id="map" className="map" onClick={this.onClick.bind(this)} tabIndex={0} onKeyDown={this.onKey.bind(this)} onContextMenu={this.onRightClick.bind(this)}>
                            {this.generateMap.bind(this)().map((a: any) => {
                                return a;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //Get map
    getMapFromServer(mapData: {id: number} , callback?: (error: { status: boolean, errorCode: string, retmap: Array<Terrain> }) => void) {
        // Primero, establecemos la conexión con el servidor
        let game = this;
        let connection = Network.getConnection();
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            console.log("Datos "+JSON.stringify(event.data));
            let data = Network.parseMapServer(event.data);
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
            } else {
                // En caso contrario, ejecutamos el callback sin errores
                game.setState({
                    cells: new Array<Array<EditCell>>(data.columns),
                    rows: data.rows,
                    columns: data.columns,
                    name: data.mapName,
                    selected: mapData.id
                });
                console.log("------------->"+JSON.stringify(data.terrains)+"; "+data.terrains.length);
                saveState(EditActions.saveState(game, data.terrains, storeEdit.getState().cursorPosition, storeEdit.getState().selected, "SAVE"));
                if(callback) {
                    callback({ status: true, errorCode: "Success", retmap: data.terrains});
                }
            }
        };
        connection.send(JSON.stringify({
            tipo: "getMapEdit",
            mapData: mapData.id
        }));
    }

    //Actualiza el valor del nombre del mapa
    updateInput(title: string) {
        this.setState({ name: title });
    }

    selectOptionsTerrains(){
        let army = [<option selected value={null}>{selectText}</option>];
        for(var i = 0; i < TERRAINS.length; i++){
            army.push(<option value={TERRAINS[i]}>{terrainListText[i]}</option>);
        }
        return army;
    }

    //Todos estos son métodos de actualización de los botones y los estados correspondientes de borrar, crear unidad, crear terreno, seleccionar y cambiar bando
    selected(evt: string) {
        saveState(EditActions.selected(this, evt));
    }

    onClickCreateTerrain(event : React.MouseEvent<HTMLElement>) {
        saveState(EditActions.onClickCreateTerrain(this));
    }

    onClickExit(event : React.MouseEvent<HTMLElement>) {
        saveState(EditActions.saveState(this, [], storeEdit.getState().cursorPosition, storeEdit.getState().selected, "SAVE"));
        this.setState({request: 0});
        this.props.parentObject.changeGameState(3); // Salir de la partida.
    }

    onClickGenerateMap(event: React.MouseEvent<HTMLElement>) {
        // Para generar el mapa, convertiremos el conjunto de terrenos en un JSON
        let terrains = storeEdit.getState().terrains;
        let name =  this.state.name.trim();
        if(name.trim()==""){
            name = {mapWithoutName};
        }
        let jsonResult = {
            id: this.state.selected,
            // Este elemento contiene los terrenos
            map: terrains,
            // También debemos definir las filas y columnas
            rows: this.state.rows,
            columns: this.state.columns,
            name: name,
            googleId: Number(this.props.parentObject.state.clientId)
        };
        // Generamos el JSON que contendrán los datos del mapa,
        let result = JSON.stringify(jsonResult);
        // Enviaremos al servidor el contenido del mapa
        Network.sendMapToServer(jsonResult);
        // Finalmente, mostramos en el textarea el resultado
        this.setState({
            cells: this.state.cells,
            rows: this.state.rows,
            columns: this.state.columns,
            name: name,
            selected: this.state.selected
        });
        window.alert(saveAlertText);
    }

    //Igual que en Map solo que se actualiza el cursor del estado de edición
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
                cursorPosition = storeEdit.getState().cursorPosition;
                // Crearemos una nueva posición resultado
                newCursorPosition = new Pair(cursorPosition.row + (cursorPosition.column&1?1:0), cursorPosition.column - 1);
                // Llamamos a la acción para cambiarlo
                break;
            case '2':
                // La tecla 2 del numpad (0,+1)
                cursorPosition = storeEdit.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row + 1, cursorPosition.column);
                break;
            case '3':
                // La tecla 3 del numpad (+1,+1)
                cursorPosition = storeEdit.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row + (cursorPosition.column&1?1:0), cursorPosition.column + 1);
                break;
            case '7':
                // La tecla 7 del numpad (-1,-1)
                cursorPosition = storeEdit.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row - (cursorPosition.column&1?0:1), cursorPosition.column - 1);
                break;
            case '8':
                // La tecla 8 del numpad (0, -1)
                cursorPosition = storeEdit.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row - 1, cursorPosition.column);
                break;
            case '9':
                // La tecla 9 del numpad (+1, -1)
                cursorPosition = storeEdit.getState().cursorPosition;
                newCursorPosition = new Pair(cursorPosition.row - (cursorPosition.column&1?0:1), cursorPosition.column + 1);
                break;
            case '5':
            case ' ':
                // Realizar el click en la posición
                cursorPosition = storeEdit.getState().cursorPosition;
                this.clickAction(cursorPosition.row, cursorPosition.column);
                break;
        }
        // Si puede hacerse el movimiento, realiza la acción
        if(newCursorPosition && newCursorPosition.row >= 0 && newCursorPosition.column >= 0 && newCursorPosition.column <= this.props.vertical && newCursorPosition.row <= this.props.horizontal) {
            saveState(EditActions.generateChangeCursor(newCursorPosition));
        }
    }

    onClick(event : React.MouseEvent<HTMLElement>) {
        let position = Pathfinding.getPositionClicked(event.clientX, event.clientY);

        //Guardamos la posición actual y la nueva posición
        this.clickAction(position.row, position.column);
    }

    //Se usa editStats ya que necesitamos obtener los datos de los array de terrain y unit del estado de edición
    onRightClick(event: React.MouseEvent<HTMLElement>) {
        // Primero, evitamos que genere el menú del navegador
        event.preventDefault();
        // Obtenemos la posición donde ha realizado click
        let position = Pathfinding.getPositionClicked(event.clientX, event.clientY);
        // También comprobamos que exista un terreno en la posición
        // Pero antes, vemos que la posición sea alcanzable
        let terrain = null;
        if(position.row >= 0 && position.row <= this.props.vertical &&
            position.column >= 0 && position.column <= this.props.horizontal) {
                // Si es válida, iteramos por los terrenos y si no se encuentra, se emite un Plains
                let terrainIndex = myIndexOf(storeEdit.getState().terrains.map(x => x.position), position);
                terrain = terrainIndex > -1?storeEdit.getState().terrains[terrainIndex]:Plains.create(position);
        }
        // Actualizamos el estado de la barra de estadísticas
        // El estado será siempre null, ya que no habrá unidades en el editor
        this.editStats.setState({ unit: null, terrain: terrain });
    }

    clickAction(row: number, column: number) {
        let newPosition: Pair = new Pair(row,column);
        let terrainIndex: number = myIndexOf(storeEdit.getState().terrains.map(x => x.position), newPosition);

        let terrain: Terrain;
        let array = storeEdit.getState().terrains;
        // Obtenemos el nuevo terreno a reemplazar/crear
        /*switch(storeEdit.getState().selected) {
            case "Plains":
                terrain = Plains.create(newPosition);
                break;
            case "Mountains":
                terrain = ImpassableMountain.create(newPosition);
                break;
            case "Hills":
                terrain = Hills.create(newPosition);
                break;
            case "Forest":
                terrain = Forest.create(newPosition);
                break;
            case "River":
                terrain = River.create(newPosition);
            default:
        };*/
        //if(storeEdit.getState().selected!=null&&storeEdit.getState().selected!=undefined){
        const sel : keyof TERR_CREATE = storeEdit.getState().selected;
        terrain = TERRAINS_CREATE[sel].create(newPosition);
        //}

        // Comprobamos si la posición está ocupada
        if(terrainIndex > -1) {
            // En este caso, reemplazamos el terreno en el índice en el que esté
            array[terrainIndex] = terrain;
        } else {
            // En este otro caso, añadiremos el terreno al índice
            array.push(terrain);
        }
        // Finalmente, actualizamos el estado
        storeEdit.dispatch(EditActions.generateChangeTerrain(array));
    }

    /** Función auxiliar usada para renderizar el mapa. Consiste en recorrer todas las columnas acumulando las casillas. **/
    generateMap() {
        var accum = [];
        // Repetirá este for hasta que se llegue al número de columnas especificado
        for(var i = 0; i < this.props.vertical*2; i++) { // Necesitamos 2*verticales para ordenarlos correctamente
            // Este método retornará una lista con las casillas en fila
            accum.push(this.generateCellRow.bind(this)(i));
        }

        return accum;
    }

    //Se generan las celdas con EditCell ya que se necesita que vaya por la lista del estado de edit
    generateCellRow(num_row: number) {
        var accum2 = [];
        this.state.cells[num_row] = new Array<EditCell>(this.props.horizontal);
        // Este bucle iterará hasta el número de celdas horizontales especificado en el props.
        for(var j = num_row%2==0?0:1; j < this.props.horizontal; j = j+2) { // Incrementamos en 2 porque el elemento entre cada hex tendrá el valor j + 1.
            let column = j;
            let row = num_row%2==0?num_row/2:Math.floor(num_row/2);
            var cell = <EditCell row={row} column={column} />; // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
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
