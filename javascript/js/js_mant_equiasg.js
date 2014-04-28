$(document).ready(function() {
    $("#nav-mantenimientos").addClass("ui-corner-all active");
    institucionDAO.cargarInstitucionValida(sistema.llenaSelect, "slct_instituto", "");
    
    //carreraDAO.cargarCarrera(sistema.llenaSelect, "slct_carrera", "");
    
    jQGridEquivalencia.Equivalencia();
    
    $("#slct_instituto").change(function(){
        equivalenciaDAO.cargarCarreras(sistema.llenaSelect, "slct_carrera", "");
        limpiarSelect("slct_curso");
        limpiarSelect("slct_modulo");
        limpiarSelect("slct_curricula");
    });
    
    
    
    
    $("#slct_carrera").change(function(){
        equivalenciaDAO.cargarCurriculas(sistema.llenaSelect, "slct_curricula", "");
        equivalenciaDAO.cargarModulos(sistema.llenaSelect, "slct_modulo", "");
        limpiarSelect("slct_curso");
        
    });
    
    $("#slct_modulo").change(function(){
        cargarCursos();
    });
    $("#slct_curricula").change(function(){
        cargarCursos();
    });
    
    
    
    
    
    $('#frmEquivalencia').dialog({
        autoOpen: false,
        show: 'fade', hide: 'fade',
        modal: true,
        width: 'auto', height: 'auto'
    });
// TEMPLATES
// LOS TEMPLATES USADOS SE ENCUENTRAN EN FRMEQUIVALENCIA.PHP , USANDO LA LIBRERIA UNDERSCORE.JS
window.templatesHtml = {}
templatesHtml.nuevoCursoActa =  _.template( $("#TemplateCurso").html() );

});

limpiarSelect=function(select){
  $("#"+select).val("");
}

cargarCursos=function(){
    
    var modulo =$("#slct_modulo").val();
    var curricula =$("#slct_curricula").val();
    equivalenciaDAO.cargarCursos(sistema.llenaSelect, "slct_curso", "");   
}

cargarCursos_asig=function(id){
    
    var modulo =$("#slct_modulo_asig_"+id).val();
    var curricula =$("#slct_curricula_asig_"+id).val();
    equivalenciaDAO.cargarCursos_asig(id,sistema.llenaSelect, "slct_curso_asig_"+id, "");   
}

add_equivalencia_jqgrid = function() {
     $("tr.curso-acta").remove();
    $("select").val("");
    // $('#btnFormEquivalencia').attr('onclick', 'nuevoEquivalencia()');
    // $('#spanBtnFormEquivalencia').html('Guardar');
    $('#sendData').attr('onclick', 'GuardarCambiosEquivalencia()');
        $('#sendData span').html('Guardar');
    $('#frmEquivalencia').dialog('open');
}


// campos a enviar al ajax para insertar
nuevoEquivalencia = function() {
    var a = new Array();
    a[0] = sistema.requeridoSlct('slct_curso');
    a[1] = sistema.requeridoSlct('slct_curso_asig');

    for (var i = 0; i < 2; i++) {
        if (!a[i]) {
            return false;
            break;
        }
    }
    equivalenciaDAO.addEquivalencia();
    //si valida todo envia a insertar persona
//	personalDAO.InsertarPersonal();
}

