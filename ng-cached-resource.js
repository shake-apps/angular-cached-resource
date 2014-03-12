(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
var app;

app = angular.module('cachedResource', ['ngResource']);

app.factory('cachedResource', [
  '$resource', '$timeout', '$q', function($resource, $timeout, $q) {
    var classMethodWrappers, localStorageKey, readCache, writeCache;
    localStorageKey = function(url, parameters) {
      var name, value;
      for (name in parameters) {
        value = parameters[name];
        url = url.replace(":" + name, value);
      }
      return url;
    };
    readCache = function(Resource, method, url) {
      return function(parameters) {
        var cached, deferred, item, key, resource, _i, _len;
        resource = Resource[method].apply(Resource, arguments);
        resource.$httpPromise = resource.$promise;
        if (window.localStorage == null) {
          return resource;
        }
        if (angular.isFunction(parameters)) {
          parameters = null;
        }
        key = localStorageKey(url, parameters);
        resource.$httpPromise.then(function(response) {
          return localStorage.setItem(key, angular.toJson(response));
        });
        cached = angular.fromJson(localStorage.getItem(key));
        if (cached) {
          if (angular.isArray(cached)) {
            for (_i = 0, _len = cached.length; _i < _len; _i++) {
              item = cached[_i];
              resource.push(item);
            }
          } else {
            angular.extend(resource, cached);
          }
          deferred = $q.defer();
          resource.$promise = deferred.promise;
          deferred.resolve(resource);
        }
        return resource;
      };
    };
    writeCache = function(Resource, method, url) {
      return function(parameters) {
        var resource, writeArgs;
        writeArgs = arguments;
        resource = Resource[method].apply(Resource, writeArgs);
        if (window.localStorage == null) {
          return resource;
        }
        return resource;
      };
    };
    classMethodWrappers = {
      get: readCache,
      query: readCache,
      save: writeCache
    };
    return function(url) {
      var CachedResource, Resource, method, wrapper;
      Resource = $resource.apply(null, arguments);
      CachedResource = {};
      for (method in classMethodWrappers) {
        wrapper = classMethodWrappers[method];
        if (Resource[method] != null) {
          CachedResource[method] = wrapper(Resource, method, url);
        }
      }
      return CachedResource;
    };
  }
]);

app;

},{}]},{},[1])