/**
 * Created by Ivan on 07/03/2018.
 */

var DATA = {

    usuario: '',
    establecimiento: '',
    fecha: '',
    procendencia: [],
    demanda: [],
    descendientes: [],
    cobertura: [],
    consulta: [],
    genero: [],
    etareo: [],
    atencion: [],
    motivos: [],
    actividades: []
};

var tematicas =
    [
        {
            text: 'Enfermedades transmisibles',
            id: 0,
            selected: false
        },
        {
            text: 'Enfermedades No transmisibles',
            id: 1,
            selected: false
        },
        {
            text: 'Salud Mental-Suicidio',
            id: 2,
            selected: false
        },
        {
            text: 'Salud Mental-Adicciones',
            id: 3,
            selected: false
        },
        {
            text: 'Salud Sexual y Procreación Responsable',
            id: 4,
            selected: false
        },
        {
            text: 'Discapacidad',
            id: 5,
            selected: false
        },
        {
            text: 'Violencia',
            id: 6,
            selected: false
        },
        {
            text: 'Organización del Servicio Social',
            id: 7,
            selected: false
        },
        {
            text: 'otros',
            id: 8,
            selected: false
        }
    ];

const tipoDeTematica =
    [
        {
            text: 'Reunión zonal',
            id: 0
        },
        {
            text: 'Reunión de refertentes zonales',
            id: 1
        },
        {
            text: 'Reunión con equipo de salud',
            id: 2
        },
        {
            text: 'Coordinación con actores comunitarios/instituciones',
            id: 3
        },
        {
            text: 'Difusión de actividad',
            id: 4
        },
        {
            text: 'Taller',
            id: 5
        },
        {
            text: 'Charla/Exposición',
            id: 6
        },
        {
            text: 'Supervisión',
            id: 7
        },
        {
            text: 'Tutoría',
            id: 8
        },
        {
            text: 'Ateneo',
            id: 9
        },
        {
            text: 'Participación en jornada/curso/congreso',
            id: 10
        },
        {
            text: 'Actividad relacionada con investigación',
            id: 11
        },
        {
            text: 'Otras',
            id: 12
        }
    ];

const programas =
    [
        {
            text: 'PEC',
            id: 0
        },
        {
            text: 'PRO.SA.DIA',
            id: 1
        },
        {
            text: 'PMCS',
            id: 2
        },
        {
            text: 'PRO.SAN.E',
            id: 3
        },
        {
            text: 'SS y PR',
            id: 4
        },
        {
            text: 'CAC',
            id: 5
        },
        {
            text: 'CELIAQUÍA',
            id: 6
        },
        {
            text: 'BAJO PESO',
            id: 7
        },
        {
            text: 'PESO SALUDABLE',
            id: 8
        },
        {
            text: 'TBC',
            id: 9
        },
        {
            text: 'ITS',
            id: 10
        },
        {
            text: '1000 DIAS',
            id: 11
        },
        {
            text: 'OTROS',
            id: 12
        },
        {
            text: 'NINGUNO',
            id: 13
        }
    ];

var prestacionesID = 0;

//var actividadesID = 0;

var flagPatologia = false;

