import React, { Component } from 'react';

export default class BaseComponent extends Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }

  throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);

    var last,
        deferTimer;

    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }
}
