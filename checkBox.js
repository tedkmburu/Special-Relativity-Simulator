
class CheckBox
{
    constructor(props)
    {
        this.x = props.x;
        this.y = props.y;
        this.size = props.size;

        this.visibility = props.visibility || "visible";

        this.text = props.text;

        this.value = props.value;

        this.onClick = props.onClick;

        this.onClick()
    }

    display()
    {
        let checkBox = this;
        
        push();
            stroke(0)
            if (this.value)
            {
                fill("#0075FF");
            }
            else 
            {
                fill(255);
            }
            rect(checkBox.x, checkBox.y, checkBox.size, checkBox.size, 2);
            if (this.value)
            {
                stroke(255)
                strokeWeight(4)
                line(checkBox.x + (checkBox.size / 2.5), checkBox.y + checkBox.size - (checkBox.size / 2.85), checkBox.x + checkBox.size - (checkBox.size / 4), checkBox.y + (checkBox.size / 4))
                line(checkBox.x + (checkBox.size / 2.5), checkBox.y + checkBox.size - (checkBox.size / 2.85), checkBox.x + (checkBox.size / 4) , checkBox.y + (checkBox.size / 2))
                strokeWeight(1)
            }

            fill(0);
            textAlign(LEFT, CENTER);
            textSize(13);
            noStroke();
            text(checkBox.text, checkBox.x + (1.25 * checkBox.size),  checkBox.y + (checkBox.size / 2) );
        pop();  
        
    }

    clicked()
    {
        let checkBox = this;
        if (checkBox.visibility != "hidden") 
        {
            checkBox.value = !checkBox.value;
            checkBox.onClick()
        }
    }
  
}