$(function(){

    $("input[type='number']").click(function () {
        $(this).select();
    });

    /*Procendencias*/
    sumaDeInputs($("#procedencia :input"),$("#totalProcedencia"));
    /*Orígenes*/
    sumaDeInputs($("#demanda :input"), $("#totalOrigen"));
    /*Descendientes de pueblos originarios*/
    sumaDeInputs($("#descendientes :input"), $("#totalDescendientes"));
    /*Cobertura de salud*/
    sumaDeInputs($("#cobertura :input"),$("#totalCobertura"));
    /*Tipos de consulta*/
    sumaDeInputs($("#consulta :input"), $("#totalConsulta"));
    /*Género*/
    sumaDeInputs($("#genero :input"), $("#totalGenero"));
    /*Grupos etáreos*/
    sumaDeInputs($("#etareo :input"), $("#totalEtareo"));
    /*Modalidad de atención*/
    sumaDeInputs($("#atencion :input"),$("#totalAtencion"));
    /*Prácticas sociales*/
    sumaDeInputs($("#practicas :input"),$("#totalPracticas"));

    //evento del botón de guardado
    $("#guardar").click(function(){

        var referencia = $("#totalProcedencia").val();
        var errorFlag = false;
        var message = [];

        if(referencia == 0){

            errorFlag = true;
        }

        $(".inputs-suma").each(function(index,element){

            if(element.value != referencia) {
                errorFlag = true;
            }
        });

        var cantidadDeMotivos =0;

        for(var index in DATA.motivos){

            cantidadDeMotivos += parseInt( DATA.motivos[index].cantidad );
        }

        //console.log(cantidadDeMotivos);

        if(cantidadDeMotivos < referencia){
            errorFlag = true;
            message.push("motivos");
        }

        if(errorFlag) message.push("totales");

        if(typeof($(".selectCS").select2('data')[0]) === 'undefined')
            message.push("cs");


        if($("#date").datepicker('getDate') === null)
            message.push("fecha");

        if(message.length != 0){

            showComparacion(message);
        }else{
            saveData();
        }
    });

    //evento del botón de cerrar sesión
    $("#salir").click(function(){

        var htmlString =
            '<input class="form-control" type="text" placeholder="usuario">' +
            '<br>' +
            '<input class="form-control" type="password" placeholder="contraseña">';

        $("#modalTitle").text("Ingrese su usuario y contraseña");
        $("#modalBody")
            .empty()
            .append(htmlString);
        $("#modal").modal("show");
        $("#cerrar").hide();
        $("#aceptar").show();
    });

    //configuración de datepicker
    $('#date')
        .datepicker({
            format: "mm/yyyy",
            startView: "months",
            minViewMode: "months",
            keyboardNavigation: false,
            autoclose: true
        })
        .on('changeMonth', function(data){
            setFecha(data);
        });

    //selector de zona (no necesario)
    $(".select2zona").select2({
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    //selector de departamento (no necesario)
    $(".selectDepartamento").select2({
        width: '100%',
        placeholder: "Busque su departamento",
        ajax: {
            url: 'getdepto',
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q: params.term
                };
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.Nombre,
                            id: item.id
                        }
                    })
                };
            }
        }
    });

    //selector de establecimiento
    $('.selectCS').select2({
        width: '100%',
        placeholder: "Busque su centro de salud",
        ajax: {
            url: 'getcs',
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q: params.term
                };
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.Nombre,
                            id: item.id
                        }
                    })
                };
            }
        }
    });

    //boton que levanta el modal para agregar un nuevo motivo
    $("#agregar").click(function(){

        agregarMotivo();
    });

    //boton que levanta el modal para completar una actividad a guardar
    $("#agregarActividades").click(function(){

        agregarActividad();
    });

    //boton del modal que guarda los datos de motivos
    $("#agregarMotivo")
        .on('click',function(){

            var mensajes = [];

            $('.selectMotivoS').each(function(index,element){
                $(element)
                    .find($('option:selected'))
                    .each(function(index2,element2){
                        if(!$(element2).val()) mensajes = "Debe elegir algún código de aspecto social";
                    });
            });

            if(!$(".selectMotivoP").prop('disabled')){

                if($(".selectMotivoP").val() === null){
                    mensajes.push("Debe elegir un motivo o marcar la casilla Sin patología.");
                }
            }

            var flagAspectoSocial = false;
            var aspectoSocial = $(".selectMotivoS").select2('data');

            for(var index in aspectoSocial){
                if(typeof(aspectoSocial[index]) !== 'undefined'){

                    flagAspectoSocial = true;
                }
            }

            if(!aspectoSocial){
                mensajes.push("Debe buscar al menos un aspecto psicosocial");
            }



            if($("#cantidadMotivo").val() < 1){
                mensajes.push("Debe ingresar una cantidad válida y distinta de cero");
            }

            if(flagPatologia === true && $("#sinPatologia").prop('checked') === true){
                mensajes.push("Ya agregó el motivo \"Sin patología\".");
            }

            if(mensajes.length > 0){

                var mensaje = "";

                for(var index in mensajes){

                    mensaje += mensajes[index] + "\n";
                }

                alert(mensaje);

                event.stopPropagation();
            }else{

                appendRow($(".selectMotivoP"),$(".selectMotivoS"));
            }
        })
        .show();

    /*
    //agrega la fila de actividad a la lista
    $("#agregarActividad")
        .on('click',function(){
            appendActividad();
        });

    */
});

