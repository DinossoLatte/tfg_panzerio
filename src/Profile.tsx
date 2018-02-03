import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { storeProfile, saveState } from './StoreProfile';
import { ReducerProfile, StateProfile, ProfileActions, InitialStateProfile} from './GameProfileState';
import { Cell } from './Cell';
import { Army } from './Army';
import { EditCell } from './EditCell';
import { TerrainCell } from './TerrainCell';
import { Pair, Cubic, myIndexOf, CUBIC_DIRECTIONS, myIndexOfCubic, Pathfinding } from './Utils';
import { UnitCell } from './UnitCell';
import { UnitStats } from './UnitStats';
import { EditStats } from './EditStats';
import { Unit, Infantry, Tank, General, UNITS, UNITS_ESP } from './Unit';
import { Terrain, Plains, ImpassableMountain, Hills, Forest, TERRAINS, TERRAINS_ESP } from './Terrains';

export class Profile extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {name: null};
    }

    updateInput(evt: string){
        if(evt==null||evt==undefined||evt==""){
            this.setState({name: "Batallón "+storeProfile.getState().selectedArmy});
        }else{
            this.setState({name: evt});
        }
    }

    onClickAddEdit(event: React.MouseEvent<HTMLElement>){
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().selectedArmy,null,"4"));
    }

    onClickDeleteEdit(event: React.MouseEvent<HTMLElement>){
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().selectedArmy,null,"5"));
    }

    selectOptionsArmy(){
        let army = [<option selected value={null}>--Selecciona--</option>];
        for(var i = 0; i < storeProfile.getState().armies.length; i++){
            army.push(<option value={i}>{storeProfile.getState().armies[i].getName()}</option>);
        }
        return army;
    }

    //Se crean los options segun la lista de unidades disponibles (empieza en 1 para no contar general)
    selectOptionsUnits(){
        let army = [<option selected value={null}>--Selecciona--</option>];
        for(var i = 1; i < UNITS.length; i++){
            army.push(<option value={UNITS[i]}>{UNITS_ESP[i]}</option>);
        }
        return army;
    }

    selectOptionsUnitsDelete(){
        let army = [<option selected value={null}>--Selecciona--</option>];
        for(var i = 1; i < UNITS.length; i++){
            if(storeProfile.getState().armies[storeProfile.getState().selectedArmy].getArmy().filter(x =>  x==UNITS[i]).length!=0){
                army.push(<option value={UNITS[i]}>{UNITS_ESP[i]}</option>);
            }
        }
        return army;
    }

    armyContent(i: number){
        let army = [];
        //Es necesario hacer este bucle porque sino no se puede incializar a 0 el array
        let armyNum = [];
        for(var j = 0; j < UNITS.length; j++){
            armyNum.push(0);
        }
        let ind;
        i==null?ind=storeProfile.getState().selectedArmy:ind=i;
        for(var y = 0; y < storeProfile.getState().armies[ind].getArmy().length; y++){
            for(var p = 0; p < UNITS.length; p++){
                if(storeProfile.getState().armies[ind].getArmy()[y]==UNITS[p]){
                    armyNum[p]++;
                }
            }
        }
        for(var z = 0; z < armyNum.length; z++){
            army.push(<p>{UNITS_ESP[z]}: {armyNum[z]}</p>);
        }
        return army;
    }

    armyList(){
        let armies = [];
        for(var i = 0; i < storeProfile.getState().armies.length; i++){
            armies.push(<div id="arm">{storeProfile.getState().armies[i].getName()}</div>);
            var army = this.armyContent(i)
            for(var j = 0; j < army.length; j++){
                armies.push(army[j]);
            }
        }
        return armies;
    }

    selectedUnit(evt: string) {
        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().selectedArmy,evt,storeProfile.getState().type));
    }

    selectedArmy(evt: string) {
        this.state.name!=null?this.setState({name: storeProfile.getState().armies[parseInt(evt)].getName()}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,parseInt(evt),storeProfile.getState().selected,"3"));
    }

    onClickDelete(event: React.MouseEvent<HTMLElement>){
        let army = storeProfile.getState().armies[storeProfile.getState().selectedArmy];
        let index = army.getArmy().indexOf(storeProfile.getState().selected);
        delete army.getArmy()[index];
        army.setArmy(army.getArmy().filter(x => x!==undefined));

        storeProfile.getState().armies[storeProfile.getState().selectedArmy]=army;

        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().selectedArmy,"",storeProfile.getState().type));
    }

    onClickDeleteArmy(event: React.MouseEvent<HTMLElement>){
        let armies = storeProfile.getState().armies;
        delete armies[storeProfile.getState().selectedArmy];
        armies = armies.filter(x => x!==undefined);

        saveState(ProfileActions.save(this,armies,null,"","2"));
    }

    onClickAdd(event: React.MouseEvent<HTMLElement>){
        let army: Army;
        //this.updateInput(this.state.name);
        if(storeProfile.getState().armies.length==storeProfile.getState().selectedArmy){
            army = new Army(["General"],this.state.name==null?"Batallón "+storeProfile.getState().selectedArmy:this.state.name);
            if(storeProfile.getState().selected!=null){
                army.getArmy().push(storeProfile.getState().selected);
            }
            storeProfile.getState().armies.push(army);
        }else{
            army=storeProfile.getState().armies[storeProfile.getState().selectedArmy];
            if(storeProfile.getState().selected!=null){
                army.getArmy().push(storeProfile.getState().selected);
            }
            if(storeProfile.getState().type=="1"||storeProfile.getState().type=="3"){
                army.setName(this.state.name==null?"Batallón "+storeProfile.getState().selectedArmy:this.state.name);
            }
            storeProfile.getState().armies[storeProfile.getState().selectedArmy]=army;
        }
        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().selectedArmy,"",storeProfile.getState().type));
    }

    onClickCreate(event: React.MouseEvent<HTMLElement>){
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().armies.length,"","1"));
    }

    onClickEdit(event: React.MouseEvent<HTMLElement>){
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,null,"","2"));
    }

    onClickEditName(event: React.MouseEvent<HTMLElement>){
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,storeProfile.getState().selectedArmy,"","3"));
    }

    onClickList(event: React.MouseEvent<HTMLElement>){
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,null,"","0"));
    }

    onClickExit(event : React.MouseEvent<HTMLElement>) {
        this.state.name!=null&&(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?this.setState({name: null}):"";
        saveState(ProfileActions.save(this,storeProfile.getState().armies,null,"","0"));
        this.props.parentObject.changeGameState(0);
    }

    render() {
        return (
            <div>
                <img className="avatar" src="imgs/avatar.png" />
                <p>Nombre: Jugador</p>
                <p>Partidas ganadas: x</p>
                <p>Partidas perdidas: y</p>
                <p>Nivel: z</p>
                {storeProfile.getState().type!="0"?<button id="listArmy" name="listArmy" className="listArmyButton" onClick={this.onClickList.bind(this)}>Mostrar batallones</button>:""}
                {storeProfile.getState().type!="1"?<button id="createArmy" name="createArmy" className="createArmyButton" onClick={this.onClickCreate.bind(this)}>Crear un nuevo ejército</button>:""}
                {storeProfile.getState().type!="2"?<button id="editArmy" name="editArmy" className="editArmyButton" onClick={this.onClickEdit.bind(this)}>Editar un ejército</button>:""}
                <button id="exitButton" name="exitButton" onClick={this.onClickExit.bind(this)}>Volver al menú</button>
                {storeProfile.getState().type>="2"&&storeProfile.getState().armies.length>0?<div>
                    <label> Selecciona el batallón:
                        <select defaultValue={null} value={storeProfile.getState().selectedArmy} onChange={evt => this.selectedArmy(evt.target.value)}>
                            {this.selectOptionsArmy()}
                        </select>
                    </label>
                    {storeProfile.getState().type>"2"&&storeProfile.getState().type!="3"?<button id="editName" name="editName" className="editNameButton" onClick={this.onClickEditName.bind(this)}>Editar nombre del batallón</button>:""}
                    {storeProfile.getState().type>"2"&&storeProfile.getState().type!="4"?<button id="addUnit" name="addUnit" className="addUnitButton" onClick={this.onClickAddEdit.bind(this)}>Añadir una nueva unidad</button>:""}
                    {storeProfile.getState().type>"2"&&storeProfile.getState().type!="5"?<button id="deleteUnit" name="deleteUnit" className="deleteUnitButton" onClick={this.onClickDeleteEdit.bind(this)}>Eliminar una unidad</button>:""}
                    {storeProfile.getState().type>"2"&&storeProfile.getState().selectedArmy!=null?<button id="deleteArmy" name="deleteArmy" className="deleteArmyButton" onClick={this.onClickDeleteArmy.bind(this)}>Eliminar batallón</button>:""}
                </div>:storeProfile.getState().type>="2"&&storeProfile.getState().armies.length==0?<div id="error">No hay batallones para seleccionar</div>:""}
                {storeProfile.getState().type=="1"||storeProfile.getState().type=="4"?<div>
                    <label> Selecciona el tipo de unidad:
                        <select defaultValue={null} value={storeProfile.getState().selected} onChange={evt => this.selectedUnit(evt.target.value)}>
                            {this.selectOptionsUnits()}
                        </select>
                    </label>
                    {storeProfile.getState().selected!=null?<button id="addUnit" name="addUnit" className="addUnitButton" onClick={this.onClickAdd.bind(this)}>Añadir unidad</button>:""}
                </div>:""}
                {(storeProfile.getState().type=="1"||storeProfile.getState().type=="3")&&storeProfile.getState().selectedArmy!=null?<div>
                    Nombre: <input type="text" value={this.state.name} onChange={evt => this.updateInput(evt.target.value)} />
                    <button id="setName" name="setName" className="setNameButton" onClick={this.onClickAdd.bind(this)}>Establecer nombre</button>
                </div>:""}
                {storeProfile.getState().type=="5"&&storeProfile.getState().armies[storeProfile.getState().selectedArmy].getArmy().length>1?<div>
                    <label> Selecciona el tipo de unidad:
                        <select defaultValue={null} value={storeProfile.getState().selected} onChange={evt => this.selectedUnit(evt.target.value)}>
                            {this.selectOptionsUnitsDelete()}
                        </select>
                    </label>
                    {storeProfile.getState().selected!=null?<button id="deleteUnit" name="deleteUnit" className="deleteUnitButton" onClick={this.onClickDelete.bind(this)}>Eliminar unidad</button>:""}
                </div>:storeProfile.getState().type=="5"&&storeProfile.getState().armies[storeProfile.getState().selectedArmy].getArmy().length<=1?<div id="error">No hay unidades para eliminar</div>:""}
                {storeProfile.getState().selectedArmy!=null&&storeProfile.getState().armies.length>storeProfile.getState().selectedArmy?<div>
                    <p>El batallón contiene:</p>
                    <div>
                        {this.armyContent(null)}
                    </div>
                </div>:""}
                {storeProfile.getState().type=="0"?<div>
                    <p>Batallones del jugador:</p>
                    <div>
                        {this.armyList()}
                    </div>
                </div>:""}
            </div>
        );
    }
}
