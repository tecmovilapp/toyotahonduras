var hostdir = "http://www.yourappland.com/applications/corporacionflores/";
//var hostdir = "http://10.0.2.2/corporacionflores/";
//var hostdir = "http://192.168.200.104/apps/ionic1.7/toyotahonduras/SERVER/";
var host = hostdir+"api_flores.php?appId=0d83420a189fab5cb7197dc431bae006";
angular.module('starter.controllers', [])
.directive('imageonload', function() {//PRELOAD PARA LAS IMAGENES
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
              var finalElement = angular.element( document.querySelector( '#item'+ element.attr("item-id")) ).attr("src", element.attr("src"));
            });
        }
    };
})
.directive('imageonload1', function() {//PRELOAD PARA LAS IMAGENES
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
              var finalElement = angular.element( document.querySelector( '#item'+ element.attr("item-id")) ).css("background-image","url("+element.attr("src")+")");//) =  element.attr("src");
            });
        }
    };
    
})
.controller('AppCtrl', function($scope, $api, $ionicModal, $timeout, $ionicLoading) {

  //LOADING CODE
  $scope.showLoadingGlobal = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });
  };
  $scope.hideLoadingGlobal = function(){
    $ionicLoading.hide();
  };

  $timeout(function(){
    window.plugins.OneSignal.init("8ed52dc0-fd11-4fb2-b8fc-dcb47500023d",
      {googleProjectNumber: "71870260750"},
      function(data) {
        $api.alerta(data.additionalData.title, data.message);
    });
  },5000);

}) //FIN APPCTRL

.controller('mainCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout, $ionicModal) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.ads = { "id": "", "imagenSmall": "", "imagenLarge": "", "enlace": "", "descripcion": "", "fecha": "" };
  var myRequest = 'action=get-ads';
  $scope.showLoadingGlobal();
  $timeout(function(){
    $scope.hideLoadingGlobal();
    if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
      //$state.go("app.config");
    }
  },2500)


  $scope.openMiToyota = function() {
    $api.openUrl('http://toyotahonduras.com/comparador','_system','no');
  };

  //MODAL TOYOTA
  $ionicModal.fromTemplateUrl('templates/modal-toyota.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalToyota = modal;
  });

  $scope.openModalToyota = function() {
    $scope.modalToyota.show();
  };
  $scope.closeModalToyota = function() {
    $scope.modalToyota.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modalToyota.remove();
  });


  //MODAL OMERHSA
  $ionicModal.fromTemplateUrl('templates/modal-omerhsa.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalOmerhsa = modal;
  });

  $scope.openModalOmerhsa = function() {
    $scope.modalOmerhsa.show();
  };
  $scope.closeModalOmerhsa = function() {
    $scope.modalOmerhsa.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modalOmerhsa.remove();
  });

  $scope.openFacebookChat = function(){
    $api.openUrl('https://www.facebook.com/messages/t/toyotahonduras/','_system','no');
  };

  $scope.openWeb = function(){
    $api.openUrl('http://toyotahonduras.com/nosotros/','_system','no');
  };

  $scope.openFacebook = function(){
    $api.openUrl('https://www.facebook.com/toyotahonduras/','_system','no');
  };

  $scope.openToyota = function(){
    $api.openUrl('http://toyotahonduras.com','_system','no');
  };

  $scope.CallTel = function(tel) {
      window.location.href = 'tel:'+ tel;
  }

  $scope.getAds = function(){
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.ads = data;
    }).error(function(data, status, headers, config) {});
  };

  $scope.openAds = function(){
    $api.openUrl($scope.ads.enlace, "_system", "no");
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.ads = { "id": "", "imagenSmall": "", "imagenLarge": "", "enlace": "", "descripcion": "", "fecha": "" };
    $timeout(function(){
      $scope.getAds();
    },500);
  });

}) //FIN MAIN

.controller('citasCtrl', function($scope, $api, $ionicPopup, $state, $ionicSideMenuDelegate, $timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.error = false;
  $scope.originalDate = new Date();
  if($api.getVar("mycars")===null || $api.getVar("mycars") === undefined){
    $api.setVar("mycars",JSON.stringify([]));
  }
  $scope.mycars = JSON.parse($api.getVar("mycars"));
  $scope.datos = {nombre:"", telefono:"", email:"", carro:"", placa:"", vin:"", ciudad:"", tipo:"", taller:"", sdate:"", senddate:"", nota:"", trans:false, avance:false};
  if($scope.mycars.length>0){
    $scope.datos.carro = $scope.mycars[0].modelo;
    $scope.datos.placa = $scope.mycars[0].placa;
    $scope.datos.vin = $scope.mycars[0].vin;
  }
  if($api.getVar("nombre") != null){
    $scope.datos.nombre = $api.getVar("nombre");
  }
  if($api.getVar("telefono") != null){
    $scope.datos.telefono = $api.getVar("telefono");
  }
  if($api.getVar("email") != null){
    $scope.datos.email = $api.getVar("email");
  }
  if($api.getVar("ciudad") != null){
    $scope.datos.ciudad = $api.getVar("ciudad");
  }

 
  $scope.formatDate = function (date){
    if(isNaN(date)){
      date = new Date();
    }
    $scope.originalDate = date;
    var fechaS = new Date(date);
    var mes = (fechaS.getMonth()+1<10)?("0"+(fechaS.getMonth()+1)):(fechaS.getMonth()+1);
    var dia = (fechaS.getDate()<10)?"0"+fechaS.getDate():fechaS.getDate();
    var hora = (fechaS.getHours()<10)?("0"+fechaS.getHours()):fechaS.getHours();
    var minute = (fechaS.getMinutes()<10)?("0"+fechaS.getMinutes()):fechaS.getMinutes();
    $scope.datos.senddate = fechaS.getFullYear()+"-"+mes+"-"+dia+" "+hora+":"+minute;
    var hora1 = (fechaS.getHours()>12)? (fechaS.getHours()-12) :fechaS.getHours();
    $scope.datos.sdate = fechaS.getDate()+" "+$api.getMonth(fechaS.getMonth())+" "+fechaS.getFullYear()+" "+hora1+":"+minute+((fechaS.getHours()<12)?" AM":" PM");
    $timeout(function(){
      $scope.$apply();
    },500)
  }

  $scope.fechao = new Date();
  $scope.fechao.setDate(new Date().getDate()-1);
  $scope.formatDate(new Date());

  $scope.onError = function(error) {
      console.log('Error: ' + error);
  };

  
  $scope.openNativePicker = function(){
    datePicker.show({date:$scope.originalDate, mode: 'datetime',minuteInterval:20,minDate: ((device.platform==="Android")?Date.now():$scope.fechao)}, $scope.formatDate, $scope.onError);
  };

  $scope.changePlaca = function(){
    for (var i = 0; i < $scope.mycars.length; i++) {
      if($scope.datos.carro === $scope.mycars[i].modelo){
        $scope.datos.placa = $scope.mycars[i].placa;
        $scope.datos.vin = $scope.mycars[i].vin;
        return;
      }
    };
  };// FIN chagePlaca

  $scope.getDataAppointment = function(){
    $scope.error = false;
    $scope.showLoadingGlobal();
    var myRequest = 'action=get-data-appointment';
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.tipos = data[0];
      $scope.datos.tipo = $scope.tipos[0].nombre;
      $scope.talleres = data[1];
      $scope.datos.taller = $scope.talleres[0].nombre;
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.error = true;
    });
  }

  $scope.confirmAppointment = function() {
   $scope.inf = "Nombre: "+$scope.datos.nombre+"<br>";
   $scope.inf += "Telefono: "+$scope.datos.telefono+"<br>";
   $scope.inf += "Email: "+$scope.datos.email+"<br>";
   $scope.inf += "Vehiculo: "+$scope.datos.carro+"<br>";
   $scope.inf += "Placa: "+$scope.datos.placa+"<br>";
   $scope.inf += "Ciudad: "+$scope.datos.ciudad+"<br>";
   $scope.inf += "Tipo: "+$scope.datos.tipo+"<br>";
   $scope.inf += "Taller: "+$scope.datos.taller+"<br>";
   $scope.inf += "Fecha y hora: "+$scope.datos.sdate+"<br>";
   $scope.inf += "Necesita transporte: "+(($scope.datos.trans)?"Si":"No")+"<br>";
   $scope.inf += "Avance Plus: "+(($scope.datos.avance)?"Si":"No")+"<br>";
   $scope.inf += "Nota adicional:"+$scope.datos.nota;
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmaci&oacute;n',
     template: '<h5 style="color:#c2000b">Si esta seguro de solicitar la cita de servicios con esta informaci&oacute;n precione "Si"</h5><br>'+$scope.inf,
     cancelText: 'No',
     okText: 'Si',
     okType:'button-assertive-custom'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.sendAppointment();
     }
   });
 };

  $scope.sendAppointment = function(){
    var myRequest = 'action=send-appointment&nombre='+$scope.datos.nombre+"&telefono="+$scope.datos.telefono+"&email="+$scope.datos.email+"&carro="+$scope.datos.carro+"&placa="+$scope.datos.placa+"&ciudad="+$scope.datos.ciudad+"&tipo="+$scope.datos.tipo+"&taller="+$scope.datos.taller+"&fecha="+$scope.datos.sdate+"&fechafull="+$scope.datos.senddate+"&nota="+$scope.datos.nota+"&transporte="+$scope.datos.trans+"&avance="+$scope.datos.avance;
    $scope.showLoadingGlobal();
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.datos.trans = false;
      $scope.datos.avance = false;
      fecha = new Date();
      var mes = (fecha.getMonth()+1<10)?("0"+(fecha.getMonth()+1)):(fecha.getMonth()+1);
      var dia = (fecha.getDate()<10)?"0"+fecha.getDate():fecha.getDate();
      $scope.datos.sdate = fecha.getFullYear()+"-"+mes +"-"+dia;
      $api.alerta("Aviso","Su cita ha sido programada.")
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main") {
      $timeout(function(){
        $scope.getDataAppointment();
      },500);
    }
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });

}) //FIN citasCTRL

.controller('cardBacCtrl', function($scope, $api, $ionicModal, $state, $ionicSideMenuDelegate, $timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.error = false;
  $scope.bac = {descripcion:"", pdf:"", correo:""};
  $scope.datos = {nombre:"", telefono:"", email:"",  ciudad:"", identidad:""};
  
  if($api.getVar("nombre") != null){
    $scope.datos.nombre = $api.getVar("nombre");
  }
  if($api.getVar("telefono") != null){
    $scope.datos.telefono = $api.getVar("telefono");
  }
  if($api.getVar("email") != null){
    $scope.datos.email = $api.getVar("email");
  }
  if($api.getVar("ciudad") != null){
    $scope.datos.ciudad = $api.getVar("ciudad");
  }
  if($api.getVar("identidad") != null){
    $scope.datos.identidad = $api.getVar("identidad");
  }

  $scope.getTarjetaBacCF = function(){
    $scope.error=false;
    $scope.showLoadingGlobal();
    var myRequest = 'action=get-bac-cf';
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.bac = data;
    }).error(function(data, status, headers, config) {
      $scope.error = true;
      $scope.hideLoadingGlobal();
    });
  };

  
  $scope.openPDF = function(){
    $api.openUrl($scope.bac.pdf, "_blank", "yes");
  };

  //COTIZACION
  $ionicModal.fromTemplateUrl('templates/card-request.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.cardrequest = modal;
  });

  $scope.openSendCardRequest = function() {
    $scope.cardrequest.show();
  };
  $scope.closeSendCardRequest = function() {
    $scope.cardrequest.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.cardrequest.remove();
  });

  $scope.sendCardRequest = function(){
    var myRequest = 'action=send-card-request&nombre='+$scope.datos.nombre+"&telefono="+$scope.datos.telefono+"&email="+$scope.datos.email+"&ciudad="+$scope.datos.ciudad+"&identidad="+$scope.datos.identidad;
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.closeSendCardRequest();
      $api.toast("La solicitud ha sido enviada.", 2500);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud.");
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main"){
      $scope.bac = {descripcion:"", pdf:"", correo:""};
      $timeout(function(){
        $scope.getTarjetaBacCF();
      },500);
    }
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });

}) //FIN CARD BAC

