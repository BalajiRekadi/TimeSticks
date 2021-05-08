const timeSticks = (function () {
    // this should always be equal to stick width
    const offSetMultiplier = 2.2;
    let selectedFormat = true;

    const container = document.querySelector('#container');
    container.className = 'container';
    const timeContainer = document.createElement('div');
    timeContainer.id = 'time-container';
    container.appendChild(timeContainer);

    /**
     * Creates a conatiner div that holds two sticks
     * These containers contain two sticks
     * used to create Hours, minutes or seconds block
     * @param id - should be 'hours', 'minutes' or 'seconds'
     * @param hoursFormat - should be either '24' or '12'
     */
    function createSticksContainer(id, format = '24') {
        // create container
        const sticksContainer = document.createElement('div');
        let leftStick;
        let rightStick;

        sticksContainer.id = id + '-container';
        sticksContainer.className = 'sticks';

        switch (id) {
            case 'hours':
                if (format === '12') {
                    leftStick = createStick(id + '-' + 'left', [0, 1]);
                    rightStick = createStick(id + '-' + 'right', [0, 9]);
                    break;
                }
                leftStick = createStick(id + '-' + 'left', [0, 2]);
                rightStick = createStick(id + '-' + 'right', [0, 9]);
                break;
            default:
                leftStick = createStick(id + '-' + 'left', [0, 5]);
                rightStick = createStick(id + '-' + 'right', [0, 9]);
                break;
        }

        sticksContainer.appendChild(leftStick);
        sticksContainer.appendChild(rightStick);

        return sticksContainer;
    }


    // Creates a single time stick
    function createStick(id, range) {
        const stickNode = document.createElement('div');
        stickNode.id = id;
        stickNode.className = 'stick';

        // create number slots
        const slotsStack = [];
        let currentNumber = range[0];
        const min = currentNumber;
        const max = range[range.length - 1];
        while (currentNumber >= min && currentNumber <= max) {
            slotsStack.push(createSlot(currentNumber));
            currentNumber++;
        }
        stickNode.append(...slotsStack);

        return stickNode;
    }

    /**
     * Creates a slot for provided number
     */
    function createSlot(number) {
        const stickSlot = document.createElement('div');
        stickSlot.id = number;
        stickSlot.innerHTML = number;
        stickSlot.className = 'slot';
        return stickSlot;
    }

    // This will create all the sticks needed
    function buildTimeSticks(is24HourFormat = true) {
        selectedFormat = is24HourFormat;
        const format = is24HourFormat ? '24' : '12';
        timeContainer.className = 'time-container';

        timeContainer.appendChild(createSticksContainer('hours', format));
        timeContainer.appendChild(createSticksContainer('minutes'));
        timeContainer.appendChild(createSticksContainer('seconds'));

        return timeContainer;
    }

    let secondsLeft;
    let secondsRight;
    let minutesLeft;
    let minutesRight;
    let hoursLeft;
    let hoursRight;

    // This will start the time
    function startTime() {
        // get sticks by their IDs
        secondsLeft = document.querySelector('#seconds-left');
        secondsRight = document.querySelector('#seconds-right');
        minutesLeft = document.querySelector('#minutes-left');
        minutesRight = document.querySelector('#minutes-right');
        hoursLeft = document.querySelector('#hours-left');
        hoursRight = document.querySelector('#hours-right');

        setInterval(updateTime, 1000);
        function updateTime() {
            const time = new Date();
            let hours = time.getHours().toString();
            let minutes = time.getMinutes().toString();
            let seconds = time.getSeconds().toString();

            // format time to two digits
            if (seconds < 10)
                seconds = '0' + seconds;
            if (minutes < 10)
                minutes = '0' + minutes;

            if (!selectedFormat && hours > 12)
                hours = hours - 12;
            if (hours < 10)
                hours = '0' + hours;

            translateSticks(seconds, secondsLeft, secondsRight);
            translateSticks(minutes, minutesLeft, minutesRight);
            translateSticks(hours, hoursLeft, hoursRight);
        }

        // This will move the sticks
        function translateSticks(values, leftNode, rightNode) {
            const secondsLeftOffset = offSetMultiplier * values[0];
            const secondsRightOffset = offSetMultiplier * values[1];
            leftNode.style.transform = `translateY(-${secondsLeftOffset}rem)`;
            rightNode.style.transform = `translateY(-${secondsRightOffset}rem)`;
            leftNode.childNodes.forEach((slotNode, index) => {
                if (index.toString() === values[0]) {
                    slotNode.classList.add('highlight');
                } else {
                    slotNode.classList.remove('highlight');
                }
            });
            rightNode.childNodes.forEach((slotNode, index) => {
                if (index.toString() === values[1]) {
                    slotNode.classList.add('highlight');
                } else {
                    slotNode.classList.remove('highlight');
                }
            });
        }
    }

    return { buildTimeSticks, startTime };
})();

// Import timeSticks and call these methods
timeSticks.buildTimeSticks();
timeSticks.startTime();


/**
 * @todo - after can be like a land and before can be like  a setting sun and sticks like buildings
 * - try to get moew glass like feel to the sticks
 * - try to remove the 00 00 00 for first render, there should not be flickering
 * - try adding smooth animations for sticks
 */