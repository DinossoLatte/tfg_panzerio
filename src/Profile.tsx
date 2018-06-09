import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { storeProfile, saveState, } from './StoreProfile';
import { ProfileActions } from './GameProfileState';
import { Army } from './Army';
import { UNITS, UNITS_ESP } from './Unit';
import { Network } from './Utils';

const playerText = "Jugador";
const armyText = "Nuevo batallón";
const newArmyText = "Batallón ";
const saveAlert1 = "Se ha guardado correctamente el perfil";
const saveAlert2 = "No se ha podido guardar correctamente el perfil";
const personalProfileText = "Perfil personal";
const backText = "Volver atrás";
const editNameText = "Modifique aquí su nombre";
const editNameButton = "Editar nombre";
const winText = "Partidas ganadas: ";
const loseText = "Partidas perdidas: ";
const showArmy = "Mostrar batallones";
const createArmyTitle = "Crear batallón";
const editArmyTitle = "Editar batallón";
const saveArmy = "Guardar batallones";
const saveInfo = "Los cambios serán almacenados en la lista de batallones por guardar";
const editArmy = "Edición del batallón";
const selectArmy = "Selecciona el batallón";
const editNameArmy = "Editar nombre del batallón";
const addUnit = "Añadir una nueva unidad";
const deleteUnitTitle = "Eliminar una unidad";
const deleteArmy = "Eliminar batallón";
const noArmies = "No hay batallones para seleccionar";
const selectUnitText = "Selecciona el tipo de unidad";
const createArmy = "Creación del batallón";
const addOtherUnit = "Añadir unidad";
const armyNameText = "Nombre del batallón: ";
const saveArmyName = "Establecer nombre";
const selectText = "--Selecciona--";
const deleteUnit = "Eliminar unidad";
const noUnit = "No hay unidades para eliminar";
const armyContentText = "El batallón contiene: ";
const saveArmyInfo = 'Para guardar los cambios deberá darle al botón de Guardar batallones';
const armyListText = "Batallones del jugador: ";
const unitListText = UNITS_ESP;
const nameUserText = "Nombre: ";

