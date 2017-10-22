import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Actions, State, InitialState, Reducer } from './GameState';
import { Cell } from './Cell';
import { Unit } from './Unit';
import { Pair } from './Utils';

/** Representa el mapa que contendrá las unidades y las casillas **/
export class Map extends React.Component<any, any> {
    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    constructor(props: any) {
        super(props);
        this.state = { cells: new Array<Array<Cell>>(this.props.horizontal) };
        store.dispatch(Actions.generateSetListener(this));
    }

    /** Renderiza el mapa **/
    render() {
        // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
        return (
            <div id="map" className="map" onClick={this.onClick.bind(this)}>
                {this.generateMap.bind(this)().map((a: any) => {
                    return a;
                })}
            </div>
        );
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
        var centerX = Math.round(column * (3/4*width) + width/2); // Para encontrar el punto central del hex más cercano. 3/4 ya que los hexes están solapados.
        var centerY;
        switch(isOdd) {
            case true:
                // El punto central equivale a la fila por el tamaño del hex más la mitad (punto medio) más el offset por la fila impar
                centerY = Math.round(row*height + height);
                break;
            case false:
                // En otro caso, no existirá el offset por la fila impar.
                centerY = Math.round(row*height + (height/2));
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

        // Finalmente, llamamos al método correspondiente:

        store.dispatch(Actions.generateChangeUnitPos(0, new Pair(row, column)));
        // Forzamos una actualización del estado para que se renderize el mapa.
        this.setState(this.state);
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
        for(var i = 0; i <= this.props.horizontal*2 + 1; i++) { // Necesitamos 2*verticales para ordenarlos correctamente
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
            if(column == store.getState().position.y && row == store.getState().position.x){
                this.state.cells[row][column] =
                accum2.push(
                    <div className="cell">
                        <Unit horizontal={j} vertical={num_row} />
                    </div>
                );
            }else{
                // Se introducirá el elemento en una lista
                var cell = <Cell vertical={column} horizontal={row} />; // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
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
