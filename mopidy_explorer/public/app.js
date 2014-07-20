angular.module('api', [
    'controllers'
]);
angular.module('controllers', ['mgcrea.ngStrap'])
    .controller('MainCtrl', function ($scope) {
        window.mopidy = new Mopidy({callingConvention: "by-position-or-by-name"});
        $scope.methods_toc = {}
        mopidy.on("state:online", function () {
            mopidy._send({method: "core.describe"}).then(function (data) {
                window.a = data;
                $scope.$apply(function () {
                    $scope.methods = data;
                    var methods_keys = Object.keys(data).map(function (item) {
                        return String(item).replace("core.", "");
                    }).sort();
                    methods_keys.forEach(function (item) {
                        item = item.split(".")
                        if (item.length == 1) {
                            item = ['core', item[0]]
                        }
                        var index = Object.keys($scope.methods_toc).indexOf(item[0]);
                        if (index == -1) {
                            $scope.methods_toc[item[0]] = [item[1]]
                        } else {
                            $scope.methods_toc[item[0]].push(item[1])
                        }

                    })
                });
            });

        });
        $scope.getCurl = function (method) {
            var _method = method;
            if (method.indexOf('core.') ==-1){
                _method = 'core.' +method;
            }
            var cmd = {
                "method": _method,
                "jsonrpc": "2.0",
                "params": $scope.getParams(method),
                "id": 1
            };
            return 'curl -X POST -H Content-Type:application/json'
                + ' -d \'' + JSON.stringify(cmd, null, 2) + '\' '
                + document.location.origin + '/mopidy/rpc';
        }
        $scope.getJS = function (method) {
            var cmd = $scope.getParams(method);
            return 'mopidy.' +$scope._snakeToCamel(method.replace('core.', ''))
                + '(' +JSON.stringify(cmd, null, 0) +').then('
                + 'function(data){\n'
                + '  console.log(data);\n'
                + '});'
        }
        $scope._snakeToCamel = function (name) {
            return name.replace(/(_[a-z])/g, function (match) {
                return match.toUpperCase().replace("_", "");
            });
        };
        $scope.getParams = function (method) {
            var param = {};
            $scope.getIt(method, 'params').map(function (item) {
                if(item.name != "kwargs"){
                    param[item.name]= null;
                }
            });
            return param;
        }
        $scope.getIt = function (method, key) {
            var method = method.replace("core.", "")
            var val = $scope.methods["core." + method][key];
            return val || 'Missing';
        }
    }).filter('htmlify', ['$sce', function ($sce) {
        return function (input) {
            if (!input) {
                return '';
            }
            return $sce.trustAsHtml(input);
        };
    }]);
var ws = new WebSocket("ws://" + document.location.host + "/mopidy/ws/");
ws.onmessage = function (message) {
    var console = document.getElementById('ws-console');
    var newLine = (new Date()).toLocaleTimeString() + ": " +
        message.data + "\n";
    console.innerHTML = newLine + console.innerHTML;
};