//funcion para agregar y guardar una actividad completada
function appendActividad(tematicaid) {

    tematicas[tematicaid].selected = true;

    var htmlString =

        '<table class="table table-bordered table-sm table-responsive-sm table-responsive-md table-responsive-lg">' +
        '<tbody>' +
        '<tr>' +
        '   <th>' + tematicas[tematicaid].text + '</th>' +
        '   <th colspan="5"><select class="selectCIE10"> </th>' +
        '</tr>' +
        '<tr>' +
        '   <td>Reunión zonal</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Reunión de ref. zonales</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Reunión con equipos de salud</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '</tr>' +
        '   <tr>' +
        '   <td>Coord. actores comu./inst.</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Difusión de actividad</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '<td>Taller</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '</tr>' +
        '<tr>' +
        '   <td>Charla/Exposición</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Supervisión</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Tutoría</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '</tr>' +
        '<tr>' +
        '   <td>Ateneo</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Part. jorn/conc/cong</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td>Act. relacionada con invest.</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '</tr>' +
        '<tr>' +
        '   <td>Otras</td>' +
        '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   <td></td>' +
        '   <td></td>' +
        '   <td></td>' +
        '   <td></td>' +
        '</tr>' +
        '<tr>' +
        '   <td colspan="6"><select class="selectprogramas"></td>' +
        '</tr>' +
        '<tr>' +
        '   <td colspan="6"><button class="quitaractividad btn btn-block btn-danger" data-id="' + tematicaid + '">Quitar actividad: "' + tematicas[tematicaid].text + '" </button></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

    $("#actividades").append(htmlString);

    $(".quitaractividad").click(function () {

        for (var index in tematicas) {

            if (tematicas[index].id == $(this).data('id')) {

                tematicas[index].selected = false;
            }
        }

        updateActividades();
    });

    $("input[type='number']").click(function () {
        $(this).select();
    });

    $(".selectprogramas").select2({
        multiple: true,
        width: '100%',
        data: programas,
        placeholder: 'Elija los programas afectados'
    });

    $(".selectCIE10").select2({
        width: '100%',
        multiple: true,
        placeholder: "Busque motivo de intervención",
        //dropdownParent: $("#modal"),
        ajax: {
            url: 'getcie10',
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q: params.term
                };

                // Query parameters will be ?1=[term]
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.id10 + " - " + item.dec10,
                            id: item.id10
                        }
                    })
                };
            }
        }
    });


    function updateActividades() {
        $("#actividades")
            .empty();

        for (var index in tematicas) {
            //console.log(tematicas[index])
            if (tematicas[index].selected) {

                var htmlString =

                    '<table class="table table-bordered table-sm table-responsive-sm table-responsive-md table-responsive-lg">' +
                    '<tr>' +
                    '   <th>' + tematicas[index].text + '</th>' +
                    '   <th colspan="5"><select class="selectCIE10"> </th>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>Reunión zonal</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Reunión de ref. zonales</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Reunión con equipos de salud</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '</tr>' +
                    '   <tr>' +
                    '   <td>Coord. actores comu./inst.</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Difusión de actividad</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '<td>Taller</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>Charla/Exposición</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Supervisión</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Tutoría</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>Ateneo</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Part. jorn/conc/cong</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td>Act. relacionada con invest.</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>Otras</td>' +
                    '   <td><input id="" class="inputs" type="number" min="0" step="1" value="0"></td>' +
                    '   <td></td>' +
                    '   <td></td>' +
                    '   <td></td>' +
                    '   <td></td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td colspan="6"><select class="selectprogramas"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td colspan="6"><button class="quitaractividad btn btn-block btn-danger" data-id="' + index + '">Quitar actividad: "' + tematicas[index].text + '" </button></td>' +
                    '</tr>' +
                    '</table>';

                $("#actividades")
                    .append(htmlString);

                $(".quitaractividad").click(function () {

                    for (var index2 in tematicas) {

                        if (tematicas[index2].id == $(this).data('id')) {

                            tematicas[index2].selected = false;
                        }
                    }

                    updateActividades();
                });

                $("input[type='number']").click(function () {
                    $(this).select();
                });

                $(".selectprogramas").select2({
                    multiple: true,
                    width: '100%',
                    data: programas,
                    placeholder: 'Elija los programas afectados'
                });

                $(".selectCIE10").select2({
                    width: '100%',
                    multiple: true,
                    placeholder: "Busque motivo de intervención",
                    //dropdownParent: $("#modal"),
                    ajax: {
                        url: 'getcie10',
                        type: 'GET',
                        dataType: 'json',
                        data: function (params) {
                            var query = {
                                q: params.term
                            };

                            // Query parameters will be ?1=[term]
                            return query;
                        },
                        processResults: function (data) {
                            return {
                                results: $.map(data, function (item) {
                                    return {
                                        text: item.id10 + " - " + item.dec10,
                                        id: item.id10
                                    }
                                })
                            };
                        }
                    }
                });
            }
        }
    }
}
/*
    var actividades = [];
    var programasArray = [];

    $("#tablaActividades :input").each(function(index,element){

        if(element.className == 'inputs' && element.value != 0){

            actividades.push({
                tipo: $(element).data('id'),
                cantidad: element.value
            });
        }

        if(element.className == 'form-check-input'){
            //if(element.checked){

              //  programasArray.push(programas[index].id);
            //}
            if(element.checked == true){
                programasArray.push(programas[element.value].id);
            }
        }
    });

   // $("#tablaActividades .form-check-input").each(function(index,element){


//    });

    DATA.actividades.push ({

        actividades: actividades,
        tematica: $(".selectTematicas").select2('data')[0].id,
        cie10: $(".selectCIE10").select2('data')[0].id,
        programas: programasArray,
        id: actividadesID
    });

    actividadesID++;

    console.log(DATA);

    updateActividades();
    */

