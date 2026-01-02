// viz_part2.js
// Simple horizontal bar plot visual (12 months) using cached random values.
(function () {
    window.VizPart2 = {

        doneLoading: false, 
        topicCounts: {},
        studentTypeCounts: {},

        preload: function (p, manager) {


            let dataCounts = this.dataCountsGet(manager);

            this.topicCounts = dataCounts.topicCounts;
            this.studentTypeCounts = dataCounts.studentTypeCounts;

            this.encodeSans = p.loadFont('fonts/EncodeSansNormal/EncodeSansNormal-900-Black.ttf');
            this.uniSans = p.loadFont('fonts/UniSans/Uni-Sans-Regular.otf');
            this.openSans = p.loadFont('fonts/OpenSans/Open-Sans-Regular.ttf');


            this.doneLoading = true;

            console.log(dataCounts);

        },


        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading) {
                this.preload(p, manager);
            }

            p.push();
            // STEP 1: Top meeting topics list 

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
            p.rect()
            p.pop();

            p.noStroke();

            p.pop()
        },

        //HELPER FUNCTIONS:--------------------------------------------------

        // This function iterates through every meeting in the data and gathers:
            //- topicCounts: The # of times students registered for a particular topic
            //- studentTypeCounts: The # of times particular student statuses registered
        dataCountsGet: function (manager) {
            let topicCounts = {};
            let studentTypeCounts = {};

            for (const meeting of manager.data){

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

                let topic = meeting["I have questions regarding..."];
                let studentType = meeting["Student Status"];

                // Count meeting topics
                // Handle multiple topics separated by semicolons
                let topics = this.semicolonSeperator(topic);

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

        semicolonSeperator: function (string) {
            return string.split(';')
        }
    };
})();