// Example by https://twitter.com/awapblog
// Updated by https://twitter.com/boldbigflank

var game = new Phaser.Game(800, 470, Phaser.AUTO, 'gameDiv', { preload: preload, create: create });

var ICON_SIZE = 64;
var ICON_SPACING = 2;
var ICON_SIZE_SPACED = ICON_SIZE + ICON_SPACING;
var BOARD_COLS;
var BOARD_ROWS;
var MATCH_MIN = 3; // min number of same color icons required in a row to be considered a match

var score = 0;
var finalScore;
var sctext1;

var resultText;

var timer;
var time;
var total;
var t;

var icons;
var selectedIcon = null;
var selectedIconStartPos;
var selectedIconTween;
var tempShiftedIcon = null;
var allowInput;

function preload() {

    game.load.spritesheet("ICONS", "./assets/sprites/icons.png", ICON_SIZE, ICON_SIZE);

}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    sctext1 = game.add.text(610, 30, 'Score: 0', { font: "30px Arial", fill: "#ffffff" });
    time = game.add.text(610, 80, 'Timer: 30', { font: "30px Arial", fill: "#ffffff" });
    
    timer = game.time.create(false);
    timer.loop(1000, countdown, this);
    
    total = 0;
    
    game.stage.backgroundColor = "#42b9f4";
    
    // fill the screen with as many icons as possible
    spawnBoard();

    // currently selected icon starting position. used to stop player form moving icons too far.
    selectedIconStartPos = { x: 0, y: 0 };
    
    // used to disable input while icons are dropping down and respawning
    allowInput = false;

    game.input.addMoveCallback(slideIcon, this);
    timer.start();
    

}

function countdown() {

    total++;
    t = 30 - total;
    if (t == 0) {
        finalScore = score;
    } else if (t <= 0) {
        game.world.removeAll();
        resultText = game.add.text(300, 210, 'Your Score is ' + finalScore, { font: "30px Arial", fill: "#ffffff" });
    } else {
        time.text = 'Timer: ' + t;
    }

}

function releaseIcon() {

    if (tempShiftedIcon === null) {
        selectedIcon = null;
        return;
    }

    // when the mouse is released with a icon selected
    // 1) check for matches
    // 2) remove matched icons
    // 3) drop down icons above removed icons
    // 4) refill the board

    var canKill = checkAndKillIconMatches(selectedIcon);
    canKill = checkAndKillIconMatches(tempShiftedIcon) || canKill;

    if (! canKill) // there are no matches so swap the icons back to the original positions
    {
        var icon = selectedIcon;

        if (icon.posX !== selectedIconStartPos.x || icon.posY !== selectedIconStartPos.y)
        {
            if (selectedIconTween !== null)
            {
                game.tweens.remove(selectedIconTween);
            }

            selectedIconTween = tweenIconPos(icon, selectedIconStartPos.x, selectedIconStartPos.y);

            if (tempShiftedIcon !== null)
            {
                tweenIconPos(tempShiftedIcon, icon.posX, icon.posY);
            }

            swapIconPosition(icon, tempShiftedIcon);

            tempShiftedIcon = null;

        }
    }

    removeKilledIcons();

    var dropIconDuration = dropIcons();

    // delay board refilling until all existing icons have dropped down
    game.time.events.add(dropIconDuration * 100, refillBoard);

    allowInput = false;

    selectedIcon = null;
    tempShiftedIcon = null;

}

function slideIcon(pointer, x, y) {

    // check if a selected icon should be moved and do it

    if (selectedIcon && pointer.isDown)
    {
        var cursorIconPosX = getIconPos(x);
        var cursorIconPosY = getIconPos(y);

        if (checkIfIconCanBeMovedHere(selectedIconStartPos.x, selectedIconStartPos.y, cursorIconPosX, cursorIconPosY))
        {
            if (cursorIconPosX !== selectedIcon.posX || cursorIconPosY !== selectedIcon.posY)
            {
                // move currently selected icon
                if (selectedIconTween !== null)
                {
                    game.tweens.remove(selectedIconTween);
                }

                selectedIconTween = tweenIconPos(selectedIcon, cursorIconPosX, cursorIconPosY);

                icons.bringToTop(selectedIcon);

                // if we moved a icon to make way for the selected icon earlier, move it back into its starting position
                if (tempShiftedIcon !== null)
                {
                    tweenIconPos(tempShiftedIcon, selectedIcon.posX , selectedIcon.posY);
                    swapIconPosition(selectedIcon, tempShiftedIcon);
                }

                // when the player moves the selected icon, we need to swap the position of the selected icon with the icon currently in that position 
                tempShiftedIcon = getIcon(cursorIconPosX, cursorIconPosY);

                if (tempShiftedIcon === selectedIcon)
                {
                    tempShiftedIcon = null;
                }
                else
                {
                    tweenIconPos(tempShiftedIcon, selectedIcon.posX, selectedIcon.posY);
                    swapIconPosition(selectedIcon, tempShiftedIcon);
                }
            }
        }
    }
}

