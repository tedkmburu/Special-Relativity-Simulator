let levelSelectOffset = 0;
let leaderboardOffset = 0;
let loadPercent = 0;


function getScreen(screenName)  // this function returns the properties of the screen you want from the screens array
{
    let screenIndex = screens.findIndex(x => x.name == screenName);
    return screens[screenIndex];
}

function getScreenIndex(screenName)  // this function returns the index of the screen you want from the screens array
{
    return screens.findIndex(x => x.name == screenName);
}

function getButton(screenName, buttonTitle) // this function returns the properties of the button you want from the buttons array
{
    let screenIndex = screens.findIndex(x => x.name == screenName);
    let buttonIndex = screens[screenIndex].buttons.findIndex(x => x.title == buttonTitle);

    return screens[screenIndex].buttons[buttonIndex];
}

function getButtonIndex(screenName, buttonTitle) // this function returns the index of the button you want from the buttons array
{
    let screenIndex = screens.findIndex(x => x.name == screenName);
    
    return screens[screenIndex].buttons.findIndex(x => x.title == buttonTitle);
}











function displayHomeScreen()
{
    //image(homeTrack, 25 * scale.x, 25 * scale.y, 721 * scale.x, 333 * scale.y);

   

    let imageY = 110;
    let imageHeight = 500;
    let imageWidth = contractLength(width * 3, objects[0].vel.x)
    imageMode(CENTER);
    image(trainfloor, 2*width/3 + trackOffset + (((width * 3) - imageWidth) / 2), imageY, imageWidth, imageHeight)
    imageMode(CORNER);
    
    displayTracks();
    displayFrames();

    if(!buildMode)
    {
        moveFrames();

        mainFrameClock += dilateTime(deltaTime, objects[mainReferenceFrame].vel.mag());

        let numberOfObjectsAtEnd = 0; 

        objects.forEach(object => {
            if(!object.reachedEnd && object.type == "Train")
            {
                object.clock = dilateTime(mainFrameClock, object.vel.mag() - objects[mainReferenceFrame].vel.mag())
            }
            else if(object.type == "Train")
            {
                numberOfObjectsAtEnd++;
            }
            
        })

        if(numberOfObjectsAtEnd == numberOfTrains)
        {
            buildMode = true;
        }
    } 

    displayControlPanel();
    //displayDiagram();
    displayTimeSheet();
}

function displayTimeSheet()
{
    push()
        fill(255)    
        let x = width - 420
        let y = 0
        rect(x, y, 200 , 300)

        fill(0)
        textSize(16)
        finishTimes.forEach((train, i) => {

            let textToShow = "Train: " + train.train + "     Time: " + (train.time / 1000).toFixed(2) + " s"
            
            text(textToShow , x + 100, (i * 30) + y + 80)
        })

        textSize(24)
        text("Arrival Time: " , x + 100,  y + 30)

    pop()
}

function displayTracks()
{
    push();
        objects.forEach(object => 
        {
            if (object.type == "Train") 
            {
                stroke(0);
                strokeWeight(3);
                line(0,object.pos.y + object.size.y, width, object.pos.y + object.size.y);
                
                let newWeight = 5;
                strokeWeight(newWeight);
                stroke(100);
                for (let x = -width; x < width * 2; x+= contractLength(50, objects[0].vel.x) ) 
                {
                    let x1 = x + trackOffset;
                    let y1 = object.pos.y + object.size.y + newWeight;
                    let x2 = x + contractLength(20, objects[0].vel.x) + trackOffset;
                    let y2 = object.pos.y + object.size.y + newWeight;
                    line(x1, y1, x2, y2);
                }
            }
            
        });
    pop();
}

function displayControlPanel()
{
    push()
        fill(255)
        let panelWidth = 200;
        let panelHeight = 155;
        let x = width - panelWidth;
        rect(x , 0, panelWidth, panelHeight)

        fill(0)
        textSize(20)
        text("Control Panel", x + (panelWidth/2), 30)
    pop()
}


function getFinalPosDiagram(object, diagramSize)
{
    // t = vel * position
    let t1, t2; 

    t1 = object.vel.mag() * diagramSize;

    return t1;
}
function getFinalTimeDiagram(object, diagramSize)
{
    // t = vel * position
    let t1, t2; 

    t1 = Math.pow(object.vel.mag(), -1) * diagramSize;

    return t1;
}

function displayDiagram()
{
    push()
        
        fill(255)
        noStroke()
        let diagramSize = 300;
        rect(0, 0, diagramSize, diagramSize)

        stroke(0)
        line(diagramSize/10, 0, diagramSize/10, diagramSize)
        line(0, 9 * diagramSize/10, diagramSize, 9 * diagramSize/10)

        let colors = ["#C8331B","#F4CF47","#68A828","#5EDFDB","#21ADD7","#E56D31"]

        let x = diagramSize/10;
        let y = 9 * diagramSize / 10;
        
        strokeWeight(3);
        for (let i = 0; i < numberOfTrains; i++) 
        {
            stroke(colors[i]);
            line(x, y, getFinalPosDiagram(objects[i], diagramSize) + x, 0 );

            line(x, y, getFinalTimeDiagram(objects[i], diagramSize) + x, 0 );

        }

        
        

    pop()
}

function addTrain()
{
    if(numberOfTrains < 6)
    {
        numberOfTrains++;
    }
}

function removeTrain()
{
    if(numberOfTrains > 1)
    {
        numberOfTrains--;
    }
}




