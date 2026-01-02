// viz_part2.js
// Simple horizontal bar plot visual (12 months) using cached random values.
(function () {
    window.VizPart2 = {

        doneLoading: false, 
        totalMeetCount: 0,
        topicCounts: {},
        studentTypeCounts: {},

        SAMPLE_COLORS: [
            '#1F77B4', // deep blue
            '#D62728', // strong red
            '#2CA02C', // rich green
            '#9467BD', // deep purple
            '#FF7F0E', // vivid orange
            '#17BECF', // teal
            '#8C564B', // dark brown
            '#7F7F7F'  // neutral gray
        ],

        preload: function (p, manager) {


            let dataCounts = this.dataCountsGet(manager);

            this.topicCounts = dataCounts.topicCounts;
            this.studentTypeCounts = dataCounts.studentTypeCounts;
            this.totalMeetCount = (manager.data).length;

            this.encodeSans = p.loadFont('fonts/EncodeSansNormal/EncodeSansNormal-900-Black.ttf');
            this.uniSans = p.loadFont('fonts/UniSans/Uni-Sans-Regular.otf');
            this.openSans = p.loadFont('fonts/OpenSans/Open-Sans-Regular.ttf');

            this.doneLoading = true;

            console.log(dataCounts);
        },


        draw: function (p, manager, ai, progress, cx, cy) {
            if (!this.doneLoading) {
                this.preload(p, manager);
            }

            p.push();
            p.noStroke();
            p.fill(0,0,0);
            
            p.textAlign(p.CENTER);

            //STEP 1: Squares for both sections 
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
            p.rect(cx-700, cy-265, 700, 350, 10);
            p.rect(cx-700, cy+120, 700, 350, 10);
            p.pop();


            //Step 2: Top topics list
            p.noStroke();
            VizPart2.drawTopics(manager, p, cx, cy);



            //Step 3: Top student statuses list
            VizPart2.drawStatuses(manager, p, cx, cy);

            p.pop()
        },

        //Draw functions: ----------------------------------------------------------

        drawTopics: function (manager, p, cx, cy) {
            p.push();
            p.textFont(this.encodeSans);
            p.fill(0,0,0);
            p.textAlign(p.LEFT);
            p.textSize(35);
            p.text("Topics", cx - 680, cy - 220);


            VizPart2.drawDonutChart(p, cx - 200, cy - 65, 200, this.topicCounts);



            p.pop();
        },

        drawStatuses: function (manager, p, cx, cy) {
            p.push();
            p.textFont(this.encodeSans);
            p.fill(0);
            p.textAlign(p.LEFT);
            p.textSize(35);
            p.text("Student Status", cx - 680, cy + 165);

            VizPart2.drawDonutChart(p, cx - 530, cy + 65, 200, this.studentTypeCounts);
            p.pop();
        },

        //HELPER FUNCTIONS:--------------------------------------------------

        // This function iterates through every meeting in the data and gathers:
            //- topicCounts: The # of times students registered for a particular topic
            //- studentTypeCounts: The # of times particular student statuses registered
        dataCountsGet: function (manager) {
            let topicCounts = {};
            let studentTypeCounts = {};

            // Selectable options on the google form, any topic that is not 
                // one of these marked as "other"
                let nonOtherTopics = [
                    "Degree Requirements & Planning",
                    "Graduation",
                    "Minor",
                    "Admissions/Application",
                    "Registration"
                ];

                let nonOtherStatuses = [
                    "Current INFO Major",
                    "INFO Major - Freshman Direct",
                    "Prospective INFO Major",
                    "INFO Minor"
                ]

            for (const meeting of manager.data){

                let topic = meeting["I have questions regarding..."];
                let studentType = meeting["Student Status"];

                // Count meeting topics
                // Handle multiple topics separated by semicolons
                let topics = topic.split(';');

                for (let topic of topics){
                    if (!nonOtherTopics.includes(topic)){
                        topic = "Other";
                    }

                    if (topicCounts[topic]) {
                        topicCounts[topic]++;
                    } else {
                        topicCounts[topic] = 1;
                    }
                }

                //Count student status types
                if (!nonOtherStatuses.includes(studentType)){
                    studentType = "Other";
                }

                if (studentTypeCounts[studentType]) {
                    studentTypeCounts[studentType]++;
                } else {
                    studentTypeCounts[studentType] = 1;
                }

            }
            return {topicCounts, studentTypeCounts};
        },

        drawDonutChart: function (p, x, y, diameter, values) {

            let entries = Object.entries(values);
            let angleStart = -p.HALF_PI;

            let total = entries.reduce((sum, e) => sum + e[1], 0); 

            // background ring
            p.strokeWeight(55);
            p.stroke(230);
            p.noFill();
            p.strokeCap(p.SQUARE);
            p.arc(x, y, diameter, diameter, 0, p.TWO_PI);
            
            //label text info
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(19);
            p.textFont(this.uniSans);
            
            //build the donut and labels
            for (let i = 0; i < entries.length; i++) {
                p.strokeWeight(55);
                p.noFill();
                let label = entries[i][0];
                let count = entries[i][1];

                let angle = (count / total) * p.TWO_PI;

                p.stroke(this.SAMPLE_COLORS[i]);
                p.arc(x, y, diameter, diameter, angleStart, angleStart + angle);

                // ----- label placement -----
                let percent = ((count / total) * 100).toFixed(1);

                let r = diameter/2;

                if (percent > 5.0){
                    r = diameter / 2; //increase or decrease to move away or closer to arc
                    p.fill(255);
                } else {
                    r = diameter / 2 + 65; //increase or decrease to move away or closer to arc
                    p.fill(0);
                }

                let midAngle = angleStart + angle / 2;
                let tx = x + Math.cos(midAngle) * r;
                let ty = y + Math.sin(midAngle) * r;

                if (percent < 5.0){
                    let lineStartR = diameter / 2; // radius of donut
                    let sx = x + Math.cos(midAngle) * lineStartR;
                    let sy = y + Math.sin(midAngle) * lineStartR;

                    p.stroke(0);      // line color
                    p.strokeWeight(1); // line thickness
                    p.line(sx, sy, tx, ty +15); // draw line from donut to label
                }

                //let percent = (count/total) * 100;
                p.noStroke();
                
                p.text(percent + "%", tx, ty);

                angleStart += angle;
            }
        }
    };
})();