GuardarCambiosEquivalencia = function(){
    //validar que exista al menos 1
    var cursosActa = $("#frmEquivalencia #cursosActa select").length;
    // console.log(cursosActa);
    if(cursosActa == 0){
        // console.log('agregar equivalencia');
        sistema.msjAdvertencia('Agrege al menos un curso de Acta',2500)
        return false;
    }
    //REVISAR SELECTS
    var selects = $("#frmEquivalencia [id^='slct']");
    for(var i = 0 ; i < selects.length ; i++){
        if( !sistema.requeridoSlct($(selects[i]).attr('id')) ){
            console.log('detenido');
            console.log($(selects[i]).attr('id'));
            return false;
            break;
        }
    }


    //VALIDAR QUE NO SE REPITAN LOS MISMOS CURSOS
    var vals = _.map($("[id*=slct_curso_asig_]") , function(i){ return $(i).val() });
    var vals_total = vals.length;
    var uniq = _.uniq(vals)
    var uniq_total = uniq.length;
    if( uniq_total < vals_total){
        sistema.msjAdvertencia('Los Cursos Actas a actualizar deben ser diferentes',2500)
        return false;
    }

    // mapear todos los select de _asig_id
    // var referencia = _.map($("#cursoReferencia select") , function(i){ return $(i).val() });
    // var dataReferencia = referencia.join("|");
    // var data = $("#cursosActa .curso-acta");
    var actas = _.map( $("#cursosActa .curso-acta") , function(i){  
        var selects = $(i).find('select');
        var dataselects = _.map( selects  , function(i){ return $(i).val() });
        var data = dataselects.join("|"); 
        return data;  
    });

    //VALIDAR QUE NO SE REPITEN LOS CURSOS ACTAS A GUARDAR
    var vals_total = actas.length;
    var uniq = _.uniq(actas)
    var uniq_total = uniq.length;
    if( uniq_total < vals_total){
        sistema.msjAdvertencia('Los Cursos Actas a actualizar deben ser diferentes',2500)
        return false;
    }

    
    var dataActas = actas.join("^");
    console.log(dataActas);
    //GUARDANDO GRUPOS

    equivalenciaDAO.addEquivalencia(dataActas);


}



edit_equivalencia_jqgrid=function(){
  $("tr.curso-acta").remove();
  
   var id = $("#table_hora").jqGrid("getGridParam", 'selrow');
    $("#frmEquivalencia .form i").remove();
    if (id) {
        var data = $("#table_hora").jqGrid('getRowData', id);
        $('#gruequi').val(id);
       //CARGANDO DATOS 1 SECCION DE SELECTS 
        $("#slct_instituto").val(data.inst).trigger("change");
        $("#slct_carrera").val(data.carrer).trigger("change");
        $("#slct_curricula").val(data.ccurric).trigger("change");
        $("#slct_modulo").val(data.cciclo).trigger("change");
        $("#slct_curso").val(data.ccurso);
        $("#slct_tequi").val(data.cestide);
        

        
        //CARGADO CURSOS
        // debugger;
        var codigos = data.codigos;
        var codigos_array = codigos.split(',');
        var total_cursos = codigos_array.length;

         codigos_array.forEach(function(item) {
            
            // cargando cursos actas
            var select_id = AgregarCurso();
            //Rellenar grupo
            //OBTENER INSTITUCION Y CARRERA DE UNA CURRICULA
            var data = item.split("~");
            var get_data = GetInstitucionyCarrera(data[0]);
             // debugger;
            var cinstit = get_data.cinstit;
            var ccarrer = get_data.ccarrer;
            var ccurric = data[0];
            var cmodulo = data[1];
            var ccurso = data[2];

            // llenar datos
            $("#slct_instituto_asig_"+select_id).val(cinstit).trigger("change");
            $("#slct_carrera_asig_"+select_id).val(ccarrer).trigger("change");
            $("#slct_curricula_asig_"+select_id).val(ccurric).trigger("change");
            $("#slct_modulo_asig_"+select_id).val(cmodulo).trigger("change");
            $("#slct_curso_asig_"+select_id).val(ccurso);

        });

        $('#sendData').attr('onclick', 'modificarEquivalencia()');
        $('#sendData span').html('Modificar');
        $('#frmEquivalencia').dialog('open');
    } else {
        sistema.msjAdvertencia('Seleccione <b>Equivalencia</b> a Editar')
    }
  
}

GetInstitucionyCarrera = function(curricula){
    var data = '';
    $.ajax({
            url : '../controlador/controladorSistema.php',
            type : 'POST',
            async:false,//no ejecuta otro ajax hasta q este termine
            dataType : 'json',
            data : {
                comando:'equivalencia',
                action:'GetInstitucionyCarrera',
                ccurric:curricula
            },
            success : function ( obj ) {
             data  = obj.data;
            }
        });
            // debugger;
        return data[0];
}




