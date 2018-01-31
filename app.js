var MapGen = angular.module('MapGen', []);

var Canvas = MapGen.controller('Canvas', ['$scope', '$timeout', function ($scope, $timeout) {
        function map(n, start1, stop1, start2, stop2) {
            return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        }


        $scope.Map = {
            width: 800,
            height: 450,
            noiseWidth: 100,
            noiseHeight: 100,
            waterLine: 50,
            someValue: 4,
            seed: null,
            func: 'abs',
            top: 255,
            canvas: document.getElementById('noise'),
            generate: function () {
                var context = this.canvas.getContext('2d');

                // gets image data
                var image = context.getImageData(0, 0, this.width, this.height);

                if (!this.seed) {
                    this.newSeed();
                }

                // looping
                if(this.func === 'abs') {
                    var applyFunction = function(value, top) {
                        return Math.round(Math.abs(value) * top);
                    };
                } else
                if(this.func === 'map') {
                    var applyFunction = function(value, top) {
                        return map(value, -1, 1, 0, top);
                    };
                }
                
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        // generating noise for current coords
                        let value = noise.simplex2(x / this.noiseWidth, y / this.noiseHeight);

                        // getting its absolute value, times 255 to get a byte color value
                        value = applyFunction(value, this.top);

                        var cell = (x + y * this.width) * 4;
                        image.data[cell] = image.data[cell + 1] = image.data[cell + 2] = value;
                        image.data[cell] += Math.max(0, (this.waterLine - value) * this.someValue);
                        image.data[cell + 3] = 255; // alpha
                    }
                }

                context.putImageData(image, 0, 0);
            },
            delayGen: function () {
                $timeout(function () {
                    $scope.Map.generate();
                }, 100);
            },
            newSeed: function () {
                // generates odd seed
                this.seed = Math.floor(Math.random() * 1000);
                if (this.seed % 2 === 1) {
                    //this.seed++;
                }

                // sets seed
                noise.seed(this.seed);
            }
        };

        $timeout(function () {
            $scope.Map.generate();
        }, 1000);
    }
]);