// fill the screen with as many icons as possible
function spawnBoard() {

    BOARD_COLS = Math.floor(600 / ICON_SIZE_SPACED);
    BOARD_ROWS = Math.floor(game.world.height / ICON_SIZE_SPACED);

    icons = game.add.group();

    for (var i = 0; i < BOARD_COLS; i++)
    {
        for (var j = 0; j < BOARD_ROWS; j++)
        {
            var icon = icons.create(i * ICON_SIZE_SPACED, j * ICON_SIZE_SPACED, "ICONS");
            icon.name = 'icon' + i.toString() + 'x' + j.toString();
            icon.inputEnabled = true;
            icon.events.onInputDown.add(selectIcon, this);
            icon.events.onInputUp.add(releaseIcon, this);
            randomizeIconColor(icon);
            setIconPos(icon, i, j); // each icon has a position on the board
            icon.kill();
        }
    }

    removeKilledIcons();

    var dropIconDuration = dropIcons();

    // delay board refilling until all existing icons have dropped down
    game.time.events.add(dropIconDuration * 100, refillBoard);

    allowInput = false;

    selectedIcon = null;
    tempShiftedIcon = null;

    // refillBoard();
}

// select a icon and remember its starting position
function selectIcon(icon) {

    if (allowInput)
    {
        selectedIcon = icon;
        selectedIconStartPos.x = icon.posX;
        selectedIconStartPos.y = icon.posY;
    }

}

// find a icon on the board according to its position on the board
function getIcon(posX, posY) {

    return icons.iterate("id", calcIconId(posX, posY), Phaser.Group.RETURN_CHILD);

}

// convert world coordinates to board position
function getIconPos(coordinate) {

    return Math.floor(coordinate / ICON_SIZE_SPACED);

}

// set the position on the board for a icon
function setIconPos(icon, posX, posY) {

    icon.posX = posX;
    icon.posY = posY;
    icon.id = calcIconId(posX, posY);

}

// the icon id is used by getIcon() to find specific icons in the group
// each position on the board has a unique id
function calcIconId(posX, posY) {

    return posX + posY * BOARD_COLS;

}

// since the icons are a spritesheet, their color is the same as the current frame number
function getIconColor(icon) {

    return icon.frame;

}

// set the icon spritesheet to a random frame
function randomizeIconColor(icon) {

    icon.frame = game.rnd.integerInRange(0, icon.animations.frameTotal - 1);

}

// icons can only be moved 1 square up/down or left/right
function checkIfIconCanBeMovedHere(fromPosX, fromPosY, toPosX, toPosY) {

    if (toPosX < 0 || toPosX >= BOARD_COLS || toPosY < 0 || toPosY >= BOARD_ROWS)
    {
        return false;
    }

    if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1)
    {
        return true;
    }

    if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1)
    {
        return true;
    }

    return false;
}

// count how many icons of the same color lie in a given direction
// eg if moveX=1 and moveY=0, it will count how many icons of the same color lie to the right of the icon
// stops counting as soon as a icon of a different color or the board end is encountered
function countSameColorIcons(startIcon, moveX, moveY) {

    var curX = startIcon.posX + moveX;
    var curY = startIcon.posY + moveY;
    var count = 0;

    while (curX >= 0 && curY >= 0 && curX < BOARD_COLS && curY < BOARD_ROWS && getIconColor(getIcon(curX, curY)) === getIconColor(startIcon))
    {
        count++;
        curX += moveX;
        curY += moveY;
    }

    return count;

}

// swap the position of 2 icons when the player drags the selected icon into a new location
function swapIconPosition(icon1, icon2) {

    var tempPosX = icon1.posX;
    var tempPosY = icon1.posY;
    setIconPos(icon1, icon2.posX, icon2.posY);
    setIconPos(icon2, tempPosX, tempPosY);

}