/*
function updateActividades(){

    var htmlString =
        '<table class="table table-bordered table-sm table-responsive-sm table-responsive-md table-responsive-lg">';

    for(var index in DATA.actividades){

        htmlString +=
            '<tr>' +
            '<td colspan="2">' +
            '<div class="col-xs-11 col-sm-11 col-md-11 col-lg-11 pull-right"></div><div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 pull-right"><button class="btn btn-sm btn-danger quitaractividad" data-id="' + DATA.actividades[index].id + '">quitar</button></div>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '   <th>Temática</th>' +
            '   <th>CIE10</th>' +
            '</tr>' +
            '' +
            '<tr>' +
            '   <td>'+ tematicas[DATA.actividades[index].tematica].text +'</td>' +
            '   <td>'+ DATA.actividades[index].cie10 +'</td>' +
            '</tr>';

        htmlString +=
            '<tr>' +
            '   <th>Tipo</th>' +
            '   <th>Cantidad</th>' +
            '</tr>';



        for(var index2 in DATA.actividades[index].actividades){

            htmlString +=
                '<tr>' +
                '   <td>'+ tipoDeTematica[DATA.actividades[index].actividades[index2].tipo].text +'</td>' +
                '   <td>'+ DATA.actividades[index].actividades[index2].cantidad +'</td>' +
                '</tr>';
        }

        htmlString +=
            '<th colspan="2">Programas afectados</th>';

        htmlString += '<tr colspan="2"><td colspan="2">';

        for(var index3 in DATA.actividades[index].programas){

            htmlString += '<span class="badge badge-secondary" style="margin-right: 5px">' + programas[DATA.actividades[index].programas[index3]].text + '</span>';
        }

        htmlString += '</td></tr>';

        htmlString += '<tr class="separador"><td></td><td></td></tr>' ;
    }

    htmlString +=
        '</table>';

    //console.log(htmlString);


    $("#actividades")
        .empty()
        .append(htmlString);

    //evento de boton quitar filas de actividades
    $(".quitaractividad")
        .click(function(){

            //console.log("test")

            for(var index in DATA.actividades){

                //console.log(DATA.actividades[index].id)

                if(DATA.actividades[index].id == $(this).data('id') ){

                    DATA.actividades.splice(index, 1);
                    //console.log("sdf")

                }
            }
            //console.log(DATA)
            updateActividades();
        });

}
*/
//agrega nuevas actividades
function agregarActividad(){
/*
    var htmlString =
        '<table id="tablaActividades" class="table table-bordered table-sm table-responsive-sm table-responsive-md table-responsive-lg">' +
        '   <tr>' +
        '       <th colspan="2">Temática</th>' +
        '       <th colspan="2">CIE10</th>' +
        '   </tr>' +
        '   <tr>' +
        '       <td colspan="2"><select class="selectTematicas"> </select></td>' +
        '       <td colspan="2"><select class="selectCIE10"> </select></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <th colspan="4">Tipo de actividad</th>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Reunión zonal</td>' +
        '       <td><input data-id="0" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td>Reunión de refertentes zonales</td>' +
        '       <td><input data-id="1" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Reunión con equipo de salud</td>' +
        '       <td><input data-id="2" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td>Coordinación con actores comunitarios/instituciones</td>' +
        '       <td><input data-id="3" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Difusión de actividad</td>' +
        '       <td><input data-id="4" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td>Taller</td>' +
        '       <td><input data-id="5" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Charla/Exposición</td>' +
        '       <td><input data-id="6" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td>Supervisión</td>' +
        '       <td><input data-id="7" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Tutoría</td>' +
        '       <td><input data-id="8" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td>Ateneo</tdh>' +
        '       <td><input data-id="9" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Participación en jornada/curso/congreso</td>' +
        '       <td><input data-id="10" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td>Actividad relacionada con investigación</td>' +
        '       <td><input data-id="11" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>Otras</td>' +
        '       <td><input data-id="12" class="inputs" type="number" min="0" step="1" value="0"></td>' +
        '       <td></td>' +
        '       <td></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <th colspan="4">Programas</th>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>PEC</td>' +
        '       <td><input data-id="0" class="form-check-input" type="checkbox" value="0"></td>' +
        '       <td>PRO.SA.DIA</td>' +
        '       <td><input data-id="1" class="form-check-input" type="checkbox" value="1"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>PMCS</td>' +
        '       <td><input data-id="2" class="form-check-input" type="checkbox" value="2"></td>' +
        '       <td>PRO.SAN.E</td>' +
        '       <td><input data-id="3" class="form-check-input" type="checkbox" value="3"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>SS y PR</td>' +
        '       <td><input data-id="4" class="form-check-input" type="checkbox" value="4"></td>' +
        '       <td>CAC</td>' +
        '       <td><input data-id="5" class="form-check-input" type="checkbox" value="5"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>CELIAQUÍA</td>' +
        '       <td><input data-id="6" class="form-check-input" type="checkbox" value="6"></td>' +
        '       <td>BAJO PESO</td>' +
        '       <td><input data-id="7" class="form-check-input" type="checkbox" value="7"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>PESO SALUDABLE</td>' +
        '       <td><input data-id="8" class="form-check-input" type="checkbox" value="8"></td>' +
        '       <td>TBC</td>' +
        '       <td><input data-id="9" class="form-check-input" type="checkbox" value="9"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>ITS</td>' +
        '       <td><input data-id="10" class="form-check-input" type="checkbox" value="10"></td>' +
        '       <td>1000 DIAS</td>' +
        '       <td><input data-id="11" class="form-check-input" type="checkbox" value="11"></td>' +
        '   </tr>' +
        '   <tr>' +
        '       <td>OTROS</td>' +
        '       <td><input data-id="12" class="form-check-input" type="checkbox" value="12"></td>' +
        '       <td>NINGUNO</td>' +
        '       <td><input data-id="13" class="form-check-input" type="checkbox" value="13"></td>' +
        '   </tr>' +
        '</table>';

    $("#modalTitle").text("Agregar nueva actividad");

    $("#modalBody")
        .empty()
        .append(htmlString);

    $(".selectTematicas").select2({
        width: '300px',
        placeholder: "seleccione temática",
        multiple: false,
        dropdownParent: $("#modal"),
        data: tematicas,
        minimumResultsForSearch: -1

    });

    $(".selectCIE10").select2({
        width: '300px',
        placeholder: "Busque motivo de intervención",
        multiple: false,
        dropdownParent: $("#modal"),
        ajax: {
            url: 'getcie10',
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q: params.term
                };

                // Query parameters will be ?1=[term]
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.id10 + " - " +item.dec10,
                            id: item.id10
                        }
                    })
                };
            }
        }

    });

    $(".modal").modal('show');

    $("#cerrar").hide();
    $("#aceptar").hide();
    $("#agregarActividad").show();
    $("#agregarMotivo").hide();

    */

    var htmlModal = '';

    for(var index in tematicas){

        if(!tematicas[index].selected) {

            htmlModal +=
                '<div class="row">' +
                '<div class="col-md-12 text-center">' +
                '   <button class="btn btn-info btn-block tematica" data-id="' + tematicas[index].id + '">' + tematicas[index].text + '</button><br/>' +
                '</div>' +
                '</div>';
        }

        $("#modalTitle").text("Agregar nueva actividad");

        $("#modalBody")
            .empty()
            .append(htmlModal);

        $(".tematica").click(function(){

            $(".modal").modal('hide');

            appendActividad($(this).data('id'));
        });

        $(".modal").modal('show');
        $("#cerrar").hide();
        $("#aceptar").hide();
        $("#agregarActividad").hide();
        $("#agregarMotivo").hide();
    }

var htmlString =
    '<table>' +
    '   <tr>' +
    '       <th colspan="3"></th>' +
    '       <th colspan="3"></th>' +
    '   </tr>' +
    '   <tr>' +
    '       <td>Reunión zonal</td>' +
    '       <td></td>' +
    '       <td>Reunión de ref. zonales</td>' +
    '       <td></td>' +
    '       <td>Reunión con equipos de salud</td>' +
    '       <td></td>' +
    '   </tr>' +
    '   <tr>' +
    '       <td>Coord. actores comu./inst.</td>' +
    '       <td></td>' +
    '       <td>Difusión de actividad</td>' +
    '       <td></td>' +
    '       <td>Taller</td>' +
    '       <td></td>' +
    '   </tr>' +
    '   <tr>' +
    '       <td>Charla/Exposición</td>' +
    '       <td></td>' +
    '       <td>Supervisión</td>' +
    '       <td></td>' +
    '       <td>Tutoría</td>' +
    '       <td></td>' +
    '   </tr>' +
    '   <tr>' +
    '       <td>Ateneo</td>' +
    '       <td></td>' +
    '       <td>Part. jorn/conc/cong</td>' +
    '       <td></td>' +
    '       <td>Act. relacionada con invest.</td>' +
    '       <td></td>' +
    '   </tr>' +
    '   <tr>' +
    '       <td>Otras</td>' +
    '       <td></td>' +
    '       <td></td>' +
    '       <td></td>' +
    '       <td></td>' +
    '       <td></td>' +
    '   </tr>' +
    '   <tr>' +
    '       <td colspan="6"></td>' +
    '   </tr>' +
    '</table>';
}

