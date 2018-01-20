import * as React from 'react';

import { store } from './Store';


export class EditStats extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        this.props.map.unitStats = this;
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
                    <p>    Tipo: {this.state.unit.type}</p>
                    <p>    Acción disponible: {this.state.unit.action==0?"Movimiento":this.state.unit.action==1?"Ataque":"Ninguna"}</p>
                    <p>    Movimiento: {this.state.unit.movement}</p>
                    <p>    Alcance: {this.state.unit.range}</p>
                    <p>    Vida: {this.state.unit.health}</p>
                    <p>    Ataque débil: {this.state.unit.attackWeak}</p>
                    <p>    Ataque fuerte: {this.state.unit.attackStrong}</p>
                    <p>    Defensa débil: {this.state.unit.defenseWeak}</p>
                    <p>    Defensa fuerte: {this.state.unit.defenseStrong}</p>
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
