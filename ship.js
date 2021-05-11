function displayFrames()
{
    objects.forEach(object => {
        object.display();
    })
}

function resetFrames()
{
    objects.forEach(object => 
    {
        object.reset();
    });

    diagramPointsTime = [[],[],[],[],[],[]]
    diagramPointsPos = [[],[],[],[],[],[]]
}

function moveFrames()
{
    objects.forEach(object => {
        object.move();
    })
    trackOffset += objects[2].relativeVel.x;
    trackOffset += objects[2].relativeVel.x;
    trackOffset += objects[2].relativeVel.x;
}

function sliderChanged()
{
  //console.log("slider");
}


class ReferenceFrame
{
    constructor(props)
    {
        this.startingPosition = createVector(props.pos.x, props.pos.y);
        this.pos = props.pos;

        this.startingVel = props.vel;
        this.vel = props.vel;
        this.relativeVel;

        this.size = props.size;
        this.contractedSize = props.size;

        this.clock = 0;

        this.selected = false;
        this.reachedEnd = false;
        this.stationaryFrame = false;

        this.slider = createSlider(-1, 1, props.vel.x, 0.01);

        this.slider.style("zIndex", "999");
        this.slider.style("visibility", "hidden");
        this.slider.addClass("slider");
        this.slider.input(sliderChanged);
        this.slider.changed(sliderChanged);
    }

    

    move()
    {
        let frame = this;

        frame.relativeVel = createVector(frame.vel.x - objects[mainReferenceFrame].vel.x, frame.vel.y - objects[mainReferenceFrame].vel.y);
     
        if (frame.reachedEnd) 
        {
            frame.pos.x = objects[2].pos.x;
            frame.vel = createVector(0,0);
        }

        let newSizeX = frame.size.x;
        let newSizeY = frame.size.y;
        newSizeX = contractLength(frame.size.x, frame.vel.x);
        
        frame.contractedSize = createVector(newSizeX, newSizeY);

        if(frame.pos.x < objects[2].pos.x || frame.type != "Train")
        {
            frame.pos.add(frame.relativeVel)
            frame.pos.add(frame.relativeVel)
            frame.pos.add(frame.relativeVel)
        }
        else if (!frame.reachedEnd)
        {
            finishTimes.push({train: frame.index - 2, time: mainFrameClock})
            frame.reachedEnd = true;
            
        }
    }

    reset()
    {
        let frame = this;
        frame.pos = createVector(frame.startingPosition.x, frame.startingPosition.y);
        mainFrameClock = 0;
        finishTimes = []
        frame.vel = createVector(frame.startingVel.x , frame.startingVel.y)

        frame.clock = 0;
        frame.reachedEnd = false; 
    }
}



class Anchor extends ReferenceFrame
{
    constructor(frame, props)
    {
        super(frame);
        this.type = props.type;
    }
    display()
    {
        
    }
}




class RaceLine extends ReferenceFrame
{
    constructor(frame, props)
    {
        super(frame);
        this.type = props.type;
    }

    display()
    {
        let line = this;
        push();
            fill("rgb(0,0,0)")
            rect(line.pos.x, line.pos.y, line.size.x, line.size.y)

            
        pop();
    }
}







class Train extends ReferenceFrame
{
    constructor(frame, props)
    {
        super(frame);
        this.type = "Train";

        this.color = props.color;
        this.carriages = props.carriages; 
        this.windows = props.windows; 
        this.index = props.index;
    }

    display()
    {
        let train = this;
        push();

            strokeWeight(1)

            image(trainImages[train.index - 3], train.pos.x, train.pos.y, train.contractedSize.x, train.size.y)

            fill(255);
            noStroke();
            textSize(16);

            let timeToShow = train.clock / 1000; 

            timeToShow = timeToShow.toFixed(2);


            

            

            let lengthToShow = train.contractedSize.x
            lengthToShow = lengthToShow;

            let velToShow = train.vel.mag() - objects[mainReferenceFrame].vel.mag();
            velToShow = velToShow.toFixed(2);


            text(timeToShow + " s", train.pos.x + train.contractedSize.x + 25, train.pos.y + (train.size.y / 2) - 10);
            text("vel: " + train.vel.x.toFixed(2) + " c", train.pos.x + train.contractedSize.x + 40, train.pos.y + (train.size.y / 2) + 10);
            text("relVel: " + velToShow + " c", train.pos.x + train.contractedSize.x + 50, train.pos.y + (train.size.y / 2) + 30);

            let lengthPosition = train.pos.x + (lengthToShow / 2) 
            text(Math.round((lengthToShow / 5)) + " m", lengthPosition, train.pos.y + train.size.y + 20);
            stroke(255)
            line(train.pos.x, train.pos.y + train.size.y + 15, lengthPosition - 30,train.pos.y + train.size.y + 15);
            line(lengthPosition + 30, train.pos.y + train.size.y + 15, train.pos.x + lengthToShow - 5, train.pos.y + train.size.y + 15);
            // line();

            if(train.selected)
            {
                noFill()
                stroke(0)
                strokeWeight(5)
                rect(train.pos.x, train.pos.y, train.contractedSize.x, train.size.y);
                mainReferenceFrame = train.index;

                objects[0].vel = createVector(train.vel.x, train.vel.y)

               


            }
            if (this.selected && buildMode)
            {
                train.slider.position(this.pos.x  + (this.contractedSize.x) + 100, this.pos.y + 30, "fixed");
                train.slider.style("visibility", "visible");
                train.vel.x = this.slider.value();
            }
            else
            {
                train.slider.style("visibility", "hidden");
            }

            
        pop();
    }
}



