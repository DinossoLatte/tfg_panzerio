import * as React from 'react';

import { store } from './Store';


export class UnitStats extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        store.getState().map.unitStats = this;
        this.state = {
            unit: null,
            terrain: null
        }
    }

    render() {
        let unitStats = null;
        if(this.state.unit != null) {
            unitStats = (
                <div>
                    <h4>Seleccionada: </h4>
                    <p>Unidad: </p>
                    <p>    Posición: {this.state.unit.position.toString()}</p>
                    <p>    Unidad: {this.state.unit.type}</p>
                </div>
            );
        }
        let terrainStats = null;
        if(this.state.terrain != null) {
            terrainStats = (
                <div>
                    <p>Terreno: </p>
                    <p>    Posición: {this.state.terrain.position.toString()}</p>
                    <p>    Tipo: {this.state.terrain.name}</p>
                    <p>    Coste (movimiento): {this.state.terrain.movement_penalty}</p>
                </div>
            );
        }

        return (
        <div className="leftPanel">
            <div className="unitStats">
                {unitStats}
                {terrainStats}
                {!unitStats && !terrainStats?"Haga click derecho para poder obtener información de la unidad y terreno.":null /* Hotfix porque CSS no quiere ponerlo con el tamaño fijo nunca */}
            </div>
        </div>
        );
    }
}