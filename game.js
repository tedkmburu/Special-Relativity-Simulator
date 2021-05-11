// The preload function is used to load in all the fonts and images. I assign each one to a global variable so I can use it anywhere in the code. Because they are all loaded in the beginning, the user never waits for images to load. After the preload function is complete, the setup() function starts
function preload() 
{
    spaceFont = loadFont('fonts/Anurati.otf');
    fontRegular = loadFont('fonts/Helvetica.ttf');

    backgroundImage = loadImage('images/circle.png'); // this image is the background while in "play" mode
    blueprint = loadImage('images/blueprint2.png'); // this image is the background while in "build" mode

    trainfloor = loadImage('images/trainbackground.png'); // this image is the background while in "build" mode

    // these are all the icons that the game will use. They are normal images. 
    // icon = {
    //     delete: loadImage('images/delete.png'), 
    //     circle: loadImage('images/circle.png'), 
    //     back: loadImage('images/back.png'), 
    //     edit: loadImage('images/edit.png'), 
    //     help: loadImage('images/help.png'), 
    //     play: loadImage('images/play.png'),
    // };


    trainImages = [
        loadImage('images/train (1).png'), 
        loadImage('images/train (2).png'), 
        loadImage('images/train (3).png'), 
        loadImage('images/train (4).png'), 
        loadImage('images/train (5).png'), 
        loadImage('images/train (6).png')
    ]



    // these are all the images that are used in popups 
    popUpImage = {


    }
    
    // all sound files that he game plays must be in an mp3 format
    soundFormats('mp3');

    // these are all the sounds that the game will use
    sounds = {
        click: loadSound('sounds/click (1).mp3'),
        lose: loadSound('sounds/hit.mp3'),
        collect: loadSound('sounds/collect.mp3'),
        victory: loadSound('sounds/victory.mp3'),
        portal: loadSound('sounds/portal.mp3'),
        // click: loadSound('sounds/clickv2.mp3'),
        // lose: loadSound('sounds/failv2.mp3'),
        // collect: loadSound('sounds/starv2.mp3'),
        //victory: loadSound('sounds/successv2.mp3'),
        popup: loadSound('sounds/popupv2.mp3'),
        };

    // Here I decrease the volume that these specific sounds are played at. They are too loud without the reductions
    sounds.victory.setVolume(0.1);
    sounds.portal.setVolume(0.3);
}


async function setup()    // This function only runs once when the page first loads. 
{
    
    let scaledHeight = windowWidth * (375 / 812);  // 375 / 812 is the aspect ratio of an iphone X. All of the sizes and positions of things are modeled aroung that
    let scaledWidth = windowWidth;
    createCanvas(windowWidth, windowHeight);  // here I create a canvas with the dimentions that fit on the screen

    textFont(fontRegular); // this is the font that I defined in the preload() function

    windowSize = createVector(scaledWidth, scaledHeight).mag();     // this is the size of the screen diagonally.
    scale = createVector(scaledWidth/812, scaledHeight/375);    // this scale is used to scale the size of things in the game up or down depending on the size of the screen

    checkScreenRotation() // checks to make sure the device is in landscape mode

    angleMode(DEGREES);     // this switches the angle mode from radians to degrees. It's important for drawing the feild lines to be in degrees mode
    textAlign(CENTER);      // all text drawn on the screen will now be centered by default
    




    createTextClasses();
    createScreens();    // this creates the screen objects into the screens array
    createPopups();    // this creates the Popup objects into the popups array

    


    if (getItem("playSounds") == null) 
    {
        storeItem("playSounds", true);
    }

    let trainWidth = 500; 
    startLine = 200; 
    finishLine = width - 600; 
    

    objects.push(new Anchor({
        pos: createVector(0, 0), 
        vel: createVector(0,0), 
        size: createVector(0, 0)
    },
    {
        type: "Anchor",
    }
    ))

    objects.push(new RaceLine({
        pos: createVector(startLine, 350), 
        vel: createVector(0,0), 
        size: createVector(20, height)
    },
    {
        type: "start",
    }
    ))

    objects.push(new RaceLine({
        pos: createVector(finishLine, 350), 
        vel: createVector(0,0), 
        size: createVector(20, height)
    },
    {
        type: "end",
    }
    ))

    

    for (let i = 3; i < 9; i++) 
    {
        let velocity = createVector((i - 3)/ 6, 0); 


        objects.push(new Train({
            pos: createVector(startLine, (i - 2) * 100 + 250), 
            vel: velocity, 
            size: createVector(trainWidth, 70)
        },
        {
            index: i,
        }
        ))
        
    }

    

        
    
    mainReferenceFrame = 2; 
    navigateTo(currentScreen); // this navigates to the first screen the users will see when he game is first opened. The screen the user first sees can be set in the variables.js file


    document.getElementById("defaultCanvas0").setAttribute("oncontextmenu", "return false"); // this disables the right click context menu on the webpage

    console.log("setup complete"); // this message won't show up in the console if there is an error somewhere in the setup funtion. Useful for debugging on certain devices. 

    


    
}


