/*
 *  Project: jQuery Animation
 *  Author: Bao Nguyen
 *  License: MIT
 *  Website: http://baonguyenyam.github.io
 */

// http://debuggable.com/posts/how-to-write-jquery-plugins:4f72ab2e-7310-4a74-817a-0a04cbdd56cb

;
(function($, window, document, undefined) {

    var kA = "kAnimation",
        key = "ka_" + kA;

    var kaGlobal = function(element, options) {
        this.element = element;

        // OPTIONS
        this.options = {
            ClassName: 'kAnimation',
            color: '#999'
        };

        this.init(options);
    };

    kaGlobal.prototype = {
        // Initial 
        init: function(options) {
            $.extend(this.options, options);
            // DO Animation 
            this.element.addClass(this.options.ClassName);
            this.element.css({
                'color': this.options.color,
            });
        },
        // More Options
        on: function(str) {
            if (str === 'change') {
                this.options.color = str;
                this.element.css('color', str);
            } else if (str === 'leave') {
                this.options.color = str;
                this.element.css('color', '#fff');
            }
        },

    };


    // Build Animation 
    $.fn[kA] = function(options) {
        var jQuerykAnimation = this.data(key);
        if (jQuerykAnimation instanceof kaGlobal) {
            if (typeof options !== 'undefined') {
                jQuerykAnimation.init(options);
            }
        } else {
            jQuerykAnimation = new kaGlobal(this, options);
            this.data(key, jQuerykAnimation);
        }
        return jQuerykAnimation;
    };

}(jQuery, window, document));