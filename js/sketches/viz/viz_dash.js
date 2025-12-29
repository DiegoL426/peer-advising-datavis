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

        preload: function (manager, p){

            //preload raw counts
            
                // total meetings
            this.totalMeetCount = (manager.data).length;

            let dataCounts = this.dataCountsGet(manager);
            this.helpedCount = dataCounts.helpedCount;
            this.dateCounts = dataCounts.dateCounts;
            this.missedNoShowCount = dataCounts.missedNoShowCount;

            this.doneLoading = true;
            this.encodeSans = p.loadFont('../fonts/EncodeSansNormal/EncodeSansNormal-900-Black.ttf');
            this.uniSans = p.loadFont('../fonts/UniSans/Fontfabric\ -\ UniSansRegular.otf');
            this.openSans = p.loadFont('../fonts/OpenSans/Open\ Sans\ regular.ttf');

            console.log(this.totalMeetCount + " " + this.helpedCount + " " + this.missedNoShowCount);
        },

        //rgba(160, 14, 14, 1);
        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizDash.preload(manager, p);
            }    
            
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;
            p.push();
            p.noStroke();
            p.fill(0,0,0);
            
            p.textAlign(p.CENTER);

            //STEP 1: Quick insights section
            p.rectMode(p.TOP_LEFT);
            p.fill('#e2d7faff');
            p.strokeWeight(2);
            p.rect(cx - 700, cy - 265, 700, 280, 10); // box outline
            p.noStroke();

            VizDash.drawQuickInsights(manager, p, cx, cy); //draw quick insights box

            //STEP 2: TIMELINE
            VizDash.drawDateTimeLine(manager, p, cx, cy);

            p.pop();
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
            p.stroke(100, 100, 250);
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
            p.fill(100, 100, 100);
            p.text("Total Signups", arcX, arcY + 4);

            //Completed vs incompleted meetings text
            p.textFont(this.openSans);
            p.textSize(20);
            p.textAlign(p.LEFT);
            p.text("Completed Meetings", cx - 210, cy - 214);
            p.text("Incomplete Meetings", cx - 210, cy - 144);
            
            //legend circles
            p.fill(100, 100, 250);
            p.circle(cx - 350, cy - 220, 60);
            p.fill('#FF6B6B');
            p.circle(cx - 350, cy - 150, 60);

            //Counts on each circle
            p.fill(255);
            p.textSize(20);
            p.textAlign(p.CENTER);
            p.textFont(this.encodeSans);
            p.text(this.helpedCount, cx - 350, cy - 214);
            p.text(this.missedNoShowCount, cx - 350, cy - 144);

            //Lines from circle to text
            p.stroke(100, 100, 100);
            p.strokeWeight(1.5);
            p.line(cx - 310, cy - 220, cx - 225, cy - 220);
            p.line(cx - 310, cy - 150, cx - 225, cy - 150);
            

            //Completion rate circle 
            let completionRate = ((this.helpedCount / this.totalMeetCount) * 100).toFixed(1);
            p.noStroke();
            p.fill('#4E944F');
            p.circle(cx - 310, cy - 50, 80);
            p.fill(255);
            p.textSize(30);
            p.textAlign(p.CENTER);
            p.text(completionRate + "%", cx - 310, cy - 40);
            p.textSize(20);
            p.fill(0);
            p.text("Completion Rate", cx - 150, cy - 50);

            p.pop();

        },

        //Draws the timeline of dates
        drawDateTimeLine: function(manager, p, cx, cy){
            p.push()
            p.strokeCap(p.ROUND);
            p.stroke(187, 187, 187);
            p.strokeWeight(2);
            p.line(cx - 700, cy+200, cx - 700, cy + 550);
            p.line(cx-700,cy+550, cx-300, cy + 550);
            p.pop();
        },


        //HELPER FUNCTIONS:--------------------------------------------------

        // This function iterates through every meeting in the data and gathers:
            //- dateCounts: an object where keys are dates and values are counts of helped meetings on that date
            //- helpedCount: an integer with total number of helped meetings
            //- missedNoShowCount: an integer with total number of missed/no-show meetings
        dataCountsGet: function(manager){
            let dateCounts = {};
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
                }
            }
            return {dateCounts, helpedCount, missedNoShowCount};
        }
    };
})();
