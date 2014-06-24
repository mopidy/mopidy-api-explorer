angular.module('api', [
    'controllers'
])
angular.module('controllers', ['mgcrea.ngStrap'])
    .controller('MainCtrl', function ($scope) {
        var mopidy = new Mopidy();
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
            return 'curl -X POST -H Content-Type:application/json' +
                ' -d \'{\n  "method": "core.' + method + '",\n  ' +
                '"jsonrpc": "2.0",\n  "id": 1\n}\' ' +
                document.location.origin + '/mopidy/rpc';
        }
        $scope.getParams = function (method) {
            return $scope.getIt(method, 'params').map(function (item) {
                return item.name;
            }).join(', ');
        }
        $scope.getIt = function (method, key) {
            var val = $scope.methods["core." + method][key];
            return val || 'Missing';
        }
    }).filter('htmlify', ['$sce', function ($sce) {
        return function (input) {
            if (!input) {
                return '';
            }
            var text = input.
                    replace(/&/g, '&amp;').
                    replace(/</g, '&lt;').
                    replace(/>/g, '&gt;').
                    replace(/'/g, '&#39;').
                    replace(/"/g, '&quot;').
                    replace(/``(\S+)``/g, "<b>$1</b>").
                    replace(/:param (\w+) (\w+):/g, "<b title=\"$1\">$2</b>").
                    replace(/:param (\w+):/g, "<b>$1</b>").
                    replace(/:attr:`(\w+)`/g, "<b>$1</b>").
                    replace(/:meth:`([~\.\w]+)\(?\)?`/g, "<code title='method'>$1</code>").
                    replace(/    (.+)/g, "<pre>$1</pre>").replace(/<\/pre>(\s?)+<pre>/gim, "\n").
                    replace(/:type (\w+): (\w+)/g, "<i title=\"$2\">(type)</i>").
                    replace(/:type (\w+):/g, "<i title=\"$1\">($1)</i>").
                    replace(/:class:`([~\.\w]+)`/g, "<code title=\"class\">$1</code>").
                    replace(/``\[\\([\[\\]:\.\w]+)\]``/g, "<b>$1</b>").
                    replace(/:rtype: (\w+)/g, "<i>$1</i>").
                    replace(/:rtype:/g, "return")
                ;

            var output = '';
            angular.forEach(text.split("\n\n"), function (paragraph, key) {
                output += '<p>' + paragraph + '</p>';
            });
            return $sce.trustAsHtml(output);
        };
    }]);
var ws = new WebSocket("ws://" + document.location.host + "/mopidy/ws/");
ws.onmessage = function (message) {
    var console = document.getElementById('ws-console');
    var newLine = (new Date()).toLocaleTimeString() + ": " +
        message.data + "\n";
    console.innerHTML = newLine + console.innerHTML;
};