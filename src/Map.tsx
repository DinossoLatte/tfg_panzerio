import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Actions, State, InitialState, Reducer } from './GameState';
import { Cell } from './Cell';
import { TerrainCell } from './TerrainCell';
import { Pair, Cubic, myIndexOf, cubic_directions, myIndexOfCubic } from './Utils';
import { Unit } from './Unit';
import { UnitCell } from './UnitCell';

/** Representa el mapa que contendrá las unidades y las casillas **/
export class Map extends React.Component<any, any> {
    //Esta variable controla el turno del juego
    turn : number;
    actualstate : number; //El valor 0 es por defecto, 1 es victoria y 2 es derrota

    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    constructor(props: any) {
        super(props);
        this.turn = 0;
        this.actualstate = 0;
        this.state = { cells: new Array<Array<Cell>>(this.props.horizontal), rows: this.props.vertical, columns: this.props.horizontal };
        store.dispatch(Actions.generateSetListener(this));
    }

    /** Renderiza el mapa **/
    render() {
        // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
        return (
            <div>
                <p>Turno del {this.turn%2==0?"Jugador":"Enemigo"}. Día {this.turn}{this.actualstate==1?". Victoria":this.actualstate==2?". Derrota":""}</p>
                <button id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>Salir del juego</button>
                <div id="map" className="map" onClick={this.onClick.bind(this)} tabIndex={0} onKeyDown={this.onKey.bind(this)}>
                    {this.generateMap.bind(this)().map((a: any) => {
                        return a;
                    })}
                </div>
            </div>
        );
    }

    onClickExit(event : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeGameState(0); // Salir de la partida.
    }

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

    /** Placeholder, contendrá la lógica de selección de la casilla correcta. **/
    onClick(event : React.MouseEvent<HTMLElement>) {
        // Para obtener las posiciones relativas al mapa, obtenemos las posiciones absolutas del primer objeto, que es el hexágono primero.
        var dimensions = document.getElementById("hex0_0").getBoundingClientRect();

        // Para soportar mejor los cambios de pantalla, obtenemos las dimensiones del hex primero, para los demás será igual.
        var height = dimensions.bottom - dimensions.top; // Hardcoded, se deberían realizar más pruebas
        var width = Math.round(height*1.153846154); // El valor que se multiplica es la proporción entre el height y width

        var x = event.clientX - dimensions.left; // A las coordenadas absolutas les restamos las dimensiones en el extremo superior izquierdo del primer hex.
        var y = event.clientY - dimensions.top;

        var column: number = Math.floor(x/(3/4*width)); // Primero, encontramos la columna aproximada, dividiendo la posición por 3/4 la anchura (debido a los siguientes cálculos)
        var row: number; // Definimos el número de fila.

        var isOdd = column%2==1; // Comprobamos si la columna de hexes es impar, ya que estará bajada por la mitad de la altura
        switch(isOdd) {
            case true:
                // Se le restará la mitad de la altura del hex.
                row = Math.floor((y - (height/2)) / height);
                break;
            case false:
                // En otro caso, se obtendrá de forma parecida a la columna. Dividiendo la altura del hex (como se verá, no es multiplicado por 3/4 al no existir un extremo en esa posición).
                row = Math.floor(y / height);
        }

        // En este momento, tendrémos la casilla correcta aproximada.
        var centerX = Math.round(column*(3/4*width)+width/2); // Para encontrar el punto central del hex más cercano. 3/4 ya que los hexes están solapados.
        var centerY;
        switch(isOdd) {
            case true:
                // El punto central equivale a la fila por el tamaño del hex más la mitad (punto medio) más el offset por la fila impar
                centerY = Math.round(row*height+height);
                break;
            case false:
                // En otro caso, no existirá el offset por la fila impar.
                centerY = Math.round(row*height+(height/2));
        }
        var radius = Math.round(height/4); // Tomamos el radio más pequeño, siendo este la mitad de la altura del hex.

        // Comprobación de si está el punto en el círculo
        if(!this.getInCircle(centerX, centerY, radius, x, y)) {
            // Debemos calcular la distancia entre los otros hexágonos:
            // Debe tenerse en cuenta que estamos intentando encontrar si el punto está en el extremo de forma "<"
            // Primero comprobamos si debemos escoger el hexágono superior o inferior
            var isUpper = y < centerY;
            // Recogemos la posición del hex horizontal siguiente:
            var comparingHexX = Math.round(centerX - (width*3/4));
            // Y dependiendo de que esté arriba o debajo, la posición vertical del hex posible:
            var comparingHexY = Math.round(isUpper?(centerY - (height/2)):(centerY + (height/2)));
            // Calculamos la distancia entre todos los posibles hexes:
            var distanceCircle = this.calculateDistance(centerX, centerY, x, y);
            var distancePossibleHex = this.calculateDistance(comparingHexX, comparingHexY, x, y);
            // Si la distancia del hex posible es menor al del círculo, entonces cambiamos el row y column
            if(distancePossibleHex < distanceCircle) {
                // Debido al sistema de identificación usado, es necesario añadir reglas si el hex es impar o par.
                if(isOdd) {
                    column--;
                    if(!isUpper) {
                        row++;
                    }
                } else {
                    column--;
                    if(isUpper) {
                        row--;
                    }
                }
            }
        }


        //Guardamos la posición actual y la nueva posición

        this.clickAction(row, column); // TODO Solucionar esto!
    }