//agrega nuevos motivos de intervención
function agregarMotivo(){

    var htmlString =
        '<h6>Cantidad de consultas</h6>' +
        '<input id="cantidadMotivo" class="inputs" type="number" min="0" step="1" value="0">' +
        '<h6>Código de patología / enfermedad</h6>' +
        '<div class="row">' +
        '   <div class="col-8">' +
        '       <select class="selectMotivoP"> </select>' +
        '   </div>' +
        '   <div class="col-4">' +
        '       <label for="sinPatologia">Sin patología</label>' +
        '       <input id="sinPatologia" type="checkbox" value="0">' +
        '   </div>' +
        '</div>' +
        '<h6>Códigos de aspectos sociales</h6>' +
        '<button id="agregarNuevoMotivo" class="btn btn-success">Agregar motivo</button>' +
        '<div id="motivosSecundariosContainer"></div>';

    $("#modalTitle").text("Agregar nuevo motivo de intervención: ");

    $("#modalBody")
        .empty()
        .append(htmlString);

    $("#agregarNuevoMotivo").click(function(){

        var htmlMotivos =
                '<div class="row motivosSecundarios">' +
                '   <div class="col-6"><select class="selectMotivoS"> </select></div>' +
                '   <div class="col-6"><input id="cantidadMotivoS" class="inputs" type="number" min="0" step="1" value="0"></div>'+
                '</div>';

        $("#motivosSecundariosContainer")
            .append(htmlMotivos);

        $("input[type='number']").click(function () {
            $(this).select();
        });

        $(".selectMotivoS").select2({
            width: '100%',
            dropdownParent: $("#modal"),
            ajax: {
                url: 'getcie10',
                type: 'GET',
                dataType: 'json',
                data: function (params) {
                    var query = {
                        q: params.term
                    };
                    return query;
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.id10 + " - " +item.dec10,
                                id: item.id10
                            }
                        })
                    };
                }
            }
        });
    });

    $(".selectMotivoP").select2({
        width: '100%',
        placeholder: "seleccione código CIE10",
        multiple: false,
        dropdownParent: $("#modal"),
        ajax: {
            url: 'getcie10',
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q: params.term
                };
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.id10 + " - " +item.dec10,
                            id: item.id10
                        }
                    })
                };
            }
        }
    });

    $("#sinPatologia").click(function(){

        if($(this).prop('checked')){

            $(".selectMotivoP").prop('disabled',true);
        }else{

            $(".selectMotivoP").prop('disabled',false);
        }
    });