.controller('vehiculosCatCtrl', function($scope, $stateParams, $api, $state, $ionicSideMenuDelegate, $timeout) {
  	$ionicSideMenuDelegate.canDragContent(false);
  	$scope.cars = [];
  	$scope.category = "";
    $scope.numcars = -1;
    $scope.error = false;
    $scope.idCat = $stateParams.catid;
  	var myRequest = 'action=get-cars&idCarCat='+$scope.idCat;

  	$scope.getCars = function(){
      $scope.numcars = -1;
      $scope.error = false;
  		$scope.showLoadingGlobal();
  		$api.serverRequest(myRequest).success(function(data, status, headers, config) {
  		  $scope.hideLoadingGlobal();
  		  $scope.category = data[0];
  		  $scope.cars = data[1];
        $scope.numcars = $scope.cars.length;
  		}).error(function(data, status, headers, config) {
  		  $scope.error = true;
        $scope.hideLoadingGlobal();
  		});
  	}
  	$scope.getCars();

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.vehiculos"){
      $scope.category = [];
      $scope.cars = [];
      $scope.numcars =-1;
      $timeout(function(){
        $scope.getCars();
      },500);
    }
  });
	
}) // FIN VEHICULOS CAT

.controller('singleVehiculoCtrl', function($scope, $ionicModal, $stateParams, $api, $state, $ionicSideMenuDelegate, $timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.idCar = $stateParams.idcar;
  $scope.idCat = $stateParams.catid;
  var myRequest = 'action=get-car-data&idCar='+$scope.idCar;
  $scope.bigImage = "";
  if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
    $scope.quote = {nombre:"", apellido:"", identidad:"", telefono:"", email:"", /*ciudad:"",*/ car:[], comentarios:""};
  } else {
    $scope.quote = {
      nombre:$api.getVar("nombre"),
      apellido:"", 
      identidad:"",
      telefono:$api.getVar("telefono"), 
      email:$api.getVar("email"), 
      /*ciudad:$api.getVar("ciudad"),*/
      car:[],
      comentarios:""
    };
  }

  $scope.shareCarLink = function(){
    $api.shareLink($scope.car.enlace);
  };

  $scope.getCarData = function(){
    $scope.error = false;
    $scope.showLoadingGlobal();
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.car = data[0];
      $scope.fotos = data[1];
      $scope.bigImage = ($scope.fotos.length>1)?$scope.fotos[0].url:"";
      $scope.quote.car = data[0];
    }).error(function(data, status, headers, config) {
      $scope.error = true;
      $scope.hideLoadingGlobal();
    });
  }

  $scope.changeImage = function(url){
    $scope.bigImage = url;
  };
  $scope.openPDF = function(){
    $api.openUrl($scope.car.pdf, "_blank", "yes");
  };

  //COTIZACION CARRO 
  $scope.sucursales = [{nombre:"Tegucigalpa, Col. El Prado"}, {nombre:"Tegucigalpa, Anillo Periférico"}, {nombre:"San Pedo Sula"}, {nombre:"La Ceiba"}, {nombre:"Choluteca"}];  
  $scope.sucursal = $scope.sucursales[0].nombre;
  $scope.updateSucursal = function() {
      $scope.sucursal = this.sucursal;
  };

  $scope.modelos = [{nombre:"Agya"}, {nombre:"Etios"}, {nombre:"Yaris"}, {nombre:"Corolla"}, {nombre:"Rush"}, {nombre:"Agya"}, {nombre:"Avanza"}, {nombre:"Rav4"}, {nombre:"Fortuner"}, {nombre:"Land Cruiser Prado"}, {nombre:"Land Cruiser Station Wagon"}, {nombre:"Hilux Cabina Sencilla 4x2"}, {nombre:"Hilux Doble Cabina 4x2"}, {nombre:"Hilux Doble Cabina 4x2 Prerruner"}, {nombre:"Hilux Cabina Sencilla 4x4"}, {nombre:"Hilux Extra Cabina 4x4"}, {nombre:"Hilux Doble Cabina 4x4"}, {nombre:"Land Cruise Pick Up"}, {nombre:"GT 86"}, {nombre:"Hiace Panel"}, {nombre:"Hiace Pasajeros Techo Bajo"}, {nombre:"Hiace Pasajeros Techo Alto"}, {nombre:"Coaster"}];  
  $scope.modelo = $scope.modelos[0].nombre;
  $scope.updateModelo = function() {
      $scope.modelo = this.modelo;
  };


  //$scope.comentarios = "";

  $ionicModal.fromTemplateUrl('templates/car-quote.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.carquote = modal;
  });

  $scope.openQuote = function() {
    $scope.carquote.show();
  };
  $scope.closeQuote = function() {
    $scope.carquote.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.carquote.remove();
  });

  //PRUEBA MANEJO
  $scope.sucursalesPrueba = [{nombre:"Tegucigalpa, Col. El Prado"}, {nombre:"Tegucigalpa, Anillo Periférico"}, {nombre:"San Pedo Sula"}, {nombre:"La Ceiba"}, {nombre:"Choluteca"}];  
  $scope.sucursalPrueba = $scope.sucursalesPrueba[0].nombre;

  $scope.modelosPrueba = [{nombre:"Agya"}, {nombre:"Etios"}, {nombre:"Yaris"}, {nombre:"Corolla"}, {nombre:"Rush"}, {nombre:"Agya"}, {nombre:"Avanza"}, {nombre:"Rav4"}, {nombre:"Fortuner"}, {nombre:"Land Cruiser Prado"}, {nombre:"Land Cruiser Station Wagon"}, {nombre:"Hilux Cabina Sencilla 4x2"}, {nombre:"Hilux Doble Cabina 4x2"}, {nombre:"Hilux Doble Cabina 4x2 Prerruner"}, {nombre:"Hilux Cabina Sencilla 4x4"}, {nombre:"Hilux Extra Cabina 4x4"}, {nombre:"Hilux Doble Cabina 4x4"}, {nombre:"Land Cruise Pick Up"}, {nombre:"GT 86"}, {nombre:"Hiace Panel"}, {nombre:"Hiace Pasajeros Techo Bajo"}, {nombre:"Hiace Pasajeros Techo Alto"}, {nombre:"Coaster"}];  
  $scope.modeloPrueba = $scope.modelosPrueba[0].nombre;


  $ionicModal.fromTemplateUrl('templates/prueba-manejo.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.pruebamanejo = modal;
  });

  $scope.openPruebaManejo = function() {
    $scope.pruebamanejo.show();
  };
  $scope.closePruebaManejo = function() {
    $scope.pruebamanejo.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.pruebamanejo.remove();
  });

  $scope.sendQuote = function(){
    //var myRequest1 = 'action=send-car-quote&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&idCarro="+$scope.quote.car["id"]+"&sucursal="+$scope.sucursal+"&modelo="+$scope.modelo+"&comentarios="+$scope.quote.comentarios+"&apellido="+$scope.quote.apellido+"&identidad="+$scope.quote.identidad;
    var myRequest1 = 'action=send-car-quote&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&idCarro="+$scope.quote.car["id"]+"&sucursal="+$scope.sucursal+"&modelo="+$scope.modelo+"&comentarios="+$scope.quote.comentarios+"&apellido="+$scope.quote.apellido+"&identidad="+$scope.quote.identidad;

    $api.serverRequest(myRequest1).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.closeQuote();
      $api.toast("La solicitud se esta procesando, <br>le estaremos contactando lo <br>más pronto posible.",2500);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

  $scope.sendPruebaManejo = function(){
    var myRequest1 = 'action=send-quote-manejo&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&idCarro="+$scope.quote.car["id"]+"&sucursal="+$scope.sucursal+"&modelo="+$scope.modelo+"&comentarios="+$scope.quote.comentarios+"&apellido="+$scope.quote.apellido+"&identidad="+$scope.quote.identidad;
    $api.serverRequest(myRequest1).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.closeQuote();
      $api.toast("Su prueba de manejo será programada, <br>le estaremos contactando lo <br>más pronto posible.",2500);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.vehiculos_cat"){
      $timeout(function(){
        $scope.car = [];
        $scope.fotos = [];
        $scope.bigImage = "";
        $scope.quote.car = [];
        $scope.getCarData();
      },500);
    }
  });

}) //SIN SINGLE VEHICULO

.controller('avanceCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  var myRequest = 'action=get-avance-plus';
  $scope.error = false;
  $scope.avancedata = {descripcion:"", pdf:"", correo:"", video:""};

  if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
    $scope.avance = {nombre:"", phone:"", email:""};
  } else {
    $scope.avance = {nombre:$api.getVar("nombre"),phone:$api.getVar("telefono"), email:$api.getVar("email")};
  }

  $scope.getAvancePlus = function(){
    $scope.showLoadingGlobal();
    $scope.error = false;
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.avancedata = data;
    }).error(function(data, status, headers, config) {
      $scope.error = true;
      $scope.hideLoadingGlobal();
    });
  };

  $scope.openPDF = function(){
    $api.openUrl($scope.avancedata.pdf, "_blank", "yes");
  };

  $scope.openVideo = function(){
    $api.openUrl($scope.avancedata.video, "_system", "no");
  };
  $scope.shareAvance = function(){
    $api.shareLink($scope.avancedata.pdf);
  };

  $scope.sendAvanceRequest = function(){
    $scope.showLoadingGlobal();
    var myRequest = 'action=send-avance-request&nombre='+$scope.avance.nombre+"&telefono="+$scope.avance.telefono+"&email="+$scope.avance.email;
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.toast("La solicitud ha sido <br>enviada correctamente,<br> pronto le estaremos <br> enviando mas información.", 5000);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.avancedata = {descripcion:"", pdf:"", correo:"", video:""};
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
    if(toState.name==="app.main"){
      return;
    }
    $timeout(function(){
      $scope.getAvancePlus();
    },500);
  });

})//FIN AVANCE

.controller('vehiculosCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error
	var myRequest = 'action=get-car-category';

	$scope.getCategories = function(){
    $scope.error = false;
		$scope.showLoadingGlobal();
		$api.serverRequest(myRequest).success(function(data, status, headers, config) {
		  $scope.hideLoadingGlobal();
		  $scope.vehiculos = data;
		}).error(function(data, status, headers, config) {
      $scope.error = true;
		  $scope.hideLoadingGlobal();
		});
	}

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main"){
      $scope.vehiculos = [];
      $timeout(function(){
        $scope.getCategories();
      },500);
    }
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });
}) //FIN VEHICULO

.controller('productosAutomotricesCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error
	var myRequest = 'action=get-car-category';

	$scope.getCategories = function(){
    $scope.error = false;
		$scope.showLoadingGlobal();
		$api.serverRequest(myRequest).success(function(data, status, headers, config) {
		  $scope.hideLoadingGlobal();
		  $scope.vehiculos = data;
		}).error(function(data, status, headers, config) {
      $scope.error = true;
		  $scope.hideLoadingGlobal();
		});
	}

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main"){
      $scope.vehiculos = [];
      $timeout(function(){
        $scope.getCategories();
      },500);
    }
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });
}) //FIN PRODUCTOS AUTOMOTRICES

.controller('productosAutomotricesMarcasCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout, $stateParams) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error
  var myRequest = 'action=get-car-category';
  $scope.idCategoria = $stateParams.idCategoria;
  $scope.categorias = [
    "Lubricantes",
    "Baterias",
    "Llantas",
    "Accesorios",
    "Repuestos Legítimos Toyota"
  ];

  $scope.categoria = "Lubricantes";

	
}) //FIN PRODUCTOS AUTOMOTRICES MARCAS

.controller('productosAutomotricesDetalleCtrl', function($scope, $api, $ionicModal, $state, $ionicSideMenuDelegate, $timeout, $stateParams) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error
  var myRequest = 'action=get-car-category';
  $scope.idCategoria = $stateParams.idCategoria;
  $scope.idMarca = $stateParams.idMarca;
  $scope.categorias = [
    "Lubricantes",
    "Baterias",
    "Llantas",
    "Accesorios",
    "Repuestos Legítimos Toyota"
  ];

  $scope.categoria = "Lubricantes";

  //Accordion Start categoria 0 Marca 0
  if($scope.idCategoria == 0 && $scope.idMarca == 0 ){
    
    $scope.groups = [];
    for (var i=0; i<1; i++) {
      $scope.groups[i] = {
        name: "Lubricantes Superiores",
        items: []
      };
      for (var j=0; j<1; j++) {
        $scope.groups[i].items.push(
          'Las condiciones reales de operación de su motor son severas pero afortunadamente existe Quaker State, brindándole dos veces más protección que otras marcas. En Quaker State nuestro objetivo es optimizar al máximo el rendimiento de su motor. Quaker State le ofrece una gama de productos diseñados para asegurar la máxima protección contra el desgaste, oxidación y acumulación de depósitos de sedimentos y barnices, posibilitando que su vehículo alcance el mejor desempeño siempre. Quaker State resguarda como ninguno los componentes internos de su motor, tales como: transmisión, diferencial, dirección asistida y frenos.'+
          'Los productos Quaker State son utilizados por el equipo que más campeonatos ha ganado en Nascar en los últimos cinco años: One Sprint Cup y el Team Hendrick Motorsport.'
        );
      }
    }
    
       
  }
  //Accordion End categoria 0 Marca 0

  //Accordion Start categoria 0 Marca 1
  if($scope.idCategoria == 0 && $scope.idMarca == 1 ){
    
    $scope.groups = [
      {
        name: "Aceites Motorcraft se crearon para el rendimiento y estos",
        items : ["Ayudan a mejorar el ahorro de combustible. Ayudan a disminuir los depósitos y residuos que comprometen el rendimiento. Ayudan a proteger las partes cruciales del desgaste.</br>"]
      },
      {
        name: "Aceite Premium para motor de Motorcraft",
        items : ["Completamente formulado con aditivos y aceites con base hidrocraqueados para ayudar a proteger contra los depósitos y desgaste. Ayuda a proteger contra la oxidación por altas temperaturas, gelificación a bajas temperaturas, óxido y corrosión y espuma. Formulado para un fácil arranque en clima frío a temperaturas por debajo de -25°C (-13°F). Grados disponibles: SAE 10W-40."]
      },
      {
        name: "Aceite Premium con mezcla sintética de Motorcraft",
        items : ["Fabricado con la más alta calidad, aceites con base hidro procesada/sintética y aditivos especialmente formulados para disminuir el desgaste y sedimento del motor. Cumple con la categoría de servicio de conservación de energía/ API SM. Los aceites de mezcla sintética Motorcraft han sido probados detenidamente y se ha encontrado que su desempeño es excelente y protegen los aceites de motor con solventes refinados normales. Disponible en cantidades a granel, el uso de aceites a granel ayuda al medio ambiente. Grados disponibles: SAE 5W-20, 5W-30 Y 10W-30."]
      },
      {
        name: "Aceite completamente sintético de Motorcraft",
        items : ["Completamente formulado para ayudar a proteger los motores. Recomendado para uso en aplicaciones de motores de gasolina en temperaturas extremas incluyendo motores supercargados, turbo cargados o normalmente aspirados de alto rendimiento. Los aditivos que disminuyen la fricción del aceite sintético 5W-20 de Motorcraft da como resultado una disminución cuantificable del consumo de combustible cuando se compara con el aceite SAE 10W-30. Formulado para proporcionar arranques fáciles a temperaturas de hasta -30°C (-22°F) Grados disponibles: SAE 5W-20, 5W-30 y 5W-50."]
      },
      {
        name: "Aceites Motorcraft para motores diesel",
        items : ["Fabricados con aceite con base hidro procesada de alta calidad con aditivos diseñados para minimizar el carbón y desgaste y ayuda a proteger los sistemas de tratamiento posterior del escape, como los filtros de particulares. Diseñado específicamente para los motores Power Stroke Diesel. Cumple con la nueva categoría CJ-4 de servicio API. Grados disponibles: SAE 15W-30 y 15W-40"]
      }
    ];
    
    
     
  }
  //Accordion End categoria 0 Marca 1

//Accordion Start categoria 0 Marca 2
if($scope.idCategoria == 0 && $scope.idMarca == 2 ){
    
  $scope.groups = [
    {
      name: "Aditivos Especializados en la limpieza interna de tu motor.",
      items : ["Diseñado con Tecnología Sintética.Incorporan los últimos avances de la química molecular al producir aditivos de la más alta calidad bajo componentes sintéticos. Aditivo Oficial Grupo Flores en sus talleres de Servicio y Agencias de Repuestos."]
    }
  ];
  
  
   
}
//Accordion End categoria 0 Marca 2

//Accordion Start categoria 0 Marca 2
if($scope.idCategoria == 0 && $scope.idMarca == 3 ){
    
  $scope.groups = [
    {
      name: "Aceite de motor genuino de Toyota",
      items : ["Este aceite de motor está formulado con un paquete especial de aditivos que ayuda a proteger las superficies de metal y juntas del motor Toyota contra la corrosión, previene la formación de espuma y mantiene la aplicación correcta de aceite en las paredes de los cilindros.</br></br>Los mejorados del índice de viscosidad estabilizan los niveles de viscosidad para un amplio rango de temperaturas de operación."]
    },
    {
      name: "Aceite de motor sintético",
      items : ["Este aceite de motor está formulado con un paquete especial de aditivos que ayuda a proteger las superficies de metal y juntas del motor Toyota contra la corrosión, previene la formación de espuma y mantiene la aplicación correcta de aceite en las paredes de los cilindros.</br></br>Los mejorados del índice de viscosidad estabilizan los niveles de viscosidad para un amplio rango de temperaturas de operación.</br><li>Mejora la economía de combustible.</li><li>Mejora la estabilidad térmica.</li><li>Intervalos de cambio de aceite más largos.</li>      "]
    }
  ];
  
  
   
}
//Accordion End categoria 0 Marca 2

//Accordion Start categoria 1 Marca 0
if($scope.idCategoria == 1 && $scope.idMarca == 0 ){
    
  $scope.groups = [
    {
      name: "Panasonic.",
      items : ["Matsushita sigue innovando, ya que sus baterías para carro Panasonic brindan un rendimiento 20% superior a las tradicionales. Los avances en las investigaciones de Matsushita les permiten a las baterías para carro Panasonic desarrollar: </br></br><strong>Alto rendimiento:</strong> Mantienen un rendimiento constante que da la confianza y que facilita el arranque.</br></br><strong> Gran capacidad:</strong> Con el mismo tamaño, producen más poder eléctrico. </br></br><strong>A prueba de calor:</strong> Son residentes a las altas temperaturas, por lo que no se deforman ni se ven afectadas en su desempeño Larga vida. Gracias a los avances que se integran como un todo, las baterías para carro Panasonic gozan de una excepcional durabilidad."]
    },
    
    {
      name: "¿Qué hace diferente a Panasonic?",
      items : ["La mezcla de las técnicas desarrolladas por Matsushiba Battery CO. Ltda, hace que las baterías para carro Panasonic (Ca Expandido) tengan un excelente desempeño y alta capacidad.</br></br> <strong>Alta capacidad de arranque:</strong> La combinación de técnicas especiales de fabricación les dan, a las baterías para carro libre de mantenimiento de Panasonic, una capacidad de reproducción de energía que optimiza la capacidad de arranque de su vehículo. </br></br><strong>Diseño en función de larga vida:</strong> La batería mantienen su alto desempeño aun en condiciones extremas y por mucho tiempo, de forma que en condiciones normales su vida útil es excepcionalmente larga. </br></br><strong>Características optimas de auto-descarga y consumo de electrolito:</strong> De esta forma el alto desempeño de la batería se mantiene, sin necesidad de añadir agua, durante todo el periodo de expectativa de vida. </br></br><strong>La batería informa su estado:</strong> El diseño de la batería incluye un indicador que señala las condiciones y necesidades de la batería.</br></br> <strong>Seguridad:</strong> Las baterías Panasonic están equipadas con filtros que evitan la combustión y mejoran el continuo desempeño de la batería."]
    }


  ];
  
    
}
//Accordion End categoria 1 Marca 0

//Accordion Start categoria 1 Marca 1
if($scope.idCategoria == 1 && $scope.idMarca == 1 ){
    
  $scope.groups = [
    {
      name: "Baterías Motorcraft MAX.",
      items : ["<li>Excelente cobertura de garantía Limitada: 100 Meses (hasta 8 años) millaje ilimitado.</li></br><li>Periodo de reemplazo Gratuito de 36 meses ( 3 años)</li></br><li>Las aleaciones de vida útil larga y el diseño de red optimizado brindan un rendimiento excelente sobre diseños convencionales en condiciones de alta temperatura.</li></br><li>La construcción resistente al calor ayuda a reducir la corrosión, aumentar la vida útil de la batería y proporcionar un ciclo de vida más largo.</li>"]
    },
    
    {
      name: "Baterías Motorcraft PLUS",
      items : ["<li>Excelente cobertura de garantía limitada: 84 meses (7 años) millaje ilimitado.</li></br><li>Periodo de reemplazo Gratuito de 18 meses.</li></br><li>La construcción resistente al calor ayuda a reducir la corrosión, aumentar la vida útil de la batería y proporcionar un ciclo de vida más largo.</li>"]
    }


  ];
  
    
}
//Accordion End categoria 1 Marca 1



//Accordion Start categoria 2 Marca 0
if($scope.idCategoria == 2 && $scope.idMarca == 0 ){
    
  $scope.groups = [
    {
      name: "YOKOHAMA",
      items : ["Amplia variedad de Llantas de alto rendimiento para automóviles de Tecnología 100% Japonesa, Fue fundada en 1917.</br>Top 10 de los mejores fabricantes de llantas a nivel mundial.</br>Empresa Global con más de 20% del mercado Japonés.</br>EN Honduras las llantas Yokohama son distribuidoras por Toyopartes agencias de repuestos, desde el 2005.</br>"]
    },
    
    {
      name: "¿Porque marca la diferencia?",
      items : ["<li>Tiene una línea de neumáticos para todas las necesidades en todos los segmentos.</li></br><li>Introduce diseños de neumáticos agresivos, innovadores y progresistas al mercado que ayudan a mejorar la estética de su vehículo.</li></br><li>Llantas Yokohama rinden tanto en terrenos húmedos como secos.</li></br><li>Llantas diseñadas para altos índices de velocidad.</li></br><li>Yokohama produce llantas para muchas de las marcas más prestigiosas de vehículos a nivel mundial.</li></br><li>Contamos con gran stock de llantas y rines 12, 14, 15, 16, 17 y 18</li><br><li>Por la compra de sus llantas le ofrecemos armado, balanceo y válvula GRATIS</li>"]
    },
    {
      name: "Diseño",
      items : ["<li>Geolandar A/T-S: Buena conducta en ruta. Actitud todo terreno.</li></br><li>Geolandar H/T-S: Desde el manejo diario hasta las incursiones ocasionales en todo terreno, proporciona las estaciones.</li></br><li>Geolandar M/T: Proporciona calidad superior en durabilidad y tracción sobre todas las superficies y condiciones climáticas.</li></br><li>AVID Tourning – S: Llantas para turismo que cautiva con su grata combinación de confort capacidad y valor.</li></br><li>AVID TRZ – S: Llanta para turismo que cautiva con su grata combinación de confort, capacidad y valor.</li></br><li>AVID – TRZ: La llanta asimétrica para toda estación, proporciona confianza en condiciones de terreno seco o mojado.</li><br><li>AVID ENVIGOR: Ninguna otra llanta ofrece un rendimiento tan completo.</li><br>"]
    },
    {
      name: "Garantía de fábrica",
      items : ["<li>Llantas diseñadas para un rendimiento mínimo de 45,000 a 50,000 Kms.</li></br><li>Garantía no incluye daños ocasionados por uso indebido o mal manejo.</li>"]
    }


  ];
  
    
}
//Accordion End categoria 2 Marca 0

//Accordion Start categoria 2 Marca 1
if($scope.idCategoria == 2 && $scope.idMarca == 1 ){
    
  $scope.groups = [
    {
      name: "Llantas Kenda",
      items : ["En Kenda Nuestras llantas radiales son diseñadas utilizando la última tecnología y estándares de seguridad para ofrecer el máximo rendimiento , fiabilidad y vida útil del neumático además de estar disponible en una amplia variedad de llantas , los productos Kenda (llantas) son conocidos por su gran rendimiento y fiabilidad a un precio razonable.</br></br>Hoy en día, nuestros investigadores están trabajando constantemente con nuevos materiales, tecnologías y esforzándose para incrementar el rendimiento y la fiabilidad de todas nuestras llantas y productos.</br></br>En un mundo donde el rendimiento, la seguridad es la regla de superioridad, Kenda se está marcando la diferencia. Al proporcionar a la industria automotriz y de millones de conductores en todo el mundo con un producto que se define una ingeniería superior, los neumáticos Kenda ofrecen una experiencia de conducción única.</br>"]
    },
    
    {
      name: "Klever A/TKR28",
      items : ["Todo terreno con la capacidad de abordar su pista favorita local o su ruta de trabajo urbana cotidiana. El diseño único del neumático permite tracción para diversas aplicaciones y condiciones.</br></br><li>Doble construcción ceñidas de acero utilizado para la uniformidad y el desgaste de larga duración.</li></br><li>Capa adicional de protección caucho a lo largo de del rodaje para mejorar la retención de estabilidad y aire de presión de neumáticos.</li></br><li>Tela reforzada en el flanco para aumentar la resistencia de punción.</li>"]
    },
    {
      name: "Komet Plus KR23",
      items : ["<li>Touring radial con un diseño de la banda revolucionaria refinado por Kenda NMA tecnología, crea una de las más tranquilos neumáticos en la alineación de Kenda.</li></br><li>Ranuras de canalización de agua para mejorar la tracción sobre mojado y seco.</li></br><li>Caucho compuesto para toda  temporada, magnífica en el Invierno, el rendimiento con el kilometraje sin comparación.</li></br><li>Una tracción fiable en todas las condiciones del manejo al máximo en la  húmeda .</li>"]
    },
    {
      name: "Power Master KR12",
      items : ["<li>Diseño tradicional  de pisada de 5 costillas, permite gran manejo en condiciones  húmedas, junto con un desgaste prolongado.</li></br><li>Cinco costillas en el diseño con cuatro ranuras que ofrecen  un desgaste para prolongar la vida del neumático.</li></br><li>Rodadura  resistente para mayor economía.</li></br>"]
    },
    {
      name: "Koyote KR06",
      items : ["<li>Mezcla perfecta de durabilidad con la construcción avanzada que proporciona una conducción cómoda, con amplia vida en la  banda de rodadura.</li></br><li>Estructura reforzada con cinturones de acero para aplicaciones de trabajo pesado.</li></br><li>De alto rendimiento del centro de la llanta para una mayor durabilidad.</li></br>"]
    },
    {
      name: "Klever H / PKR 15",
      items : ["<li>El sólido centro de la costilla provisiona una gran economía  de combustible y capacidad de manejo excelente.</li></br><li>Costados alrededor de la llanta provisiona de una gran dispersión de agua  y reducir los niveles de ruido, haciéndolas mas  seguras y cómodas de manejo.</li></br><li>Costados para mejorar la reducción del ruido y el desgaste uniforme.</li></br><li>Mejora de la comodidad y la reducción del ruido de la carretera.</li>"]
    },
    {
      name: "K630",
      items : ["<li>De grano en el compuesto, las especificaciones de los neumáticos han fortalecido  la capacidad de carga para trabajo  mas pesado.</li></br><li>Cinco costillas y bandas de rodadura de diseño para una tracción excelente y manipulación.</li></br><li>Cuatro ranuras de ancho circunferencial ayudan  para eliminar el agua.</li>"]
    },
    {
      name: "K631",
      items : ["<li>La banda de rodamiento de diseño computarizado la  hace un gran neumático.</li></br><li>Excelente Manejo  en condiciones diferentes de carretera.</li></br><li>Equipo de diseño modular que utiliza las formas naturales para mejorar el desgaste y durabilidad.</li></br><li>Lo profundo de la circunferencia en las ranuras potenciales ayudan a  dispersar el agua, brindando un  mayor rendimiento.</li>"]
    },
    {
      name: "KLEVER M/TKR29",
      items : ["<li>Es una excelente opción para los amantes del Off-Road o individuos que requieren un neumático de alta tracción para su entorno de trabajo.</li></br><li>El compuesto de goma durable soportará los entornos de trabajo más exigentes.</li></br><li>Kenda M/T incorpora zapatas autolimpiables únicas para la tracción máxima durante las condiciones más duras.</li></br><li>Construcción doble cinturón de acero utilizado para la uniformidad y el desgaste de larga duración.</li>"]
    },






  ];
  
    
}
//Accordion End categoria 2 Marca 1



//Accordion Start categoria 3 Marca 0
if($scope.idCategoria == 3 && $scope.idMarca == 0 ){
    
  $scope.groups = [
    {
      name: "Accesorios",
      items : ["Le ofrecemos variedad de accesorios para equipar su vehículo según sus gustos y preferencias; contamos además con mano de obra especializada en el ramo y nuestro local se encuentra ubicado en un lugar accesible.</br></br>Encontrará todos los accesorios originales y genéricos para vehículos de las marcas Toyota, Lexus y Daihatsu.</br></br><strong>Estamos ubicados en:</br></strong></br><strong>Agencia CarDepot, Tegucigalpa.</strong></br>Col. El Prado, Parque Automotriz Toyota, vía puente San José, contiguo a Centro Comercial Plaza la Granja, Tel: 2216-4000, Ext. 1453 / 1454 </br></br><strong>Agencias CarDepot, San Pedro Sula.</strong></br> Tel: 2561-8600, 2556-7037, Ext. 2215 / 2216 </br></br><strong>Agencias CarDepot, La Ceiba</br></strong> Tel: 2442-4140, 2442-4711, Ext. 3410 / 341 1.</br></br><strong> Horario de Atención:</br></strong> Lunes a Viernes de 8:00 a.m. a 5:00 p.m. Sábado, de 8:00 a.m. a 12:00 m."]
    }


  ];
  
    
}
//Accordion End categoria 3 Marca 0


//Accordion Start categoria 4 Marca 0
if($scope.idCategoria == 4 && $scope.idMarca == 0 ){
    
  $scope.groups = [
    {
      name: "Repuestos Legítimos",
      items : ["Le ofrecemos variedad de accesorios para equipar su vehículo según sus gustos y preferencias; contamos además con mano de obra especializada en el&nbsp;ramo y nuestro local se encuentra ubicado en un lugar accesible."]
    }


  ];
  
    
}
//Accordion End categoria 4 Marca 0



  //Hide Show Accordion logic
  /*
    * if given group is the selected group, deselect it
    * else, select the given group
    */
   $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  }; 


  if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
    $scope.quote = {nombre:"", apellido:"", identidad:"", chasis:"", comentarios:"", telefono:"", email:"", ciudad:"", car:[]};
  } else {
    $scope.quote = {
      nombre:$api.getVar("nombre"),
      telefono:$api.getVar("telefono"), 
      email:$api.getVar("email"), 
      ciudad:$api.getVar("ciudad"),
      apellido:"", 
      identidad:"", 
      chasis:"", 
      comentarios:"",
      car:[]
    };
  }

  $scope.CallTel = function(tel) {
      window.location.href = 'tel:'+ tel;
  }

  //COTIZACION PRODUCTOS
  $scope.sucursales = [{nombre:"Tegucigalpa, Col. El Prado"}, {nombre:"Tegucigalpa, Anillo Periférico"}, {nombre:"San Pedo Sula"}, {nombre:"La Ceiba"}, {nombre:"Choluteca"}];  
  $scope.sucursal = $scope.sucursales[0].nombre;
  $scope.updateSucursal = function() {
      $scope.sucursal = this.sucursal;
  };

  $scope.modelos = [{nombre:"Agya"}, {nombre:"Etios"}, {nombre:"Yaris"}, {nombre:"Corolla"}, {nombre:"Rush"}, {nombre:"Agya"}, {nombre:"Avanza"}, {nombre:"Rav4"}, {nombre:"Fortuner"}, {nombre:"Land Cruiser Prado"}, {nombre:"Land Cruiser Station Wagon"}, {nombre:"Hilux Cabina Sencilla 4x2"}, {nombre:"Hilux Doble Cabina 4x2"}, {nombre:"Hilux Doble Cabina 4x2 Prerruner"}, {nombre:"Hilux Cabina Sencilla 4x4"}, {nombre:"Hilux Extra Cabina 4x4"}, {nombre:"Hilux Doble Cabina 4x4"}, {nombre:"Land Cruise Pick Up"}, {nombre:"GT 86"}, {nombre:"Hiace Panel"}, {nombre:"Hiace Pasajeros Techo Bajo"}, {nombre:"Hiace Pasajeros Techo Alto"}, {nombre:"Coaster"}];  
  $scope.modelo = $scope.modelos[0].nombre;
  $scope.updateModelo = function() {
      $scope.modelo = this.modelo;
  };
  

  $ionicModal.fromTemplateUrl('templates/productos-quote.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.productosquote = modal;
  });

  $scope.openQuoteProductos = function() {
    $scope.productosquote.show();
  };
  $scope.closeQuoteProductos = function() {
    $scope.productosquote.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.productosquote.remove();
  });

  $scope.CallTel = function(tel) {
      window.location.href = 'tel:'+ tel;
  }

  $scope.sendQuoteProductos = function(){
    var myRequest1 = 'action=send-quote-productos&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&descripcion="+$scope.categorias[$scope.idCategoria]+"&apellido="+$scope.quote.apellido+"&identidad="+$scope.quote.identidad+"&descripcion="+$scope.categorias[$scope.idCategoria]+"&chasis="+$scope.quote.chasis+"&comentarios="+$scope.quote.comentarios+"&sucursal="+$scope.sucursal+"&modelo="+$scope.modelo;
    $api.serverRequest(myRequest1).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.closeQuoteProductos();
      $api.toast("La solicitud se esta procesando, <br>le estaremos contactando lo <br>mas pronto posible.",2500);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

	$scope.getCategories = function(){
    $scope.error = false;
		$scope.showLoadingGlobal();
		$api.serverRequest(myRequest).success(function(data, status, headers, config) {
		  $scope.hideLoadingGlobal();
		  $scope.vehiculos = data;
		}).error(function(data, status, headers, config) {
      $scope.error = true;
		  $scope.hideLoadingGlobal();
		});
	}

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main"){
      $scope.vehiculos = [];
      $timeout(function(){
        $scope.getCategories();
      },500);
    }
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });
}) //FIN PRODUCTOS AUTOMOTRICES DETALLE

