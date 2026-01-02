// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizDash = {

        doneLoading: false,

        //raw counts
        totalMeetCount: 0,
        helpedCount: 0,
        missedNoShowCount: 0,
        dateCounts: {},
        missedDateCounts: {},

        //booleans for timeline
        missedDateView: false,

        preload: function (manager, p){

            //preload raw counts
            
                // total meetings
            this.totalMeetCount = (manager.data).length;

            let dataCounts = this.dataCountsGet(manager);

            this.helpedCount = dataCounts.helpedCount;
            this.dateCounts = dataCounts.dateCounts;
            this.missedDateCounts = dataCounts.missedDateCounts;
            this.missedNoShowCount = dataCounts.missedNoShowCount;

            this.encodeSans = p.loadFont('fonts/EncodeSansNormal/EncodeSansNormal-900-Black.ttf');
            this.uniSans = p.loadFont('fonts/UniSans/Uni-Sans-Regular.otf');
            this.openSans = p.loadFont('fonts/OpenSans/Open-Sans-Regular.ttf');
        
            this.doneLoading = true;
        },

        //rgba(94, 94, 94, 1);
        draw: function (p, manager, ai, progress, cx, cy) {
            if (!this.doneLoading){
                VizDash.preload(manager, p);
            }    
            
            p.push();
            p.noStroke();
            p.fill(0,0,0);
            
            p.textAlign(p.CENTER);

            //STEP 1: Quick insights section
            p.rectMode(p.TOP_LEFT);
            p.fill('#f4ecf9ff');
            //p.fill('#E6DDF5');
            //p.fill('#ecececff');
            p.strokeWeight(2);

            p.push();
            p.drawingContext.shadowOffsetX = 4;
            p.drawingContext.shadowOffsetY = 4;
            p.drawingContext.shadowBlur = 10;
            p.drawingContext.shadowColor = 'rgba(71, 71, 71, 0.3)';
            p.rect(cx - 700, cy - 265, 700, 280, 10); // box outline
            p.pop();

            p.noStroke();
            VizDash.drawQuickInsights(manager, p, cx, cy); //draw quick insights box

            //STEP 2: TIMELINE
            p.push();
            p.drawingContext.shadowOffsetX = 4;
            p.drawingContext.shadowOffsetY = 4;
            p.drawingContext.shadowBlur = 10;
            p.drawingContext.shadowColor = 'rgba(71, 71, 71, 0.3)';
            p.rectMode(p.TOP_LEFT);
            p.rect(cx - 700, cy + 50, 700, 420, 10); // box outline
            p.pop();

            VizDash.drawDateTimeLine(manager, p, cx, cy);
        },

        //Drawing Functions:-------------------------------------------------

        //Draws the quick insights box
        drawQuickInsights: function(manager, p, cx, cy){
            p.push();

            //Title text
            p.textFont(this.encodeSans);
            p.fill(0,0,0);
            p.textAlign(p.LEFT);
            p.textSize(35);
            p.text("Overview", cx - 680, cy - 220);
            
            //The ARC (first time using it haha)
            //Arc showing % of helped meetings
            let helpedPercent = (this.helpedCount / this.totalMeetCount); // helped percent
            let arcRadius = 250;
            let arcX = cx - 550;
            let arcY = cy - 50;
            p.noFill();
            p.strokeWeight(10);
            p.stroke('#FF6B6B');
            p.arc(arcX, arcY, arcRadius, arcRadius, p.radians(180), p.radians(0));
            p.stroke('#6464FA');
            p.strokeWeight(10);
            p.arc(arcX, arcY, arcRadius, arcRadius, p.radians(180), p.radians(180 + (180 * helpedPercent)));
            p.noStroke();

            //Text in the arc
            p.textAlign(p.CENTER);
            p.textSize(50);
            p.fill(0,0,0);
            p.text(this.totalMeetCount, arcX, arcY - 40);
            p.textFont(this.openSans);
            p.textSize(30);
            p.fill('#505050');
            p.text("Total Signups", arcX, arcY + 4);

            //Completed vs incompleted meetings text
            p.textFont(this.uniSans);
            p.textSize(22);
            p.textAlign(p.LEFT);
            
            p.text("Completed Meetings", cx - 210, cy - 200);
            p.text("Incomplete Meetings", cx - 210, cy - 120);
            p.text("Completion Rate", cx - 210, cy - 40);
            
            // legend circles
            p.fill(100, 100, 250);
            p.circle(cx - 350, cy - 205, 60);

            p.fill('#FF6B6B');
            p.circle(cx - 350, cy - 125, 60);

            let completionRate = ((this.helpedCount / this.totalMeetCount) * 100).toFixed(1);
            p.fill('#4E944F');
            p.circle(cx - 350, cy - 45, 70);

            //Counts on each circle
            p.fill(255);
            p.textSize(30);

            p.textAlign(p.CENTER);
            p.textFont(this.uniSans);
            p.text(this.helpedCount, cx - 350, cy - 195);
            p.text(this.missedNoShowCount, cx - 350, cy - 115);
            p.textSize(23);
            p.text(completionRate + "%", cx - 350, cy - 36);

            //Lines from circle to text
            p.stroke(100, 100, 100);
            p.strokeWeight(1.5);
            p.line(cx - 310, cy - 205, cx - 220, cy - 205);
            p.line(cx - 310, cy - 125, cx - 220, cy - 125);
            p.line(cx - 310, cy - 45, cx - 220, cy - 45);
            p.pop();

        },

        //Draws the timeline of dates
        drawDateTimeLine: function(manager, p, cx, cy){
            p.push()

            //Title text
            p.textFont(this.encodeSans);
            p.fill(0,0,0);
            p.textAlign(p.LEFT);
            p.textSize(35);
            p.text("Meetings Over Time", cx - 680, cy + 100);
            p.textSize(18);
            p.textFont(this.openSans);
            p.fill('#505050');

            if (this.missedDateView){
                p.text("Number of missed/no-show meetings per day", cx - 680, cy + 130);
            } else {
                p.text("Number of completed meetings per day", cx - 680, cy + 130);
            }

            //Axes
            p.strokeCap(p.ROUND);
            p.stroke(187, 187, 187);
            p.strokeWeight(2);
            p.line(cx - 650, cy+155, cx - 650, cy + 440); // Y axis
            p.line(cx-650,cy+440, cx-38, cy + 440); // X axis

            //texture box taking up the graph
            p.push();
            p.noStroke();
            p.fill('#faeefdff');
            p.rect(cx - 650, cy + 155, 612, 285);
            p.pop();
                
            let dateCounts = this.dateCounts;
            let missedDateCounts = this.missedDateCounts;

            let dates = Object.keys(dateCounts);

            let counts = [];
            if (this.missedDateView){
                counts = dates.map(date => missedDateCounts[date] || 0); // array of missed/no-show counts
            } else {
                counts = dates.map(date => dateCounts[date]); // array of counts
            }
            let maxCount = 15; // maximum count for scaling
            
            dates.sort((a,b) => new Date(a) - new Date(b)); //sort dates in ascending order
            
            //Y axis labels
            p.fill(0,0,0);
            p.textAlign(p.CENTER);
            p.textSize(12);
            p.noStroke();

            p.text(maxCount.toString(), cx - 660, cy + 160);
            p.text(Math.round(maxCount / 2).toString(), cx - 660, cy + 300);
            p.text("0", cx - 660, cy + 445);

            p.strokeWeight(1);
            p.stroke(187, 187, 187);
            p.line(cx - 650, cy + 297.5, cx - 38, cy + 300); //mid line
            p.line(cx - 650, cy + 155, cx - 38, cy + 155); //top line

            //X axis labels
            p.textAlign(p.CENTER);
            p.textSize(12);
            p.noStroke();
            p.text("Sept 15th", cx - 650, cy + 460); // first date
            p.text("Dec 5th", cx - 38, cy + 460); // last date


            //Building the timeline bars     
            let timelineW = 600;
            let timelineH = 285;
            p.noStroke();
            p.fill(80, 150, 200, 220);

            // build a bar for each date, making its height based on the # of meetings on that date
            for (let i = 0; i < dates.length; i++){
                let date = dates[i];
                let count = 0;
                if (this.missedDateView) {
                    count = missedDateCounts[date] || 0;
                } else {
                    count = dateCounts[date];
                }
                let x = (cx - 650 + (i / (dates.length - 1)) * timelineW) + 10;
                let y = cy + 440 - (count / maxCount) * timelineH;

                //x axis label in mid october and novemeber
                if (date === "10/15/2025"){
                    p.fill(0,0,0);
                    p.textAlign(p.CENTER);
                    p.textSize(12);
                    p.noStroke();
                    p.text("Oct 15th", x, cy + 460);
                } else if (date === "11/14/2025"){
                    p.fill(0,0,0);
                    p.textAlign(p.CENTER);
                    p.textSize(12);
                    p.noStroke();
                    p.text("Nov 14th", x, cy + 460);
                }

                if (this.missedDateView){
                    p.stroke('#FF6B6B');
                } else {
                    p.stroke('#6464FA');
                }

                //draw the bar
                p.strokeCap(p.SQUARE);
                p.strokeWeight(4);
                p.line(x, cy + 440, x, y);
            }

            //data source buttons next to title

            p.textFont(this.uniSans);
            p.textAlign(p.CENTER);
            p.textSize(15);
            if (this.missedDateView){
                p.stroke('#6464FA');
                p.strokeWeight(2);
                p.noFill();
                p.rect(cx - 280, cy + 70, cx - 680, cy - 220, 25);
                p.noStroke();
                p.fill(`#FF6B6B`);
                p.rect(cx - 150, cy + 70, cx - 680, cy - 220, 25);
                p.fill(0);
                p.text("See Complete", cx - 231, cy + 100);
                p.fill(255);
                p.text("See Incomplete", cx - 100, cy + 100);
            } else {
                p.stroke('#FF6B6B');
                p.strokeWeight(2);
                p.noFill();
                p.rect(cx - 150, cy + 70, cx - 680, cy - 220, 25);
                p.noStroke();
                p.fill('#6464FA');
                p.rect(cx - 280, cy + 70, cx - 680, cy - 220, 25);

                p.fill(255);
                p.text("See Complete", cx - 231, cy + 100);
                p.fill(0);
                p.text("See Incomplete", cx - 100, cy + 100);

            }
            
            if (p.mouseIsPressed){
                if (
                p.mouseX >= cx - 150 &&
                p.mouseX <= cx - 150 + 130 &&
                p.mouseY >= cy + 70 &&
                p.mouseY <= cy + 70 + 30
                ) {
                    VizDash.missedDateView = true;
                }

                // See Complete
                if (
                    p.mouseX >= cx - 280 &&
                    p.mouseX <= cx - 280 + 130 &&
                    p.mouseY >= cy + 70 &&
                    p.mouseY <= cy + 70 + 30
                ) {
                    VizDash.missedDateView = false;
                }
            }
            
            p.pop();
        },


        //HELPER FUNCTIONS:--------------------------------------------------

        // This function iterates through every meeting in the data and gathers:
            //- dateCounts: an object where keys are dates and values are counts of helped meetings on that date
            //- missedDateCounts: an object where keys are dates and values are counts of missed/no-show meetings on that date
            //- helpedCount: an integer with total number of helped meetings
            //- missedNoShowCount: an integer with total number of missed/no-show meetings
        dataCountsGet: function(manager){
            let dateCounts = {};
            let missedDateCounts = {};
            let helpedCount = 0;
            let missedNoShowCount = 0;

            for (const meeting of manager.data){
                let date = meeting["Start time"];
                let helper = meeting["Being Helped By"];
                let endTime = meeting["CompletionTime (Ctrl + Shift + ; )"];
                if (helper || endTime){
                    helpedCount++;
                    if (dateCounts[date]){
                        dateCounts[date]++;
                     } else {
                        dateCounts[date] = 1;
                    }
                } else {
                    missedNoShowCount++;
                    if (missedDateCounts[date]){
                        missedDateCounts[date]++;
                    } else {
                        missedDateCounts[date] = 1;
                    }
                }
            }
            return {dateCounts, helpedCount, missedNoShowCount, missedDateCounts};
        }
    };
})();
