sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/Dialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, MessageBox, Fragment, Dialog) {
        "use strict";

        return Controller.extend("MiniSap.project1.controller.View1", {
            onInit: function () {

                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();

                oModel.read("/UserSet", {
                    success: function (oData, response) {
                        var Model = response.data.results;
                        var oJsonModel = new sap.ui.model.json.JSONModel(Model);
                        this.getView().setModel(oJsonModel, "User");
                    }.bind(this)
                });




            },
            onCrearUser: function () {


                this.fragmento = sap.ui.xmlfragment("MiniSap.project1.fragments.CrearUser", this);
                this.getView().addDependent(this.fragmento);
                this.fragmento.open();


                /// MessageToast.show("Ingrese todos los campos obligatorios");


            },
            onVolver: function () {

                //this.getView().setBusy(false);
                this.fragmento.close();
                this.fragmento.destroy();




            },
            _crearObjUsuario: function () {
                var isUsuario = sap.ui.getCore().byId("isUsuario").getValue()
                var nombre = sap.ui.getCore().byId("nombre").getValue();
                var apellido = sap.ui.getCore().byId("apellido").getValue();
                var mail = sap.ui.getCore().byId("mail").getValue();


                var usuario = {
                    ID: isUsuario,  /*char de 10*/
                    Nombre: nombre,			/*char 40*/
                    Apellido: apellido,     /*char 40*/
                    Email: mail,		       /*char 241*/

                };

                var oModel = this.getOwnerComponent().getModel();


                oModel.create("/UserSet", usuario, {
                    success: function (oData, oResponse) {
                        var oMessages = $.parseJSON(oResponse.headers["sap-message"]);
                        console.log(oMessages.message);

                        if (oMessages.message === "OK") {

                            var mensaje = "Se ha generado el Lote correctamente"
                            MessageBox.success(mensaje);

                        } else {
                            sap.m.MessageBox.error("Se ha producido un error: " + oMessages.message + " .");

                        }

                    }.bind(this),
                    error: function (e) {
                        MessageBox.error("Hubo un error al guardar los datos.");
                        console.log(e);
                    }.bind(this)
                });

            },
            OnUpload: function (oEvent) {

                this.fragmento = sap.ui.xmlfragment("MiniSap.project1.fragments.Upload", this);
                this.getView().addDependent(this.fragmento);
                this.fragmento.open();


                var oModel = this.getOwnerComponent().getModel().oData;
                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                const arr = Object.values(oModel);

                var i = sPath.slice(1, 2);




                arr.forEach((obj, index) => {
                    if (index == i) {

                        var id = obj.ID,
                            nombre = obj.Nombre,
                            apellido = obj.Apellido,
                            Email = obj.Email;

                        sap.ui.getCore().byId("inputId").setValue(id);
                        sap.ui.getCore().byId("inputNombre").setValue(nombre);
                        sap.ui.getCore().byId("inputApellido").setValue(apellido);
                        sap.ui.getCore().byId("inputEmail").setValue(Email);
                    }

                })


            },
            FilaPress: function () {
                MessageBox.success("Buenas");


            },
            oncancelar: function () {
                this.fragmento.close();
                this.fragmento.destroy();

            },
            onUploadDatos: function (oEvent) {

                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var isUsuario = sap.ui.getCore().byId("inputId").getValue();
                var nombre = sap.ui.getCore().byId("inputNombre").getValue();
                var apellido = sap.ui.getCore().byId("inputApellido").getValue();
                var mail = sap.ui.getCore().byId("inputEmail").getValue();

                oModel.setUseBatch(false);

                var usuario = {
                    ID: isUsuario,  /*char de 10*/
                    Nombre: nombre,			/*char 40*/
                    Apellido: apellido,     /*char 40*/
                    Email: mail		       /*char 241*/

                }
                oModel.update("/UserSet('" + usuario.ID + "')", usuario, {
                    success: function (oData, oResponse) {
                        console.log(oResponse);


                    }, error: function (oError) {
                        console.log(oError);




                    }
                })



            },
            onCargarDatos: function (oEvent) {
                var usuario = this._crearObjUsuario();
                var oModel = this.getOwnerComponent().getModel();
                this.fragmento.close();
                this.fragmento.destroy();


            }

        });
    });
