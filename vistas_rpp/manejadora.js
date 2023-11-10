"use strict";
/// <reference path="./planta.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
$(document).ready(() => {
    const manejadora = new RecPrimerParcial.Manejadora();
    manejadora.MostrarPlantasFotosBD();
    $("#btn-agregar").on("click", () => {
        manejadora.AgregarPlantaFotoBD($("#codigo").val(), $("#nombre").val(), $("#color_flor").val(), parseFloat($("#precio").val()));
        manejadora.ActualizarTabla();
    });
    $("#btn-modificar").on("click", () => {
        // Obtén los valores de los campos del formulario
        const codigo = $("#codigo").val();
        const nombre = $("#nombre").val();
        const colorFlor = $("#color_flor").val();
        const precio = parseFloat($("#precio").val());
        const fotoInput = $("#foto")[0];
        const nuevaFoto = fotoInput.files && fotoInput.files[0];
        // Crea un objeto Planta con los nuevos valores
        const plantaModificada = new Tignino.Planta(codigo, nombre, colorFlor, precio);
        // Verifica si hay una nueva foto antes de agregarla al FormData
        if (nuevaFoto) {
            // Crea un nuevo FormData
            const formData = new FormData();
            // Agrega el objeto Planta como cadena JSON al FormData
            formData.append("planta_json", JSON.stringify(plantaModificada));
            // Agrega la nueva foto al FormData
            formData.append("foto", nuevaFoto);
            // Llama a la función para modificar la planta
            manejadora.ModificarPlantaFotoBD(formData);
        }
        else {
            // Llama a la función para modificar la planta sin cambiar la foto
            manejadora.ModificarPlantaFotoBD(plantaModificada);
        }
        manejadora.ActualizarTabla();
    });
    $("#btn-filtrar").on("click", () => {
        // Obtén los valores de los campos de filtro (ajusta según tus campos)
        const colorFlor = $("#color_flor_filtro").val();
        const precioMin = $("#precio_min_filtro").val();
        // Crea un objeto con los valores de filtro
        const filtro = {
            colorFlor: colorFlor,
            precioMin: precioMin
        };
        // Llama al método para filtrar plantas
        manejadora.FiltrarPlantasFotoBD(filtro);
    });
});
var RecPrimerParcial;
(function (RecPrimerParcial) {
    class Manejadora {
        MostrarPlantasFotosBD() {
            $.ajax({
                type: "GET",
                url: "http://localhost:2023/listarPlantasFotosBD",
                dataType: "json"
            })
                .done((objJSON) => {
                //MUESTRO EL RESULTADO DE LA PETICION
                console.log(objJSON);
                let tabla = `<table class="table table-hover">
                                    <tr>
                                    <th>Código</th><th>Nombre</th><th>Color Flor</th><th>Precio</th><th>Foto</th><th>Acciones</th>
                                    </tr>`;
                objJSON.forEach((item) => {
                    tabla += `<tr>
                                <td>${item.codigo}</td>
                                <td>${item.nombre}</td>
                                <td><input type="color" value="${item.color_flor}" disabled></td>
                                <td>${item.precio}</td>
                                <td> <img src="http://localhost:2023/${item.foto}" width=50 height=50> </td>
                                <td>
                                    <input type="button" value="modificar" data-obj='${JSON.stringify(item)}' data-action="modificar">        
                                    <input type="button" value="eliminar" data-obj='${JSON.stringify(item)}' data-action="eliminar">
                                </td>
                            </tr>`;
                });
                tabla += `</table>`;
                $("#divTablaPlantaFotos").html(tabla);
                $('[data-action="modificar"]').on("click", (function () {
                    let objJSON = $(this).attr("data-obj");
                    let obj = JSON.parse(objJSON);
                    // Llenar campos con la información del producto
                    $("#codigo").val(obj.codigo);
                    $("#nombre").val(obj.nombre);
                    $("#color_flor").val(obj.color_flor);
                    $("#precio").val(obj.precio);
                    $("#imgFoto").attr("src", `http://localhost:2023/${obj.foto}`);
                    // Adjuntar el objeto al botón "btnModificar"
                    $("#btnModificar").data("producto", obj);
                }));
                $('[data-action="eliminar"]').on("click", (function () {
                    let objJSON = $(this).attr("data-obj");
                    let obj = JSON.parse(objJSON);
                    console.log(obj);
                    $.ajax({
                        type: 'POST',
                        url: "http://localhost:2023/eliminarPlantaFotoBD",
                        data: objJSON,
                        dataType: "text",
                        contentType: 'application/json'
                    })
                        .done((mensaje) => {
                        alert(mensaje);
                    })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
                    });
                }));
            });
        }
        AgregarPlantaFotoBD(codigo, nombre, color_flor, precio) {
            const formData = new FormData();
            const foto = $("#foto")[0];
            formData.append("codigo", codigo);
            formData.append("nombre", nombre);
            formData.append("color_flor", color_flor);
            formData.append("precio", precio.toString());
            formData.append("foto", foto.files[0]);
            $.ajax({
                type: "POST",
                url: "http://localhost:2023/agregarPlantaFotoBD",
                dataType: "text",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                async: true
            })
                .done((mensaje) => {
                alert(mensaje);
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
            });
        }
        ModificarPlantaFotoBD(obj) {
            $.ajax({
                type: 'POST',
                url: "http://localhost:2023/modificarPlantaFotoBD",
                data: obj instanceof Tignino.Planta ? obj.toJSON() : obj,
                cache: false,
                contentType: false,
                processData: false,
                async: true
            })
                .done((mensaje) => {
                alert(mensaje);
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
            });
        }
        ActualizarTabla() {
            this.MostrarPlantasFotosBD();
        }
        FiltrarPlantasFotoBD(filtro) {
            $.ajax({
                type: 'GET',
                url: "http://localhost:2023/listarPlantasFiltradasFotosBD",
                data: filtro,
                dataType: "json"
            })
                .done((plantasFiltradas) => {
                // Muestra el listado filtrado en la página
                this.MostrarListadoFiltrado(plantasFiltradas);
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
            });
        }
        // Método para mostrar el listado filtrado en la página
        MostrarListadoFiltrado(plantasFiltradas) {
            let tabla = `<table class="table table-hover">
                                <tr>
                                <th>Código</th><th>Nombre</th><th>Color Flor</th><th>Precio</th><th>Foto</th><th>Acciones</th>
                                </tr>`;
            plantasFiltradas.forEach((item) => {
                tabla += `<tr>
                            <td>${item.codigo}</td>
                            <td>${item.nombre}</td>
                            <td><input type="color" value="${item.color_flor}" disabled></td>
                            <td>${item.precio}</td>
                            <td> <img src="http://localhost:2023/${item.foto}" width=50 height=50> </td>
                            <td>
                                <input type="button" value="modificar" data-obj='${JSON.stringify(item)}' data-action="modificar">        
                                <input type="button" value="eliminar" data-obj='${JSON.stringify(item)}' data-action="eliminar">
                            </td>
                        </tr>`;
            });
            tabla += `</table>`;
            $("#divTablaPlantaFotos").html(tabla);
        }
    }
    RecPrimerParcial.Manejadora = Manejadora;
})(RecPrimerParcial || (RecPrimerParcial = {}));
//# sourceMappingURL=manejadora.js.map