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

  //COTIZACION
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
    var myRequest1 = 'action=send-car-quote&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&idCarro="+$scope.quote.car["id"];
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
    var myRequest1 = 'action=send-prueba-manejo&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&idCarro="+$scope.quote.car["id"];
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

  $scope.CallTel = function(tel) {
      window.location.href = 'tel:'+ tel;
  }

  //COTIZACION
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
    var myRequest1 = 'action=send-quote-productos&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&descripcion="+$scope.categorias[$scope.idCategoria];
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


  //COTIZACION
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
    var myRequest1 = 'action=send-quote-taller&nombre='+$scope.quote.nombre+"&telefono="+$scope.quote.telefono+"&email="+$scope.quote.email+"&ciudad="+$scope.quote.ciudad+"&descripcion="+$scope.categorias[$scope.idCategoria];
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
    $scope.singlePromo.show();
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
      cordova.InAppBrowser.open(url, location, 'location='+showbar);
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