/*
    $(".selectMotivoS").select2({
        width: '100%',
        multiple: true,
        dropdownParent: $("#modal"),
        ajax: {
            url: 'getcie10',
            type: 'GET',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q: params.term
                };
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.id10 + " - " +item.dec10,
                            id: item.id10
                        }
                    })
                };
            }
        }
    });
*/
    $("input[type='number']").click(function () {
        $(this).select();
    });

    $("#modal").modal('show');
    $("#cerrar").hide();
    $("#aceptar").hide();
    $("#agregarActividad").hide();
    $("#agregarMotivo").show();
}

//agrega fila de motivos de intervención
function appendRow(selectorP,selectorS){

    var motivo;

    if($("#sinPatologia").prop('checked')){

        flagPatologia = true;

        motivo = {
            cie10: '0',
            nombre: 'Sin patología',
            secundarios: [],
            cantidad: $("#cantidadMotivo").val(),
            id: prestacionesID
        };

    }else{

        motivo = {
            cie10: selectorP.select2('data')[0].id,
            nombre: selectorP.select2('data')[0].text,
            secundarios: [],
            cantidad: $("#cantidadMotivo").val(),
            id: prestacionesID
        };
    }

    for(var index in selectorS.select2('data')){

        motivo.secundarios.push({
            cie10: selectorS.select2('data')[index].id,
            nombre: selectorS.select2('data')[index].text
        });
    }

    DATA.motivos.push(motivo);

    var motivosContainer = $("#motivos");

    motivosContainer.empty();

    var htmlString =
        '<tr>' +
        '   <th>Patología</th>' +
        '   <th>Cantidad</th>' +
        '   <th>Aspectos sociales</th>' +
        '   <th>Acción</th>' +
        '</tr>';

    for(var index in DATA.motivos){

        htmlString +=
            '<tr>' +
            '<td>' + DATA.motivos[index].nombre + '</td>' +
            '<td>' + DATA.motivos[index].cantidad + '</td>' +
            '<td>';

        for(var index2 in DATA.motivos[index].secundarios){

            htmlString +=
                '<span class="badge badge-info">' + DATA.motivos[index].secundarios[index2].cie10 + '</span> &nbsp ';
        }

        htmlString +=
            '</td>' +
            '<td><button class="btn btn-danger btn-sm quitarmotivo" data-id="' + DATA.motivos[index].id + '">quitar</button></td>' +
            '</tr>';
    }

    motivosContainer
        .append(htmlString);

    //evento de boton quitar de filas de motivos de intervención
    $(".quitarmotivo")
        .click(function(){

            for(var index in DATA.motivos){

                if(DATA.motivos[index].id == $(this).data('id') ){

                    if(DATA.motivos[index].cie10 == 0){

                        flagPatologia = false;
                    }

                    DATA.motivos.splice(index, 1);
                }
            }

            updateMotivosRows();
        });

    prestacionesID++;
}