.controller('chatCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout, $stateParams) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error;

  if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
    $scope.quote = {nombre:"", telefono:"", email:"", ciudad:"", car:[]};
  } else {
    $scope.quote = {
      nombre:$api.getVar("nombre"),
      telefono:$api.getVar("telefono"), 
      email:$api.getVar("email"), 
      ciudad:$api.getVar("ciudad"),
      car:[]
    };
  }

  $scope.sendChat = function() {
    var myRequest1 = 'action=send-chat&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad;
    $api.serverRequest(myRequest1).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.toast("La solicitud se esta procesando, <br>le estaremos contactando lo <br>mas pronto posible.",2500);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

  

  //$scope.idCategoria = $stateParams.idCategoria;
  
}) //TALLERES

.controller('talleresCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout, $stateParams) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error
  var myRequest = 'action=get-car-category';

  $scope.idCategoria = $stateParams.idCategoria;
  
}) //TALLERES

.controller('talleresDetalleCtrl', function($scope, $ionicModal, $api, $state, $ionicSideMenuDelegate, $timeout, $stateParams) {
	$ionicSideMenuDelegate.canDragContent(false);
	$scope.vehiculos = [];
  $scope.error;
  $scope.idCategoria = $stateParams.idCategoria;
  $scope.categorias = [
    "Taller de Mecánica",
    "Taller de Pintura",
    "Taller Móvil",
    "Taller Express"
  ];
  var myRequest = 'action=get-car-category';
  if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
    $scope.quote = {nombre:"", apellido:"", identidad:"", telefono:"", email:"", ciudad:"", car:[], fecha:"", hora:"", chasis:"", placa:"", comentarios:""};
  } else {
    $scope.quote = {
      nombre:$api.getVar("nombre"),
      apellido:"", 
      identidad:"",
      telefono:$api.getVar("telefono"), 
      email:$api.getVar("email"), 
      ciudad:$api.getVar("ciudad"),
      car:[], 
      fecha:"", 
      hora:"", 
      chasis:"", 
      placa:"",
      comentarios:""
    };
  }


  //CITA TALLER
  $scope.talleres = [{nombre:"Tegucigalpa, Col. El Prado"}, {nombre:"Tegucigalpa, Palmira"}, {nombre:"San Pedro Sula, Blvd. Del Sur"}, {nombre:"Express Centro, SPS"}, {nombre:"La Ceiba"}, {nombre:"Choluteca"}, {nombre:"Taller Móvil Centro – Sur"}, {nombre:"Taller Móvil Zona Norte"}];  
  $scope.taller = $scope.talleres[0].nombre;
  $scope.updateTaller = function() {
      $scope.taller = this.taller;
  };

  $scope.modelos = [{nombre:"Agya"}, {nombre:"Etios"}, {nombre:"Yaris"}, {nombre:"Corolla"}, {nombre:"Rush"}, {nombre:"Agya"}, {nombre:"Avanza"}, {nombre:"Rav4"}, {nombre:"Fortuner"}, {nombre:"Land Cruiser Prado"}, {nombre:"Land Cruiser Station Wagon"}, {nombre:"Hilux Cabina Sencilla 4x2"}, {nombre:"Hilux Doble Cabina 4x2"}, {nombre:"Hilux Doble Cabina 4x2 Prerruner"}, {nombre:"Hilux Cabina Sencilla 4x4"}, {nombre:"Hilux Extra Cabina 4x4"}, {nombre:"Hilux Doble Cabina 4x4"}, {nombre:"Land Cruise Pick Up"}, {nombre:"GT 86"}, {nombre:"Hiace Panel"}, {nombre:"Hiace Pasajeros Techo Bajo"}, {nombre:"Hiace Pasajeros Techo Alto"}, {nombre:"Coaster"}];  
  $scope.modelo = $scope.modelos[0].nombre;
  $scope.updateModelo = function() {
      $scope.modelo = this.modelo;
  };

  $scope.tipos = [{nombre:"Preventivo"}, {nombre:"Correctivo"}, {nombre:"General"}, {nombre:"Pintura"}];  
  $scope.tipo = $scope.tipos[0].nombre;
  $scope.updateTipo = function() {
      $scope.tipo = this.tipo;
  };

  $ionicModal.fromTemplateUrl('templates/taller-quote.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.tallerquote = modal;
  });

  $scope.openQuoteTaller = function() {
    $scope.tallerquote.show();
  };
  $scope.closeQuoteTaller = function() {
    $scope.tallerquote.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.tallerquote.remove();
  });

  $scope.CallTel = function(tel) {
      window.location.href = 'tel:'+ tel;
  }

  $scope.sendQuoteTaller = function(){
    var myRequest1 = 'action=send-quote-taller&nombre='+$scope.quote.nombre+"&apellido="+$scope.quote.apellido+"&identidad="+$scope.quote.identidad+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&modelo="+$scope.modelo+"&taller="+$scope.taller+"&tipo="+$scope.tipo+"&fecha="+$scope.quote.fecha+"&hora="+$scope.quote.hora+"&chasis="+$scope.quote.chasis+"&placa="+$scope.quote.placa+"&comentarios="+$scope.quote.comentarios;
    $api.serverRequest(myRequest1).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.closeQuoteTaller();
      $api.toast("La solicitud se esta procesando, <br>le estaremos contactando lo <br>mas pronto posible.",2500);
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };
  
}) //TALLERES DETALLE

