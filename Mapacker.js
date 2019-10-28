/*
 * replace spaces
 * loop from max
 * 
 * 
 * 
 * 
 * 
 */

var map = [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [2, 2, 2, 0, 0, 0],
    [1, 1, 1, 2, 0, 0],
    [3, 0, 0, 3, 3, 3]
];

var map_packed = '6|6x0;0,4x1,0;2x0,3x1,0;3x2,3x0;3x1,2,2x0;3,2x0,3x3';




/*
 0x6;
 0,1x4,0;
 0x2,1x3,0;
 2x3,0x3;
 1x3,2,0x2;
 3,0,3x3
 */


function unpack(string) {
    let result = [];

    /* picks length of each row */
    let info = string.split('|');
    let length = parseInt(info[0]);

    /* splits items into lines */
    let lines = info[1].split(';');

    for (let l = 0; l < lines.length; l++) {

        /* an index to represent the last added element to the current line */
        let itemIndex = 0;

        /* splits lines into items */
        let items = lines[l].split(',');

        /* creates and pushes an array for the current row/line */
        let buffer = new ArrayBuffer(length);
        result.push(new Uint8Array(buffer));

        for (let i = 0; i < items.length; i++) {
            /* multi numbs */
            if (items[i].indexOf('x') > 0) {

                let itemInfo = items[i].split('x');

                let mult = parseInt(itemInfo[0]);
                
                let number = parseInt(itemInfo[1]);

                result[l].fill(number, itemIndex, itemIndex + mult);

                itemIndex += mult;
            }

            if (isNaN(items[i]) === false) {
                let number = parseInt(items[i]);

                result[l][itemIndex] = number;

                itemIndex++;
            }
        }
    }

    return result;
}


function pack(array) {

    let result = [];

    let length = array[0].length;

    let current = {};

    for (let l = 0; l < array.length; l++) {

        result.push('');

        current = {
            item: -1,
            length: 0
        };

        for (let i = 0; i < array[l].length; i++) {
            /* first item of current line, storing it */
            if (i === 0) {
                current.item = array[l][i];
                current.length++;
            } else {
                /* if it aint the first item, then lets compare it */
                if (current.item === array[l][i]) {
                    current.length++;
                } else {
                    if (current.length > 1) {
                        result[l] += (current.length + 'x' + current.item) + ',';
                    } else {
                        result[l] += (current.item) + ',';
                    }
                    current.item = array[l][i];
                    current.length = 1;
                }
            }
        }

        if (current.length > 1) {
            result[l] += (current.length + 'x' + current.item);
        } else {
            result[l] += (current.item);
        }
    }

    return length + '|' + result.join(';');
}