//agrega las filas de motivos según los datos guardados en el json
function updateMotivosRows(){

    var motivosContainer = $("#motivos");

    motivosContainer.empty();

    var htmlString =
        '<tr>' +
        '   <th>Patología</th>' +
        '   <th>Cantidad</th>' +
        '   <th>Aspectos sociales</th>' +
        '   <th>Acción</th>' +
        '</tr>';

    for(var index in DATA.motivos){

        htmlString +=
            '<tr>' +
            '   <td>' + DATA.motivos[index].nombre + '</td>' +
            '   <td>' + DATA.motivos[index].cantidad + '</td>' +
            '<td>';

        for(var index2 in DATA.motivos[index].secundarios){

            htmlString +=
                '<span class="badge badge-info">' + DATA.motivos[index].secundarios[index2].cie10 + '</span> &nbsp ';
        }

        htmlString +=
            '</td>' +
            '<td><button class="btn btn-danger btn-sm quitarmotivo" data-id="' + DATA.motivos[index].id + '">quitar</button></td>' +
            '</tr>';
    }

    motivosContainer
        .append(htmlString);

    //evento de boton quitar de filas de motivos de intervención
    $(".quitarmotivo")
        .click(function(){

            for(var index in DATA.motivos){

                if(DATA.motivos[index].id == $(this).data('id') ){

                    if(DATA.motivos[index].cie10 == 0){

                        flagPatologia = false;
                    }

                    DATA.motivos.splice(index, 1);
                }
            }

            updateMotivosRows();
        });
}