modificarEquivalencia = function(){
  
    //validar que exista al menos 1
    var cursosActa = $("#frmEquivalencia #cursosActa select").length;
    // console.log(cursosActa);
    if(cursosActa == 0){
        // console.log('agregar equivalencia');
        sistema.msjAdvertencia('Agrege al menos un curso de Acta',2500)
        return false;
    }
    //REVISAR SELECTS
    var selects = $("#frmEquivalencia [id^='slct']");
    for(var i = 0 ; i < selects.length ; i++){
        if( !sistema.requeridoSlct($(selects[i]).attr('id')) ){
            console.log('detenido');
            console.log($(selects[i]).attr('id'));
            return false;
            break;
        }
    }

   
    // mapear todos los select de _asig_id
    // var referencia = _.map($("#cursoReferencia select") , function(i){ return $(i).val() });
    // var dataReferencia = referencia.join("|");
    // var data = $("#cursosActa .curso-acta");
    // USANDO EL METODO MAPEO DE UNDERSCORE.JS
    var actas = _.map( $("#cursosActa .curso-acta") , function(i){  
        var selects = $(i).find('select');
        var dataselects = _.map( selects  , function(i){ return $(i).val() });
        var data = dataselects.join("|"); 
        return data;  
    });

    //VALIDAR QUE NO SE REPITEN LOS CURSOS ACTAS A GUARDAR
    var vals_total = actas.length;
    var uniq = _.uniq(actas)
    var uniq_total = uniq.length;
    if( uniq_total < vals_total){
        sistema.msjAdvertencia('Los Cursos Actas a actualizar deben ser diferentes',2500)
        return false;
    }


    var dataActas = actas.join("^");

    // debugger;
    equivalenciaDAO.EditarEquivalencia(dataActas);
}

delete_equivalencia_jqgrid = function(){
  var id = $("#table_hora").jqGrid("getGridParam", 'selrow');
    $("#frmEquivalencia .form i").remove();
    if (id) {
   
      var respuesta =  window.confirm("Esta segurio de eliminar esta equivalencia");
      if(respuesta){
        equivalenciaDAO.EliminarEquivalencia(id);
      }
    }else {
        sistema.msjAdvertencia('Seleccione <b>Equivalencia</b> a Editar')
    }
}



AgregarCurso = function(){
    var tot=0;
    var htm=""; 
    tot = $("#txt_cant_cur").val()*1 + 1;
    $("#txt_cant_cur").val(tot);
    $("#cursosActa").append(templatesHtml.nuevoCursoActa({id:tot}));

    $('#frmEquivalencia').dialog("option", "position", "center");
    //SE AGREGAN LOS DATOS
    institucionDAO.cargarInstitucionValida(sistema.llenaSelect, "slct_instituto_asig_"+tot, "");

    $("#slct_instituto_asig_"+tot).change(function(){
        equivalenciaDAO.cargarCarreras_asig(tot ,sistema.llenaSelect, "slct_carrera_asig_"+tot, "");
        limpiarSelect("slct_curso_asig_"+tot);
        limpiarSelect("slct_modulo_asig_"+tot);
        limpiarSelect("slct_curricula_asig_"+tot);
    });
    $("#slct_carrera_asig_"+tot).change(function(){
        equivalenciaDAO.cargarCurriculas_asig(tot,sistema.llenaSelect, "slct_curricula_asig_"+tot, "");
        equivalenciaDAO.cargarModulos_asig(tot,sistema.llenaSelect, "slct_modulo_asig_"+tot, "");
        limpiarSelect("slct_curso_asig_"+tot);
    });
    
    $("#slct_modulo_asig_"+tot).change(function(){
        cargarCursos_asig(tot);
    });
    $("#slct_curricula_asig_"+tot).change(function(){
        cargarCursos_asig(tot);
    });

    return tot;
}


RemoverCurso = function (i){
    $(i).parent().parent().parent().remove();
    $('#frmEquivalencia').dialog("option", "position", "center");

}




















    