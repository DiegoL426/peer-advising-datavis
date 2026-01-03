(function () {
    window.VizTitle = {


        doneLoading: false,

        preload: function(p, manager){

            this.encodeSans = p.loadFont('fonts/EncodeSansNormal/EncodeSansNormal-900-Black.ttf');
            this.uniSans = p.loadFont('fonts/UniSans/Uni-Sans-Regular.otf');
            this.openSans = p.loadFont('fonts/OpenSans/Open-Sans-Regular.ttf');


            this.doneLoading = true;
        },


        draw: function (p, manager, ai, progress, cx, cy){
            
            if (!this.doneLoading){
                this.preload(p, manager);
            }

            p.push();
            p.noStroke();
            p.textFont(this.encodeSans);
            p.fill(255);
            var w = 420;
            var h = 120;
            p.rect(cx - w / 2, cy - h / 2, w, h, 6);

            p.fill(0);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(38);
            p.textStyle(p.BOLD);
            p.text('UW iSchool Peer Advising Analytics', cx- 330, cy);
            p.textSize(30);
            p.textStyle(p.NORMAL);
            p.text('Autumn 2025', cx - 330, cy + 60);
            p.textSize(20);
            p.textStyle(p.ITALIC);
            p.text('Diego Licea', cx - 330, cy + 110);
            p.pop();

        }

    };
})()