//suma los resultados y le resta el campo de total
function sumaDeInputs(selInputs, selTotal){

    selInputs
        .on('change', function(){

            var acum = 0;

            selInputs.each(function(index,element){

                if(element.value < 0 ) element.value = 0;
                acum += parseInt(element.value);

            });

            acum -= parseInt(selTotal.val());

            selTotal.val(acum);
        });
}

//conversión de texto del botón para mostrar la fecha elegida
function setFecha(data){

    var event =  data.date;
    var options = { month: 'long', year: 'numeric'};

    $('#btnfecha')
        .text(event.toLocaleDateString('es-ES', options))
        .removeClass("btn-danger")
        .addClass("btn-success");
}

//compara los totales para saber si coinciden
function showComparacion(message){
    var htmlTitle = 'ERROR';
    var htmlBody = '';

    for( var index in message){

        //en caso de no ingresar establecimiento
        if(message[index] == "cs"){

            htmlBody += '<p class="text-danger"> <b>No se ingresó centro de salud</b></p> <hr><br>';
        }

        //en caso que no coincidan los totales
        if(message[index] == "totales"){

            htmlBody +=
                '<p class="text-danger"><b>Los totales no coinciden</b></p>' +
                '<table class="table table-bordered table-sm table-responsive-sm table-responsive-md table-responsive-lg">' +
                '   <tr>' +
                '       <th>Campo</th>' +
                '       <th>Total</th>' +
                '   </tr>';

            $(".inputs-suma").each(function(index,element){

                htmlBody +=
                    '<tr>'+
                    '   <td class="text-right">' +
                    element.name +
                    '</td>' +
                    '<td>' +
                    element.value +
                    '   </td>' +
                    '</tr>';
            });

            htmlBody +=
                '</table> <br><hr>';
        }
        if(message[index] == "fecha"){
            htmlBody += '<p class="text-danger"> <b>No se ingresó el mes</b></p> <hr><br>';
        }
        //en caso de tener menos motivos de intervención
        if(message[index] == "motivos"){

            htmlBody += '<p class="text-danger"> <b>Los motivos de intervención deben ser mayores o iguales al total</b></p> <hr><br>';
        }
    }

    htmlBody +=
        '<p class="bg-danger text-light text-center">Cambie los valores para poder continuar</p>';

    $("#modalTitle").text(htmlTitle);

    $("#modalBody")
        .empty()
        .append(htmlBody);

    $("#modal")
        .modal('show');

    $("#cerrar").hide();
    $("#agregarActividad").hide();
    $("#agregarMotivo").hide();
    $("#aceptar").show();

}

//guarda los datos
function saveData(){
    /*
    var htmlString =
        '<p>Los datos se guardaron correctamente</p>';

    $("#modalBody")
        .empty()
        .append(htmlString);

    $("#modalTitle").text("Enhorabuena chaval!");

    $("#modal").modal('show');
    $("#aceptar").show();
    $("#cerrar").hide();

    //borrado de campos
    $(".inputs, .inputs-suma").each(function(index,element){

        element.value = 0;
    });
    */
    DATA.establecimiento = $(".selectCS").select2('data')[0].id;

    $("#procedencia :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.procendencia.push({
                deptoid: $(element).data('id'),
                cantidad: $(element).val()
            });
        }
    });

    $("#demanda :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.demanda.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    $("#descendientes :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.descendientes.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    $("#cobertura :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.cobertura.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    $("#consulta :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.consulta.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    $("#genero :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.genero.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    $("#etareo :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.etareo.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    $("#atencion :input").each(function(index,element){
        if($(element).val() != 0){
            DATA.atencion.push({
                tipo: $(element).data('name'),
                cantidad: $(element).val()
            });
        }
    });

    guardarDatos();
}

function guardarDatos(){

    alert("Completó los datos correctamente. En ésta etapa de capacitación los datos aún no son guardados.")
}
/*
function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}
*/
/*
function suma(arr){
    
    var acum = parseInt(0,10);

    for(var index in arr){

        acum += parseInt(arr[index].val() == '' ? 0 : arr[index].val() ,10);
    }

    return acum;
}
    */

