// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizDash = {

        doneLoading: false,

        preload: function (manager, p){

            const dateCounts = VizDash.dateCountsGet(manager);
            const helpedCount = VizDash.helpedCountGet(manager);
            const totalMeetCount = (manager.data).length;
            this.doneLoading = true;

            this.myFont = p.loadFont('assets/YourFontName.ttf');
            console.log(totalMeetCount + " " + helpedCount);
        },

        //rgb(0,0,0);
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
            p.textSize(20);
            p.text("Hello", cx - 100, cy);


            //STEP 1: TIMELINE (I guess?)
            VizDash.drawDateTimeLine(manager, p, cx, cy);


            p.pop();
        },

        //Drawing Functions:-------------------------------------------------

        drawDateTimeLine: function(manager, p, cx, cy){
            p.strokeCap(p.ROUND);
            p.stroke(187, 187, 187);
            p.strokeWeight(2);
            p.line(cx - 700, cy+200, cx - 700, cy + 550);
            p.line(cx-700,cy+550, cx-300, cy + 550);
        },


        //HELPER FUNCTIONS:--------------------------------------------------

        //This function iterates through every meeting in the data, then counts the # of meetings that have a particular date in them.
        //Returns an object with every found date as the key and the # of meetings on that date as its value
        dateCountsGet: function(manager){
            let dateCounts = {};
            for (const meeting of manager.data){
                let date = meeting["Start time"];
                let helper = meeting["Being Helped By"];
                if (date && helper){
                    if (dateCounts[date]){
                        dateCounts[date]++;
                     } else {
                        dateCounts[date] = 1;
                    }
                }   
                
            }
            return dateCounts;
        },

        helpedCountGet: function(manager){
            let count = 0;
            for (const meeting of manager.data){
                let helper = meeting["Being Helped By"];
                let endTime = meeting["CompletionTime (Ctrl + Shift + ; )"];
                if (helper || endTime){
                    count++;
                }
            }
            return count;
        }

    };
})();