function draw() // this function runs every frame. It's used to show the screen that is currently visible. the screen then has functions to show all the things that are supposed to be visible when the user is looking at that screen 
{
    frameRate(60);  // the game will try limit itself to 60 frames per second. If a device can't maintain 60 fps, it will run at whatever it can

    screens.forEach(screen =>
    {
        if (screen.name == currentScreen) 
        {
            displayScreen(screen) // every frame, the game finds the screen object in the screens array that has a name that matches the currentScreen variable and displays that screen. This will show all buttons, images and textboxes in that screen as well as run its functions
        }
    })

    // checkScreenRotation()
}


function convertVelocityToUnitsC(velocity)
{
    let newVel = velocity / 299792458;
    return newVel;
}

function dilateTime(stationaryTime, velocity)
{
    let mainFrameVelocity = objects[mainReferenceFrame].vel.mag(); 
    let vOverCSquared = Math.pow(velocity - mainFrameVelocity, 2); // Math.pow(velocity / c, 2) but c is 1
    let gamma = Math.sqrt(1 - vOverCSquared);
    let dilatedTime = stationaryTime * gamma; 

    return dilatedTime;
}

function contractLength(properLength, velocity)
{
    let mainFrameVelocity = objects[mainReferenceFrame].vel.mag(); 
    let vOverCSquared = Math.pow(velocity - mainFrameVelocity, 2); // Math.pow(velocity / c, 2) but c is 1
    let gamma = (Math.sqrt(1 - vOverCSquared));
    let relativeLength = properLength * gamma; 

    return relativeLength;
}



function togglePlaySounds() 
{
    playSounds = !playSounds; // this toggles the playSounds variable between true and false

    createScreens();    // you then have to createScreens again to update the buttons in the settings menu to have the right background color and text

    // after that, I recreate the buttons in the level select screen because they were removed in the createScreeens() function
    createLevelNavigationButtons();
}



function toggleColorBlindMode()
{
    colorBlindMode = !colorBlindMode; // this toggles the colorBlindMode variable between true and false
    storeItem("colorBlindMode", colorBlindMode); // the users color preference is then stored locally on the device for the next time they play the game
    

    chargeColor = getColors(); // this function changes the charge colors to match the color mode. The chargeColor variable is also used to display the color of some buttons. Those will change too. 
    textColor = getTextColors(); // this function changes the text colors to match the color mode

    createTextClasses(); // the classes for textboxes are recreated with the new color mode
    createScreens(); // you then have to createScreens again to update the buttons in the settings menu to have the right background color and text

    createLevelNavigationButtons() // recreate the buttons in the level select screen because they were removed in the createScreeens() function
}




function checkScreenRotation()
{
    // if (window.screen.orientation.type != "landscape-primary" &&  window.screen.orientation.type != "landscape-secondary")
    // {
    //     // document.body.setAttribute( "style", "-webkit-transform: rotate(-90deg);");

    //     // resizeCanvas(windowHeight, windowWidth);
    //     // scale = createVector(height/375, width/812);
    //     // windowSize = createVector(width, height).mag(); 
    //     push()
    //         fill(0);
    //         rect(0, 0, width, height);
    //     pop()
        
    // }
    // else
    // {
    //     // document.body.setAttribute( "style", "-webkit-transform: rotate(0deg);");
    // }
    //createScreens();
}

