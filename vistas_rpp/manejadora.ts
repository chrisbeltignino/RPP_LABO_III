/// <reference path="./planta.ts" />
/// <reference path="../node_modules/@types/jquery/index.d.ts" />

$(document).ready(() => {

    const manejadora = new RecPrimerParcial.Manejadora();
    manejadora.MostrarPlantasFotosBD();

    $("#btn-agregar").on("click", () => {
        manejadora.AgregarPlantaFotoBD(
            $("#codigo").val() as string,
            $("#nombre").val() as string,
            $("#color_flor").val() as string,
            parseFloat($("#precio").val() as string)
        );
        manejadora.ActualizarTabla();
    });

    $("#btn-modificar").on("click", () => {
        // Obtén los valores de los campos del formulario
        const codigo = $("#codigo").val() as string;
        const nombre = $("#nombre").val() as string;
        const colorFlor = $("#color_flor").val() as string;
        const precio = parseFloat($("#precio").val() as string);
        const fotoInput = $("#foto")[0] as HTMLInputElement;
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
        } else {
            // Llama a la función para modificar la planta sin cambiar la foto
            manejadora.ModificarPlantaFotoBD(plantaModificada);
        }
        manejadora.ActualizarTabla();
    });

    $("#btn-filtrar").on("click", () => {
        // Obtén los valores de los campos de filtro (ajusta según tus campos)
        const colorFlor = $("#color_flor_filtro").val() as string;
        const precioMin = $("#precio_min_filtro").val() as string;

        // Crea un objeto con los valores de filtro
        const filtro = {
            colorFlor: colorFlor,
            precioMin: precioMin
        };

        // Llama al método para filtrar plantas
        manejadora.FiltrarPlantasFotoBD(filtro);
    });
});

namespace RecPrimerParcial {

    export class Manejadora {
        
        MostrarPlantasFotosBD() {
            $.ajax({
                type: "GET",
                url: "http://localhost:2023/listarPlantasFotosBD",
                dataType: "json" 
            })
            .done((objJSON: any) => {
                //MUESTRO EL RESULTADO DE LA PETICION
                console.log(objJSON);
        
                let tabla:string = `<table class="table table-hover">
                                    <tr>
                                    <th>Código</th><th>Nombre</th><th>Color Flor</th><th>Precio</th><th>Foto</th><th>Acciones</th>
                                    </tr>`;
                objJSON.forEach((item:any) => {
                    tabla +=`<tr>
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
        
                tabla +=`</table>`;
                $("#divTablaPlantaFotos").html(tabla);
        
                $('[data-action="modificar"]').on("click", (function(){
                    let objJSON:any = $(this).attr("data-obj");
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
        
                $('[data-action="eliminar"]').on("click", (function(){
                    let objJSON:any = $(this).attr("data-obj");
                    let obj = JSON.parse(objJSON);
        
                    console.log(obj);
        
                    $.ajax({
                        type: 'POST',
                        url: "http://localhost:2023/eliminarPlantaFotoBD",
                        data: objJSON,
                        dataType: "text",
                        contentType: 'application/json'
                    })
                    .done((mensaje:any)=>{
                        alert(mensaje);
                    })
                    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {
                        alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
                    }); 
                }));
            });
        }

        AgregarPlantaFotoBD(codigo: string, nombre: string, color_flor: string, precio: number): void {
            const formData = new FormData();
            const foto : any = $("#foto")[0] as HTMLInputElement;

            formData.append("codigo", codigo);
            formData.append("nombre", nombre);
            formData.append("color_flor", color_flor);
            formData.append("precio", precio.toString());
            formData.append("foto",foto.files[0]);

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
            .done((mensaje:any)=>{
                alert(mensaje);
            })
            .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {
                alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
            });
        }

        ModificarPlantaFotoBD(obj: Tignino.Planta | FormData): void {
            $.ajax({
                type: 'POST',
                url: "http://localhost:2023/modificarPlantaFotoBD",
                data: obj instanceof Tignino.Planta ? obj.toJSON() : obj,
                cache: false,
                contentType: false,
                processData: false,
                async: true
            })
            .done((mensaje: any) => {
                alert(mensaje);
            })
            .fail(function (jqXHR: any, textStatus: any, errorThrown: any) {
                alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
            });
        }

        ActualizarTabla() {
            this.MostrarPlantasFotosBD();
        }

        FiltrarPlantasFotoBD(filtro: any): void {
            $.ajax({
                type: 'GET',
                url: "http://localhost:2023/listarPlantasFiltradasFotosBD",
                data: filtro,
                dataType: "json"
            })
            .done((plantasFiltradas: any) => {
                // Muestra el listado filtrado en la página
                this.MostrarListadoFiltrado(plantasFiltradas);
            })
            .fail(function (jqXHR: any, textStatus: any, errorThrown: any) {
                alert(jqXHR.responseText + "\n" + textStatus + "\n" + errorThrown);
            });
        }
    
        // Método para mostrar el listado filtrado en la página
        private MostrarListadoFiltrado(plantasFiltradas: any): void {
            let tabla:string = `<table class="table table-hover">
                                <tr>
                                <th>Código</th><th>Nombre</th><th>Color Flor</th><th>Precio</th><th>Foto</th><th>Acciones</th>
                                </tr>`;
            plantasFiltradas.forEach((item: any) => {
                tabla +=`<tr>
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
}