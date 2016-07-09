/*
 *  Project: jQuery Animation
 *  Author: Bao Nguyen
 *  License: MIT
 *  Website: http://baonguyenyam.github.io
 */

;
(function($, window, document, undefined) {
    var kA = 'kAnimation'

    function kaGlobal(element, options) {
        this.element = element
        this._name = kA
        this._defaults = $.fn.kAnimation.defaults
        this.options = $.extend({}, this._defaults, options)
        this.init()
    }
    $.extend(kaGlobal.prototype, {
        init: function() {
            this.buildAnimation()
            this.bindEvents()
            this.onComplete()
        },

        destroy: function() {
            this.unbindEvents()
            this.element.removeData()
        },

        buildAnimation: function() {
            var plugin = this
            this.element = $(this.element)
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
                    plugin.onBegin.call(plugin)
                } else {
                    $e.addClass($o.ClassName)
                    plugin.onBegin.call(plugin)
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
                                    plugin.onChange.call(plugin)
                                }
                            }
                        }
                        if (remove === 'remove') {
                            timerx[i] = setTimeout(internalCallback(i, indexArraykey), i)
                        } else {
                            timerx[i] = setTimeout(internalCallback(i, indexArraykey), i * $d)
                            plugin.onChange.call(plugin)
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

        bindEvents: function() {
            var plugin = this

            plugin.element.on('click' + '.' + plugin._name, function() {
                plugin.onClick.call(plugin)
            })
            plugin.element.on('mouseover' + '.' + plugin._name, function() {
                plugin.onHover.call(plugin)
            })
        },

        unbindEvents: function() {
            this.element.off('.' + this._name)
        },

        // Create custom methods
        onClick: function() {
            var onClick = this.options.onClick

            if (typeof onClick === 'function') {
                onClick.call(this.element)
            }
        },

        onHover: function() {
            var onHover = this.options.onHover

            if (typeof onHover === 'function') {
                onHover.call(this.element)
            }
        },
        onBegin: function() {
            var onBegin = this.options.onBegin

            if (typeof onBegin === 'function') {
                onBegin.call(this.element)
            }
        },

        onComplete: function() {
            var onComplete = this.options.onComplete

            if (typeof onComplete === 'function') {
                onComplete.call(this.element)
            }
        },

        onChange: function() {
            var onChange = this.options.onChange

            if (typeof onChange === 'function') {
                onChange.call(this.element)
            }
        }

    })

    // Click Toggle
    $.fn.clickToggle = function(a, b) {
            function cb() {
                [b, a][this._tog ^= 1].call(this)
            }
            return this.on('click', cb)
        }
        // Build Animation 

    $.fn.kAnimation = function(options) {
        this.each(function() {
            if (!$.data(this, 'kAnimation_' + kA)) {
                $.data(this, 'kAnimation_' + kA, new kaGlobal(this, options))
            }
        })

        return this
    }

    $.fn.kAnimation.defaults = {
        ClassName: 'animated',
        Animation: 'fadeIn',
        Type: 'auto', // auto, scroll, click, hover
        Delay: '0',
        Forever: false,
        DelayForever: 0,
        ScrollLoop: false,
        onComplete: null,
        onChange: null,
        onClick: null,
        onBegin: null,
        onHover: null
    }
})(jQuery, window, document)