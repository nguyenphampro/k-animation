/*
 *  Project: jQuery Animation
 *  Author: Bao Nguyen
 *  License: MIT
 *  Website: http://baonguyenyam.github.io
 */

// http://debuggable.com/posts/how-to-write-jquery-plugins:4f72ab2e-7310-4a74-817a-0a04cbdd56cb


;
(function($, window, document, undefined) {
    var kA = 'kAnimation',
        key = 'ka_' + kA

    var kaGlobal = function(element, options) {
        this.element = element

        // OPTIONS
        this.options = {
            ClassName: 'animated',
            Animation: 'fadeIn',
            Type: 'auto', // auto, scroll, click, hover
            Delay: '0',
            ScrollLoop: true
        }

        this.init(options)
    }

    kaGlobal.prototype = {
        // Initial 
        init: function(options) {
            $.extend(this.options, options)
            var $e = this.element,
                $o = this.options,
                $d = this.options.Delay,
                $sl = this.options.ScrollLoop,
                $t = (this.options.Type).toLocaleLowerCase()

            // console.log(typeof($o.Animation))
            // console.log($o)


            // DO Animation 
            var doAnimation = function(remove) {
                if (remove === 'remove') {
                    $e.removeClass($o.ClassName)
                } else {
                    $e.addClass($o.ClassName)
                }

                if (typeof($o.Animation) == 'string') {
                    if (remove === 'remove') {
                        $e.removeClass($o.Animation)
                    } else {
                        setTimeout(function() {
                            $e.addClass($o.Animation)
                        }, $d)
                    }
                } else {
                    var i = 1
                    var indexArray = $o.Animation
                    var timerx = []
                    $(indexArray).each(function(indexArraykey) {
                        function internalCallback(i, indexArraykey) {
                            return function() {
                                var val = indexArray[indexArraykey]
                                if (remove === 'remove') {
                                    $e.removeClass(val)
                                } else {
                                    $e.addClass(val)
                                }
                            }
                        }
                        if (remove === 'remove') {
                            timerx[i] = setTimeout(internalCallback(i, indexArraykey), i)
                        } else {
                            timerx[i] = setTimeout(internalCallback(i, indexArraykey), i * $d)
                        }
                        i++
                    })
                }
            }

            // Scroll
            if ($t === 'scroll') {
                var $w = $(window)
                    // Xem lai ham nay 
                function check_if_in_view() {
                    var window_height = $w.height()
                    var window_top_position = $w.scrollTop()
                    var window_bottom_position = (window_top_position + window_height)

                    $.each($e, function() {
                        var $element = $(this)
                        var element_height = $element.outerHeight()
                        var element_top_position = $element.offset().top
                        var element_bottom_position = (element_top_position + element_height)

                        if ((element_bottom_position >= window_top_position) &&
                            (element_top_position <= window_bottom_position)) {
                            doAnimation()
                        } else {
                            if ($sl) {
                                doAnimation('remove')
                            }
                        }
                    })
                }

                $w.on('scroll resize', check_if_in_view)
            }
            // Click
            else if ($t === 'click') {
                $e.each(function(index) {
                    $(this).on('click', function() {
                        doAnimation()
                    })
                    if ($sl) {
                        console.log(1);
                    } else {
                        console.log(3);
                    }
                })
            }
            // Click
            else if ($t === 'hover') {
                $e.each(function(index) {
                    $(this).hover(function() {
                        doAnimation()
                    })
                })
            } else {
                doAnimation()
            }
        },
        // More Options
        // on: function(str) {
        //     if (str === 'change') {
        //         this.options.color = str
        //         this.element.css('color', str)
        //     } else if (str === 'leave') {
        //         this.options.color = str
        //         this.element.css('color', '#fff')
        //     }
        // },

    }

    // Build Animation 
    $.fn[kA] = function(options) {
        var jQuerykAnimation = this.data(key)
        if (jQuerykAnimation instanceof kaGlobal) {
            if (typeof options !== 'undefined') {
                jQuerykAnimation.init(options)
            }
        } else {
            jQuerykAnimation = new kaGlobal(this, options)
            this.data(key, jQuerykAnimation)
        }
        return jQuerykAnimation
    }
}(jQuery, window, document))