// count how many icons of the same color are above, below, to the left and right
// if there are more than 3 matched horizontally or vertically, kill those icons
// if no match was made, move the icons back into their starting positions
function checkAndKillIconMatches(icon) {

    if (icon === null) { return; }

    var canKill = false;

    // process the selected icon

    var countUp = countSameColorIcons(icon, 0, -1);
    var countDown = countSameColorIcons(icon, 0, 1);
    var countLeft = countSameColorIcons(icon, -1, 0);
    var countRight = countSameColorIcons(icon, 1, 0);

    var countHoriz = countLeft + countRight + 1;
    var countVert = countUp + countDown + 1;

    if (countVert >= MATCH_MIN)
    {
        killIconRange(icon.posX, icon.posY - countUp, icon.posX, icon.posY + countDown);
        canKill = true;
    }

    if (countHoriz >= MATCH_MIN)
    {
        killIconRange(icon.posX - countLeft, icon.posY, icon.posX + countRight, icon.posY);
        canKill = true;
    }

    return canKill;

}

// kill all icons from a starting position to an end position
function killIconRange(fromX, fromY, toX, toY) {

    fromX = Phaser.Math.clamp(fromX, 0, BOARD_COLS - 1);
    fromY = Phaser.Math.clamp(fromY , 0, BOARD_ROWS - 1);
    toX = Phaser.Math.clamp(toX, 0, BOARD_COLS - 1);
    toY = Phaser.Math.clamp(toY, 0, BOARD_ROWS - 1);

    for (var i = fromX; i <= toX; i++)
    {
        for (var j = fromY; j <= toY; j++)
        {
            var icon = getIcon(i, j);
            icon.kill();
            
            score += 50;
            sctext1.text = 'Score: ' + score;
        }
    }

}

// move icons that have been killed off the board
function removeKilledIcons() {

    icons.forEach(function(icon) {
        if (!icon.alive) {
            setIconPos(icon, -1,-1);
        }
    });

}

// animated icon movement
function tweenIconPos(icon, newPosX, newPosY, durationMultiplier) {

    console.log('Tween ',icon.name,' from ',icon.posX, ',', icon.posY, ' to ', newPosX, ',', newPosY);
    if (durationMultiplier === null || typeof durationMultiplier === 'undefined')
    {
        durationMultiplier = 1;
    }

    return game.add.tween(icon).to({x: newPosX  * ICON_SIZE_SPACED, y: newPosY * ICON_SIZE_SPACED}, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);

}

// look for icons with empty space beneath them and move them down
function dropIcons() {

    var dropRowCountMax = 0;

    for (var i = 0; i < BOARD_COLS; i++)
    {
        var dropRowCount = 0;

        for (var j = BOARD_ROWS - 1; j >= 0; j--)
        {
            var icon = getIcon(i, j);

            if (icon === null)
            {
                dropRowCount++;
            }
            else if (dropRowCount > 0)
            {
                icon.dirty = true;
                setIconPos(icon, icon.posX, icon.posY + dropRowCount);
                tweenIconPos(icon, icon.posX, icon.posY, dropRowCount);
            }
        }

        dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
    }

    return dropRowCountMax;

}

// look for any empty spots on the board and spawn new icons in their place that fall down from above
function refillBoard() {

    var maxIconsMissingFromCol = 0;

    for (var i = 0; i < BOARD_COLS; i++)
    {
        var iconsMissingFromCol = 0;

        for (var j = BOARD_ROWS - 1; j >= 0; j--)
        {
            var icon = getIcon(i, j);

            if (icon === null)
            {
                iconsMissingFromCol++;
                icon = icons.getFirstDead();
                icon.reset(i * ICON_SIZE_SPACED, -iconsMissingFromCol * ICON_SIZE_SPACED);
                icon.dirty = true;
                randomizeIconColor(icon);
                setIconPos(icon, i, j);
                tweenIconPos(icon, icon.posX, icon.posY, iconsMissingFromCol * 2);
            }
        }

        maxIconsMissingFromCol = Math.max(maxIconsMissingFromCol, iconsMissingFromCol);
    }

    game.time.events.add(maxIconsMissingFromCol * 2 * 100, boardRefilled);

}

// when the board has finished refilling, re-enable player input
function boardRefilled() {
    var canKill = false;
    for (var i = 0; i < BOARD_COLS; i++)
    {
        for (var j = BOARD_ROWS - 1; j >= 0; j--)
        {
            var icon = getIcon(i, j);

            if (icon.dirty)
            {
                icon.dirty = false;
                canKill = checkAndKillIconMatches(icon) || canKill;
            }
        }
    }

    if(canKill){
        removeKilledIcons();
        var dropIconDuration = dropIcons();
        // delay board refilling until all existing icons have dropped down
        game.time.events.add(dropIconDuration * 100, refillBoard);
        allowInput = false;
    } else {
        allowInput = true;
    }
}