.controller('contactCtrl', function($scope, $api, $state, $ionicSideMenuDelegate, $timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  var myRequest = 'action=get-contact-info';
  $scope.contactdata = {telefono:"", enlace:""};
  if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ) {
    $scope.contact = {nombre:"",phone:"",email:"", tipo:"Comentario",comentario: ""};
  } else {
    $scope.contact = {nombre:$api.getVar("nombre"),phone:$api.getVar("telefono"), email:$api.getVar("email"), tipo:"Comentario",comentario: ""};
  }

  $scope.openChat = function(url){
    $api.openUrl(url, "_system", "no");
  };

  $scope.getContactInfo = function(){
    $scope.showLoadingGlobal();
    $scope.error = false;
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.contactdata = data;
    }).error(function(data, status, headers, config) {
      $scope.error = true;
      $scope.hideLoadingGlobal();
    });
  };

  $scope.sendContactData = function(){
    if(typeof $scope.contact === undefined){
      $api.alerta("Error", "Uno o mas campos esta vacios.");
      return;
    }

    if(typeof $scope.contact.nombre === undefined || 
       typeof $scope.contact.phone === undefined || 
       typeof $scope.contact.email === undefined || 
       typeof $scope.contact.tipo === undefined ||
       $scope.contact.nombre.toString().length < 1 ||
       $scope.contact.phone.toString().length < 1 ||
       $scope.contact.email.toString().length < 1 ){
      $api.alerta("Error", "Uno o mas campos esta vacios.");
      return;
    }
    var myRequest = 'action=send-contact-info&nombre='+$scope.contact.nombre+"&telefono="+$scope.contact.phone+"&email="+$scope.contact.email+"&tipo="+$scope.contact.tipo+"&comentario="+$scope.contact.comentario;
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.contact.tipo = "Comentario";
      $scope.contact.comentario = "";
      $api.alerta("Aviso", "La información ha sido enviada correctamente.");
    }).error(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $api.alerta("Error","Ocurrió un error al enviar la solicitud, por favor intenta nuevamente.");
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main"){
      $scope.contactdata = {telefono:"", enlace:""};
      $timeout(function(){
        $scope.getContactInfo();
      },500);
    }
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });

}) // FIN CONTACT