export class Profile extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: playerText,
            gameswon: 0,
            gameslost: 0,
            name: armyText,
            googleId: this.props.parentObject.state.clientId,
            avatar: this.props.parentObject.state.clientAvatar,
            units: new Array<Army>()
        };
        let getprofile: {
            googleId: number
        } = {
            // Incluimos el id del usuario de Google
            googleId: this.props.parentObject.state.clientId
        };
        var prof = this;
        Network.receiveProfileFromServer(getprofile,(statusCode: { status: boolean, error: string, name: string, gamesWon: number, gamesLost: number }) => {
            // Vemos cómo ha salido la operación
            if(!statusCode.status) {
                // Si ha salido mal, alertamos al usuario
                console.log("No se ha podido obtener correctamente el perfil");
            } else {
                this.setState({
                    username: statusCode.name,
                    gameswon: statusCode.gamesWon,
                    gameslost: statusCode.gamesLost,
                    name: armyText,
                    googleId: this.props.parentObject.state.clientId
                });

                prof.getUserIdFromServer((error: { status: boolean, errorCode: string, userId: number })=>{
                    prof.getArmyIdFromServer(error, (errorarmy: { status: boolean, errorCode: string, armyId: number[], armyName: string[] }) =>{
                        //this.setState({names: errorarmy.armyName});
                        for(var i=0; i<errorarmy.armyId.length; i++){
                            let arm = null;
                            let unit = prof.state.units;
                            prof.getUnitsFromServer(errorarmy.armyId[i], errorarmy.armyName, errorarmy.armyId,(errorunits: { status: boolean, errorCode: string, units: Array<{type: string, number: number}>, name: string[], armies: number[], army: number }) =>{
                                for(var j=0; j<errorunits.name.length; j++){
                                    //Se hace esto porque tiene problemas a la hora de trabajar con un for exterior a la llamada al servidor asi que trabajamos desde dentro del callback con otro for
                                    if(errorunits.army==errorunits.armies[j]){
                                        arm = new Army(errorunits.units,errorunits.name[j]);
                                        unit.push(arm);
                                        this.setState({units: unit});
                                    }
                                }
                            });
                        }
                        saveState(ProfileActions.save(prof, this.state.units, storeProfile.getState().selectedArmy, storeProfile.getState().selected, storeProfile.getState().type));
                        this.forceUpdate();
                    });
                });
            }
        });
    }

    getUnitsFromServer(army: number, name: string[], armies: number[]
        , callback?: (error: { status: boolean, errorCode: string, units: Array<{type: string, number: number}>, name: string[], armies: number[], army: number }) => void) {
        // Primero, establecemos la conexión con el servidor
        let game = this;
        let connection = Network.getConnection();
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
            } else {
                let data = JSON.parse(event.data);
                callback({status: data.status, errorCode: data.error, units: data.units, name: name, armies: armies, army: data.armyId});
            }
        };
        // Al abrirse la conexión, informamos al servidor del mapa
        connection.send(JSON.stringify({
            tipo: "getUnitsMenu",
            armyclient: army
        }));
    }

    getUserIdFromServer(callback?: (error: { status: boolean, errorCode: string, userId: number }) => void) {
        // Primero, establecemos la conexión con el servidor
        let connection = Network.getConnection();
        let armyprofileclient: {
            googleId: number
        } = {
            // Incluimos el id del usuario de Google
            googleId: this.props.parentObject.state.clientId
        };
        Network.receiveProfileIdFromServer(armyprofileclient,(statusCode: { status: boolean, error: string, id: number }) => {
            if(!statusCode.status) {
                // Si ha salido mal, alertamos al usuario
                console.log("No se ha podido obtener correctamente el perfil");
            } else {
                callback({status: statusCode.status, errorCode: statusCode.error, userId: statusCode.id});
            }
        });
    }

    getArmyIdFromServer(errorCode: { status: boolean, errorCode: string, userId: number }, callback?: (error: { status: boolean, errorCode: string, armyId: number[], armyName: string[] }) => void) {
        // Primero, establecemos la conexión con el servidor
        let connection = Network.getConnection();
        let armyclient: {
            userId: number
        } = {
            // Incluimos el id del usuario de Google
            userId: errorCode.userId
        };
        connection.onmessage = function(event: MessageEvent) {
            // Generalmente, no esperaremos una respuesta, por lo que simplemente aseguramos que
            // el comando se haya entendido
            if(event.data == "Command not understood") {
                // Lanzamos un error
                console.log("Error when attempting to save, server didn't understood request");
                //No es necesario llamar al callback porque este ya es el nivel final (cliente)
            } else {
                let data = JSON.parse(event.data);
                callback({status: errorCode.status, errorCode: errorCode.errorCode, armyId: data.armyId, armyName: data.armyName});
            }
        };
        // Al abrirse la conexión, informamos al servidor del mapa
        connection.send(JSON.stringify({
            tipo: "getArmyId",
            armyclient: armyclient
        }));
    }

    // Este método cambiará el título
    updateInput(title: string) {
        if (title.trim() == "") {
            // Si nos viene el (objeto), indicamos el batallón seleccionado
            this.setState({ name: newArmyText + storeProfile.getState().selectedArmy });
        } else {
            // En otro caso, mostraremos el elemento de entrada
            this.setState({ name: title });
        }
    }

    //Se crean los options segun la lista de unidades disponibles (empieza en 1 para no contar general)
    selectOptionsUnits() {
        let army = [<option selected value={null}>{selectText}</option>];
        for (var i = 1; i < UNITS.length; i++) {
            army.push(<option value={UNITS[i]}>{unitListText[i]}</option>);
        }
        return army;
    }

    selectOptionsUnitsDelete() {
        let army = [<option selected value={null}>{selectText}</option>];
        for(var i = 1; i < UNITS.length; i++) {
            if(storeProfile.getState().armies[storeProfile.getState().selectedArmy].unitList.some(x => x.type == UNITS[i] && x.number > 0)) {
                army.push(<option value={UNITS[i]}>{unitListText[i]}</option>);
            }
        }
        return army;
    }

    /// Este listener se encarga de añadir a los ejércitos unidades
    onClickAddUnit(event: React.MouseEvent<HTMLElement>) {
        let army: Army;
        // Comprobamos si la lista de ejércitos coinciden con el ejército seleccionado
        if (storeProfile.getState().armies.length == storeProfile.getState().selectedArmy) {
            // Si el índice es igual, se estará creando el ejército
            // Definimos el ejército por defecto
            army = new Army([{ type: "General", number: 1 }],
                // Si el nombre no está definido, ponemos uno por defecto
                this.state.name == null ? newArmyText + storeProfile.getState().selectedArmy :
                    // Si ya nos viene, le ponemos el que tengamos
                    this.state.name);
            // Si tenemos un ejército seleccionado
            if (storeProfile.getState().selected != null) {
                army.unitList.push({ type: storeProfile.getState().selected, number: 1 });
            }
            storeProfile.getState().armies.push(army);
        } else {
            // En otro caso, tenemos ya uno seleccionado
            army = storeProfile.getState().armies[storeProfile.getState().selectedArmy];
            // Si tenemos un ejército seleccionado
            if (storeProfile.getState().selected != null) {
                // Primero, comprobamos que exista el par tipo y número de unidades
                let pairTypeNumberOfSelected = army.unitList.find(unitType => unitType.type == storeProfile.getState().selected);
                // Comprobamos si el par existe
                if(pairTypeNumberOfSelected) {
                    // En el caso de que exista, cambiaremos el valor del número en el índice del seleccionado
                    army.unitList[army.unitList.indexOf(pairTypeNumberOfSelected)].number = pairTypeNumberOfSelected.number + 1;
                } else {
                    // En otro caso, estamos iniciando el par tipo y número
                    army.unitList.push({ type: storeProfile.getState().selected, number: 1});
                }
            }
            // Si estamos en la fase 1 o edición de nombre del ejército
            if (storeProfile.getState().type == "1" || storeProfile.getState().type == "3") {
                // Entonces cambiamos el nombre del ejército
                army.name =
                    // Si el nombre no está definido, le asignamos uno por defecto
                    this.state.name == null ? newArmyText + storeProfile.getState().selectedArmy :
                        // Si lo tenemos, ponemos el que está definido
                        this.state.name;
            }
            // Finalmente ponemos el ejército, TODO de nuevo no es esta la forma de hacerlo
            storeProfile.getState().armies[storeProfile.getState().selectedArmy] = army;
        }
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, storeProfile.getState().selected, storeProfile.getState().type));
    }

    /// Este listener se encargará de cambiar a la edición del batallón
    onClickAddEdit(event: React.MouseEvent<HTMLElement>) {
        // Si está definido el nombre
        if (this.state.name != null &&
            // El tipo es 1 o edición de nombre del ejército
            (storeProfile.getState().type == "1" ||
                storeProfile.getState().type == "3") &&
            // Y se dispone de un ejercito seleccionado
            storeProfile.getState().selectedArmy != null
        ) {
            // Actualizamos el menú realizando un setState
            this.setState({ name: null });
        }
        // Actualizamos el estado general para cambiar a la fase TODO 4 ???
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, null, "4"));
    }

    /// Este método se encargará
    onClickDeleteEdit(event: React.MouseEvent<HTMLElement>) {
        // Si no tenemos un nombre, es decir estamos modificando un batallón
        if (this.state.name != null &&
            // Si estamos en la fase 1 o edición de nombre del ejército
            (storeProfile.getState().type == "1" ||
                storeProfile.getState().type == "3") &&
            // Y tenemos un ejército seleccionado
            storeProfile.getState().selectedArmy != null
        ) {
            // Actualizamos el menú
            this.setState({ name: null });
        }
        // Actualizamos el estado a la fase TODO 5 ???
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, null, "5"));
    }

    /// Esta función representará las opciones del los ejércitos
    renderSelectOptionsArmy() {
        // Primero, ponemos la opción por defecto
        let armies = [<option selected value={null}>{selectText}</option>];
        for (var i = 0; i < storeProfile.getState().armies.length; i++) {
            // y introducimos cada posible ejército
            armies.push(<option value={i}>{storeProfile.getState().armies[i].name}</option>);
        }
        return armies;
    }

    /// Esta función se encargará de mostrar el contenido de un ejército,
    /// siendo en este caso las unidades que lo contienen
    renderArmyContent(armyIndex: number) {
        // 'result' contendrá el conjunto de elementos HTML que se representará
        let result = [];
        // Y estos contadores tendrán el número de unidades del correspondiente tipo
        let armyNumbers = [];
        //Es necesario hacer este bucle porque sino no se puede incializar a 0 el array
        for (var j = 0; j < UNITS.length; j++) {
            armyNumbers.push(0);
        }
        let index = (
            // Si el índice introducido es null
            armyIndex == null ?
                // Entonces obtenemos el del estado general
                storeProfile.getState().selectedArmy :
                // En caso contrario, usamos el que nos da de argumento
                armyIndex);
        // Iteramos por cada tipo de unidad del ejército
        for(let indexArmy = 0; indexArmy < storeProfile.getState().armies[index].unitList.length; indexArmy++) {
            // Obtenemos el par tipo y número
            let unitTypePair = storeProfile.getState().armies[index].unitList[indexArmy];
            // Obtenemos el índice del tipo de la unidad
            let typeIndex = UNITS.findIndex(type => type == unitTypePair.type);
            // E asignaremos al valor del número de unidades del tipo el valor del par
            armyNumbers[typeIndex] = unitTypePair.number;
        }
        // Finalmente, añadiremos a los componentes el número de unidades
        for(let indexNumbers = 0; indexNumbers < armyNumbers.length; indexNumbers++) {
            result.push(<p>{unitListText[indexNumbers]}: {armyNumbers[indexNumbers]}</p>);
        }
        return result;
    }


    /// Esta función se encargará de renderizar una lista de los ejércitos del usuario
    renderArmyList() {
        // Esta variable contendrá los elementso HTML a representar
        let armies = [];
        // Iteramos por cada ejército
        for (var index = 0; index < storeProfile.getState().armies.length; index++) {
            armies.push(<div id="bold">{storeProfile.getState().armies[index].name}</div>);
            // Por cada ejército mostraremos también las unidades que lo contienen
            var unitLists = this.renderArmyContent(index)
            // Y los introducimos a la lista
            for (var j = 0; j < unitLists.length; j++) {
                armies.push(unitLists[j]);
            }
        }
        return armies;
    }

    /// Esta función se encarga de seleccionar la unidad
    selectUnit(unitType: string) {
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, unitType, storeProfile.getState().type));
    }

    /// Esta función seleccionará el ejército con el índice introducido para cambiarle el nombre
    selectArmy(armyIndex: string) {
        // Comprobamos que no tengamos el nombre
        if (this.state.name != null) {
            // Asignamos el valor del ejército, para ser modificado
            this.setState({ name: storeProfile.getState().armies[parseInt(armyIndex)].name });
        }
        // Actualizamos el estado a fase edición de nombre del ejército
        saveState(ProfileActions.save(this, storeProfile.getState().armies, parseInt(armyIndex), null, "3"));
    }

    /// Este listener se encargará de tramitar la eliminación de la unidad
    onClickDeleteUnit(event: React.MouseEvent<HTMLElement>) {
        // Primero, obtenemos el ejército seleccionado
        let army = storeProfile.getState().armies[storeProfile.getState().selectedArmy];
        // Obtenemos el índice del ejército, que lo sobrescribiremos
        let armyUnits = army.unitList;
        // Obtenemos el tipo de la unidad
        let deletedUnitType = storeProfile.getState().selected;
        // Iteramos el array
        armyUnits
            // Primero, filtramos los pares por el que tenga el tipo correspondiente
            .filter(pair => pair.type == deletedUnitType)
            // Después, cambiamos el número del par, decrementando en uno
            .forEach(pair => pair.number = pair.number - 1);
        // Asignamos el nuevo ejército al seleccionado
        army.unitList = armyUnits
            // En el caso de que alguno de los valores sea negativo, quitaremos de la lista el elemento
            .filter(pair => pair.number > 0);
        // Actualizamos el estado
        storeProfile.getState().armies[storeProfile.getState().selectedArmy] = army;
        // Y finalmente llamamos a la actualización del estado
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, storeProfile.getState().selected, storeProfile.getState().type));
    }

    /// Este listener se encargará de eliminar un ejército
    onClickDeleteArmy(event: React.MouseEvent<HTMLElement>) {
        // Obtenemos la lista de ejércitos
        let armies = storeProfile.getState().armies;
        // Obtenemos el ejército a eliminar
        let army = armies[storeProfile.getState().selectedArmy];
        // Filtramos el ejército de la lista
        armies = armies.filter(armyList => armyList.name != army.name);
        // Finalmente guardamos el conjunto de ejércitos
        saveState(ProfileActions.save(this, armies, null, null, "2"));
    }

    /// Este listener se encarga de añadir a los ejércitos unidades
    onClickSetName(event: React.MouseEvent<HTMLElement>) {
        let army: Army;
        // Comprobamos si la lista de ejércitos coinciden con el ejército seleccionado
        if (storeProfile.getState().armies.length == storeProfile.getState().selectedArmy) {
            // Si el índice es igual, se estará creando el ejército
            // Definimos el ejército por defecto
            army = new Army([{ type: "General", number: 1 }],
                // Si el nombre no está definido, ponemos uno por defecto
                this.state.name == null ? newArmyText + storeProfile.getState().selectedArmy :
                    // Si ya nos viene, le ponemos el que tengamos
                    this.state.name);
            storeProfile.getState().armies.push(army);
        } else {
            // En otro caso, tenemos ya uno seleccionado
            army = storeProfile.getState().armies[storeProfile.getState().selectedArmy];
            // Si estamos en la fase 1 o edición de nombre del ejército
            if (storeProfile.getState().type == "1" || storeProfile.getState().type == "3") {
                // Entonces cambiamos el nombre del ejército
                army.name =
                    // Si el nombre no está definido, le asignamos uno por defecto
                    this.state.name == null ? newArmyText + storeProfile.getState().selectedArmy :
                        // Si lo tenemos, ponemos el que está definido
                        this.state.name;
            }
            // Finalmente ponemos el ejército
            storeProfile.getState().armies[storeProfile.getState().selectedArmy] = army;
        }
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, storeProfile.getState().selected, storeProfile.getState().type));
    }

    /// Esta función se encargará de tramitar la creación de ejércitos
    onClickCreateArmy(event: React.MouseEvent<HTMLElement>) {
        // Si no se ha introducido un nombre del ejército
        if (this.state.name != null &&
            // Y la fase es la 1 o edición de nombre del ejército
            (storeProfile.getState().type == "1" ||
                storeProfile.getState().type == "3") &&
            // Y se ha seleccionado un ejército
            storeProfile.getState().selectedArmy != null
        ) {
            // Entonces cambiamos el estado del componente, renderizando de nuevo
            this.setState({ name: null })
        }
        // Finalmente, actualizamos la fase del estado
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().armies.length, "General", "1"));
    }

    /// Este listener se encargará de activar la edición de ejércitos
    onClickEditArmy(event: React.MouseEvent<HTMLElement>) {
        // Si el nombre no está asignado
        if(this.state.name != null &&
            // Y el estado es 1 o edición de nombre del ejército
            (storeProfile.getState().type == "1" || storeProfile.getState().type == "3") &&
            // Ý se dispone de un ejército
            storeProfile.getState().selectedArmy != null
        ) {
            // Refrescamos la vista
            this.setState({ name: null })
        }
        // Y actualizamos el estado para pasar a la fase 2
        saveState(ProfileActions.save(this, storeProfile.getState().armies, null, null, "2"));
    }

    /// Este listener se encargará de cambiar el nombre del ejército
    onClickEditArmyName(event: React.MouseEvent<HTMLElement>) {
        // El nombre no está asignado
        if(this.state.name != null &&
            // La fase es 1 o edición de nombre del ejército
            (storeProfile.getState().type == "1" || storeProfile.getState().type == "3") &&
            // Y se tiene un ejército seleccionado
            storeProfile.getState().selectedArmy != null
        ) {
            // Actualizamos el estado y refrescamos la vista
            this.setState({ name: null });
        }
        // Guardamos el estado para pasar a la fase 3 (edición del nombre del ejército)
        saveState(ProfileActions.save(this, storeProfile.getState().armies, storeProfile.getState().selectedArmy, null, "3"));
    }

    /// Este listener se encargará de listar las unidades del ejército?
    onClickList(event: React.MouseEvent<HTMLElement>) {
        // El nombre está asignado
        if(this.state.name != null &&
            // La fase es 1 o edición del nombre del ejército
            (storeProfile.getState().type == "1" || storeProfile.getState().type == "3") &&
            // Y se tiene un ejército seleccionado
            storeProfile.getState().selectedArmy != null
        ) {
            // Entonces refrescamos el estado
            this.setState({ name: null })
        }
        // Y cambiamos la fase a 0?
        saveState(ProfileActions.save(this, storeProfile.getState().armies, null, null, "0"));
    }

    /// Este listener se encargará de salir del menú de perfil
    onClickExitMenu(event: React.MouseEvent<HTMLElement>) {
        // El nombre está asignado
        if(this.state.name != null &&
            // La fase es 1 o edición de nombre del ejército
            (storeProfile.getState().type == "1" || storeProfile.getState().type == "3") &&
            // Hay un ejército seleccionado
            storeProfile.getState().selectedArmy != null
        ) {
            // Entonces, actualizamos el estado y refrescamos la vista
            this.setState({ name: null })
        }
        // Guardamos el estado, para que tenga en cuenta la fase inicial por si el usuario vuelve a entrar
        saveState(ProfileActions.save(this, storeProfile.getState().armies, null, null, "0"));
        // Y avisamos al juego de que el usuario ha salido del menú de perfil
        this.props.parentObject.changeGameState(0);
    }

    updateUserName(title: string) {
        if (title.trim() == "") {
            // Si nos viene el (objeto), indicamos el batallón seleccionado
            this.setState({ username: playerText});
        } else {
            // En otro caso, mostraremos el elemento de entrada
            this.setState({ username: title });
        }
    }

    // Este método se encargará de guardar el perfil en la BD
    onClickSaveProfileName() {
        // Primero, obtenemos el perfil en su totalidad
        let profile: {
            name: string,
            googleId: number
        } = {
            name: this.state.username,
            googleId: this.props.parentObject.state.clientId
        };
        // Una vez tengamos el perfil convertido, procedemos a guardarlo
        Network.saveProfileNameToServer(profile, (statusCode: { status: boolean, error: string }) => {
            // Vemos cómo ha salido la operación
            if(!statusCode.status) {
                // Si ha salido mal, alertamos al usuario
                window.alert(saveAlert2);
            } else {
                // En caso contrario, indicamos el guardado correcto
                window.alert(saveAlert1);
                let getprofile: {
                    googleId: number
                } = {
                    // Incluimos el id del usuario de Google
                    googleId: profile.googleId
                };
                Network.receiveProfileFromServer(getprofile,(status: { status: boolean, error: string, name: string, gamesWon: number, gamesLost: number }) => {
                    // Vemos cómo ha salido la operación
                    if(!status.status) {
                        // Si ha salido mal, alertamos al usuario
                        console.log("No se ha podido obtener correctamente el perfil");
                    } else {
                        this.setState({
                            username: status.name,
                            gameswon: status.gamesWon,
                            gameslost: status.gamesLost,
                            name: armyText,
                            googleId: getprofile.googleId
                        });
                    }
                });
            }
        })
        this.forceUpdate();
    }

    // Este método se encargará de guardar el perfil en la BD
    onClickSaveProfile() {
        // Primero, obtenemos el perfil en su totalidad
        let profile: {
            armies: Array<{ id: number, name: string, pair: Array<{ type: string, number: number }> }>,
            googleId: number
        } = {
            armies: storeProfile.getState().armies // Iteramos por los ejércitos
                .map(army => { // Lo convertiremos en un map que almacena los datos
                    return {
                        id: 0, // Los ids de los ejércitos serán 0, al estar creandose
                        name: army.name,
                        pair: army.unitList
                    };
                }),
            // Incluimos el id del usuario de Google
            googleId: this.props.parentObject.state.clientId
        };
        // Una vez tengamos el perfil convertido, procedemos a guardarlo
        Network.saveProfileToServer(profile, (error: { status: boolean, error: string }) => {
            // Vemos cómo ha salido la operación
            if(!error.status) {
                // Si ha salido mal, alertamos al usuario
                window.alert(saveAlert2);
            } else {
                // En caso contrario, indicamos el guardado correcto
                window.alert(saveAlert1);
                let getprofile: {
                    googleId: number
                } = {
                    // Incluimos el id del usuario de Google
                    googleId: profile.googleId
                };
                Network.receiveProfileFromServer(getprofile,(status: { status: boolean, error: string, name: string, gamesWon: number, gamesLost: number }) => {
                    // Vemos cómo ha salido la operación
                    if(!status.status) {
                        // Si ha salido mal, alertamos al usuario
                        console.log("No se ha podido obtener correctamente el perfil");
                    } else {
                        this.setState({
                            username: status.name,
                            gameswon: status.gamesWon,
                            gameslost: status.gamesLost,
                            name: armyText,
                            googleId: getprofile.googleId
                        });
                    }
                });
            }
        })
        this.forceUpdate();
    }

    render() {
        return (
            <div className="jumbotron text-center">
                <h2> {personalProfileText} <button className="btn btn-primary btn-sm" id="exitButton" name="exitButton" onClick={this.onClickExitMenu.bind(this)}>{backText}</button></h2>
                <img className="avatar" src={this.state.avatar} />
                <p>{nameUserText+this.state.username}</p>
                <label id="bold">{editNameText} <input className="form-control" type="text" value={this.state.username} onChange={evt => this.updateUserName(evt.target.value)} /></label>
                <button id="saveProfile" name="saveProfile" className="btn btn-primary btn-sm" onClick={this.onClickSaveProfileName.bind(this)}>{editNameButton}</button>
                <p>{winText+this.state.gameswon}</p>
                <p>{loseText+this.state.gameslost}</p>
                {storeProfile.getState().type != "0" ? <button id="listArmy" name="listArmy" className="btn btn-primary btn-sm" onClick={this.onClickList.bind(this)}>{showArmy}</button> : ""}
                {storeProfile.getState().type != "1" ? <button id="createArmy" name="createArmy" className="btn btn-primary btn-sm" onClick={this.onClickCreateArmy.bind(this)}>{createArmyTitle}</button> : ""}
                {storeProfile.getState().type != "2" ? <button id="editArmy" name="editArmy" className="btn btn-primary btn-sm" onClick={this.onClickEditArmy.bind(this)}>{editArmyTitle}</button> : ""}
                <button id="saveProfile" name="saveProfile" className="btn btn-primary btn-sm" onClick={this.onClickSaveProfile.bind(this)}>{saveArmy}</button>
                {storeProfile.getState().type >= "2" && storeProfile.getState().armies.length > 0 ? <div>
                    <div className="alert alert-info" id="error">{saveInfo}</div>
                    <h4> {editArmy} </h4>
                    <label> <p>{selectArmy}</p>
                        <select className="form-control" defaultValue={null} value={storeProfile.getState().selectedArmy} onChange={evt => this.selectArmy(evt.target.value)}>
                            {this.renderSelectOptionsArmy()}
                        </select>
                    </label>
                    {storeProfile.getState().type > "2" && storeProfile.getState().type != "3" ? <button id="editName" name="editName" className="btn btn-primary btn-sm" onClick={this.onClickEditArmyName.bind(this)}>{editNameArmy}</button> : ""}
                    {storeProfile.getState().type > "2" && storeProfile.getState().type != "4" ? <button id="addUnit" name="addUnit" className="btn btn-primary btn-sm" onClick={this.onClickAddEdit.bind(this)}>{addUnit}</button> : ""}
                    {storeProfile.getState().type > "2" && storeProfile.getState().type != "5" ? <button id="deleteUnit" name="deleteUnit" className="btn btn-primary btn-sm" onClick={this.onClickDeleteEdit.bind(this)}>{deleteUnitTitle}</button> : ""}
                    {storeProfile.getState().type > "2" && storeProfile.getState().selectedArmy != null ? <button id="deleteArmy" name="deleteArmy" className="btn btn-primary btn-sm" onClick={this.onClickDeleteArmy.bind(this)}>{deleteArmy}</button> : ""}
                </div> : storeProfile.getState().type >= "2" && storeProfile.getState().armies.length == 0 ? <div className="alert alert-warning" id="error">{noArmies}</div> : ""}
                {storeProfile.getState().type == "1" || storeProfile.getState().type == "4" ? <div>
                    <div className="alert alert-info" id="error">{saveInfo}</div>
                    <h4> {createArmy} </h4>
                    <label> {selectUnitText}
                        <select className="form-control" defaultValue={null} value={storeProfile.getState().selected} onChange={evt => this.selectUnit(evt.target.value)}>
                            {this.selectOptionsUnits()}
                        </select>
                    </label>
                    {storeProfile.getState().selected != null ? <button id="addUnit" name="addUnit" className="btn btn-primary btn-sm" onClick={this.onClickAddUnit.bind(this)}>{addOtherUnit}</button> : ""}
                </div> : ""}
                {(storeProfile.getState().type == "1" || storeProfile.getState().type == "3") && storeProfile.getState().selectedArmy != null ? <div>
                     <label> {armyNameText} <input className="form-control" type="text" value={this.state.name} onChange={evt => this.updateInput(evt.target.value)} /> </label>
                    <button id="setName" name="setName" className="btn btn-primary btn-sm" onClick={this.onClickSetName.bind(this)}>{saveArmyName}</button>
                </div> : ""}
                {storeProfile.getState().type == "5" && storeProfile.getState().armies[storeProfile.getState().selectedArmy].unitList.length > 1 ? <div>
                    <label> {selectUnitText}
                        <select className="form-control" defaultValue={null} value={storeProfile.getState().selected} onChange={evt => this.selectUnit(evt.target.value)}>
                            <option selected value={null}>{selectText}</option>
                            {this.selectOptionsUnitsDelete()}
                        </select>
                    </label>
                    {storeProfile.getState().selected != null ? <button id="deleteUnit" name="deleteUnit" className="btn btn-primary btn-sm" onClick={this.onClickDeleteUnit.bind(this)}>{deleteUnit}</button> : ""}
                </div> : storeProfile.getState().type == "5" && storeProfile.getState().armies[storeProfile.getState().selectedArmy].unitList.length <= 1 ? <div className="alert alert-warning" id="error">{noUnit}</div> : ""}
                {storeProfile.getState().selectedArmy != null && storeProfile.getState().armies.length > storeProfile.getState().selectedArmy ? <div>
                    <p>{armyContentText}</p>
                    <div>
                        {this.renderArmyContent(null)}
                    </div>
                </div> : ""}
                {storeProfile.getState().type == "0" ? <div>
                    <div className="alert alert-info" id="error">{saveArmyInfo}</div>
                    <h4> {armyListText} </h4>
                    <div>
                        {this.renderArmyList()}
                    </div>
                </div> : ""}
            </div>
        );
    }
}
