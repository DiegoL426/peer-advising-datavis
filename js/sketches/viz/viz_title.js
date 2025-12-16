// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizTitle = {

        doneLoading: false,

        preload: function (manager){

            const dateCounts = VizTitle.dateCounts(manager);
            console.log(dateCounts);

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizTitle.preload(manager);
            }
            
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;
            p.push();
            p.noStroke();
            p.fill(255);
            var w = 420;
            var h = 120;
            p.rect(cx - w / 2, cy - h / 2, w, h, 6);

            p.fill(0);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(48);
            p.text(ai === 0 ? 'INFO 474' : 'Final Project', cx, cy);
            p.pop();
        },

        dateCounts: function(manager){

            let dateCounts = {};

            for (const meeting of manager.data){
                let date = meeting["Start time"];

                if (date){
                    if (dateCounts[date]){
                        dateCounts[date]++;
                     } else {
                        dateCounts[date] = 1;
                    }
                }   
                
            }

            return dateCounts;
        }
    };
})();