.controller('configCtrl', function($scope, $api, $stateParams, $ionicModal, $timeout, $ionicSideMenuDelegate, $ionicPopup) {
  $ionicSideMenuDelegate.canDragContent(false);
  var cdate = new Date();
  $scope.carYears = [];
  $scope.addcar ={"model":"","year":cdate.getFullYear().toString(),"placa":"","image":hostdir+'default_files/default.jpg'};
  $scope.mycars = Array();
  if(typeof $api.getVar("mycars")!=undefined && $api.getVar("mycars")!="undefined" && typeof $api.getVar("mycars")!=null && $api.getVar("mycars")!=null){
    $scope.mycars = JSON.parse($api.getVar("mycars"));
  }

  var myRequest = 'action=get-all-cars';
  $scope.bac = {descripcion:"", pdf:"", correo:""};

  $scope.getAllCars = function(){
    var cdate = new Date();
    $scope.showLoadingGlobal();
    $scope.carYears = [];
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.carlist = data;
      $scope.addcar.model = $scope.carlist[0].model;
      $timeout(function(){
        $scope.$apply();
      }, 1000);
      for(var i=cdate.getFullYear()+1; i > 1959; i-- ){
        $scope.carYears.push(i);
      }
    }).error(function(data, status, headers, config) {
        $api.alerta("Error", "Ocurrió un error al recuperar la información.");
        $scope.hideLoadingGlobal();
    });
  };

  $scope.saveConfig = function(){
    $scope.nume = 0;
    $scope.errores = "";
    if($scope.datos.nombre === "" || $scope.datos.nombre.length<1){
      $scope.errores = "*El campo NOMBRE esta vacio.<br>"
      $scope.nume++;
    }

    if($scope.datos.identidad === "" || $scope.datos.identidad.length<1 || isNaN($scope.datos.identidad)){
      $scope.errores += "*El numero de IDENTIDAD es incorrecto.<br>"
      $scope.nume++;
    }

    if($scope.datos.telefono === "" || $scope.datos.telefono.length<8 || isNaN($scope.datos.telefono)){
      $scope.errores += "*El numero de TELÉFONO es incorrecto.<br>"
      $scope.nume++;
    }

    if($scope.datos.email === "" || $scope.datos.email.length<1 || !$api.validaMail($scope.datos.email)){
      $scope.errores += "*El E-MAIL ingresado es incorrecto.<br>"
      $scope.nume++;
    }

    if($scope.datos.ciudad === "" || $scope.datos.ciudad.length<1){
      $scope.errores += "*El campo CIUDAD esta vacio."
      $scope.nume++;
    }

    if($scope.nume > 0){
      $api.alerta("Error", "Los siguientes campos tienen errores:<br>"+$scope.errores);
    } else {
      $api.setVar("nombre", $scope.datos.nombre);
      $api.setVar("identidad", $scope.datos.identidad);
      $api.setVar("telefono", $scope.datos.telefono);
      $api.setVar("email", $scope.datos.email);
      $api.setVar("ciudad", $scope.datos.ciudad);
      $api.toast("La información ha sido guardada");
    }
  };
  $scope.llenarDatos = function(){
    if( $api.getVar("nombre")===null || $api.getVar("identidad")===null || $api.getVar("telefono")===null || $api.getVar("email")===null || $api.getVar("ciudad")===null ){
      $scope.datos = {nombre:"",identidad:"",telefono:"",email:"",ciudad:""};
    } else {
      $scope.datos = {nombre:$api.getVar("nombre"),identidad:$api.getVar("identidad"),telefono:$api.getVar("telefono"),email:$api.getVar("email"),ciudad:$api.getVar("ciudad")};
    }
  };
  //FUNCIONES PARA TOMAR O SELECCIONAR FOTO
  $scope.selectOrigin = function(){
    $ionicPopup.show({
      template: 'Seleccione el origen la imagen.',
      title: 'Imagen del vehiculo',
      scope: $scope,
      buttons: [
        { 
          text: 'Camara',
          type: 'button-assertive',
          onTap: function(e) {
            $scope.takePicture();
          }
        },
        {
          text: 'Galeria',
          type: 'button-positive',
          onTap: function(e) {
            $scope.selectPicture();
          }
        }
      ]
    });
  };

  $scope.takePicture = function(){
    navigator.camera.getPicture(function(imageData) {
      var ft = new FileTransfer();
      var params = "appId=0d83420a189fab5cb7197dc431bae006&action=save-picture";
      //var host = "http://192.168.200.107/apps/ionic1.7/corporacionflores/SERVER/";
      var host = "http://www.yourappland.com/applications/corporacionflores/";
      $scope.showLoadingGlobal();
      ft.upload(imageData, encodeURI(host+"api_flores.php?"+params), 
        function(res){
          var data = res.response.split("@");
          $scope.addcar.image = data[1];
          $scope.$apply();
          $scope.hideLoadingGlobal();
        }, function(error){// ERROR FILE TRANSFER
          console.log(JSON.stringify(error));
          $scope.hideLoadingGlobal();
      });
    }, 
    function(message) {//ERROR CAMERA
      console.log('Error: ' + message);
    }, 
    { 
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI
    });//FIN CAMERA
  };

  $scope.selectPicture = function(){
    navigator.camera.getPicture(function(imageData) {
      var ft = new FileTransfer();
      var params = "appId=0d83420a189fab5cb7197dc431bae006&action=save-picture";
      //var host = "http://192.168.200.107/apps/ionic1.7/corporacionflores/SERVER/";
      var host = "http://www.yourappland.com/applications/corporacionflores/";
      $scope.showLoadingGlobal();
      ft.upload(imageData, encodeURI(host+"api_flores.php?"+params), 
        function(res){
          var data = res.response.split("@");
          $scope.addcar.image = data[1];
          $scope.$apply();
          $scope.hideLoadingGlobal();
        }, function(error){// ERROR FILE TRANSFER
          console.log(JSON.stringify(error));
          $scope.hideLoadingGlobal();
      });
    }, 
    function(message) {//ERROR CAMERA
      console.log('Error: ' + message);
    }, 
    { 
      quality: 50,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI
    });//FIN CAMERA
  };

  $scope.guardarVehiculo = function(){
    $scope.nume = 0;
    $scope.errores = "";
    if($scope.addcar.placa === "" || $scope.addcar.placa.length<1){
      $scope.errores = "*El campo PLACA esta vacio.<br>"
      $scope.nume++;
    }

    if($scope.nume > 0){
      $api.alerta("Error", "Los siguientes campos tienen errores:<br>"+$scope.errores);
    } else {
      if($scope.imageEdited == ""){
        $scope.mycars.push({"image":$scope.addcar.image, "placa":$scope.addcar.placa, "year":$scope.addcar.year, "modelo":$scope.addcar.model, "vin":$scope.addcar.vin});
      } else {
        for(var i=0;i<$scope.mycars.length;i++){
          if($scope.mycars[i].image === $scope.imageEdited){
            $scope.mycars[i].image = $scope.addcar.image;
            $scope.mycars[i].placa = $scope.addcar.placa;
            $scope.mycars[i].year = $scope.addcar.year;
            $scope.mycars[i].modelo = $scope.addcar.model;
            $scope.mycars[i].vin = $scope.addcar.vin;
            break;
          }
        }
      }
      $api.setVar("mycars",JSON.stringify($scope.mycars));
      $scope.closeAddCar();
    }
  };//GUARDAR CARRO

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/add-car.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  // Triggered in the login modal to close it
  $scope.closeAddCar = function() {
    $scope.modal.hide();
  };

  // Open modal
  $scope.openAddCar = function() {
    $scope.imageEdited = "";
    var cdate = new Date();
    $scope.addcar ={"model": $scope.carlist[0].model,"year":cdate.getFullYear().toString(),"placa":"","image":hostdir+'default_files/default.jpg?'+Math.floor((Math.random() * 1000)+1)+Math.floor((Math.random() * 1000) + 1000)+Math.floor((Math.random() * 1000) + 2000),"vin":""};
    $scope.mycars = Array();
    if(typeof $api.getVar("mycars")!=undefined && $api.getVar("mycars")!="undefined" && typeof $api.getVar("mycars")!=null && $api.getVar("mycars")!=null){
      $scope.mycars = JSON.parse($api.getVar("mycars"));
    } 
    $scope.modal.show();
  };

  $scope.openEditCar = function(model, year, image, placa, vin) {
    $scope.imageEdited = image;
    $scope.addcar ={"model":model, "year": year, "placa":placa, "image": image, "vin":vin};
    $scope.modal.show();
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
    if(toState.name==="app.main"){
      return;
    }
    $timeout(function(){
      $scope.getAllCars();
      $scope.llenarDatos();
    },500);
  });

  $scope.getAllCars();
  $scope.llenarDatos();

})//FIN CONFIG

.controller('promoCtrl', function($scope, $api, $ionicModal, $timeout) {
  $scope.promosByDate = [];
  $scope.promosById = [];
  $scope.promoFilter = [];
  $scope.search = false;
  $scope.datos= {search:"", filter:"titulo"}
  $scope.datos.search = "";
  $scope.numPromos = 1;
  $scope.promos = [];
  $scope.singleP = {};

  /*
  $scope.showSearch = function(){
    $scope.search = true;
  };*/

  $scope.sharePromo = function(url){
    $api.shareLink(url);
  };

  /*
  $scope.hideSearch = function(){
    $scope.search = false;
    $scope.datos.search = "";
    $scope.searchPromos();
  };
  */

  $scope.searchPromos = function(){
    $scope.numpromos = 1;
    $scope.promoFilter = [];
    $scope.temp = [];
    var cont = 0
        
    if($scope.datos.search ===""){
      $scope.promoFilter = $scope.promos;
    } else {
      for(var i=0;i<$scope.promos.length;i++){
        for(var t=0;t<$scope.promos[i].length;t++){
          if( $scope.promos[i][t].titulo.toLowerCase().search($scope.datos.search.toLowerCase()) != -1 || $scope.promos[i][t].descripcion.toLowerCase().search($scope.datos.search.toLowerCase()) != -1){
            $scope.temp.push($scope.promos[i][t]);
          }
        }

        if($scope.temp.length==2){
          $scope.promoFilter.push($scope.temp);
          $scope.temp = [];
        }
          
      }
      if($scope.temp.length == 1){
        $scope.temp.push({id:-1});
        $scope.promoFilter.push($scope.temp);
        $scope.temp = [];
      }
    }
    if($scope.promoFilter.length==0){
      $scope.numPromos = 0;
    } else {
      $scope.numPromos = $scope.promoFilter.length;
    }
  };

  $scope.changeFilter = function(){
    if($scope.datos.filter==="titulo"){
      $scope.promos = $scope.promosByDate;
    } else {
      $scope.promos = $scope.promosById;
    }
    $scope.searchPromos();
  };

  $scope.getPromos = function(){
    $scope.showLoadingGlobal();
    $scope.error= false;
    $scope.promos = [];
    var myRequest = "action=get-promos";
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.promosByDate = data[0];
      $scope.promosById = data[1];
      $scope.changeFilter();
    }).error(function(data, status, headers, config) {
        $scope.error= true;
        $scope.hideLoadingGlobal();
    });
  };

  //SINGLE PROMOCIONES
  $ionicModal.fromTemplateUrl('templates/single-promo.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.singlePromo = modal;
  });

  $scope.openSinglePromo = function(id) {
    for(var i=0;i<$scope.promoFilter.length;i++){
      if($scope.promoFilter[i][0].id === id){              
        $scope.singleP = $scope.promoFilter[i][0];
      } else if( $scope.promoFilter[i][1].id === id ) {
        $scope.singleP = $scope.promoFilter[i][1];
      }
    }
    $api.openUrl($scope.singleP.enlace,'_system','no');
    //$scope.singlePromo.show();
  };
  $scope.closeSinglePromo = function() {
    $scope.singlePromo.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.singlePromo.remove();
  });

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    
    if(fromState.name!=="app.promo"){
      $scope.promosByDate = [];
      $scope.promosById = [];
      $scope.promoFilter = [];
      $scope.search = false;
      $scope.datos= {search:"", filter:"titulo"}
      $scope.datos.search = "";
      $scope.numPromos = 1;
      $scope.promos = [];
      $scope.singleP = {};
      $timeout(function(){
        $scope.getPromos();
      },500);
    }

    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });

})//FIN PROMOCIONES

.controller('newsCtrl', function($scope, $api, $ionicModal, $timeout) {
  $scope.numNews = 1;
  $scope.newsL = [];
  $scope.error= false;

  $scope.getNews = function(){
    $scope.showLoadingGlobal();
    $scope.error= false;
    $scope.locations = [];
    $scope.numNews = 1;
    $scope.newsL = [];
    var myRequest = "action=get-news";
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.newsL = data;
      $scope.numNews = data.length;
    }).error(function(data, status, headers, config) {
        $scope.error= true;
        $scope.hideLoadingGlobal();
    });
  };

  $scope.shareNewsLink = function(url){
    $api.shareLink(url);
  };

  //SINGLE 
  $ionicModal.fromTemplateUrl('templates/single-news.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.singleNews = modal;
  });

  $scope.openSingleNews = function(id) {
    for(var i=0;i<$scope.newsL.length;i++){
      if($scope.newsL[i].id === id){
        $scope.singleN = $scope.newsL[i];
      }
    }
    $scope.singleNews.show();
  };
  $scope.closeSingleNews = function() {
    $scope.singleNews.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.singleNews.remove();
  });

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    
    if(fromState.name==="app.main"){
      $scope.numNews = 1;
      $scope.newsL = [];
      $timeout(function(){
        $scope.getNews();
      },500);
    }

    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });
})//FIN NOTICIAS

