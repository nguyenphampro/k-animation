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
            Forever: false,
            DelayForever: 0,
            ScrollLoop: false
        }

        this.init(options)
    }

    kaGlobal.prototype = {
        // Initial 
        init: function(options) {
            $.extend(this.options, options)

            if (this.element.attr('k-animation')) {
                var $e = this.element,
                    $o = $e.attr('k-class') ? {
                        ClassName: $e.attr('k-animation'),
                        Animation: $e.attr('k-class').split(',')
                    } : this.options,
                    $d = $e.attr('k-delay') ? $e.attr('k-delay') : this.options.Delay,
                    $sl = $e.attr('k-scrollLoop') ? $e.attr('k-scrollLoop') : this.options.ScrollLoop,
                    $f = $e.attr('k-forever') ? $e.attr('k-forever') : this.options.Forever,
                    $df = $e.attr('k-delayforever') ? $e.attr('k-delayforever') : this.options.DelayForever,
                    $t = $e.attr('k-type') ? $e.attr('k-type').toLocaleLowerCase() : (this.options.Type).toLocaleLowerCase()
            } else {
                var $e = this.element,
                    $o = this.options,
                    $d = this.options.Delay,
                    $sl = this.options.ScrollLoop,
                    $f = this.options.Forever,
                    $df = this.options.DelayForever,
                    $t = (this.options.Type).toLocaleLowerCase()
            }
            // DO Animation 
            var doAnimation = function(remove) {
                // console.log(options)
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
                $e.each(function(index) {
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

                            if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                                doAnimation()
                            } else {
                                if ($sl) {
                                    doAnimation('remove')
                                }
                            }
                        })
                    }

                    $w.on('scroll resize', check_if_in_view)
                })
            }
            // Click
            else if ($t === 'click') {
                $e.each(function(index) {
                    if ($f) {
                        $(this).clickToggle(function() {
                            doAnimation('remove')
                            setTimeout(function() {
                                doAnimation()
                            }, $df)
                        }, function() {
                            doAnimation('remove')
                            setTimeout(function() {
                                doAnimation()
                            }, $df)
                        })
                    } else {
                        $(this).click(function() {
                            doAnimation()
                        })
                    }
                })
            }
            // Hover
            else if ($t === 'hover') {
                $e.each(function(index) {
                    if ($f) {
                        $(this).hover(function() {
                            setTimeout(function() {
                                doAnimation('remove')
                                doAnimation()
                            }, $df)
                        }, function() {
                            doAnimation('remove')
                        })
                    } else {
                        $(this).hover(function() {
                            doAnimation()
                        })
                    }
                })
            }
            // Auto 
            else {
                $e.each(function(index) {
                    if ($f) {
                        doAnimation()
                        setInterval(function() {
                            doAnimation('remove')
                            doAnimation()
                        }, $df)
                    } else {
                        doAnimation()
                    }
                })
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

    // Click Toggle
    $.fn.clickToggle = function(a, b) {
            function cb() {
                [b, a][this._tog ^= 1].call(this)
            }
            return this.on('click', cb)
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