window.addEventListener("orientationchange", function(event) 
{
    console.log("the orientation of the device is now " + event.target.screen.orientation.type);
    checkScreenRotation();
});


function keyPressed() 
{

}



function mouseDraggedLevel() // only runs when the screen that's currently being displayed is the level screen
{
    if (gameMode == "Build") 
    {
        let mousePosition = createVector(mouseX, mouseY);
        let draggingCharge = null; // this will store the index of the charge that's being dragged

        charges.forEach((charge, i) => { // loop through all charges. Used a JavaScript array function
            if (charge.dragging)    // if the charge's dragging property is true
            {
                draggingCharge = i; // set dragging chages to that charges index
            }
        })


        if (draggingCharge == null) // if no charge is being dragged
        {
            charges.forEach(charge => { // loop through all charges. Used a JavaScript array function
                let distance = mousePosition.dist(charge.position); // get distance between two points. Used p5 vector.dist(vector) function
                if (distance < chargeRadius)    // this is true when the user is dragging a point inside a charge
                {
                    draggingCharge = charge;
                    charge.dragging = true; // this sets dragging equal to true so the next time the mouseDraggedLevel() funciton is called, draggingCharge will not be null
                }
            })
        }
        else
        {
            charges.forEach(charge => {
                charge.dragging = false;
                charge.selected = false;
            });

            draggingCharge = charges[draggingCharge];
            draggingCharge.dragging = true;
            draggingCharge.x = constrain(mouseX,0,width);
            draggingCharge.y = constrain(mouseY,0,height);
            draggingCharge.position = createVector(mouseX, mouseY);

            createFieldLines();
        }
    }
}





function displayFrameRate() // every 20 frames, this will update the frame rate displayed on the screen. If I change it every frame, it is too fast to read
{
    if (frameCount % 20 == 0) 
    {
        currentFrameRate = frameRate(); 
    }
    push();
        noStroke();
        fill(100);
        textSize(20);
        text(round(currentFrameRate), 125, 25);
    pop();
}

function displayTime() // this will display the timer at the top of the level
{
    push();
        textFont('Arial')
        noStroke();
        fill(255);
        textSize(20 * scale.x);
        text(millisecondsToTimeFormat(timeElapsed), 406 * scale.x, 30 * scale.y);
    pop();
}

function displayTrash() // this will display the trash can icon at the bottom left of the screen.
{
    

    push();
        fill(255)
        noStroke()
        rect(0, height - 50, 50, 50);
    pop();

    
    let chargeIsBeingDragged = charges.some(charge => charge.dragging);
    let chargeIsSelected = charges.some(charge => charge.selected);

    if(chargeIsBeingDragged && mouseIsPressed) // if a charge is being dragged, the trash can will move around 
    {
        image(icon.delete, 5 + (Math.random() * 5) - 2.5, height - 45+ (Math.random() * 5) - 2.5, 40, 40);
    }
    else    // if no cahrge is being dragged, the trash can will remain in place
    {
        image(icon.delete, 5 , height - 45, 40, 40);
    }
    

    charges.forEach((charge, i) => 
    {
        if (charge.x < 50 && charge.y > height - 50) // if a charge is positined in the same place as the trash can, it will be deleted
        {
            charges.splice(i,1); // this removes the charge from the charges array or "deletes" it
            createFieldLines(); // after the charge is deleted, the game needs to recalculate the field lines
        }
    })
    
}

function millisecondsToTimeFormat(millis) // this converts time from a millisecond format to a minutes:seconds.milliseconds format
{
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(2);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function windowResized() // when the windown is resized, these functions will run. This is a p5 inbuilt function
{
    setup();    
}

function openFullscreen() // this funciton will launch the game in fullscreen. It's currently not called anywhere 
{
    fullscreen();
    resizeCanvas(windowWidth, windowHeight);
    windowSize = createVector(width, height).mag();

    // var elem = document.getElementById("defaultCanvas0");

    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // } else if (elem.mozRequestFullScreen) { /* Firefox */
    //   elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    //   elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) { /* IE/Edge */
    //   elem.msRequestFullscreen();
    // }
}