.controller('locationsCtrl', function($scope, $api, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  
  console.log("Ubicaciones Ctrl");
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.numLocations = 1;
  $scope.locations = [];
  $scope.locFilter = [];
  $scope.error= false;
  $scope.search = false;
  $scope.datos = {search: ""};

  
  
  $scope.openSingleLocation = function(nombre, lat, lng) {
      window.location.href = '#/app/main/locations/single_location/'+nombre+'/'+lat+'/'+lng;
  }

  $scope.CallTel = function(tel) {
      window.location.href = 'tel:'+ tel;
  }

  //COTIZACION
  $ionicModal.fromTemplateUrl('templates/redes-sociales.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.redessociales = modal;
  });

  $scope.openRedesSociales = function() {
    $scope.redessociales.show();
  };

  $scope.closeRedesSociales = function() {
    $scope.redessociales.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.redessociales.remove();
  });


  $scope.openFacebook = function(){
    $api.openUrl('https://www.facebook.com/toyotahonduras/','_system','no');
  };

  $scope.openTwitter = function(){
    $api.openUrl('https://twitter.com/toyotahonduras','_system','no');
  };

  $scope.openInstagram = function(){
    $api.openUrl('https://www.instagram.com/toyotahonduras/','_system','no');
  };

  $scope.openYoutube = function(){
    $api.openUrl('https://www.youtube.com/channel/UCfuN9GrSllq5GJBXMNe8D3g','_system','no');
  };

  $scope.showSearch = function(){
    $scope.search = true;
  };

  /*
  $scope.hideSearch = function(){
    $scope.search = false;
    $scope.datos.search = "";
    $scope.searchLocations();
  };
  */

  
  $scope.searchLocations = function(){
    $scope.numLocations = 1;
    $scope.locFilter = [];
    if($scope.datos.search ===""){
      $scope.locFilter = $scope.locations;
    } else {
      for(var i=0;i<$scope.locations.length;i++){
        if( $scope.locations[i].direccion.toLowerCase().search($scope.datos.search.toLowerCase()) != -1 || $scope.locations[i].nombre.toLowerCase().search($scope.datos.search.toLowerCase()) != -1){
          $scope.locFilter.push($scope.locations[i]);
        }
      }
    }
    if($scope.locFilter.length==0){
      $scope.numLocations = 0;
    } else {
      $scope.numLocations = $scope.locFilter.length;
    }
  };
  

  $scope.getLocations = function(){
    $scope.showLoadingGlobal();
    $scope.error= false;
    $scope.locations = [];
    var myRequest = "action=get-locations";
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.locations = data;
      $scope.searchLocations();
    }).error(function(data, status, headers, config) {
        $scope.error= true;
        
        $scope.hideLoadingGlobal();
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    
    if(fromState.name!=="app.single_location" && fromState.name!=="app.locations"){
      //$scope.numLocations = 1;
      //$scope.locations = [];
      //$scope.locFilter = [];
      //$scope.error= false;
      //$scope.search = false;
      $scope.datos = {search: ""};
      $timeout(function(){
        $scope.getLocations();
      },500);
    }

    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
  });

})//FIN UBICACIONES

.controller('singleLocationCtrl', function($scope, $api, $stateParams, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.nombre = $stateParams.nombre;
  $scope.lat = $stateParams.lat;
  $scope.lng = $stateParams.lng;
  $scope.map = null;

  $scope.initMap = function() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: parseFloat($scope.lat), lng: parseFloat($scope.lng)},
      zoom: 14,
      mapTypeControl:false,
      scaleControl: false,
      streetViewControl: false
    });
    $scope.marker = new google.maps.Marker({
      position: {lat: parseFloat($scope.lat), lng: parseFloat($scope.lng)},
      map: $scope.map,
      title: $scope.nombre
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name!=="app.locations"){
      angular.element( document.querySelector( '#map' ) ).remove();
      return;
    }
    $scope.initMap();
  });

})// FIN singleLocationCtrl


.controller('productosAutomotricesLocationCtrl', function($scope, $api, $stateParams, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  //$scope.nombre = $stateParams.nombre;
  //$scope.lat = $stateParams.lat;
  //$scope.lng = $stateParams.lng;
  $scope.map = null;
  $scope.initMap = function() {    
    

    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 14.662802, lng: -86.215980},
      zoom: 7,
      mapTypeControl:false,
      scaleControl: false,
      streetViewControl: false
    });

    //Marcador 1 INICIO
    var contentString1 = 
           '<div id="content">'+
              '<h2>Productos Automotrices</h2>'+
              '<div>'+
              '<p><b>Juticalpa</b>, Blvd. Los Poetas, Barrios las Acacias, Centro Comercial Nazareth, al costado sur de terminal de buses Discovery, linea de lujo.' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2785-2963&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow1 = new google.maps.InfoWindow({
      content: contentString1,
      maxWidth: 300
    });

    $scope.marker1 = new google.maps.Marker({
      position: {lat: 14.662802, lng: -86.215980},
      map: $scope.map,
      title: "Ubicación 1",
      labelContent: "ABCD"
    });

    $scope.marker1.addListener('click', function() {
      infowindow1.open($scope.map, $scope.marker1);
    });
    //Marcador 1 FIN


    //Marcador 2 INICIO
    var contentString2 = 
            '<div id="content">'+
              '<h2>Productos Automotrices</h2>'+
              '<div>'+
              '<p><b>Agencia Centro SPS.</b>, Barrio Guamilito, 3 ave, 6 calle frente a Diario La Prensa, San Pedro Sula.  ' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2553-1070&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow2 = new google.maps.InfoWindow({
      content: contentString2,
      maxWidth: 300
    });

    $scope.marker2 = new google.maps.Marker({
      position: {lat: 15.476639, lng: -88.032480},
      map: $scope.map,
      title: "Ubicación 2"
    });

    $scope.marker2.addListener('click', function() {
        infowindow2.open($scope.map, $scope.marker2);
      });
    //Marcador 2 FIN


    //Marcador 3 INICIO
    var contentString3 = 
            '<div id="content">'+
              '<h2>5 ta. Avenida</h2>'+
              '<div>'+
              '<p><b>Corporación Flores</b> ,Comayaguela ' +
              
              '</div>'+
            '</div>';

    var infowindow3 = new google.maps.InfoWindow({
      content: contentString3,
      maxWidth: 300
    });

    $scope.marker3 = new google.maps.Marker({
      position: {lat: 14.095098, lng: -87.209198},
      map: $scope.map,
      title: "Ubicación 3"
    });

    $scope.marker3.addListener('click', function() {
        infowindow3.open($scope.map, $scope.marker3);
      });
    //Marcador 3 FIN


    
    //Marcador 4 INICIO
    var contentString4 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>Danli.</b>,  Barrio el Centro, calle del comercio frente a Tigo Center' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2763-3305&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow4 = new google.maps.InfoWindow({
      content: contentString4,
      maxWidth: 300
    });

    $scope.marker4 = new google.maps.Marker({
      position: {lat: 14.030524, lng: -86.567733},
      map: $scope.map,
      title: "Ubicación 4"
    });

    $scope.marker4.addListener('click', function() {
        infowindow4.open($scope.map, $scope.marker4);
      });
    //Marcador 4 FIN

    
    //Marcador 5 INICIO
    var contentString5 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>Agencia Centro SPS.</b>, Barrio Guamilito, 3 ave, 6 calle frente a Diario La Prensa, San Pedro Sula.  ' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2553-1070&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow5 = new google.maps.InfoWindow({
      content: contentString5,
      maxWidth: 300
    });

    $scope.marker5 = new google.maps.Marker({
      position: {lat: 15.476639, lng: -88.032480},
      map: $scope.map,
      title: "Ubicación 5"
    });

    $scope.marker5.addListener('click', function() {
        infowindow5.open($scope.map, $scope.marker5);
      });
    //Marcador 5 FIN

    
    //Marcador 6 INICIO
    var contentString6 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>Tegucigalpa</b>, El Prado, Parque Automotriz Toyota vía puente San José. ' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2216-4000&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow6 = new google.maps.InfoWindow({
      content: contentString6,
      maxWidth: 300
    });

    $scope.marker6 = new google.maps.Marker({
      position: {lat: 14.083941, lng: -87.206104},
      map: $scope.map,
      title: "Ubicación 2"
    });

    $scope.marker6.addListener('click', function() {
        infowindow6.open($scope.map, $scope.marker6);
      });
    //Marcador 6 FIN

    
    //Marcador 7 INICIO
    var contentString7 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>Comayagua</b>, Final del Blvd, Cuarto Centenario, salida a la Libertad, antes de la Cámara de Comercio e Industria de Comayagua.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2772-0695&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow7 = new google.maps.InfoWindow({
      content: contentString7,
      maxWidth: 300
    });

    $scope.marker7 = new google.maps.Marker({
      position: {lat: 14.466235,  lng: -87.646263},
      map: $scope.map,
      title: "Ubicación 2"
    });

    $scope.marker7.addListener('click', function() {
        infowindow7.open($scope.map, $scope.marker7);
      });
    //Marcador 7 FIN

    
    //Marcador 8 INICIO
    var contentString8 = 
            '<div id="content">'+
              '<h2>Súper Car</h2>'+
              '<div>'+
              '<p><b>Corporación Flores</b>, Tegucigalpa.  ' +
           
              '</div>'+
            '</div>';

    var infowindow8 = new google.maps.InfoWindow({
      content: contentString8,
      maxWidth: 300
    });

    $scope.marker8 = new google.maps.Marker({
      position: {lat: 14.095599, lng: -87.210143},
      map: $scope.map,
      title: "Ubicación 2"
    });

    $scope.marker8.addListener('click', function() {
        infowindow8.open($scope.map, $scope.marker8);
      });
    //Marcador 8 FIN

    
    //Marcador 9 INICIO
    var contentString9 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>La Ceiba</b>, Colonia Palmira, carretera La Ceiba.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2442-4140&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow9 = new google.maps.InfoWindow({
      content: contentString9,
      maxWidth: 300
    });

    $scope.marker9 = new google.maps.Marker({
      position: {lat: 15.755190, lng: -86.832953},
      map: $scope.map,
      title: "Ubicación 9"
    });

    $scope.marker9.addListener('click', function() {
        infowindow9.open($scope.map, $scope.marker9);
      });
    //Marcador 9 FIN

    
    //Marcador 10 INICIO
    var contentString10 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>Choluteca</b>, Carretera Panamericana, salida a Guasaule contiguo a Cruz Roja Hondureña, Parque Automotriz Toyota.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2785-2524&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow10 = new google.maps.InfoWindow({
      content: contentString10,
      maxWidth: 300
    });

    $scope.marker10 = new google.maps.Marker({
      position: {lat: 13.309830, lng: -87.178313},
      map: $scope.map,
      title: "Ubicación 10"
    });

    $scope.marker10.addListener('click', function() {
        infowindow10.open($scope.map, $scope.marker10);
      });
    //Marcador 10 FIN

    
    //Marcador 11 INICIO
    var contentString11 = 
    '<div id="content">'+
    '<h2>Productos Automotrices</h2>'+
    '<div>'+
    '<p><b>Santa Rosa de Copán</b>,  Barrio el Progreso frente a la Cámara de Comercio e Industria de Copán.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2662-2657&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow11 = new google.maps.InfoWindow({
      content: contentString11,
      maxWidth: 300
    });

    $scope.marker11 = new google.maps.Marker({
      position: {lat: 14.767101, lng: -88.776263},
      map: $scope.map,
      title: "Ubicación 11"
    });

    $scope.marker11.addListener('click', function() {
        infowindow11.open($scope.map, $scope.marker11);
      });
    //Marcador 11 FIN









  };

  $scope.initMap();

  /*
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name!=="app.locations"){
      angular.element( document.querySelector( '#map' ) ).remove();
      return;
    }
    $scope.initMap();
  });
  */

})// FIN singleLocationCtrl

