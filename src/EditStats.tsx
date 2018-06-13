import * as React from 'react';

import { storeEdit } from './StoreEdit';

const terrainText = "Terreno: ";
const positionText = "Posición: ";
const typeText = "Tipo: ";
const costText = "Coste (movimiento): ";
const weakDefTerrain = "Bonificación defensa débil: ";
const strongDefTerrain = "Bonificación defensa fuerte: ";
const weakAttTerrain = "Bonificación ataque débil: ";
const strongAttTerrain = "Bonificación ataque fuerte: ";
const contText = "Contenido de la posición seleccionada: ";
const infoText = "Haga click derecho para poder obtener información de la unidad y terreno.";

//Esta clase funciona igual que UnitStats pero simplemente obtiene los datos de storeEdit
export class EditStats extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        storeEdit.getState().map.editStats = this;
        this.state = {
            terrain: null
        }
    }

    render() {
        let terrainStats = null;
        if(this.state.terrain != null) {
            terrainStats = (
                <div>
                    <p id="bold"> {terrainText} </p>
                    <p>    {positionText+this.state.terrain.position.toString()}</p>
                    <p>    {typeText+this.state.terrain.name}</p>
                    <p>    {costText+this.state.terrain.movement_penalty}</p>
                    <p>    {weakDefTerrain+this.state.terrain.defenseWeak}</p>
                    <p>    {strongDefTerrain+this.state.terrain.defenseStrong}</p>
                    <p>    {weakAttTerrain+this.state.terrain.attackWeak}</p>
                    <p>    {strongAttTerrain+this.state.terrain.attackStrong}</p>
                </div>
            );
        }

        return (
        <div className="col-sm-3 text-left">
                <h3>{contText}</h3>
                {terrainStats}
                {!terrainStats?<div className="alert alert-info" id="error">{infoText}</div>:null}
        </div>
        );
    }
}
