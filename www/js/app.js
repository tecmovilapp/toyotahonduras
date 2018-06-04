// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])//, 'ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    navigator.splashscreen.hide();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      //StatusBar.hide();
    }
  });//FIN READY
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.transition('android');
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
      }
    }
  })

  .state('app.citas', {
    url: '/main/citas',
    views: {
      'menuContent': {
        templateUrl: 'templates/citas.html',
        controller: 'citasCtrl'
      }
    }
  })

  .state('app.promo', {
    url: '/main/promo',
    views: {
      'menuContent': {
        templateUrl: 'templates/promociones.html',
        controller: 'promoCtrl'
      }
    }
  })

  .state('app.news', {
    url: '/main/news',
    views: {
      'menuContent': {
        templateUrl: 'templates/news.html',
        controller: 'newsCtrl'
      }
    }
  })

  .state('app.chat', {
    url: '/main/chat',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
  })

  .state('app.locations', {
    url: '/main/locations',
    views: {
      'menuContent': {
        templateUrl: 'templates/locations.html',
        controller: 'locationsCtrl'
      }
    }
  })

  .state('app.location', {
    url: '/main/locations/single_location/:nombre/:lat/:lng',
    views: {
      'menuContent': {
        templateUrl: 'templates/single-location.html',
        controller: 'singleLocationCtrl'
      }
    }
  })

  .state('app.productosLocation', {
    url: '/main/locations/productos_automotrices_location',
    views: {
      'menuContent': {
        templateUrl: 'templates/productos-automotrices-location.html',
        controller: 'productosAutomotricesLocationCtrl'
      }
    }
  })

  .state('app.pagos', {
    url: '/main/pagos',
    views: {
      'menuContent': {
        templateUrl: 'templates/pagos.html',
        controller: 'pagosCtrl'
      }
    }
  })
//SIN USO
 /* .state('app.single_pagos', {
    url: '/main/pagos/single_pagos/:nombre/:lat/:lng',
    views: {
      'menuContent': {
        templateUrl: 'templates/single-pagos.html',
        controller: 'singlePagosCtrl'
      }
    }
  })
*/
  .state('app.config', {
    url: '/main/config',
    views: {
      'menuContent': {
        templateUrl: 'templates/config.html',
        controller: 'configCtrl'
      }
    }
  })
  .state('app.tarjetas', {
    url: '/main/tarjetas',
    views: {
      'menuContent': {
        templateUrl: 'templates/tarjetas.html',
        controller: 'cardBacCtrl'
      }
    }
  })
  .state('app.contact', {
    url: '/main/contact',
    views: {
      'menuContent': {
        templateUrl: 'templates/contact.html',
        controller: 'contactCtrl'
      }
    }
  })
  .state('app.vehiculos', {
    url: '/main/vehiculos',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehiculos.html',
        controller: 'vehiculosCtrl'
      }
    }
  })
  .state('app.vehiculos_cat', {
    url: '/main/vehiculos/vehiculos_cat/:catid',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehiculos_cat.html',
        controller: 'vehiculosCatCtrl'
      }
    }
  })
  .state('app.single_vehiculo', {
    url: '/main/vehiculos/vehiculos_cat/:catid/single_vehiculo/:idcar',
    views: {
      'menuContent': {
        templateUrl: 'templates/single_vehiculo.html',
        controller: 'singleVehiculoCtrl'
      }
    }
  })
  .state('app.avance', {
    url: '/main/avance',
    views: {
      'menuContent': {
        templateUrl: 'templates/avance.html',
        controller: 'avanceCtrl'
      }
    }
  }).state('app.productos_automotrices', {
    url: '/main/vehiculos/productos_automotrices',
    views: {
      'menuContent': {
        templateUrl: 'templates/productos-automotrices.html',
        controller: 'productosAutomotricesCtrl'
      }
    }
  }).state('app.productos_automotrices_marcas', {
    url: '/main/vehiculos/productos_automotrices_marcas/:idCategoria',
    views: {
      'menuContent': {
        templateUrl: 'templates/productos-automotrices-marcas.html',
        controller: 'productosAutomotricesMarcasCtrl'
      }
    }
  }).state('app.productos_automotrices_detalle', {
    url: '/main/vehiculos/productos_automotrices_detalle/:idCategoria/:idMarca',
    views: {
      'menuContent': {
        templateUrl: 'templates/productos-automotrices-detalle.html',
        controller: 'productosAutomotricesDetalleCtrl'
      }
    }
  }).state('app.talleres', {
    url: '/main/vehiculos/talleres',
    views: {
      'menuContent': {
        templateUrl: 'templates/talleres.html',
        controller: 'talleresCtrl'
      }
    }
  }).state('app.talleres_detalle', {
    url: '/main/vehiculos/talleres_detalle/:idCategoria',
    views: {
      'menuContent': {
        templateUrl: 'templates/talleres-detalle.html',
        controller: 'talleresDetalleCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