// INICIO talleresLocationCtrl
.controller('talleresLocationCtrl', function($scope, $api, $stateParams, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  //$scope.nombre = $stateParams.nombre;
  //$scope.lat = $stateParams.lat;
  //$scope.lng = $stateParams.lng;
  $scope.map = null;
  $scope.initMap = function() {    
    

    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 14.662802, lng: -86.215980},
      zoom: 8,
      mapTypeControl:false,
      scaleControl: false,
      streetViewControl: false
    });

    //Marcador 1 INICIO
    var contentString1 = 
           '<div id="content">'+
              '<h2>Taller de Servicios</h2>'+
              '<div>'+
              '<p><b>Tegucigalpa</b> ,Parque Automotriz Toyota, Col. El Prado.' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;9613-0997&quot;)"'+
              
              '</div>'+
            '</div>';

    var infowindow1 = new google.maps.InfoWindow({
      content: contentString1,
      maxWidth: 300
    });

    $scope.marker1 = new google.maps.Marker({
      position: {lat: 14.083870, lng: -87.207024},
      map: $scope.map,
      title: "Ubicación 1",
      labelContent: "ABCD"
    });

    $scope.marker1.addListener('click', function() {
      infowindow1.open($scope.map, $scope.marker1);
    });
    //Marcador 1 FIN


    //Marcador 2 INICIO
    var contentString2 = 
            '<div id="content">'+
              '<h2>Taller de servicios Palmira</h2>'+
              '<div>'+
              '<p><b>Tegucigalpa</b>, Col. Palmira ' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="document.location.href =  &quot;tel:96130997&quot;"'+
              '</div>'+
            '</div>';

    var infowindow2 = new google.maps.InfoWindow({
      content: contentString2,
      maxWidth: 300
    });

    $scope.marker2 = new google.maps.Marker({
      position: {lat: 14.103621, lng: -87.195305},
      map: $scope.map,
      title: "Ubicación 2"
    });

    $scope.marker2.addListener('click', function() {
        infowindow2.open($scope.map, $scope.marker2);
      });
    //Marcador 2 FIN


    //Marcador 3 INICIO
    var contentString3 = 
            '<div id="content">'+
              '<h2>Taller de Servicio</h2>'+
              '<div>'+
              '<p><b>San Pedro Sula</b> , Parque Automotriz Toyota, Boulevard del Sur.' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2556-7356&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow3 = new google.maps.InfoWindow({
      content: contentString3,
      maxWidth: 300
    });

    $scope.marker3 = new google.maps.Marker({
      position: {lat: 15.476528, lng: -88.032570},
      map: $scope.map,
      title: "Ubicación 3"
    });

    $scope.marker3.addListener('click', function() {
        infowindow3.open($scope.map, $scope.marker3);
      });
    //Marcador 3 FIN


    
    //Marcador 4 INICIO
    var contentString4 = 
            '<div id="content">'+
              '<h2>Taller de Servicio Express Centro</h2>'+
              '<div>'+
              '<p><b>San Pedro Sula</b> ,3 ra. Ave, San Pedro Sula.' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2557-7833&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow4 = new google.maps.InfoWindow({
      content: contentString4,
      maxWidth: 300
    });

    $scope.marker4 = new google.maps.Marker({
      position: {lat: 15.5101584, lng: -88.0255630},
      map: $scope.map,
      title: "Ubicación 4"
    });

    $scope.marker4.addListener('click', function() {
        infowindow4.open($scope.map, $scope.marker4);
      });
    //Marcador 4 FIN

    
    //Marcador 5 INICIO
    var contentString5 = 
    '<div id="content">'+
    '<h2>Taller de Servicio </h2>'+
    '<div>'+
    '<p><b>La Ceiba</b> ,Parque Automotriz Toyota, entrada Col. Palmira.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2442-4711&quot;)"'+
    '</div>'+
  '</div>';


    var infowindow5 = new google.maps.InfoWindow({
      content: contentString5,
      maxWidth: 300
    });

    $scope.marker5 = new google.maps.Marker({
      position: {lat: 15.755202, lng: -86.833015},
      map: $scope.map,
      title: "Ubicación 5"
    });

    $scope.marker5.addListener('click', function() {
        infowindow5.open($scope.map, $scope.marker5);
      });
    //Marcador 5 FIN

    
    //Marcador 6 INICIO
    var contentString6 = 
    '<div id="content">'+
    '<h2>Taller de Servicio </h2>'+
    '<div>'+
    '<p><b>Choluteca</b> ,Carretera Panamericana, salida a Guasaule, contiguo a Cruz Roja Hondureña.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2782-2524&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow6 = new google.maps.InfoWindow({
      content: contentString6,
      maxWidth: 300
    });

    $scope.marker6 = new google.maps.Marker({
      position: {lat: 13.309767, lng: -87.178291},
      map: $scope.map,
      title: "Ubicación 6"
    });

    $scope.marker6.addListener('click', function() {
        infowindow6.open($scope.map, $scope.marker6);
      });
    //Marcador 6 FIN

    
    
    //Marcador 7 INICIO
    var contentString7 = 
    '<div id="content">'+
    '<h2>Taller Móvil </h2>'+
    '<div>'+
    '<p><b>San Pedro Sula</b> ,Agencia Boulevard del Sur intercepción 33 Calle y Boulevard del Sur frente a puente a desnivel.' +
    '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;9689-4454&quot;)"'+
    '</div>'+
  '</div>';

    var infowindow7 = new google.maps.InfoWindow({
      content: contentString7,
      maxWidth: 300
    });

    $scope.marker7 = new google.maps.Marker({
      position: {lat: 15.467879, lng: -87.985446},
      map: $scope.map,
      title: "Ubicación 2"
    });

    $scope.marker7.addListener('click', function() {
        infowindow7.open($scope.map, $scope.marker7);
      });
    //Marcador 7 FIN

    
        
    //Marcador 9 INICIO
    var contentString9 = 
            '<div id="content">'+
              '<h2>La Ceiba</h2>'+
              '<div>'+
              '<p><b>Corporación Flores</b>, Col. Palmira, Ceiba.  ' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2225-5540&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow9 = new google.maps.InfoWindow({
      content: contentString9,
      maxWidth: 300
    });

    $scope.marker9 = new google.maps.Marker({
      position: {lat: 15.755190, lng: -86.832953},
      map: $scope.map,
      title: "Ubicación 9"
    });

    $scope.marker9.addListener('click', function() {
        infowindow9.open($scope.map, $scope.marker9);
      });
    //Marcador 9 FIN

    
    //Marcador 10 INICIO
    var contentString10 = 
            '<div id="content">'+
              '<h2>Taller de Servicios</h2>'+
              '<div>'+
              '<p><b>Choluteca</b>, Parque Automotriz Toyota, Carretera Panamericana, salida a Guasaule, contiguo a Cruz Roja Hondureña.' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;2782-2524&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow10 = new google.maps.InfoWindow({
      content: contentString10,
      maxWidth: 300
    });

    $scope.marker10 = new google.maps.Marker({
      position: {lat: 13.309830, lng: -87.178313},
      map: $scope.map,
      title: "Ubicación 10"
    });

    $scope.marker10.addListener('click', function() {
        infowindow10.open($scope.map, $scope.marker10);
      });
    //Marcador 10 FIN

    
    //Marcador 11 INICIO
    var contentString11 = 
            '<div id="content">'+
              '<h2>Taller Móvil</h2>'+
              '<div>'+
              '<p><b>Tegucigalpa</b>, Parque Automotriz Toyota, Colonia El Prado.' +
              '<input type="button" class="button button-block button-small button-assertive-custom" value="Llamar" onclick="alert(&quot;9613-0997&quot;)"'+
              '</div>'+
            '</div>';

    var infowindow11 = new google.maps.InfoWindow({
      content: contentString11,
      maxWidth: 300
    });

    $scope.marker11 = new google.maps.Marker({
      position: {lat: 14.083834,  lng: -87.207024},
      map: $scope.map,
      title: "Ubicación 11"
    });

    $scope.marker11.addListener('click', function() {
        infowindow11.open($scope.map, $scope.marker11);
      });
    //Marcador 11 FIN









  };

  $scope.initMap();

  /*
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name!=="app.locations"){
      angular.element( document.querySelector( '#map' ) ).remove();
      return;
    }
    $scope.initMap();
  });
  */

})// FIN talleresLocationCtrl

.controller('pagosCtrl', function($scope, $ionicSideMenuDelegate,$api, $ionicModal, $timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.numPagos = 1;
  $scope.pagosL = [];
  $scope.error= false;

  $scope.getAgenciasPagos = function(){
    $scope.showLoadingGlobal();
    $scope.error= false;
    $scope.pagosL = [];
    $scope.numPagos = 1;
    var myRequest = "action=get-pagos-agencias";
    $api.serverRequest(myRequest).success(function(data, status, headers, config) {
      $scope.hideLoadingGlobal();
      $scope.pagosL = data;
      $scope.numPagos = data.length;
    }).error(function(data, status, headers, config) {
        $scope.error= true;
        $scope.hideLoadingGlobal();
    });
  };

  $scope.openWeb = function(url){
    $api.openUrl(url,"_system","no");
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name==="app.main" && device.platform==="iOS"){
      StatusBar.show();
    }
    if(fromState.name==="app.main"){
      $scope.numPagos = 1;
      $scope.pagosL = [];
      $scope.error= false;
      $timeout(function(){
        $scope.getAgenciasPagos();
      },500);
    }
  });

})//FIN PAGOS
/*
.controller('singlePagosCtrl', function($scope, $api, $stateParams, $ionicModal, $timeout, $ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.nombre = $stateParams.nombre;
  $scope.lat = $stateParams.lat;
  $scope.lng = $stateParams.lng;
  $scope.map = null;

  $scope.initMap = function() {
    $scope.map = new google.maps.Map(document.getElementById('mapp'), {
      center: {lat: parseFloat($scope.lat), lng: parseFloat($scope.lng)},
      zoom: 14,
      mapTypeControl:false,
      scaleControl: false,
      streetViewControl: false
    });
    $scope.marker = new google.maps.Marker({
      position: {lat: parseFloat($scope.lat), lng: parseFloat($scope.lng)},
      map: $scope.map,
      title: $scope.nombre
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if(fromState.name!=="app.pagos"){
      angular.element( document.querySelector( '#mapp' ) ).remove();
      return;
    }
    $scope.initMap();
  });

})// FIN singleLocationCtrl
*/
.factory('$api', function($http, $ionicPopup, $ionicLoading){
  return {
    countJSON: function(data){
      var key, count = 0;
      for(key in data) {
        count++;
      }
      return count;
    },
    alerta: function(title, msg){
       var alertPopup = $ionicPopup.alert({
         title: title,
         template: msg,
         buttons: [
            {text: '<b>Ok</b>',
              type: 'button-assertive-custom'
            },
          ]
       });
       alertPopup.then(function(res) {
         console.log('Closed!');
       });
    },
    validaMail: function(mail){
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(mail);
    },
    setVar: function(key, val){
      localStorage.setItem("cflores_"+key, val);
    },
    getVar: function(key){
      return localStorage.getItem("cflores_"+key);
    },
    removeVar: function(key){
      localStorage.removeItem("cflores_"+key);
    },
    serverRequest: function(data){//ESTA FUNCION CUANDO HACEMOS PETICIONES CORTAS
      var myUrl = host+"&"+data;
      return $http({method: 'GET', url: myUrl, timeout:10000});
    },
    serverPostRequest: function(postdata, getdata){
      var myUrl = host+"&"+getdata+"&country="+this.getVar("country");
      return $http({method : 'POST', url : myUrl, data : postdata});
    },
    toast: function(msg,d){
      d = typeof d !== 'undefined' ? d : 1500;
      $ionicLoading.show({ template: msg, noBackdrop: true, duration: d });
    },
    getFormatDate: function(y, m, dw, d, h, min){
      var hora = ((h<10)?"0"+h:h)+":"+((min<10)?"0"+min:min);
      var fulldate = dias[dw]+" "+d+" de "+meses[m]+" del "+y+" a las "+ hora;
      return fulldate;
    }, 
    getDaysInMonth: function(month,year) {
      return new Date(year, month, 0).getDate();  
    },
    openUrl: function(url, location, showbar){
      cordova.InAppBrowser.open(url, '_blank', 'location=yes');
      //window.open(url, '_system', 'location=yes');
      //window.open(url, '_self', 'location=yes'),!1;
      //cordova.InAppBrowser.open(url, location, 'location='+showbar);
    },
    shareLink: function(url){
      window.plugins.socialsharing.share(null, null, null, url);
    },
    getMonth: function(num){
      var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return meses[num];
    }
  };
});


