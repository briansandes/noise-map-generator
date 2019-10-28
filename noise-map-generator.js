var MapGen = angular.module('MapGen', []);

var Canvas = MapGen.controller('Canvas', ['$scope', '$timeout', function ($scope, $timeout) {
        function map(n, start1, stop1, start2, stop2) {
            return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        }

        $scope.Map = {
            scale: 5,
            width: 240,
            height: 160,
            noiseWidth: 70,
            noiseHeight: 50,
            waterLine: 48,
            someValue: 4,
            seed: null,
            func: 'abs',
            top: 160,
            makeMap: true,
            foodTolerance: 70,
            waterTolerance: 155,
            tiles: {
                dirt: {
                    colors: [155, 118, 83]
                },
                food: {
                    colors: [0, 150, 12]
                },
                water: {
                    colors: [64, 164, 220]
                }
            },
            map: document.getElementById('noise'),
            screenCanvas: document.getElementById('map'),
            generate: function () {
                var context = this.map.getContext('2d');

                // gets image data
                var image = context.getImageData(0, 0, this.width, this.height);

                if (!this.seed) {
                    this.newSeed();
                }

                // setting methods inside loop
                if (this.func === 'abs') {
                    var applyFunction = function (value, top) {
                        return Math.round(Math.abs(value) * top);
                    };
                } else
                if (this.func === 'map') {
                    var applyFunction = function (value, top) {
                        return map(value, -1, 1, 0, top);
                    };
                }

                // setting methods inside loop
                if (this.makeMap === true) {
                    var getColors = function (value) {

                        let colorValue = value + Math.max(0, ($scope.Map.waterLine - value) * $scope.Map.someValue);

                        // dirt
                        if (colorValue < $scope.Map.foodTolerance && value < $scope.Map.foodTolerance) {
                            return $scope.Map.tiles.dirt.colors;
                        } else
                        // food
                        if (colorValue >= $scope.Map.foodTolerance && colorValue < $scope.Map.waterTolerance &&
                                value >= $scope.Map.foodTolerance && value < $scope.Map.waterTolerance) {
                            return $scope.Map.tiles.food.colors;
                        } else
                        // water
                        if (colorValue >= $scope.Map.waterTolerance) {
                            return $scope.Map.tiles.water.colors;
                        } else {
                            return $scope.Map.tiles.dirt.colors;
                        }
                    };
                } else
                if (this.makeMap === false) {
                    var getColors = function (value) {
                        return [value + Math.max(0, ($scope.Map.waterLine - value) * $scope.Map.someValue), value, value];
                    };
                }

                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        // generating noise for current coords
                        let value = noise.simplex2(x / this.noiseWidth, y / this.noiseHeight);

                        // getting its absolute value, times 255 to get a byte color value
                        value = applyFunction(value, this.top);
                        let colors = getColors(value);

                        var cell = (x + (y * this.width)) * 4;

                        image.data[cell] = colors[0]; // r
                        image.data[cell + 1] = colors[1]; // g
                        image.data[cell + 2] = colors[2]; // b
                        image.data[cell + 3] = 255; // alpha
                    }
                }

                
                context.putImageData(image, 0, 0);
                
                var screenContext = this.screenCanvas.getContext('2d');
                screenContext.imageSmoothingEnabled = false;
                
                screenContext.drawImage(this.map, 0, 0, this.width * this.scale, this.height * this.scale);
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