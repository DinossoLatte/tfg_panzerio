import * as React from 'react';

import { storeEdit } from './StoreEdit';

//Esta clase funciona igual que UnitStats pero simplemente obtiene los datos de storeEdit
export class EditStats extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        storeEdit.getState().map.editStats = this;
        this.state = {
            unit: null,
            terrain: null
        }
    }

    render() {
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
                {terrainStats}
                {!terrainStats?<p>"Haga click derecho para poder obtener información de la unidad y terreno."</p>:null}
            </div>
        </div>
        );
    }
}