    clickAction(row: number, column: number) {
        let newPosition: Pair = new Pair(row,column);
        let unitIndex: number;
        let otherIndex: number;
        //Cada vez que salga este if es que se está comprobando si es turno del jugador o enemigo y dependiendo de eso comprueba en la lista del jugador o enemiga
        if(this.turn%2==0){
            unitIndex = myIndexOf(store.getState().position.map(x=>x.position), newPosition);
            otherIndex = myIndexOf(store.getState().enemyposition.map(x=>x.position), newPosition);
        }else{
            unitIndex = myIndexOf(store.getState().enemyposition.map(x=>x.position), newPosition);
            otherIndex = myIndexOf(store.getState().position.map(x=>x.position), newPosition);
        }

        //Si el indice es != -1 (está incluido en la lista de unidades) y está en modo de espera de movimiento se generará el estado de movimiento
        if(unitIndex!= -1 && store.getState().type == "SET_LISTENER"){
            saveState(Actions.generateMove(unitIndex,this.turn%2==0));
        //Si hace clic en una possición exterior, mantieene el estado de en movimiento (seleccionado) y sigue almacenando la unidad seleccionada
        }else if((newPosition.column<0 || newPosition.column>this.props.horizontal || newPosition.row<0 || newPosition.row>this.props.vertical)){
            saveState(Actions.generateMove(store.getState().selectedUnit,this.turn%2==0));
        //En caso de que no esté incluida en la lista de unidades y esté en estado de movimiento
        }else if(unitIndex==-1 && store.getState().selectedUnit != null && myIndexOf(store.getState().visitables, newPosition) != -1){
            //Primero se comprueba si es un ataque (si selecciona a un enemigo durante el movimiento)
            if(otherIndex != -1){
                //Si es así se ataca
                saveState(Actions.attack(otherIndex,this.turn%2==0));
            }
            //El valor de null es si se hace que justo tras el movimiento seleccione otra unidad, en este caso no es necesario así que se pondrá null
            if(this.turn%2==0){
                saveState(Actions.generateChangeUnitPos(store.getState().selectedUnit, newPosition, null));
            }else{
                saveState(Actions.generateChangeUnitPosEnemy(store.getState().selectedUnit, newPosition, null));
            }
            //Si no quedan más unidades enemigas es una victoria y si no quedan más unidades del jugador es una derrota
            if(store.getState().enemyposition.length==0){
                this.actualstate=1;
                saveState(Actions.finish());
            }else if(store.getState().position.length==0){
                this.actualstate=2;
                saveState(Actions.finish());
            }
            this.turn++;
        }else{
            saveState(Actions.generateSetListener(this));
        }
    }

    // Calcula si dado los datos del circulo y  un punto cualquiuera, el punto cualquiera está dentro del círculo
    getInCircle(centerX: number, centerY: number, radius: number, x: number, y: number) {
        // Raiz cuadrada de la distancia vectorial entre el centro y el punto debe ser menor al radio
        return this.calculateDistance(centerX, centerY, x, y) < radius;
    }

    // Calcula la distancia vectorial entre dos puntos
    calculateDistance(x0: number, y0: number, x1: number, y1: number) {
        return Math.sqrt(Math.pow((x0-x1),2) + Math.pow((y0-y1),2));
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
        for(var j = num_row%2==0?0:1; j <= this.props.horizontal; j = j+2) { // Incrementamos en 2 porque el elemento entre cada hex tendrá el valor j + 1.
            let column = j;
            let row = num_row%2==0?num_row/2:Math.floor(num_row/2);
            let pos = new Pair(row, column);
            //Si está incluida en la lista de posiciones de unidades (el indice obtenido es -1) entonces se añade una casilla de unidad
            let unitIndex = myIndexOf(store.getState().position.map(x=>x.position), pos);
            let enemyIndex = myIndexOf(store.getState().enemyposition.map(x=>x.position), pos);
            if (unitIndex!=-1){
                this.state.cells[row][column] = <Cell row={row} column={column} />
                accum2.push(
                    <UnitCell row={row} column={column} enemy={false} unit={store.getState().position[unitIndex]}/>
                );
            //Si está entre las casillas enemigas entonces se modifica su imagen.
            }else if(enemyIndex!=-1){
                this.state.cells[row][column] = <Cell row={row} column={column} />
                accum2.push(
                    <UnitCell row={row} column={column} enemy={true} unit={store.getState().enemyposition[enemyIndex]}/>
                );
            //Si está en modo seleccionado se usará otra lógica es necesario llamarlo despues de la unidad sino las casillas de unidades al generarse se pondran en amarillo
            }else if(store.getState().selectedUnit!=null){
                let actualPosition: Pair;
                if(this.turn%2==0){
                    actualPosition = store.getState().position[store.getState().selectedUnit].position;
                }else{
                    actualPosition = store.getState().enemyposition[store.getState().selectedUnit].position;
                }
                //Si la distancia es menor o igual a la distancia máxima entonces son posiciones validas y se seleccionaran, además se comprueba que no sea un obstáculo
                if(myIndexOf(store.getState().visitables, pos) != -1){
                    var cell = <Cell row={row} column={column} selected={true} />; // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                    this.state.cells[row][column] = cell;
                    //Para no añadir una nueva clase de celda seleccionada simplemente hacemos esto
                    accum2.push(cell);
                //Es necesario hacer este else porque al entrar en este else if no podrá ejecutar el else exterior
                }else{
                    var cell = <Cell row={row} column={column} />; // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                    this.state.cells[row][column] = cell;
                    accum2.push(cell);
                }
            }else{
                // Se introducirá el elemento en una lista
                var cell = <Cell row={row} column={column} />; // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                this.state.cells[row][column] = cell;
                accum2.push(cell);
            }
        }

        // Se retorna en un div que dependiendo de que se trate de la fila par o impar, contendrá también la clase celRowOdd.
        return (
            <div className={"cellRow" + (num_row%2==0?"":" cellRowOdd")}>
                {accum2}
            </div>
        );
    }
}
