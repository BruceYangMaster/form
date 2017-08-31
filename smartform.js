(function (root, smartForm) {
    if (typeof define === 'function' && define.amd) {
        define(smartForm);
    } else if (typeof exports === 'object') {
        module.exports = smartForm();
    } else {
        root.SmartForm = smartForm();
    }
})(this, function () {
    PageHead.type = 'pageHead';
    Input.type = 'input';
    Select.type = 'select';
    Radio.type = 'radio';
    Checkbox.type = 'checkbox';
    Button.type = 'button';
    DateInput.type = 'date';
    DateTime.type = 'dateTime';

    return function smartForm(data) {
        var scope = this;
        scope.components = [PageHead, Input, DateInput, DateTime, Select, Radio, Checkbox, Button];
        setTimeout(function () {
            resolveData(data);
        });

        scope.validArr = [];

        scope.validate = function () {
            var res = true;
            scope.validArr.forEach(function (item) {
                if (!item) {
                    res = false;
                }
            });
            return res;
        };
        scope.getValue = function () {
            var val = {};
            scope.computedData.forEach(function (item, index) {
                if (item.type !== 'button' && item.type !== 'pageHead') {
                    val[item.name] = item.computedDom.getValue();
                }
            });
            return val;
        };

        function mapping(type, callback) {
            scope.components.forEach(function (component, index) {
                if (type === component.type) {
                    callback(component);
                }
            });
        }

        function resolveData(data) {
            if (!$.isArray(data)) {
                console.error('初始化数据应为json数组');
                return;
            }
            data.forEach(function (item, index) {
                mapping(item.type, function (component) {
                    item.computedDom = new component(item);
                });
            });
            scope.computedData = data;
            render();
        }

        function render() {
            scope.computedData.forEach(function (item, index) {
                if (item.type === 'input' || item.type === 'select' || item.type === 'date' || item.type === 'dateTime') {
                    var lastChild = $('.page').children('div:last-child');
                    if (lastChild.hasClass('weui-cells_form')) {
                        lastChild.append(item.computedDom.dom);
                    } else {
                        var form = $('<div class=\'weui-cells weui-cells_form\'></div>').append(item.computedDom.dom);
                        $('.page').append(form);
                    }
                } else {
                    $('.page').append(item.computedDom.dom);
                }
                var arr = data.filter(function (item) {
                    return item.type === 'button';
                });
                if (arr.length > 0) {
                    bindEvent();
                }
            });
        }

        function bindEvent() {
            scope.button = $('.weui-btn');
            if (scope.button.length > 0) {
                scope.button.on('click', function () {
                    scope.validArr = [];
                    scope.computedData.forEach(function (item, index) {
                        if (item.required) {
                            scope.validArr.push(item.computedDom.validate());
                        }
                    });
                });
            }
        }
    };

    function PageHead(pageHead) {
        this.domText = '<div class=\'page__hd\'>';
        this.domText += '<h1 class=\'page__title\'>' + pageHead.title + '</h1>';
        this.domText += pageHead.desc ? '<p class=\'page__desc\'>' + pageHead.desc + '</p>' : '';
        this.domText += '</div>';
        this.dom = $(this.domText);
    }

    function Input(input) {
        this.wrapper = $('<div class=\'weui-cell\'></div>');
        this.hd = $('<div class=\'weui-cell__hd\'><label class=\'weui-label\'>' + input.label + '</label></div>');
        this.bd = $('<div class=\'weui-cell__bd\'><input class=\'weui-input\' value=\'' + input.value + '\' placeholder=\'' + input.label + '\'></div>');
        this.ft = $('<div class=\'weui-cell__ft\'></div>');
        this.dom = this.wrapper.append(this.hd).append(this.bd).append(this.ft);
        this.getValue = function () {
            return this.bd.find('input').val();
        };
        this.validate = function () {
            if (input.required && !this.getValue()) {
                this.dom.addClass('weui-cell_warn');
                if (this.ft.find('i').length < 1) {
                    this.ft.append('<i class=\'weui-icon-warn\'></i>');
                }
                return false;
            } else {
                this.dom.removeClass('weui-cell_warn');
                this.ft.find('i').remove();
                return true;
            }
        }
    }

    function DateInput(input) {
        this.wrapper = $('<div class=\'weui-cell\'></div>');
        this.hd = $('<div class=\'weui-cell__hd\'><label class=\'weui-label\'>' + input.label + '</label></div>');
        this.bd = $('<div class=\'weui-cell__bd\'><input class=\'weui-input\' type=\'date\' value=\'' + input.value + '\' placeholder=\'' + input.label + '\'></div>');
        this.ft = $('<div class=\'weui-cell__ft\'></div>');
        this.dom = this.wrapper.append(this.hd).append(this.bd).append(this.ft);
        this.getValue = function () {
            return this.bd.find('input').val();
        };
        this.validate = function () {
            if (input.required && !this.getValue()) {
                this.dom.addClass('weui-cell_warn');
                if (this.ft.find('i').length < 1) {
                    this.ft.append('<i class=\'weui-icon-warn\'></i>');
                }
                return false;
            } else {
                this.dom.removeClass('weui-cell_warn');
                this.ft.find('i').remove();
                return true;
            }
        }
    }

    function DateTime(input) {
        this.wrapper = $('<div class=\'weui-cell\'></div>');
        this.hd = $('<div class=\'weui-cell__hd\'><label class=\'weui-label\'>' + input.label + '</label></div>');
        this.bd = $('<div class=\'weui-cell__bd\'><input class=\'weui-input\' type=\'datetime-local\' value=\'' + input.value + '\' placeholder=\'' + input.label + '\'></div>');
        this.ft = $('<div class=\'weui-cell__ft\'></div>');
        this.dom = this.wrapper.append(this.hd).append(this.bd).append(this.ft);
        this.getValue = function () {
            return this.bd.find('input').val();
        }
        this.validate = function () {
            if (input.required && !this.getValue()) {
                this.dom.addClass('weui-cell_warn');
                if (this.ft.find('i').length < 1) {
                    this.ft.append('<i class=\'weui-icon-warn\'></i>');
                }
                return false;
            } else {
                this.dom.removeClass('weui-cell_warn');
                this.ft.find('i').remove();
                return true;
            }
        }
    }

    function Select(select) {
        this.wrapper = $('<div class=\'weui-cell weui-cell_select weui-cell_select-after\'></div>');
        this.hd = $('<div class=\'weui-cell__hd\'><label class=\'weui-label\'>' + select.label + '</label></div>');
        this.bdWrapper = $('<div class=\'weui-cell__bd\'></div>');

        this.select = (function () {
            var selectDom = $('<select class=\'weui-select\' name=\'' + select.name + '\'></select>');
            select.options.forEach(function (item, index) {
                selectDom.append('<option value=\'' + item.value + '\'>' + item.label + '</option>');
            });
            return selectDom;
        })();
        this.bd = this.bdWrapper.append(this.select);
        this.dom = this.wrapper.append(this.hd).append(this.bd);
        if (typeof select.value !== 'undefined') {
            this.select.val(select.value);
        }
        this.getValue = function () {
            return this.select.val();
        }
    }

    function Radio(radio) {
        var _this = this;
        this.wrapper = $('<div class=\'weui-cells__title\'>' + radio.title + '</div><div class=\'weui-cells weui-cells_radio\'></div>');
        this.labels = (function () {
            var labelsArr = [];
            radio.options.forEach(function (item, index) {
                var labelId = uuid();
                var wrapper = $('<label class=\'weui-cell weui-check__label\' for=\'' + labelId + '\'></label>');
                var hd = $('<div class=\'weui-cell__bd\'><p>' + item.label + '</p></div>');
                var str = '';
                if (typeof radio.value !== 'undefined') {
                    if (radio.value === item.value) {
                        str = 'checked=\'checked\'';
                    }
                } else {
                    if (index === 0) {
                        str = 'checked=\'checked\'';
                    }
                }
                var input = $('<input type=\'radio\' class=\'weui-check\'' + str + ' value= \'' + item.value + '\' name=\'' + radio.name + '\' id=\'' + labelId + '\'><span class=\'weui-icon-checked\'></span>')
                var bd = $('<div class=\'weui-cell__ft\'></div>').append(input);
                labelsArr.push(wrapper.append(hd).append(bd));
            });
            return labelsArr;
        })();
        this.dom = (function () {
            var dom = _this.wrapper;
            _this.labels.forEach(function (item) {
                $(dom[1]).append(item);
            });
            return dom;
        })();
        this.getValue = function () {
            return $('input[name=' + radio.name + ']:checked').val();
        }
    }

    function Checkbox(checkbox) {
        var _this = this;
        this.wrapper = $('<div class=\'weui-cells__title\'>' + checkbox.title + '</div><div class=\'weui-cells weui-cells_checkbox\'></div>');
        this.labels = (function () {
            var labelsArr = [];
            checkbox.options.forEach(function (item, index) {
                var labelId = uuid();
                var wrapper = $('<label class=\'weui-cell weui-check__label\' for=\'' + labelId + '\'></label>');
                var str = '';
                if (typeof checkbox.value !== 'undefined') {
                    if (checkbox.value.indexOf(item.value) !== -1) {
                        str = 'checked=\'checked\'';
                    }
                }
                var input = $('<input type=\'checkbox\' class=\'weui-check\'' + str + ' name=\'' + checkbox.name + '\' value=\'' + item.value + '\' id=\'' + labelId + '\' ><i class=\'weui-icon-checked\'></i>')
                var hd = $('<div class=\'weui-cell__hd\'></div>').append(input);
                var bd = $('<div class=\'weui-cell__bd\'><p>' + item.label + '</p></div>');
                labelsArr.push(wrapper.append(hd).append(bd));
            });
            return labelsArr;
        })();
        this.dom = (function () {
            var dom = _this.wrapper;
            _this.labels.forEach(function (item) {
                $(dom[1]).append(item);
            });
            return dom;
        })();
        this.getValue = function () {
            var arr = [];
            $('input[name=' + checkbox.name + ']:checked').each(function (index, item) {
                arr.push(item.getAttribute('value'));
            });
            return arr;
        }
    }

    function Button(button) {
        this.button = $('<a href=\'javascript:;\' class=\'weui-btn weui-btn_primary\'>' + button.title + '</a>');
        this.dom = $('<div class=\'button-area\'><div>').append(this.button);
    }

    function uuid() {
        return Math.random().toString(36).substring(3, 8);
    }
});