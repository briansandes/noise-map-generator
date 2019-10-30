var MapGen = angular.module('MapGen', []);

var MapGenCtrl = MapGen.controller('MapGenCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.Map = {
            scale: 5,
            params: {
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
                foodThreshold: 70,
                waterThreshold: 155
            },
            exportedData: '',
            noiseCanvas: document.getElementById('noise'),
            screenCanvas: document.getElementById('map'),
            generate: function () {
                if (!this.params.seed) {
                    this.newSeed();
                }
                
                this.map = NoiseMap.generate(this.params);
                
                var context = this.noiseCanvas.getContext('2d');
                var image = context.getImageData(0, 0, this.params.width, this.params.height);
                
                for (let y = 0; y < this.params.height; y++) {
                    for (let x = 0; x < this.params.width; x++) {
                        var cell = (x + (y * this.params.width)) * 4;

                        image.data[cell] = NoiseMap.tiles[NoiseMap.tiles.index[this.map.data[y][x]]].colors[0]; // r
                        image.data[cell + 1] = NoiseMap.tiles[NoiseMap.tiles.index[this.map.data[y][x]]].colors[1]; // g
                        image.data[cell + 2] = NoiseMap.tiles[NoiseMap.tiles.index[this.map.data[y][x]]].colors[2]; // b
                        image.data[cell + 3] = 255; // alpha
                    }
                }
                
                context.putImageData(image, 0, 0);
                
                var screenContext = this.screenCanvas.getContext('2d');
                screenContext.imageSmoothingEnabled = false;
                
                screenContext.drawImage(this.noiseCanvas, 0, 0, this.params.width * this.scale, this.params.height * this.scale);
            },
            delayGen: function () {
                $timeout(function () {
                    $scope.Map.generate();
                }, 100);
            },
            newSeed: function () {
                // generates odd seed
                this.params.seed = Math.floor(Math.random() * 1000);
                if (this.params.seed % 2 === 1) {
                    //this.seed++;
                }
            },
            
            reset: function() {
                this.params = Object.assign({}, NoiseMap.defaultParams);
            },
            export: function() {
                this.exportedData = JSON.stringify({
                    params: this.params,
                    data: pack(this.map.data)
                });
                this.exported = true;
            }
        };
        
        $scope.Map.params = Object.assign({}, NoiseMap.defaultParams);

        $timeout(function () {
            $scope.Map.generate();
        }, 100);
    }
]);