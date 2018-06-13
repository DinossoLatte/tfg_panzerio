import * as React from 'react';

import { store } from './Store';

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
const unitText = "Unidad: ";
const positionUnit = "Posición: ";
const typeUnit = "Tipo: ";
const actionUnit = "Acción disponible: ";
const movementUnit = "Movimiento: ";
const rangeUnit = "Alcance: ";
const healthUnit = "Vida: ";
const weakDefUnit = "Defensa débil: ";
const strongDefUnit = "Defensa fuerte: ";
const weakAttUnit = "Ataque débil: ";
const strongAttUnit = "Ataque fuerte: ";
const moveText = "Movimiento";
const attackText = "Ataque";
const noneText = "Ninguna";

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
                    <p id="bold">{unitText} </p>
                    <p>    {positionUnit+this.state.unit.position.toString()}</p>
                    <p>    {typeUnit+this.state.unit.type}</p>
                    <p>    {this.state.unit.action==0?actionUnit+moveText:this.state.unit.action==1?actionUnit+attackText:actionUnit+noneText}</p>
                    <p>    {movementUnit+this.state.unit.movement}</p>
                    <p>    {rangeUnit+this.state.unit.range}</p>
                    <p>    {healthUnit+this.state.unit.health}</p>
                    <p>    {weakAttUnit+this.state.unit.attackWeak}</p>
                    <p>    {strongAttUnit+this.state.unit.attackStrong}</p>
                    <p>    {weakDefUnit+this.state.unit.defenseWeak}</p>
                    <p>    {strongDefUnit+this.state.unit.defenseStrong}</p>
                </div>
            );
        }
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
                {unitStats}
                {terrainStats}
                {!terrainStats?<div className="alert alert-info" id="error">{infoText}</div>:null}
        </div>
        );
    }
}