function displayScreen(screen)
{
    
    background("#432D2F");
    

    screen.display();
    screen.displayHeader();
        

    displayPopups();

    //displayFrameRate();
}



function navigateTo(screenToShow, backButton)
{

    screens.forEach(screen => {
        if (screen.name != screenToShow) 
        {
            screen.visibility = "hidden";
        }
        else
        {
            screen.visibility = "visible";
        }
    });
    currentScreen = screenToShow;

    if (!backButton) 
    {
        screenStack.push(screenToShow);
    }
}

function navigateBack()
{
    let screenToShow
    if (screenStack.length > 1) 
    {
        screenStack.pop()
        screenToShow = screenStack[screenStack.length - 1]
        
    }
    if (screenToShow == "Loading Screen") 
    {
        screenToShow = screenStack[screenStack.length - 1]
    }
    navigateTo(screenToShow, true);
}

class Screen 
{
    constructor(props)
    {
        this.name = props.name;
        this.title = props.title;
        this.titlePosition = createVector(props.titlePosition.x  * scale.x, props.titlePosition.y  * scale.y);
        this.titleFontSize = props.titleFontSize * scale.x;
        this.visibility = props.visibility;
        this.buttons = props.buttons;
        this.header = props.header;
        this.textBoxes = props.textBoxes;
        this.images = props.images;
        this.functions = props.functions;
    }

    display()
    {
        let screen = this;

        if (screen.functions != null) 
        {
            screen.functions();
        }

    }

    displayHeader()
    {
        let screen = this;

        push();
            noStroke()
            if (screen.header != null) 
            {
                fill("rgba(0,0,0,0.5)");
                rect(0, 0, width, 50 * scale.y);
            }

            textSize(screen.titleFontSize);
            fill(255);
            noStroke();
            text(screen.title, screen.titlePosition.x, screen.titlePosition.y);         

            screen.buttons.forEach(button =>
            {
                button.display();
            });

            screen.textBoxes.forEach(textBox =>
            {
                textBox.display();
            });

            // screen.images.forEach(image =>
            // {
            //     images.display();
            // });
        pop();
    }
}

let butonHalfWidth = 125
let buttonFullWidth = 260
let buttonHeight = 40

function createScreens() 
{
    screens = [
        // screen object format 
        // new Screen({
        //     name: give it a unique name, 
        //     title: This is text that will appear wherever the title position wants it,
        //     titlePosition: position for the title, 
        //     titleFontSize: font size of the title,
        //     visibility: the visibility of the screen is either "visibile" or "hidden". It's hidden by default, 
        //     buttons: [
        //         button objects that will appear on this screen
        //         ],
        //     textBoxes: [
        //          textbox objects that will appear on the screen
        //     ],
        //     functions: function(){ function that will run every frame while the screen is visible },
        //     }), 




        new Screen({
            name: "Home",
            title: "",
            titlePosition: createVector(200, 100), 
            titleFontSize: 48,
            visibility: "hidden", 
            buttons: [
                new Button({x: width - 140, y: 50, width: 100, height: 40, title: "Play" , onClick: function(){ buildMode = !buildMode; (this.title == "Play") ? this.title = "Pause" : this.title = "Play"; }, shape: "rect", bgColor: "#EFEFEF", fontColor: "black", fontSize: 14, font: fontRegular}), 
                new Button({x: width - 140, y: 100, width: 100, height: 40, title: "Restart" , onClick: function(){ resetFrames(); buildMode = true; screens[0].buttons[0].title = "Play" }, shape: "rect", bgColor: "#EFEFEF", fontColor: "black", fontSize: 14, font: fontRegular}),
                // new Button({x: width - 280, y: 200, width: 100, height: 40, title: "Add Train", onClick: function(){ addTrain() } ,  shape: "rect", bgColor: "#EFEFEF", fontColor: "black", fontSize: 14, font: fontRegular}),
                // new Button({x: width - 280, y: 250, width: 100, height: 40, title: "Remove Train", onClick: function(){ removeTrain() } ,  shape: "rect", bgColor: "#EFEFEF", fontColor: "black", fontSize: 14, font: fontRegular}),
  
                // new Button({x: 662, y: 75, width: 100, height: 40, title: "PLAY" , onClick: function(){ navigateTo("Level Select"); }, shape: "Home", bgColor: "rgba(0,0,0,0)", fontColor: "white", fontSize: 24, font: spaceFont}), 
                // new Button({x: 512, y: 150, width: 250, height: 40, title: "LEADERBOARD", onClick: function(){ navigateTo("Leaderboard"); }, shape: "Home", bgColor: "rgba(0,0,0,0)", fontColor: "white", fontSize: 24, font: spaceFont}), 
                // new Button({x: 612, y: 225, width: 150, height: 40, title: "SETTINGS", onClick: function(){ navigateTo("Settings"); }, shape: "Home", bgColor: "rgba(0,0,0,0)", fontColor: "white", fontSize: 24, font: spaceFont}), 
                // new Button({x: 662, y: 300, width: 100, height: 40, title: "HELP"    , onClick: function(){ showPopUp("Help") }, shape: "Home", bgColor: "rgba(0,0,0,0)", fontColor: "white", fontSize: 24, font: spaceFont}),
                //new Button({x:  10, y:  10, width: 140, height: 20, title: "Change Username", onClick: function(){ navigateTo("Settings"); }, shape: "Rect", bgColor: "rgba(0,0,0,0)", fontColor: "white", fontSize: 16, font: fontRegular})
                ],
            textBoxes: [],
            functions: function(){ displayHomeScreen() },
            }), 



    ]
}

