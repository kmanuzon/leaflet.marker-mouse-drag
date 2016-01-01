/**
 * Leaflet.marker-mouse-drag 0.3.0
 *
 * Drags marker by mouse movement.
 */
(function (factory, window) {
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }
    if (typeof window !== 'undefined' && window.L) {
        window.L.Handler.MarkerMouseDrag = factory(L);
    }
}(function (L) {
'use strict';

var MarkerMouseDrag = L.Handler.extend({

    _map: null,
    _marker: null,
    _initialLatLng: null,

    dragMarker: function(marker) {
        if ( !this.enabled()) {
            this._marker = marker;
            this._marker.closePopup();
            this._initialLatLng = this._marker.getLatLng();
            this.enable();
        }
    },

    addHooks: function() {
        L.DomEvent.on(this._map._container, 'keyup', this._cancelOnEsc, this);
        this._map.on('mousemove', this._onMouseMove, this);
        this._map.on('click', this._onClick, this);
        this._marker.on('click', this._onClick, this);
    },

    removeHooks: function() {
        L.DomEvent.off(this._map._container, 'keyup', this._cancelOnEsc, this);
        this._map.off('mousemove', this._onMouseMove, this);
        this._map.off('click', this._onClick, this);
        this._marker.off('click', this._onClick, this);
        this._marker = null;
    },

    _onMouseMove: function(e) {
        this._marker.setLatLng(e.latlng);
    },

    _onClick: function() {
        this._fireDoneEvent();
        this.disable();
    },

    _fireDoneEvent: function() {
        this._map.fire('marker:done', {
            layer: this._marker
        });
    },

    // cancel placing the marker if escape key is pressed.
    _cancelOnEsc: function(e) {
        if (e.keyCode === 27) {
            this._marker.setLatLng(this._initialLatLng);
            this.disable();
        }
    }
});


return MarkerMouseDrag;
}, window));
